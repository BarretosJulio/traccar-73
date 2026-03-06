

## Redesign Profissional da Tela de Login

### Problemas na Screenshot
1. **Logo muito pequena** — maxHeight de 120px, precisa ser ~200px na tela de login
2. **Form colado na logo** — sem espaçamento vertical adequado, tudo amontoado no topo
3. **Sidebar sem distribuição vertical** — conteúdo empilhado no topo em vez de distribuído com `justifyContent: center` ou espaçamento proporcional
4. **Options bar (QR + idioma)** entre logo e form — cria ruído visual
5. **Aspecto geral amador** — falta respiração, hierarquia visual e proporção

### Solução

Reorganizar o sidebar com **3 zonas verticais bem distribuídas**:

```text
┌────────────────────┐
│                    │
│      [LOGO]        │  ← Zona 1: Logo grande (200px) + slogan
│   Rastreamento     │
│    Inteligente     │
│                    │
│────────────────────│
│                    │
│    [FORM LOGIN]    │  ← Zona 2: Form centralizado verticalmente
│    Email           │
│    Senha           │
│    [Entrar]        │
│    [Demo]          │
│    Register|Reset  │
│                    │
│────────────────────│
│  QR  | Idioma      │  ← Zona 3: Options bar no rodapé
└────────────────────┘
```

### Alterações por Arquivo

**1. `src/login/LogoImage.jsx`**
- Aumentar `maxHeight` de `120px` para `200px` (triplo visual)
- Aumentar `margin` para dar mais presença

**2. `src/login/LoginLayout.jsx`**
- Sidebar: usar `justifyContent: 'space-between'` para distribuir logo/form/footer
- Aumentar padding vertical (`py: 5`)
- Logo zone: `flex: 0 0 auto`, centralizada
- Form zone: `flex: 1`, com `display: flex, alignItems: center, justifyContent: center`
- Mover o slogan para fonte ligeiramente maior (0.9rem)

**3. `src/login/LoginPage.jsx`**
- Mover a `options` bar (QR + idioma) para o **final** do children (rodapé do sidebar)
- Aumentar gap do container do form para `spacing(2.5)`
- Título "Entrar" com `fontSize: 1.6rem`
- Subtítulo com `fontSize: 0.9rem`
- Botão login com `py: 1.4` e `fontSize: 0.95rem`

