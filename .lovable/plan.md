

# Fix: HTTP 415 ao excluir geocercas

## Causa Raiz

No `traccar-proxy` (linha 207-213), o proxy lê e encaminha o body para **todos** os métodos exceto GET/HEAD — incluindo DELETE. Isso envia um body vazio para o Traccar, que rejeita com HTTP 415 (Unsupported Media Type).

```text
Cliente DELETE /api/geofences/123
  → Proxy lê body vazio + sem Content-Type
  → Encaminha para Traccar com body = ""
  → Traccar rejeita: 415 Unsupported Media Type
```

## Correção

**Arquivo**: `supabase/functions/traccar-proxy/index.ts` (linhas 207-213)

Alterar a condição para só encaminhar body em métodos que realmente enviam dados (POST, PUT, PATCH), excluindo DELETE:

```typescript
// Antes:
if (req.method !== "GET" && req.method !== "HEAD") {

// Depois:
if (["POST", "PUT", "PATCH"].includes(req.method)) {
```

Isso garante que DELETE requests sejam enviados sem body e sem Content-Type, que é o comportamento correto do protocolo HTTP.

## Impacto
- **Positivo**: Corrige exclusão de geocercas, dispositivos, notificações e qualquer recurso via DELETE
- **Banco de dados**: Nenhum
- **APIs**: Apenas correção no proxy, sem mudança de interface
- **Risco**: Nenhum — DELETE requests não devem ter body

