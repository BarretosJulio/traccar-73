

## Problema

Na tela de configurações (DevicesPage, etc.) no desktop, o botão de seta "Voltar ao Dashboard" no drawer lateral está sobreposto à barra de busca/título da página. A seta fica posicionada no canto superior esquerdo do drawer, competindo visualmente com outros elementos.

## Solução

Reposicionar o botão "Voltar" no drawer desktop do `PageLayout.jsx` para ficar mais integrado e sem sobreposição. Em vez de ficar na mesma linha da toolbar com o título, colocar como um botão dedicado abaixo do título, ou mover para o rodapé do drawer.

**Abordagem escolhida**: Mover o botão "Voltar ao Dashboard" para o **rodapé do drawer lateral** no desktop, como um botão com texto "Voltar ao Dashboard" — limpo, sem sobreposição, e sempre acessível.

## Alterações

### `src/common/components/PageLayout.jsx`

1. Remover o `IconButton` com `BackIcon` do `<Toolbar>` do drawer desktop
2. Adicionar um botão "Voltar ao Dashboard" no rodapé do drawer (após o `{menu}`), usando `Box` com `mt: 'auto'` para empurrar para baixo
3. Estilizar como um `ListItemButton` ou `Button` com ícone de seta + texto "Voltar"
4. Apenas no desktop — mobile não muda

```
Drawer desktop (antes):
┌─────────────────────┐
│ ← Título    [><]    │  ← seta sobrepõe
│─────────────────────│
│ menu items...       │
└─────────────────────┘

Drawer desktop (depois):
┌─────────────────────┐
│   Título      [><]  │
│─────────────────────│
│ menu items...       │
│                     │
│ ← Voltar ao Painel  │  ← rodapé, sem conflito
└─────────────────────┘
```

Alteração apenas em: `src/common/components/PageLayout.jsx`

