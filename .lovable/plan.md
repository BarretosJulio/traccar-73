

# WhatsApp Alert Popup por Veiculo no Mapa

## Escopo

Substituir o comportamento do botao WhatsApp no mapa (hoje abre wa.me externamente) por um popup flutuante com toggles de alertas por veiculo selecionado, persistidos no Supabase.

## 1. Nova tabela Supabase

Migration SQL para criar `whatsapp_device_alert_prefs` com colunas: `id`, `tenant_id` (FK tenants), `device_id` (integer Traccar), `user_email` (text), `alert_type` (text), `enabled` (boolean), `created_at`, `updated_at`. Constraint UNIQUE em `(tenant_id, device_id, user_email, alert_type)`. RLS: usuarios autenticados gerenciam seus proprios registros (por user_email via auth.users ou tenant owner); service_role acesso total.

## 2. Refatorar `src/map/MapWhatsApp.js`

- Aceitar prop `onClick` callback
- No `onAdd()`, o `button.onclick` dispara `this.onClick()` em vez de `window.open`
- Atualizar `useMemo` para recriar control quando `onClick` mudar

## 3. Novo componente `src/main/components/WhatsAppDeviceAlerts.jsx`

Popup flutuante posicionado absolute sobre o mapa (canto superior direito, ao lado dos controles):
- Se nenhum veiculo selecionado: mensagem "Selecione um veiculo no mapa"
- Se veiculo selecionado: mostra nome do device + lista dos 9 tipos de alerta com Switch/toggle
- Carrega prefs do Supabase para `device_id + user_email`; fallback para defaults do tenant (`whatsapp_alert_configs`)
- Upsert no Supabase ao toggle
- Botao fechar (X)
- Estilo glassmorphism (backdrop-filter blur, bg semi-transparente)
- Tipos de alerta: `deviceOnline`, `deviceOffline`, `deviceMoving`, `deviceStopped`, `deviceOverspeed`, `geofenceEnter`, `geofenceExit`, `ignitionOn`, `ignitionOff`

## 4. Integrar no `src/main/MainMap.jsx`

- Estado `whatsappOpen` (useState)
- Handler `handleWhatsAppClick` que toggle o estado
- Pegar `selectedId` do Redux store (`state.devices.selectedId`)
- Passar `onClick={handleWhatsAppClick}` para `<MapWhatsApp>`
- Renderizar `<WhatsAppDeviceAlerts>` quando `whatsappOpen` com props: `deviceId={selectedId}`, `onClose`, `tenantId`

## 5. Atualizar types do Supabase

O arquivo `src/integrations/supabase/types.ts` sera atualizado automaticamente pelo sistema apos a migration.

## Arquivos modificados
- **Nova migration SQL** — `whatsapp_device_alert_prefs`
- **`src/map/MapWhatsApp.js`** — aceitar `onClick` prop
- **`src/main/MainMap.jsx`** — estado popup + renderizar overlay
- **Novo `src/main/components/WhatsAppDeviceAlerts.jsx`** — popup com toggles

