

## Problema

Quando o painel de configurações abre no desktop, a rota muda de `/app` (DashboardPage com mapa) para `/app/settings/*`. O `<Outlet>` no `App.jsx` substitui o DashboardPage, então o mapa desaparece — restando apenas o backdrop cinza do overlay.

Além disso, a largura do sidebar muda conforme o conteúdo de cada página de settings.

## Solução

### 1. Renderizar o mapa atrás do overlay de settings (`App.jsx`)

No `App.jsx`, detectar quando estamos em uma rota de settings no desktop e renderizar o `MainMap` como fundo fixo, para que fique visível atrás do overlay com blur.

```jsx
// App.jsx — adicionar:
const isSettingsRoute = pathname.startsWith('/app/settings') || pathname.startsWith('/app/geofences');

// No render, antes do Outlet:
{desktop && isSettingsRoute && (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
    <MainMap filteredPositions={[]} selectedPosition={null} onEventsClick={() => {}} />
  </div>
)}
```

### 2. Fixar largura do sidebar no PageLayout (`PageLayout.jsx`)

Atualmente o `floatingSidebar` tem `width: 250`. Precisa ser largo o suficiente para o maior item do menu ("Comandos Gravados", "Cercas Geográficas", etc.) sem quebrar. Fixar em `minWidth: 220, width: 220` e garantir que o card tenha tamanho fixo total para não mudar ao trocar de página.

- `floatingCard`: adicionar `width: 960` (fixo, não só maxWidth) e `height: 80vh` (fixo)
- `floatingSidebar`: `width: 220, minWidth: 220, flexShrink: 0`
- `floatingContent`: `flexGrow: 1, minWidth: 0` (evita esticamento)

### Arquivos a modificar

| Arquivo | Mudança |
|---|---|
| `src/App.jsx` | Renderizar MainMap atrás quando em rota de settings (desktop) |
| `src/common/components/PageLayout.jsx` | Fixar dimensões do card e sidebar |

