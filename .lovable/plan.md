

## Plano: Central de Comandos GPRS para Dispositivos

### Contexto
O sistema ja possui infraestrutura basica de comandos via `CommandDevicePage` e `BaseCommandView`, que usa a API Traccar (`/api/commands/types?deviceId=X` para tipos disponiveis, `/api/commands/send` para envio). Porem, a experiencia atual e fragmentada: o usuario precisa navegar ate cada dispositivo individualmente para enviar comandos. O objetivo e criar uma **Central de Comandos** unificada.

### O que sera construido

Uma nova pagina **"Central de Comandos"** acessivel pelo menu de configuracoes, com:

1. **Seletor de dispositivo** — dropdown com todos os dispositivos da plataforma (da Redux store `devices.items`)
2. **Tipos de comando disponiveis** — ao selecionar dispositivo, carrega `GET /api/commands/types?deviceId=X` para mostrar apenas comandos suportados por aquele aparelho/protocolo
3. **Formulario de envio** — reutiliza a logica do `BaseCommandView` (campos dinamicos por tipo de comando)
4. **Historico de comandos** — lista os comandos enviados recentemente usando `GET /api/commands?deviceId=X` e os eventos de resposta via `GET /api/events?deviceId=X&type=commandResult`
5. **Status de entrega** — indica se o comando foi: Enviado, Na Fila, Resposta Recebida, ou Falhou

### Mudancas

**1. Criar `src/settings/CommandCenterPage.jsx`**
- Layout com dois paineis: esquerda (seletor + formulario), direita (historico/log)
- Seletor de dispositivo usando `Autocomplete` MUI com os devices da store
- Ao selecionar device, chama `/api/commands/types?deviceId=X` para popular os comandos disponiveis
- Reutiliza `BaseCommandView` para o formulario de parametros do comando
- Botao "Enviar Comando" que faz `POST /api/commands/send`
- Snackbar com feedback: "Comando enviado", "Comando na fila", ou erro
- Tabela de historico com: tipo de comando, data/hora, status (enviado/na fila/resposta)
- Busca respostas via `/api/events?deviceId=X&type=commandResult` para mostrar se houve retorno

**2. Atualizar `src/Navigation.jsx`**
- Adicionar rota `settings/command-center` apontando para `CommandCenterPage`

**3. Atualizar `src/settings/components/SettingsMenu.jsx`**
- Adicionar item "Central de Comandos" no menu, com icone `TerminalOutlinedIcon` ou `SettingsRemoteOutlinedIcon`

**4. Atualizar traducoes `src/resources/l10n/pt_BR.json` e `en.json`**
- Adicionar chaves: `commandCenter`, `commandHistory`, `commandStatus`, `commandResponse`, `commandPending`, `commandDelivered`

### Detalhes Tecnicos

- A API Traccar `/api/commands/types?deviceId=X` ja retorna apenas os comandos suportados pelo protocolo do dispositivo (ex: GT06 suporta `engineStop`, `engineResume`, `positionPeriodic`; Coban suporta `custom`, `positionSingle`, etc.)
- Portanto, nao e necessario criar um mapeamento manual de aparelhos/portas — a API ja resolve isso por dispositivo
- O campo `positionCommand` nas posicoes do dispositivo contem respostas de comandos GPRS
- Eventos do tipo `commandResult` indicam quando o aparelho respondeu ao comando
- Todas as chamadas passam pelo `traccar-proxy` existente

### Fluxo do Usuario

```text
Menu Settings → Central de Comandos
  ┌─────────────────────────────────────────┐
  │  [Selecionar Dispositivo ▼]              │
  │  [Tipo de Comando ▼] (auto-filtrado)     │
  │  [Campos do comando...]                  │
  │  [☐ Enviar por SMS]  [☐ Sem fila]       │
  │  [Cancelar] [Enviar Comando]             │
  ├─────────────────────────────────────────┤
  │  Historico de Comandos                   │
  │  ┌──────┬────────────┬────────┬───────┐ │
  │  │ Data │ Comando    │ Device │Status │ │
  │  │ 14:30│EngineStop  │ ABC-12 │ ✅    │ │
  │  │ 14:25│PositionReq │ XYZ-34 │ ⏳    │ │
  │  └──────┴────────────┴────────┴───────┘ │
  └─────────────────────────────────────────┘
```

