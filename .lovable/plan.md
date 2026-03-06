

## Redesign Profissional do Painel Admin

### Problemas Identificados
1. **maxWidth: 800px** — muito estreito para desktop, desperdiça espaço lateral
2. **Botões sem contraste** — texto invisível nos botões (cor do texto vs fundo)
3. **Inline styles monolíticos** — 707 linhas num único arquivo, difícil manter
4. **Preview da tela de login** — muito pequeno e pouco representativo
5. **Layout de coluna única** — não aproveita a largura da tela em desktop

### Solução

Redesenhar o dashboard com layout profissional de 2 colunas em desktop:

```text
┌─────────────────────────────────────────────────────────┐
│  HEADER (sticky, blur)                                  │
│  [Logo] Company Name [Trial Badge]         [Logout]     │
├─────────────────────────────────────────────────────────┤
│  [Tabs: Personalizar | Link | Plano | Estatísticas]    │
├──────────────────────────┬──────────────────────────────┤
│  COLUNA ESQUERDA         │  COLUNA DIREITA              │
│                          │                              │
│  ┌──────────────────┐    │  ┌────────────────────────┐  │
│  │ Identidade Visual│    │  │ Tela de Login          │  │
│  │ Nome, Logo,      │    │  │ Cores, Imagem, Preview │  │
│  │ Cores            │    │  │                        │  │
│  └──────────────────┘    │  └────────────────────────┘  │
│  ┌──────────────────┐    │  ┌────────────────────────┐  │
│  │ WhatsApp         │    │  │ Config Técnica         │  │
│  └──────────────────┘    │  │ Traccar URL, Domínio   │  │
│                          │  └────────────────────────┘  │
├──────────────────────────┴──────────────────────────────┤
│  [════════════ Salvar Alterações ════════════]          │
└─────────────────────────────────────────────────────────┘
```

### Alterações Técnicas — `src/admin/AdminDashboard.jsx`

**1. Container principal**
- Trocar `maxWidth: 800` por `maxWidth: 1200` para aproveitar a tela
- Aumentar padding lateral

**2. Tab "Personalizar" (pwa) — Layout 2 colunas**
- Usar `display: grid; gridTemplateColumns: '1fr 1fr'` em desktop
- Coluna esquerda: Identidade Visual + WhatsApp
- Coluna direita: Tela de Login + Config Técnica
- Em mobile: volta para coluna única com `gridTemplateColumns: '1fr'`

**3. Botões — Corrigir contraste**
- Botão "Salvar": `background: gradient`, `color: #0a0a0f` (texto escuro) — já está correto no código, verificar se renderiza
- Botão "Logout": adicionar `color: #e2e8f0` e hover state
- Botão "Remover logo": melhorar contraste
- Tabs: aumentar padding e melhorar estados hover/active

**4. Preview da tela de login**
- Aumentar altura de `140px` para `200px`
- Proporção mais realista do sidebar vs content area

**5. Cards**
- Adicionar `transition` e hover com `border-color` mais visível
- Padding consistente de `24px`
- Títulos dos cards com ícones e melhor hierarquia

**6. Botão Salvar (full-width)**
- Mover para fora do grid, ocupar largura total
- Aumentar `padding: 16px`, `fontSize: 16`
- Garantir `color: #0a0a0f` (texto escuro sobre gradiente claro)

**7. Responsividade**
- `@media (max-width: 768px)`: grid volta a 1 coluna
- Implementar via media query inline ou `matchMedia`

### Resultado Esperado
- Dashboard profissional que usa toda a largura disponível
- Botões com texto visível e contrastante
- Organização lógica em 2 colunas para desktop
- Preview de login maior e mais realista
- Hierarquia visual clara entre seções

