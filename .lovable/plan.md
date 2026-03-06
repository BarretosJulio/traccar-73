

## Auditoria de Contraste — Problemas Identificados e Correções

### Problema Principal: `contrastText` incorreto no Dark Mode

No `palette.js`, `primary.contrastText` é `#ffffff` (branco), mas no dark mode o `primary.main` é `#5eead4` (teal claro). Branco sobre teal claro tem contraste péssimo (~1.6:1). Isso afeta **todos os botões `contained`** do MUI globalmente — login, save, ações, etc.

Alguns componentes já corrigem isso manualmente (`MenuItem.jsx`, `CollectionFab.jsx`, `MainToolbar.jsx` usam `#1e293b` no dark mode), mas a correção correta é no tema.

### Problemas Encontrados

| Local | Problema | Correção |
|---|---|---|
| `palette.js` L18 | `contrastText: '#ffffff'` fixo | Mudar para dinâmico: dark → `#0f172a`, light → `#ffffff` |
| `LoginPage.jsx` L303 | `color: 'white'` hardcoded no botão | Remover override, usar `contrastText` do tema |
| `LoginPage.jsx` L322 | `color: 'white'` no botão OpenID | Idem |
| `public/styles.css` L92 | Ícones do mapa `invert(0.7)` = 70% branco, baixo contraste | Aumentar para `invert(0.85)` |
| `public/styles.css` L88 | Separadores entre botões do mapa quase invisíveis | Aumentar opacidade de `0.06` para `0.1` |
| `BottomMenu.jsx` L53 | Ícones inativos `rgba(255,255,255,0.55)` | Já aceitável, mas subir para `0.6` |

### Arquivos a Modificar

**1. `src/common/theme/palette.js`**
- Mudar `contrastText` do primary para ser dinâmico: `darkMode ? '#0f172a' : '#ffffff'`
- Isso corrige automaticamente todos os botões contained do app

**2. `src/login/LoginPage.jsx`**
- Remover `color: 'white'` hardcoded dos botões (linhas 303 e 322)
- O tema agora fornece o contrastText correto

**3. `public/styles.css`**
- Ícones do mapa: `invert(0.7)` → `invert(0.85)` para maior visibilidade
- Separadores: `rgba(255, 255, 255, 0.06)` → `rgba(255, 255, 255, 0.1)`

**4. `src/common/components/BottomMenu.jsx`**
- Ícones inativos: `rgba(255,255,255,0.55)` → `rgba(255,255,255,0.6)`

**5. Limpeza de overrides manuais** (já funcionam, podem ser simplificados)
- `MenuItem.jsx`, `CollectionFab.jsx`, `MainToolbar.jsx`: trocar condicionais por `'primary.contrastText'` (agora que o tema está correto)

