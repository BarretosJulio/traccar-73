
# Fix: Botão de editar geocerca navega para rota errada (tela branca)

## Problema
O `CollectionActions` no `GeofencesList` usa `editPath="/settings/geofence"`, gerando navegação para `/settings/geofence/123`. Porém, a rota correta é `/app/settings/geofence/:id` (está aninhada sob `/app`). O React Router não encontra a rota e renderiza uma tela branca.

## Correção

### Arquivo: `src/other/GeofencesList.jsx` (linha 42)
Alterar `editPath` de `"/settings/geofence"` para `"/app/settings/geofence"`.

## Impacto
- Apenas correção de path de navegação
- Sem impacto em banco, APIs ou regras de negócio
