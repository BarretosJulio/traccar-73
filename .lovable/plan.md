

## Melhorar UX/UI da Seção "Tela de Login" no Admin Dashboard

### Problemas Identificados
1. **Color pickers nativos** ficam pequenos e sem estilo — parecem elementos brutos do browser
2. **Preview muito pequeno** (80px altura) — não transmite como ficará a tela real
3. **Título da seção** ("Tela de Login") com cor dourada pouco legível no fundo escuro
4. **Campos de hex** sem feedback visual — não mostram a cor selecionada de forma clara
5. **Botão "Remover"** sem tradução (hardcoded "Remover")
6. **Layout dos color pickers** não agrupa sidebar e fundo de forma intuitiva

### Solução

Redesenhar a seção "Tela de Login" dentro do card existente com:

**1. Color Pickers Estilizados**
- Input `type="color"` envolvido em um container com borda arredondada, sombra interna e tamanho maior (48x48)
- Campo hex ao lado com borda que muda para a cor selecionada (border-left colorida)
- Agrupar "Cor do Painel Lateral" e "Cor de Fundo" em grid 2 colunas no desktop

**2. Preview Maior e Realista**
- Aumentar para ~160px de altura
- Simular a proporção real: sidebar à esquerda com logo placeholder + área direita com form placeholder
- Mostrar o overlay escuro quando há imagem de fundo
- Border e border-radius consistentes

**3. Upload de Imagem Melhorado**
- Quando há imagem, mostrar thumbnail maior com botão de remover como overlay
- Quando não há, área de drag com ícone e texto claros

**4. Traduzir strings restantes**
- "Remover" → `t('sharedRemove')` (já existe no sistema)

### Arquivo Modificado
- `src/admin/AdminDashboard.jsx` — linhas 353-438 (seção "Login Page Customization")

### Detalhes da Implementação

Substituir o bloco do card "Login Page Customization" por uma versão redesenhada:

- Título com ícone e descrição sutil abaixo
- Grid 2 colunas para os 2 color pickers (sidebar + fundo)
- Cada color picker: container com `width: 48px, height: 48px, borderRadius: 10, overflow: hidden, border` + campo hex com `borderLeft: 3px solid {cor}`
- Upload de imagem: área maior com preview integrado (se houver imagem, mostra como background do próprio container de upload com overlay + botão remover centralizado)
- Preview: `height: 140px`, proporções mais realistas, sidebar com gradiente real, área direita com simulação de formulário (3 linhas + botão)

