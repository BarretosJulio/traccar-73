

## Diagnóstico

O proxy `traccar-proxy` está funcionando corretamente (testei ambos tenants e retornou 200). O erro 301 que apareceu era transitório/cache antigo.

O problema real é que o **Painel Cliente (PWA)** tem dependências frágeis que quebram quando o servidor Traccar não responde ou o tenant não está configurado corretamente.

### Problemas identificados:

1. **LogoImage crash**: Acessa `state.session.server.attributes?.logo` mas se o server for `null` (antes de carregar), dá erro
2. **ServerProvider sem tratamento de tenant**: Não verifica se o tenant tem `traccar_url` válida antes de chamar o proxy
3. **Falta de Content-Type no POST login**: O `LoginPage` manda `body: new URLSearchParams(...)` mas não define `Content-Type: application/x-www-form-urlencoded` explicitamente nos headers
4. **App.jsx session check**: Chama `/api/session` GET sem `x-traccar-email`, causando possível falha silenciosa
5. **Compatibilidade Traccar**: A versão 6.x mudou endpoints — precisa ter fallback

## Plano de Implementação

### 1. Tornar LogoImage resiliente (sem server obrigatório)

Adicionar optional chaining seguro para quando `state.session.server` for `null` (quando acessado fora do contexto do app, ou antes do carregamento).

### 2. Corrigir ServerProvider para validar tenant

Antes de chamar o proxy, verificar se o tenant tem `traccar_url` válida (não é `https://pending-setup.example.com`). Se não tiver, redirecionar para uma mensagem de "empresa ainda não configurada".

### 3. Corrigir headers do LoginPage

Garantir que o POST de login envia `Content-Type: application/x-www-form-urlencoded` explicitamente, pois o proxy repassa headers.

### 4. Tornar App.jsx mais robusto

Adicionar `x-traccar-email` do localStorage na chamada GET `/api/session` para recuperar sessão existente.

### 5. Garantir compatibilidade com qualquer versão Traccar

O proxy já segue redirects. Adicionar tratamento para respostas inesperadas (HTML em vez de JSON, por exemplo) que podem ocorrer em versões diferentes do Traccar.

### Arquivos a modificar:

| Arquivo | Mudança |
|---|---|
| `src/login/LogoImage.jsx` | Optional chaining seguro para `server` nulo |
| `src/ServerProvider.jsx` | Validar tenant.traccar_url antes de fetch |
| `src/login/LoginPage.jsx` | Adicionar Content-Type header explícito |
| `src/App.jsx` | Adicionar x-traccar-email no session check |
| `src/common/util/fetchOrThrow.js` | Adicionar Content-Type default e tratamento de resposta HTML |

Nenhuma alteração no Painel Admin ou Painel Empresa.

