

## Problema

No modo demo, `SocketController` e `CachingController` continuam fazendo chamadas reais à API Traccar (`/api/devices`, `/api/positions`, `/api/geofences`, etc.). Como não existe sessão real no Traccar, todas retornam **401 Unauthorized** — o erro que aparece na tela.

## Solução

Passar `demoMode` como contexto do Outlet (já é feito em `App.jsx`) e usá-lo nos controllers para **pular todas as chamadas API reais** quando o demo está ativo.

### Arquivos a Modificar

**1. `src/SocketController.jsx`**
- Receber `demoMode` via props ou contexto
- Quando `demoMode === true`, não fazer polling nem fetch de devices/positions
- Os dados demo já são injetados pelo `DemoController`

**2. `src/CachingController.js`**
- Receber `demoMode` via props ou contexto
- Quando `demoMode === true`, pular fetch de geofences, groups, drivers, maintenances, calendars

**3. `src/App.jsx`**
- Passar `demoMode` como prop para `SocketController` e `CachingController`
- No `useEffectAsync` que verifica sessão (linha 64-80): se `demoMode === true`, pular o fetch de `/api/session` (o user já foi definido no Redux pelo LoginPage)

### Lógica

```jsx
// App.jsx - passar demoMode aos controllers
<SocketController demoMode={demoMode} />
<CachingController demoMode={demoMode} />

// SocketController.jsx - pular polling
useEffect(() => {
  if (authenticated && !demoMode) {
    // ... polling normal
  }
}, [authenticated, demoMode]);

// CachingController.js - pular cache
useEffectAsync(async () => {
  if (authenticated && !demoMode) {
    const response = await fetchOrThrow('/api/geofences');
    // ...
  }
}, [authenticated, demoMode]);

// App.jsx - pular session check em demo
useEffectAsync(async () => {
  if (!user && !demoMode) {
    // fetch session...
  }
}, [demoMode]);
```

Isso garante que no modo demo nenhuma chamada real à API é feita, eliminando os erros 401.

