

## Problema

O botão de voltar no `MapPage.jsx` está posicionado em `top: 8.5 spacing, left: 1.5 spacing`, o que o coloca sobreposto ao painel lateral (sidebar) com a lista de dispositivos. Precisa ser movido para o topo do mapa, fora da área do sidebar.

## Solução

**Arquivo**: `src/main/MapPage.jsx`

Reposicionar o botão de voltar para o topo do mapa, à direita do sidebar no desktop e no topo esquerdo no mobile:

- **Desktop**: `top: theme.spacing(1.5)`, `left: calc(drawerWidthDesktop + spacing)` — posiciona logo após o sidebar, no topo do mapa
- **Mobile**: `top: theme.spacing(1)`, `left: theme.spacing(1)` — canto superior esquerdo do mapa
- Estilo glassmorphism consistente com os outros controles do mapa (backdrop blur, semi-transparente)

```jsx
backButton: {
  position: 'fixed',
  zIndex: 10,
  background: theme.palette.background.paper,
  boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
  width: 36,
  height: 36,
  [theme.breakpoints.up('md')]: {
    top: theme.spacing(1.5),
    left: `calc(${theme.dimensions.drawerWidthDesktop} + ${theme.spacing(2.5)})`,
  },
  [theme.breakpoints.down('md')]: {
    top: theme.spacing(1),
    left: theme.spacing(1),
  },
},
```

