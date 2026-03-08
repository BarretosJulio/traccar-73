

## Plano: Central de Comandos com Protocolo, Porta e Comandos Rapidos

### Objetivo
Reescrever a `CommandCenterPage` para mostrar o **protocolo e porta** do dispositivo selecionado, e exibir os **comandos disponiveis como botoes rapidos** em grid — ao clicar, expande os campos de parametros prontos para envio.

### Mudancas

**1. Criar `src/common/util/protocolPorts.js`**
Mapeamento estatico dos ~50 protocolos Traccar com porta padrao:
- gps103: 5001, tk103: 5002, gl100: 5003, gl200: 5004, t55: 5005, xexun: 5006, totem: 5007, enfora: 5008, meiligao: 5009, trv: 5010, suntech: 5011, progress: 5012, h02: 5013, jt600: 5014, huabao: 5015, v680: 5016, pt502: 5017, tr20: 5018, navis: 5019, mtas: 5020, skypatrol: 5021, gt02: 5022, gt06: 5023, megastek: 5024, navigil: 5025, gpsgate: 5026, teltonika: 5027, mta6: 5028, tlt2h: 5029, taip: 5030, wondex: 5031, cellocator: 5032, galileo: 5033, ywt: 5034, tk102: 5035, intellitrac: 5036, gpsmta: 5037, wialon: 5038, carscop: 5039, apel: 5040, manpower: 5041, globalsat: 5042, atrack: 5043, pt3000: 5044, ruptela: 5045, topflytech: 5046, laipac: 5047, aplicom: 5048, gotop: 5049, sanav: 5050, gator: 5051, noran: 5052, m2m: 5053, osmand: 5055, easytrack: 5056, gpsmarker: 5057, khd: 5058, piligrim: 5059, stl060: 5060, cartrack: 5061, minifinder: 5062, haicom: 5063, eelink: 5064, box: 5065, freedom: 5066, telic: 5067, trackbox: 5068, visiontek: 5069, orion: 5070, riti: 5071, ulbotech: 5072, tramigo: 5073, tr900: 5074, ardi01: 5075, xt013: 5076, autofon: 5077, gosafe: 5078, bce: 5079, xirgo: 5080, calamp: 5081, mtx: 5082, tytan: 5083, avl301: 5084, castel: 5085, mxt: 5086, cityeasy: 5087, aquila: 5088, flextrack: 5089, blackkite: 5090, adm: 5091, watch: 5092, t800x: 5093, upro: 5094, auro: 5095, disha: 5096, thinkrace: 5097, pathaway: 5098, arnavi: 5099, nvs: 5100, kenji: 5101, astra: 5102, homtecs: 5103, fox: 5104, gnx: 5105, arknav: 5106, supermate: 5107, appello: 5108, idpl: 5109, huahsheng: 5110, granit: 5111, carcell: 5112, obddongle: 5113, hunterpro: 5114, raveon: 5115, cradlepoint: 5116, arknavx8: 5117, autograde: 5118, oigo: 5119, jpkorjar: 5120, cguard: 5121, fifotrack: 5122, smokey: 5123, extremtrac: 5124, trakmate: 5125, at2000: 5126, maestro: 5127, ais: 5128, gt30: 5129, tmg: 5130, pretrace: 5131, pricol: 5132, siwi: 5133, starlink: 5134, dmt: 5135, xt2400: 5136, dmthttp: 5137, alematics: 5138, gps056: 5139, flexcomm: 5140, vt200: 5141, owntracks: 5142, vtfms: 5143, tlv: 5144, esky: 5145, genx: 5146, flespi: 5147, xrb28: 5148, queclink: 5149, startek: 5150, coban: 5056
- Funcao `getProtocolPort(protocol)` e `getProtocolName(protocol)`

**2. Reescrever `src/settings/CommandCenterPage.jsx`**
- Ao selecionar dispositivo, buscar posicao da store `session.positions` para obter `protocol`
- Exibir card info: **Protocolo** e **Porta** do dispositivo
- Buscar `/api/commands/types?deviceId=X` diretamente (sem BaseCommandView)
- Renderizar comandos como **grid de Cards clicaveis** com icones (Lock, LockOpen, GpsFixed, Settings, etc.)
- Ao clicar num comando, expandir campos de parametros usando `useCommandAttributes`
- Manter historico de comandos e botao enviar
- Icone por tipo de comando mapeado estaticamente (engineStop → Lock, engineResume → LockOpen, positionSingle → GpsFixed, custom → Terminal, etc.)

**3. Atualizar traducoes `pt_BR.json` e `en.json`**
- `commandProtocol`, `commandPort`, `commandQuickActions`, `commandSelectCommand`

### Layout

```text
┌──────────────────────────────────────────────┐
│  Central de Comandos                         │
│  [Selecionar Dispositivo ▼]                  │
│                                              │
│  📡 Protocolo: gt06  |  🔌 Porta: 5023      │
│                                              │
│  Comandos Disponiveis:                       │
│  ┌──────────┐ ┌──────────────┐ ┌─────────┐  │
│  │🔒Bloquear│ │🔓Desbloquear │ │📍Posição│  │
│  └──────────┘ └──────────────┘ └─────────┘  │
│  ┌──────────┐ ┌──────────┐                   │
│  │⚙️Custom  │ │📶Config  │                   │
│  └──────────┘ └──────────┘                   │
│                                              │
│  [Campos do comando selecionado...]          │
│  [Cancelar] [Enviar Comando]                 │
├──────────────────────────────────────────────┤
│  Historico de Comandos          🔄           │
│  Data  | Descricao | Status                  │
└──────────────────────────────────────────────┘
```

