

## Mover Formulário de Login para o Sidebar Esquerdo

### Layout Atual
```text
┌──────────┬─────────────────────────┐
│ SIDEBAR  │    CONTENT AREA         │
│ (28%)    │                         │
│ [Logo]   │    [Form Login]         │
│ [Slogan] │                         │
└──────────┴─────────────────────────┘
```

### Novo Layout
```text
┌──────────────────┬──────────────────┐
│    SIDEBAR       │                  │
│    (~380px)      │   CONTENT AREA   │
│                  │   (imagem/cor    │
│    [Logo]        │    configurável) │
│    [Slogan]      │                  │
│    [Form Login]  │                  │
│    [Links]       │                  │
│                  │                  │
└──────────────────┴──────────────────┘
```

### Alterações

**1. `src/login/LoginLayout.jsx`**
- Inverter a lógica: o sidebar recebe os `children` (formulário) abaixo do logo
- Aumentar largura do sidebar para ~380px (cabe o form)
- O Paper (direita) fica apenas como área visual (imagem/cor de fundo configurável)
- Remover o `<form>` do Paper e colocá-lo dentro do sidebar
- No mobile (< sm): sidebar ocupa 100% e Paper desaparece
- Textos e inputs no sidebar usam cores claras (branco/rgba) para contraste no fundo colorido

**2. `src/login/LoginPage.jsx`**
- Ajustar cores dos inputs para funcionar no fundo escuro do sidebar: usar variante `filled` ou `outlined` com cores claras
- Título e subtítulo em branco/rgba
- Links (Register, Reset) em branco com opacidade
- Botões com cores claras para contraste no sidebar
- Options bar (QR, language) movidos para dentro do sidebar (topo)

**3. `src/common/theme/dimensions.js`**
- Ajustar `sidebarWidth` para `380px` (fixo, não percentual) para caber o formulário

### Comportamento Responsivo
- **Desktop (lg+)**: Sidebar 380px com logo + form, direita com imagem/cor
- **Tablet (sm-lg)**: Sidebar 100%, sem área direita
- **Mobile (< sm)**: Sidebar 100%, sem área direita

