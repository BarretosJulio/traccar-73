

## Plano: Indicador de dispositivos vinculados + Dialog de gerenciamento

### Contexto
Cada geocerca no Traccar pode ser vinculada a dispositivos via `GET /api/permissions?geofenceId={id}` (retorna `[{deviceId, geofenceId}]`). Atualmente o card não mostra essa informação.

### Implementação

**1. Novo componente: `src/other/GeofenceDevicesDialog.jsx`**
- Dialog MUI que recebe `geofenceId` e `open/onClose`
- Ao abrir, faz `GET /api/devices?geofenceId={geofenceId}` para obter os dispositivos vinculados
- Lista os dispositivos com nome e categoria
- CRUD:
  - **Adicionar**: Autocomplete com todos os dispositivos (do Redux store `devices.items`), ao selecionar faz `POST /api/permissions` com `{deviceId, geofenceId}`
  - **Remover**: Botão de delete em cada item, faz `DELETE /api/permissions` com `{deviceId, geofenceId}`
  - **Pausar/Ativar** individual não existe nativamente no Traccar para permissões (é tudo ou nada), então esse botão será omitido pois pausar a cerca já desativa para todos

**2. Atualizar `src/other/GeofencesList.jsx`**
- Ao montar, buscar permissões de todas as geocercas: `GET /api/permissions?groupId=...` ou fazer um fetch por geocerca quando expandir
- Abordagem eficiente: fazer `GET /api/devices?geofenceId={id}` apenas quando o card expandir (lazy load)
- No card (antes dos botões de ação), mostrar um `Chip` clicável com contagem: "🚗 3" 
- Ao clicar no Chip, abre o `GeofenceDevicesDialog`
- Buscar contagem ao expandir o card e cachear no state local

**3. Fluxo de dados**
- `GET /api/devices?geofenceId={id}` → retorna dispositivos vinculados (Traccar API nativa)
- `POST /api/permissions` body `{deviceId: X, geofenceId: Y}` → vincula
- `DELETE /api/permissions` body `{deviceId: X, geofenceId: Y}` → desvincula
- Dispositivos disponíveis: já existem no Redux store `state.devices.items`

### Arquivos
| Arquivo | Ação |
|---------|------|
| `src/other/GeofenceDevicesDialog.jsx` | Criar — dialog com lista, add e remove |
| `src/other/GeofencesList.jsx` | Modificar — adicionar chip de contagem + abrir dialog |

