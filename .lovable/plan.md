

## Avaliação de Contrastes e Tooltips

### Problemas Identificados

**1. Tooltips ausentes em ícones clicáveis:**

| Componente | Elemento | Tooltip? |
|---|---|---|
| `MainToolbar.jsx` | Botão mapa/lista (linha 82-88) | Sem tooltip |
| `MainToolbar.jsx` | Botão filtro (linha 103) | Sem tooltip |
| `MainToolbar.jsx` | Botão adicionar — Tooltip está dentro do IconButton (incorreto) | Corrigir |
| `EventsDrawer.jsx` | Botão limpar todos (linha 57) | Sem tooltip |
| `EventsDrawer.jsx` | Botões deletar evento individual (linha 82) | Sem tooltip |
| `GeofencesPage.jsx` | Botão voltar (linha 98) | Sem tooltip |
| `GeofencesPage.jsx` | Botão upload — Tooltip dentro do IconButton (incorreto) | Corrigir |
| `CollectionFab.jsx` | FAB adicionar (linha 27) | Sem tooltip |
| `BottomMenu.jsx` | NavItems mobile | Sem tooltip (aceitável em mobile) |
| `PageLayout.jsx` | Botão voltar e fechar no desktop | Sem tooltip |
| `MapSideMenu.jsx` | Ícones do menu | Já tem tooltips ✓ |
| `StatusCard.jsx` | Botões de ação | Já tem tooltips ✓ |
| `CollectionActions.jsx` | Botões editar/remover | Já tem tooltips ✓ |

**2. Problemas de contraste:**

- **`MainToolbar.jsx`** — botão adicionar: `bgcolor: 'primary.main'` com `color: 'primary.contrastText'` (branco). No tema claro, primary.main = `#0f766e` (teal escuro) + branco = bom. No escuro, primary.main = `#5eead4` (teal claro) + branco = **contraste ruim**.
- **`BottomMenu.jsx`** — ícones inativos: `rgba(255,255,255,0.4)` em fundo escuro. Labels inativos: `rgba(255,255,255,0.35)` — contraste fraco.
- **`MenuItem.jsx`** — estado selecionado: `primary.main` como fundo + `primary.contrastText` (branco). No dark mode, primary.main = `#5eead4` (claro) + branco = **contraste ruim**.
- **`CollectionFab.jsx`** — FAB usa `color="primary"` que terá o mesmo problema de contraste no dark mode.

---

### Plano de Implementação

#### 1. Adicionar Tooltips em todos os ícones clicáveis

**`src/main/MainToolbar.jsx`:**
- Botão mapa/lista: envolver com `<Tooltip title={devicesOpen ? t('mapTitle') : t('deviceTitle')}>`
- Botão filtro: envolver com `<Tooltip title={t('sharedSearch')}>`
- Botão adicionar: mover `<Tooltip>` para **fora** do `<IconButton>` (atualmente está aninhado incorretamente)

**`src/main/EventsDrawer.jsx`:**
- Botão limpar todos: `<Tooltip title={t('notificationClearAll')}>`
- Botões deletar individual: `<Tooltip title={t('sharedRemove')}>`

**`src/other/GeofencesPage.jsx`:**
- Botão voltar: `<Tooltip title={t('sharedBack')}>`
- Botão upload: corrigir — Tooltip deve envolver o IconButton, não estar dentro dele

**`src/settings/components/CollectionFab.jsx`:**
- FAB adicionar: `<Tooltip title={t('sharedAdd')}>`

**`src/common/components/PageLayout.jsx`:**
- Botão voltar desktop: `<Tooltip title="Voltar">`
- Botão fechar desktop: `<Tooltip title="Fechar">`
- Botão voltar mobile: `<Tooltip title={t('sharedBack')}>`
- Botão menu mobile: `<Tooltip title="Menu">`

#### 2. Corrigir contrastes no dark mode

**`src/common/components/MenuItem.jsx`:**
- No estado selecionado, usar cor de texto escura quando primary.main é claro (dark mode):
```jsx
'&.Mui-selected': {
  backgroundColor: 'primary.main',
  color: (theme) => theme.palette.mode === 'dark' ? '#1e293b' : 'primary.contrastText',
}
```

**`src/main/MainToolbar.jsx`:**
- Botão adicionar: adicionar lógica de cor condicionada ao tema para garantir contraste:
```jsx
color: (theme) => theme.palette.mode === 'dark' ? '#1e293b' : '#fff',
```

**`src/common/components/BottomMenu.jsx`:**
- Ícones inativos: aumentar opacidade de `0.4` para `0.55`
- Labels inativos: aumentar de `0.35` para `0.5`

**`src/settings/components/CollectionFab.jsx`:**
- Adicionar `sx` para corrigir cor do ícone no dark mode

---

### Arquivos a modificar

| Arquivo | Mudança |
|---|---|
| `src/main/MainToolbar.jsx` | Tooltips + contraste botão adicionar |
| `src/main/EventsDrawer.jsx` | Tooltips nos botões de delete |
| `src/other/GeofencesPage.jsx` | Tooltips corrigidos (voltar + upload) |
| `src/settings/components/CollectionFab.jsx` | Tooltip + contraste dark mode |
| `src/common/components/PageLayout.jsx` | Tooltips nos botões voltar/fechar/menu |
| `src/common/components/MenuItem.jsx` | Contraste dark mode no estado selecionado |
| `src/common/components/BottomMenu.jsx` | Melhorar contraste ícones/labels inativos |

