

## Plano Completo: SaaS Multi-Tenant para Rastreamento Traccar

### Problema Atual
O frontend faz chamadas diretas ao Traccar (`web.mabtracker.com.br`). Como o app roda em domínio diferente (lovable.app), o browser não envia cookies de sessão cross-origin, causando o erro **HTTP 401 Unauthorized** em todas as rotas autenticadas (`/api/devices`, `/api/geofences`, etc.). O `/api/server` funciona porque é público.

Para o modelo SaaS, cada empresa terá seu próprio servidor Traccar, tornando impossível usar um URL fixo.

### Arquitetura da Solução

```text
Browser (app.seudominio.com)
    │
    ├─ POST /functions/v1/traccar-proxy   (HTTP requests)
    │       │
    │       ▼
    │   Edge Function (Supabase)
    │       │  1. Identifica tenant (header X-Tenant-Slug)
    │       │  2. Busca traccar_url na tabela tenants
    │       │  3. Usa token de sessão armazenado no Supabase
    │       │  4. Forward server-side → Traccar do tenant
    │       ▼
    │   Traccar Server da Empresa
    │
    └─ WSS polling via Edge Function    (real-time updates)
            │  Edge Functions não suportam WebSocket persistente
            │  Solução: polling com intervalo de 5-10s
            ▼
        Traccar Server da Empresa
```

### Etapas de Implementação

---

#### Etapa 1: Tabela `tenants` (Supabase Migration)

Armazena configurações de cada empresa cliente:

```sql
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,              -- identificador na URL
  company_name TEXT NOT NULL,
  traccar_url TEXT NOT NULL,              -- ex: https://traccar.empresa.com.br
  custom_domain TEXT UNIQUE,              -- domínio próprio (opcional)
  logo_url TEXT,
  color_primary TEXT DEFAULT '#1a73e8',
  color_secondary TEXT DEFAULT '#ffffff',
  whatsapp_number TEXT,
  whatsapp_message TEXT DEFAULT 'Olá, preciso de suporte',
  subscription_status TEXT DEFAULT 'trial',  -- trial, active, suspended, cancelled
  plan_type TEXT DEFAULT 'basic',
  max_devices INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

Tabela auxiliar para sessões Traccar por usuário/tenant:

```sql
CREATE TABLE public.traccar_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  session_cookie TEXT NOT NULL,           -- JSESSIONID do Traccar
  traccar_user_id INTEGER,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

RLS policies para ambas as tabelas (acesso restrito por autenticação Supabase).

---

#### Etapa 2: Edge Function `traccar-proxy`

Função principal que substitui todas as chamadas diretas ao Traccar:

- Recebe: `method`, `path` (ex: `/api/devices`), `body`, `X-Tenant-Slug` header
- Busca o `traccar_url` do tenant na tabela
- Busca o `session_cookie` do usuário na tabela `traccar_sessions`
- Se não tem sessão, faz login no Traccar com credenciais e armazena o cookie
- Faz `fetch(traccar_url + path)` server-side com o cookie
- Retorna resposta ao browser

Endpoints tratados:
- `POST /api/session` → login no Traccar, armazena cookie
- `GET /api/devices`, `/api/positions`, etc. → forward com cookie
- `DELETE /api/session` → logout, remove cookie

---

#### Etapa 3: Edge Function `traccar-socket` (polling)

Edge Functions Supabase não suportam WebSocket persistente. Alternativa:

- Frontend faz polling a cada 5-10 segundos via `traccar-proxy`
- Busca `/api/positions` e `/api/events` periodicamente
- Atualiza o Redux store como o WebSocket fazia

---

#### Etapa 4: Modificar Frontend

**`apiUrl.js`** → Redireciona todas as chamadas para a Edge Function:
```javascript
export const apiUrl = (path) => {
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  return `https://${projectId}.supabase.co/functions/v1/traccar-proxy?path=${encodeURIComponent(path)}`;
};
```

**`fetchOrThrow.js`** → Adiciona headers `X-Tenant-Slug` e `Authorization` (token Supabase) em todas as requisições.

**`SocketController.jsx`** → Substituir WebSocket por polling interval que chama a Edge Function.

**`LoginPage.jsx`** → Login faz POST na Edge Function (que faz login no Traccar e armazena sessão).

---

#### Etapa 5: `TenantProvider` (React Context)

- Detecta tenant por: `window.location.hostname` (domínio custom) ou path slug na URL
- Busca configurações do tenant na tabela `tenants` via Supabase client
- Disponibiliza para todos os componentes: `logo_url`, `color_primary`, `whatsapp_number`, `traccar_url`, etc.

---

#### Etapa 6: Branding Dinâmico

Componentes que usarão dados do tenant:
- **`AppThemeProvider`** → `color_primary` / `color_secondary` do tenant
- **`LogoImage`** → `logo_url` do tenant
- **`MapWhatsApp`** → `whatsapp_number` do tenant
- **`LoginPage`** → branding completo do tenant

---

#### Etapa 7: Painel Admin do Tenant (futuro)

Página para a empresa gerenciar suas configurações:
- Upload de logo
- Definir cores
- Configurar WhatsApp
- Ver status da assinatura

---

### Ordem de Execução

| # | Tarefa | Dependência |
|---|--------|-------------|
| 1 | Criar tabela `tenants` e `traccar_sessions` com RLS | Supabase conectado |
| 2 | Criar Edge Function `traccar-proxy` | Tabelas criadas |
| 3 | Modificar `apiUrl.js` e `fetchOrThrow.js` | Edge Function pronta |
| 4 | Criar `TenantProvider` | Tabela tenants |
| 5 | Substituir WebSocket por polling | Edge Function pronta |
| 6 | Integrar branding dinâmico nos componentes | TenantProvider |
| 7 | Inserir tenant de teste (seu servidor atual) | Tabelas criadas |

### Resultado

Após implementação:
- O erro 401 será resolvido (proxy server-side elimina CORS)
- Cada empresa terá seu próprio branding e configurações
- O sistema suporta N empresas, cada uma com seu servidor Traccar
- Empresas podem usar domínio próprio ou slug na URL

