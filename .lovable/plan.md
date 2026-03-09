

## Plano: Hover Tooltip + Menu de Ações Rápidas no Mapa

### Objetivo
1. **Hover no marcador do mapa**: Ao passar o mouse sobre um veículo no mapa, exibir um popup (tooltip nativo do MapLibre) com dados completos do veículo — nome, IMEI, cliente, telefone, status online/offline, velocidade, endereço, ignição, etc.
2. **Clique no veículo**: Além do StatusCard existente, adicionar uma **barra de ações rápidas** com ícones como na imagem de referência — Info (ℹ), Compartilhar, Tabela de dados, Editar, Bloquear (verde), Desbloquear (vermelho).

### Mudanças

**1. Criar `src/map/MapHoverPopup.js`** (novo)
- Componente que adiciona listeners `mouseenter`/`mouseleave` na source de posições do MapPositions
- No `mouseenter`, cria um `maplibregl.Popup` posicionado nas coordenadas do veículo
- Conteúdo HTML do popup com: nome, IMEI (uniqueId), telefone (device.phone), status (online/offline), velocidade, endereço, ignição, bloqueio, satélites, última atualização, coordenadas, protocolo
- No `mouseleave` ou ao clicar, remove o popup
- Estilização inline no HTML do popup para funcionar independente do tema

**2. Atualizar `src/map/MapPositions.js`**
- Expor o `id` da source via prop callback ou ref para que `MapHoverPopup` possa usar
- Adicionar `onMouseHover` callback que passa `deviceId` + coordenadas

**3. Reescrever barra de ações do `src/common/components/StatusCard.jsx`**
- Substituir os ícones atuais por ícones que batem com a referência:
  - **ℹ Info**: Abre detalhes (dialog existente)
  - **Compartilhar**: Share do dispositivo
  - **Tabela**: Abre replay/relatórios
  - **Editar**: Editar dispositivo
  - **🟢 Desbloquear**: Envia comando `engineResume` direto (com confirmação)
  - **🔴 Bloquear**: Envia comando `engineStop` direto (com confirmação)
- Os ícones de bloqueio/desbloqueio ficam coloridos (verde e vermelho) como na referência

**4. Atualizar `src/main/MainMap.jsx`**
- Adicionar `<MapHoverPopup />` dentro do `<MapView>`

**5. Atualizar traduções `pt_BR.json` e `en.json`**
- Chaves: `commandEngineBlock`, `commandEngineUnblock`, `commandConfirmBlock`, `commandConfirmUnblock`

### Layout do Hover Popup
```text
┌─────────────────────────────┐
│  🚗 Veículo ABC-1234        │
│  IMEI: 869731057566945      │
│  Tel: (11) 99999-9999       │
│  Status: 🟢 Online          │
│  Ignição: Ligada             │
│  Velocidade: 45 km/h        │
│  Endereço: Rua X, 123       │
│  Satélites: 12               │
│  Última att: 2 min atrás    │
└─────────────────────────────┘
```

### Layout dos Botões de Ação (StatusCard)
```text
┌──────────────────────────────────────┐
│  [ℹ]  [↗]  [⊞]  [✏]  [🟢🔓]  [🔴🔒] │
│  Info Share Grid Edit Unlock  Block  │
└──────────────────────────────────────┘
```

### Arquivos Impactados
- `src/map/MapHoverPopup.js` (novo)
- `src/map/MapPositions.js` (expor source id)
- `src/common/components/StatusCard.jsx` (barra de ações)
- `src/main/MainMap.jsx` (incluir MapHoverPopup)
- `src/resources/l10n/en.json`, `pt_BR.json`

