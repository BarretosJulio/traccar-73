

## Resposta: Como funciona a vinculação de geocercas no Traccar

**Não, a geocerca criada NÃO se aplica automaticamente a todos os carros.**

No Traccar, geocercas precisam ser **vinculadas** a dispositivos, grupos ou usuários através do sistema de **permissions** (API `POST /api/permissions`). O projeto já implementa isso nas páginas:

- **DeviceConnectionsPage** → vincula geocerca a um dispositivo específico
- **GroupConnectionsPage** → vincula geocerca a um grupo de dispositivos
- **UserConnectionsPage** → vincula geocerca a um usuário (todos os dispositivos dele)

### Fluxo atual
1. Usuário cria geocerca no mapa ✅
2. Geocerca é salva via `POST /api/geofences` ✅
3. **Falta**: vincular a geocerca aos dispositivos desejados — o usuário precisa ir manualmente em cada dispositivo/grupo e fazer a associação

### Proposta de melhoria

Adicionar ao **GeofenceCreateDialog** uma etapa para selecionar a quais dispositivos/grupos a geocerca será vinculada no momento da criação:

1. **Adicionar seleção de dispositivos/grupos** no dialog de criação de geocerca:
   - Um `Autocomplete` multi-select com a lista de dispositivos (de `/api/devices`)
   - Opção "Todos os dispositivos" que vincula ao usuário atual
   - Opção por grupo

2. **Após criar a geocerca**, fazer `POST /api/permissions` para cada vínculo:
   ```json
   { "deviceId": 123, "geofenceId": 456 }
   ```

3. **Arquivos a modificar**:
   - `src/map/draw/GeofenceCreateDialog.jsx` — adicionar campo de seleção de dispositivos/grupos
   - `src/map/draw/MapGeofenceEdit.jsx` — enviar as permissions após criar a geocerca

