

# Auditoria Final — Resultado

Após revisar minuciosamente **todos os arquivos corrigidos nas rodadas anteriores**, o estado atual do projeto está significativamente melhor. A maioria dos problemas críticos (navegação, i18n principal, centralização de constantes) foi resolvida. Restam **5 problemas residuais**.

---

## CORRIGIDOS (confirmados OK)

- ReportsMenu: todos os links com `/app`, `selected` correto -- OK
- SettingsMenu: Geofences `selected` com `/app/geofence` -- OK
- BottomMenu: usa `theme.palette`, detecta `/app/geofences` -- OK
- SideNav: bordas arredondadas, `selected` estilizado -- OK
- LoginPage, MapPage, LoginLayout: strings traduzidas via `t()` -- OK
- RegisterPage, ResetPasswordPage: `lightInputSx` aplicado -- OK
- LandingPage: todas as strings via `t()` -- OK
- OnboardingPage: todas as strings via `t()` -- OK
- AdminDashboard: strings via `t()`, sem fallbacks `|| 'pt-BR'` -- OK
- AdminLoginPage: traduzido, placeholder `email@example.com` -- OK
- PageLayout: padding `theme.spacing(3)` -- OK
- NavBar.jsx removido -- OK
- Tenant slug centralizado em `constants.js` -- OK
- Demo user centralizado em `constants.js` -- OK

---

## PENDENTES (5 problemas restantes)

### 1. `lightInputSx` duplicado em 3 arquivos (DRY violation)
O objeto `lightInputSx` está copiado identicamente em `LoginPage.jsx`, `RegisterPage.jsx` e `ResetPasswordPage.jsx` (30 linhas x 3 = 90 linhas duplicadas). Deve ser extraído para um módulo compartilhado.

**Solução**: Criar `src/login/loginStyles.js` com o `lightInputSx` exportado e importar nos 3 arquivos.

### 2. AdminDashboard: placeholders em português
- Linha 500: `placeholder="https://seuservidor.com"` -- hardcoded pt-BR
- Linha 507: `placeholder="app.suaempresa.com.br"` -- hardcoded pt-BR

**Solução**: Trocar por placeholders neutros como `"https://traccar.example.com"` e `"app.yourcompany.com"`.

### 3. AdminDashboard: detecção de erro por string match
- Linha 521: `message.includes('Error') || message.includes('error') || message.includes('Erro')` -- frágil e dependente de idioma.

**Solução**: Usar um estado booleano `isError` separado em vez de fazer match por conteúdo da string.

### 4. AdminDashboard: `toLocaleDateString()` sem locale
- Linhas 672 e 689: `new Date(...).toLocaleDateString()` sem argumento de locale. Funciona com o default do browser, mas seria mais consistente usar o locale do sistema de i18n.

**Solução**: Importar `dayjs` (já disponível no projeto) e formatar as datas de forma consistente com o restante do sistema.

### 5. LandingPage: "HyperTraccar" hardcoded
- Linhas 63 e 408: O nome do produto `"HyperTraccar"` está hardcoded. Se é um nome de marca fixo, isso é aceitável. Mas para consistência com o resto do sistema i18n, poderia ser uma constante ou chave de tradução.

**Solução**: Adicionar constante `PRODUCT_NAME` em `constants.js` ou chave i18n `productName`.

---

## Plano de Implementação

1. **Extrair `lightInputSx`** para `src/login/loginStyles.js` e atualizar imports nos 3 arquivos
2. **Corrigir placeholders pt-BR** no AdminDashboard (2 inputs)
3. **Refatorar detecção de erro** no AdminDashboard: usar estado `isError` booleano
4. **Formatar datas com dayjs** no AdminDashboard (2 locais)
5. **Centralizar nome do produto** "HyperTraccar" em constante

