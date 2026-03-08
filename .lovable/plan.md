

# Auditoria Completa de Telas e Funcionalidades

## Resumo Executivo

Após análise minuciosa de todas as telas, menus, rotas e componentes do sistema, identifiquei **17 problemas** organizados por severidade.

---

## CRÍTICO — Bugs de Navegação

### 1. ReportsMenu: Links sem prefixo `/app`
**Arquivo**: `src/reports/components/ReportsMenu.jsx`

Todos os links do menu de relatórios estão **sem o prefixo `/app`**, causando navegação para rotas inexistentes (404). Isso afeta:
- `/reports/combined` → deveria ser `/app/reports/combined`
- `/reports/events`, `/reports/trips`, `/reports/stops`, etc.
- `/replay` → deveria ser `/app/replay`
- `/reports/logs`, `/reports/scheduled`, `/reports/statistics`, `/reports/audit`

As checagens de `selected` também usam `location.pathname === '/reports/...'` — nunca serão `true` pois a rota real é `/app/reports/...`. O menu lateral de relatórios **nunca destaca o item ativo**.

**Impacto**: Ao clicar em qualquer item do menu lateral de relatórios, o usuário é redirecionado para fora do app (rota não encontrada ou tela de login).

### 2. SettingsMenu: Link de Geofences incorreto
**Arquivo**: `src/settings/components/SettingsMenu.jsx` (linha 69)

O link aponta para `/app/geofences` mas o `selected` verifica `location.pathname.startsWith('/app/settings/geofence')`. Quando o usuário está em `/app/geofences`, o item não aparece como ativo.

---

## ALTO — Problemas Visuais e de UX

### 3. RegisterPage e ResetPasswordPage: Estilo desatualizado
**Arquivos**: `src/login/RegisterPage.jsx`, `src/login/ResetPasswordPage.jsx`

Usam `LoginLayout` mas os campos de input não aplicam o `lightInputSx` (inputs brancos com alto contraste) que foi implementado na `LoginPage`. Os inputs padrão do MUI ficam com visual inconsistente (fundo transparente, labels flutuantes) contra o sidebar escuro.

### 4. AdminDashboard: CSS inline sem tema
**Arquivo**: `src/admin/AdminDashboard.jsx` (760 linhas)

Todo o painel admin usa **inline styles** com cores hardcoded (`#0a0a0f`, `#00f5a0`, `#e2e8f0`). Não respeita tema claro/escuro do sistema. Ao contrário de todas as outras telas que usam `tss-react/mui` e `theme.palette`.

### 5. LandingPage: CSS inline sem tema
**Arquivo**: `src/landing/LandingPage.jsx` (478 linhas)

Mesma situação do AdminDashboard — tudo inline, sem responsividade adequada para mobile em alguns componentes, sem suporte a tema.

### 6. BottomMenu: Cores hardcoded
**Arquivo**: `src/common/components/BottomMenu.jsx`

O menu inferior usa cores fixas (`#2dd4bf`, `rgba(15,23,32,0.95)`) que não se adaptam ao tema claro. O fundo escuro fica inconsistente quando o usuário está no modo claro.

### 7. DashboardPage: Botão "Voltar ao Dashboard" não traduzido
**Arquivo**: `src/main/MapPage.jsx` (linha 137)

`Tooltip title="Voltar ao Dashboard"` é hardcoded em português, deveria usar `t()`.

### 8. LoginPage: Textos hardcoded em português
**Arquivo**: `src/login/LoginPage.jsx`
- Linha 267: `"Entre com suas credenciais para acessar"` — hardcoded
- Linha 281: `"Usuário ou senha inválidos"` — hardcoded
- Linha 383: `"Entrar como Cliente Demo"` — hardcoded

---

## MÉDIO — Inconsistências Visuais

### 9. SideNav: Estilo antigo
**Arquivo**: `src/common/components/SideNav.jsx`

Usa `ListItemButton` padrão sem bordas arredondadas, sem transições, sem estilo `selected` customizado. Contrasta com o `MenuItem.jsx` que tem `borderRadius: 2`, transições suaves e estilo ativo com `primary.main`.

### 10. PageLayout (floating card): Sidebar sem estilo de menu
**Arquivo**: `src/common/components/PageLayout.jsx`

O sidebar do modo desktop (`floatingSidebar`) usa `backgroundColor: theme.palette.background.default` — correto. Mas a área `floatingContent` tem `padding: theme.spacing(1)` que pode ser insuficiente para formulários com `Container maxWidth="xs"`.

### 11. StatusCard: 838 linhas monolíticas
**Arquivo**: `src/common/components/StatusCard.jsx`

Arquivo extremamente longo (838 linhas) que viola o princípio de responsabilidade única. Contém card, popup, diálogos, tabelas e ações — tudo num só componente. Funciona, mas dificulta manutenção.

### 12. DashboardPage: 1012 linhas monolíticas
**Arquivo**: `src/main/DashboardPage.jsx`

Mesmo problema — mistura estilos, lógica de filtros, grid de stats, lista de veículos, menu rápido e footer em um único arquivo.

---

## BAIXO — Melhorias de Consistência

### 13. AdminDashboard: Strings não traduzidas
Diversas strings hardcoded em português: "Remover", "Plano Completo", "R$ 24,90/mês", "Uso em Tempo Real", "Atualizado automaticamente a cada 30 segundos".

### 14. BottomMenu: Botão "Relatórios" navega sem `/app`
**Arquivo**: `src/common/components/BottomMenu.jsx` (linha 174)

O link para relatórios está correto (`/app/reports/combined`), mas quando navega usando o menu lateral (ReportsMenu), os links estão quebrados (bug #1).

### 15. LoginLayout: Texto hardcoded
**Arquivo**: `src/login/LoginLayout.jsx` (linha 103)

`"Rastreamento Inteligente"` — hardcoded em português.

### 16. Replay link em ReportsMenu
`buildLink('/replay')` gera `/replay` sem `/app`, e não há checagem `selected` para esta rota.

### 17. Geofences Menu: Rota `/app/geofences` fora do padrão `/app/settings/`
A página de geocercas está em `/app/geofences` enquanto todas as outras configurações estão em `/app/settings/`. Isso causa confusão no `isSettingsRoute` do `App.jsx` (linha 45) que precisa de lógica especial para incluí-la.

---

## Plano de Correção (Priorizado)

### Fase 1 — Correções Críticas de Navegação
1. **Corrigir todos os links em `ReportsMenu.jsx`**: adicionar prefixo `/app` em todos os `buildLink()` e `selected` checks
2. **Corrigir `selected` do Geofences em `SettingsMenu.jsx`**

### Fase 2 — Consistência Visual
3. **Aplicar `lightInputSx` em `RegisterPage.jsx` e `ResetPasswordPage.jsx`**
4. **Traduzir strings hardcoded** em LoginPage, MapPage, LoginLayout
5. **Adaptar BottomMenu ao tema** — usar `theme.palette` ao invés de cores fixas

### Fase 3 — Padronização
6. **Migrar AdminDashboard de inline styles para `makeStyles`** com suporte a tema
7. **Migrar LandingPage de inline styles para `makeStyles`**

### Fase 4 — Refatoração (opcional)
8. Extrair sub-componentes de StatusCard e DashboardPage

