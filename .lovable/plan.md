

# Fix: Geocercas — Polígono, Exclusão e Lixeira

## Problemas Identificados

### 1. Exclusão dá erro (415)
O fix no `traccar-proxy` foi aplicado no código (linha 207), mas pode não ter sido deployado com sucesso. Vou redeployar a Edge Function para garantir.

### 2. Ferramenta Polígono não cria geocerca
Analisando o código, o evento `draw.create` usa a mesma lógica para polígono e linha. Ambos chamam `geometryToArea(feature.geometry)` que usa `wellknown.stringify`. O problema provável: ao completar um polígono, o MapboxDraw gera coordenadas que, após `reverseCoordinates`, podem resultar num WKT inválido para o Traccar. Vou adicionar logs e validação para diagnosticar e corrigir.

### 3. Botão Lixeira (trash) não funciona
O botão trash do MapboxDraw só funciona quando uma feature está **selecionada** (modo `simple_select` com feature clicada). O problema é que ao clicar numa geocerca existente, ela pode não entrar em modo de seleção corretamente porque o `draw.delete` event dispara mas a API falha (volta ao problema 1).

## Correções

### Arquivo: `supabase/functions/traccar-proxy/index.ts`
- Redeployar a Edge Function para garantir que o fix do DELETE está ativo em produção.

### Arquivo: `src/map/draw/MapGeofenceEdit.js`
- Adicionar tratamento de erro mais robusto no listener de `draw.create` para capturar e logar problemas com a geometria do polígono.
- No listener de `draw.delete`, adicionar `refreshGeofences()` no catch para sincronizar o estado mesmo quando a API falha (a cerca some no draw mas não no servidor).
- Garantir que o `draw.create` listener inclua `t` nas dependências do useEffect (atualmente falta, pode causar stale closure).

### Arquivo: `src/map/core/mapUtil.js`
- Validar que `geometryToArea` gera WKT válido para polígonos (o `reverseCoordinates` pode estar invertendo incorretamente coordenadas aninhadas de polígonos).

## Detalhes Técnicos

**`draw.create` listener (linha 72-92)** — O useEffect tem `[dispatch, navigate]` como deps mas usa `t` e `draw`, ambos não listados. Isso pode causar stale closures onde `t` retorna undefined ou `draw` aponta para instância antiga.

**Coordenadas de polígono** — `reverseCoordinates` trata recursivamente arrays aninhados. Para polígonos (`[[[lat,lng], ...]]`), a recursão deve funcionar, mas vou validar o output do `stringify` para confirmar que gera `POLYGON((...))` válido.

**Sync do estado** — Quando o trash deleta no draw mas a API falha, a feature desaparece visualmente mas permanece no servidor. Ao dar refresh, o `refreshGeofences` recarrega do servidor e restaura (ou no caso do delete que funciona no servidor mas falha no frontend, a cerca some no refresh).

## Impacto
- **Banco de dados**: Nenhum
- **APIs**: Apenas redeploy do proxy existente
- **Frontend**: Correção de dependências do useEffect e tratamento de erro

