

# Criar API_DOCS.md

## Arquivo a Criar

### `API_DOCS.md`

Documentação completa das 4 Edge Functions com base na análise direta do código-fonte:

**1. `traccar-proxy`** — Proxy multi-tenant para API Traccar
- Autenticação: sem JWT, usa headers `x-tenant-slug` + `x-traccar-email`
- Parâmetro obrigatório: `?path=/api/...`
- Fluxos: login (POST /api/session → armazena JSESSIONID), logout (DELETE /api/session → limpa sessão), proxy genérico (GET/POST/PUT/DELETE com sessão armazenada)
- Validação de subscription (bloqueia suspended/cancelled)
- Auto-limpeza de sessão expirada em 401

**2. `whatsapp-proxy`** — Proxy autenticado para UAZAPI
- Autenticação: Bearer JWT (Supabase Auth)
- Resolve tenant pelo `user_id` do JWT
- 8 actions via `?action=`: `create-instance`, `connect`/`qrcode`, `disconnect`, `send-text`, `get-alerts`, `save-alerts`, `get-messages`, `set-webhook`
- Cada action documentada com método, body, resposta

**3. `whatsapp-webhook`** — Receptor de webhooks
- Autenticação: nenhuma (público)
- 2 actions: `process-event` (processa evento Traccar → envia alerta WhatsApp), `delivery-receipt` (recibo de entrega UAZAPI)
- Template variables: `{device}`, `{event}`, `{time}`, `{data}`

**4. `create-tenant`** — Criação de tenants
- Autenticação: nenhuma (público)
- POST com body JSON: `company_name`, `owner_email`, `password` (obrigatórios) + `traccar_url`, `color_primary`, `color_secondary` (opcionais)
- Cria auth user + tenant com trial de 7 dias
- Rollback: deleta auth user se criação do tenant falhar

### Formato
Cada function terá: URL base, autenticação, endpoints/actions com método HTTP, headers, parâmetros, body de exemplo, resposta de sucesso e códigos de erro.

