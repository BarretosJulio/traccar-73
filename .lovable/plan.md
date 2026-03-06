

## Problema

Todos os botões de navegação no `PageLayout.jsx` (seta voltar, botão X, clique fora) usam `navigate('/app')` — que sempre vai para o Dashboard. O usuário quer voltar para onde estava antes (geralmente o mapa).

## Solução

**Arquivo**: `src/common/components/PageLayout.jsx`

Trocar todos os `navigate('/app')` por `navigate(-1)` nos três pontos:

1. **Clique fora do overlay** (linha 139): `navigate(-1)`
2. **Botão seta voltar** (linha 149): `navigate(-1)`
3. **Botão X fechar** (linha 160): `navigate(-1)`

Isso faz o browser voltar na história, retornando exatamente para a página de onde o usuário veio (mapa, dashboard, ou qualquer outra).

