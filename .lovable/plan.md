

## Plano: Push Notifications no PWA (Modular)

### Contexto Atual
- O sistema usa **polling de 5s** no `SocketController` para buscar devices/positions, mas **nao busca eventos** no polling (apenas processa eventos nativos via `handleNativeNotification`)
- Nao existe nenhuma integracao com a **Web Notifications API** (`Notification.requestPermission`, `showNotification`)
- O PWA ja esta configurado via `vite-plugin-pwa` com service worker (Workbox), mas sem suporte a push notifications
- Eventos Traccar disponiveis: `deviceOnline`, `deviceOffline`, `deviceMoving`, `deviceStopped`, `deviceOverspeed`, `geofenceEnter`, `geofenceExit`, `ignitionOn`, `ignitionOff`, `alarm`, `maintenance`, `commandResult`, `fuelDrop`, `fuelIncrease`, `driverChanged`, `textMessage`

### Arquitetura Modular

Tres modulos independentes:

```text
src/common/notifications/
  ├── notificationManager.js    ← Gerencia permissao + exibe notificacoes
  ├── notificationEvents.js     ← Formata eventos Traccar em notificacoes
  └── useNotifications.js       ← Hook React que conecta tudo
```

### Mudancas

**1. `src/common/notifications/notificationManager.js`**
- `requestNotificationPermission()` — solicita permissao ao usuario
- `isNotificationSupported()` — verifica se browser suporta
- `getNotificationPermission()` — retorna status atual
- `showNotification(title, options)` — exibe notificacao nativa com icone, body, tag (para deduplicar), click handler para focar a aba

**2. `src/common/notifications/notificationEvents.js`**
- `formatEventNotification(event, devices, t)` — recebe um evento Traccar e retorna `{ title, body, icon, tag }` formatado
- Usa `formatNotificationTitle` existente para o titulo
- Body inclui nome do dispositivo + horario
- Tag usa `event.id` para evitar duplicatas

**3. `src/common/notifications/useNotifications.js`**
- Hook que:
  - Solicita permissao na montagem (se nao foi pedido antes)
  - Persiste preferencia no `localStorage`
  - Exporta `{ permission, requestPermission, sendEventNotification }`

**4. Atualizar `src/SocketController.jsx`**
- Adicionar polling de eventos: `GET /api/events` com `lastEventId` para buscar apenas novos eventos
- Ao receber novos eventos, chamar `handleEvents` (ja existente) E `sendEventNotification` para push nativo
- Manter `lastEventIdRef` para nao repetir eventos

**5. Atualizar `vite.config.js`**
- Adicionar `navigateFallbackDenylist: [/^\/~oauth/]` (best practice)

**6. Atualizar traducoes `en.json` e `pt_BR.json`**
- `notificationPermission`, `notificationEnabled`, `notificationDisabled`, `notificationRequest`

### Fluxo

```text
SocketController (polling 5s)
  ├── GET /api/devices → Redux
  ├── GET /api/positions → Redux
  └── GET /api/events?lastId=X → novos eventos
       ├── dispatch(eventsActions.add) → EventsDrawer
       ├── Audio alarm (se configurado)
       ├── Snackbar in-app
       └── notificationManager.showNotification()
            → Push nativo no browser/PWA
            → Funciona com app em background
            → Click foca a aba/app
```

### Detalhes Importantes
- A Web Notifications API funciona tanto em browser desktop quanto em PWA instalado
- Quando o PWA esta em background, as notificacoes aparecem no centro de notificacoes do OS
- Nao precisa de Firebase/VAPID — usando apenas a Notifications API do browser (nao requer backend)
- Tag no `showNotification` evita notificacoes duplicadas do mesmo evento
- O polling de eventos usa o endpoint `GET /api/reports/events` com filtro de data para buscar eventos recentes (ultimos 30s)

