

# WhatsApp Integration via UAZAPI — Architecture Plan

## Analysis & Recommendation

**Where should WhatsApp live? In the SaaS Admin Panel (not the tracking platform).**

Reasons:
- Only tenant admins manage WhatsApp connections (QR code, alerts config)
- Each company connects their own WhatsApp Business number
- End users (Traccar clients) never see WhatsApp config — they only receive messages
- Billing/payment alerts are a SaaS-level concern, not a tracking-level concern
- The Admin Dashboard already has the tenant context and auth flow needed

## What UAZAPI Adds to the System

Based on the API documentation and n8n integration specs:

1. **Instance Management** — Create/connect WhatsApp instance per tenant via QR code
2. **Send Messages** — Text, media, location, contacts to any WhatsApp number
3. **Webhooks** — Receive delivery receipts, incoming messages
4. **Contact Validation** — Check if a phone number has WhatsApp before sending
5. **Business Profile** — Set company name, description, photo on WhatsApp Business

## Database Schema (3 new tables)

```text
whatsapp_instances
├── id (uuid, PK)
├── tenant_id (uuid, FK → tenants.id)
├── uazapi_instance_id (text)          -- UAZAPI instance identifier
├── uazapi_token (text, encrypted)      -- Instance API token
├── status (text: disconnected|connecting|connected)
├── phone_number (text, nullable)       -- Connected number (after QR scan)
├── created_at / updated_at

whatsapp_alert_configs
├── id (uuid, PK)
├── tenant_id (uuid, FK → tenants.id)
├── alert_type (text)                   -- e.g. 'geofenceExit', 'sos', 'ignitionOn', 'speedLimit', 'maintenance'
├── enabled (boolean, default false)
├── template_message (text)             -- Message template with {device}, {event}, {time} placeholders
├── created_at / updated_at

whatsapp_message_log
├── id (uuid, PK)
├── tenant_id (uuid, FK → tenants.id)
├── recipient_phone (text)
├── message_type (text: alert|billing|manual)
├── message_content (text)
├── status (text: sent|delivered|failed)
├── error_message (text, nullable)
├── created_at
```

RLS: All tables restricted to `auth.uid() = tenants.user_id` via join, plus service role for edge functions.

## Edge Functions (2 new, fully isolated)

### 1. `whatsapp-proxy`
Proxies all UAZAPI API calls from the Admin frontend:
- `POST /connect` — Create instance + return QR code
- `GET /status` — Check connection status
- `POST /disconnect` — Logout instance
- `POST /send` — Send message (for manual/test sends)
- `GET /alerts` — List alert configs
- `PUT /alerts` — Update alert configs

Validates Supabase Auth JWT, resolves tenant, fetches UAZAPI credentials from `whatsapp_instances` table.

### 2. `whatsapp-webhook`
Receives events from Traccar (via traccar-proxy integration) and UAZAPI:
- Traccar event → checks `whatsapp_alert_configs` → sends WhatsApp via UAZAPI
- UAZAPI delivery receipts → updates `whatsapp_message_log`

## Admin Dashboard — New Tab: "📱 WhatsApp"

```text
┌─────────────────────────────────────────┐
│  📱 WhatsApp                            │
├─────────────────────────────────────────┤
│  Connection Status: 🔴 Disconnected     │
│  [Connect WhatsApp]                     │
│                                         │
│  ┌─────────────┐                        │
│  │   QR CODE   │  ← Scan with WhatsApp  │
│  │             │     Business app       │
│  └─────────────┘                        │
│                                         │
│  ── Alert Configuration ──              │
│  ☑ SOS Alarm          [Edit template]   │
│  ☑ Geofence Exit      [Edit template]   │
│  ☐ Speed Limit        [Edit template]   │
│  ☐ Ignition On/Off    [Edit template]   │
│  ☐ Maintenance Due    [Edit template]   │
│                                         │
│  ── Message Log ──                      │
│  📨 +5511999... | Alert SOS | ✅ Sent   │
│  📨 +5511888... | Billing   | ✅ Sent   │
│                                         │
│  ── Future: Billing Alerts ──           │
│  ☐ Payment reminder (3 days before)     │
│  ☐ Overdue notice                       │
└─────────────────────────────────────────┘
```

## File Structure (fully isolated module)

```text
src/admin/
  whatsapp/
    WhatsAppTab.jsx           -- Main tab component
    WhatsAppConnection.jsx    -- QR code + connection status
    WhatsAppAlerts.jsx        -- Alert type toggles + templates
    WhatsAppMessageLog.jsx    -- Sent messages history
    whatsappService.js        -- API calls to whatsapp-proxy

supabase/functions/
  whatsapp-proxy/index.ts     -- Admin API proxy
  whatsapp-webhook/index.ts   -- Event receiver
```

Zero changes to existing Traccar tracking code. The only touchpoint is adding the new tab to `AdminDashboard.jsx`.

## Secrets Required

| Secret | Purpose |
|--------|---------|
| `UAZAPI_ADMIN_TOKEN` | Admin token for creating/managing UAZAPI instances |
| `UAZAPI_BASE_URL` | API base URL (e.g. `https://yoursubdomain.uazapi.com`) |

## Implementation Order

1. Create 3 database tables + RLS policies
2. Add `UAZAPI_ADMIN_TOKEN` and `UAZAPI_BASE_URL` secrets
3. Build `whatsapp-proxy` edge function
4. Build `WhatsAppTab` UI module (connection + QR code)
5. Build alert configuration UI + persistence
6. Build `whatsapp-webhook` edge function for event forwarding
7. Build message log UI
8. Add i18n keys (en + pt_BR)
9. Update CHANGELOG.md

## Security Considerations

- UAZAPI tokens stored encrypted in DB, never exposed to frontend
- All UAZAPI calls go through edge function (server-side only)
- Tenant isolation: each tenant only sees/manages their own instance
- Message log provides audit trail (LGPD compliance)
- Webhook endpoint validates origin headers

