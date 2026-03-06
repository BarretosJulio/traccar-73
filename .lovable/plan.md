

## Menu de Ações Rápidas ao Selecionar Veículo

### Contexto

Atualmente, ao clicar num veículo no mapa, o `StatusCard` mostra telemetria e ações na barra inferior (replay, comando, editar, excluir). Para ações operacionais rápidas como **bloqueio de motor** e **âncora**, o operador precisa navegar até a tela de comandos — muitos cliques.

### Solução

Adicionar um **painel de ações rápidas** (Quick Actions) no `StatusCard`, entre os chips e os dados, com botões visuais para os comandos mais usados da API Traccar.

### Comandos Traccar Disponíveis (via `POST /api/commands/send`)

| Ação | `type` na API | Descrição |
|---|---|---|
| **Bloquear Motor** | `engineStop` | Corta a ignição remotamente |
| **Desbloquear Motor** | `engineResume` | Restaura a ignição |
| **Âncora (Geofence)** | Cria geofence via `POST /api/geofences` | Cerca circular na posição atual |
| **Localizar (Beep)** | `custom` com data específica | Aciona buzzer/sirene |
| **Solicitar Posição** | `requestPhoto` ou `positionSingle` | Força atualização de posição |

### Arquivos a Modificar

**1. `src/common/components/StatusCard.jsx`**
- Adicionar seção de **Quick Actions** após os chips, com botões compactos:
  - 🔒 **Bloquear/Desbloquear** — toggle baseado em `attrs.blocked`
  - ⚓ **Âncora** — cria geofence circular (já existe `handleGeofence`, mover para cá)
  - 📍 **Localizar** — envia comando `positionSingle`
- Cada botão executa `POST /api/commands/send` diretamente com o `type` correto
- Adicionar **dialog de confirmação** para ações destrutivas (bloqueio)
- Feedback visual: Snackbar ou mudança de estado do chip após envio
- Primeiro buscar tipos suportados via `GET /api/commands/types?deviceId=X` para mostrar apenas ações disponíveis para aquele dispositivo

**2. Novo componente: `src/common/components/QuickActionsBar.jsx`**
- Componente isolado que recebe `deviceId`, `position`, `attrs`
- Busca tipos suportados do dispositivo ao montar
- Renderiza botões apenas para comandos suportados
- Gerencia estados de loading/confirmação
- Dialog de confirmação para `engineStop`/`engineResume`

### Layout Visual

```text
┌─────────────────────────────────────────┐
│ [Ícone] HB20 MAB-02    Online     [X]  │
│ 🟢 Ligado  🔵 Movendo  🔓 Desbloq.    │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 🔒 Bloquear  ⚓ Âncora  📍 Localizar│ │  ← Quick Actions
│ └─────────────────────────────────────┘ │
│                                         │
│ 📍 Rua Augusta, 1200...                │
│ ─────────────────────────────────────── │
│ Velocidade: 45 km/h   Bateria: 85%     │
│ ...                                     │
└─────────────────────────────────────────┘
```

### Fluxo de Execução

1. Ao abrir StatusCard, `QuickActionsBar` faz `GET /api/commands/types?deviceId=X`
2. Filtra e mostra apenas ações suportadas pelo dispositivo
3. Ao clicar em "Bloquear": dialog de confirmação → `POST /api/commands/send` com `{ deviceId, type: "engineStop" }`
4. Feedback: loading spinner no botão → sucesso/erro via Snackbar
5. Âncora: reutiliza lógica existente de criar geofence circular

### Segurança

- Verificar `deviceReadonly` e `readonly` antes de mostrar ações
- Dialog de confirmação obrigatório para `engineStop`/`engineResume`
- Log da ação no console (auditoria futura)

