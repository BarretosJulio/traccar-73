

## Personalização da Tela de Login por Empresa

### Contexto
O usuário quer que cada empresa (tenant) possa configurar no painel Admin:
1. **Cor do painel lateral** (a parte verde/teal) da tela de login
2. **Imagem de fundo ou cor** do lado direito (parte branca), com filtro escuro por cima quando for imagem
3. **Logo da tela de login** (já existe `logo_url`, mas precisa de campo dedicado se quiser logo separada)

### Alterações no Banco de Dados

Nova migration adicionando 3 colunas à tabela `tenants`:

```sql
ALTER TABLE public.tenants
ADD COLUMN IF NOT EXISTS login_sidebar_color TEXT,
ADD COLUMN IF NOT EXISTS login_bg_image TEXT,
ADD COLUMN IF NOT EXISTS login_bg_color TEXT;
```

- `login_sidebar_color` — cor do painel lateral esquerdo (default usa `color_primary`)
- `login_bg_image` — URL de imagem de fundo do lado direito (com overlay escuro automático)
- `login_bg_color` — cor de fundo alternativa do lado direito (quando não houver imagem)

### Alterações no Admin Dashboard (`src/admin/AdminDashboard.jsx`)

Na aba "Personalizar", adicionar nova seção **"Tela de Login"** com:
- Color picker para **cor do painel lateral**
- Upload de **imagem de fundo** (usando mesmo fluxo do logo, bucket `logos`)
- Color picker para **cor de fundo** (alternativa à imagem)
- Preview visual simplificado mostrando as cores escolhidas

Atualizar `handleSave` para incluir os 3 novos campos no update.

### Alterações no Login Layout (`src/login/LoginLayout.jsx`)

- Importar `useTenant` do TenantProvider
- Usar `tenant.login_sidebar_color` para o gradiente do sidebar (fallback: `color_primary` ou teal padrão)
- Usar `tenant.login_bg_image` como `background-image` do Paper com overlay `rgba(0,0,0,0.5)` por cima
- Usar `tenant.login_bg_color` como cor de fundo alternativa quando não houver imagem
- A logo já é resolvida via `LogoImage` que prioriza `tenant.logo_url`

### Fluxo Visual

```text
┌──────────────┬──────────────────────────┐
│              │                          │
│  SIDEBAR     │   CONTENT AREA           │
│  (cor config)│   (imagem + overlay      │
│              │    OU cor de fundo)       │
│  [Logo]      │                          │
│  [Slogan]    │   [Form Login]           │
│              │                          │
└──────────────┴──────────────────────────┘
```

### Arquivos Modificados
1. **Nova migration SQL** — 3 colunas em `tenants`
2. **`src/admin/AdminDashboard.jsx`** — seção "Tela de Login" com campos de config
3. **`src/login/LoginLayout.jsx`** — consumir configs do tenant para aplicar cores/imagem
4. **`src/resources/l10n/en.json`** e **`pt_BR.json`** — chaves de tradução para os novos labels

