

## Traduzir Strings Hardcoded no Frontend

### Problema
Existem dezenas de strings em Portugues (pt-BR) hardcoded diretamente no JSX em vez de usar o sistema de tradução (`useTranslation` / `t()`). Isso quebra a internacionalização.

### Arquivos Afetados e Strings a Corrigir

**1. `src/common/components/StatusCard.jsx`**

| String hardcoded | Chave i18n existente ou nova |
|---|---|
| `'Ligado'` / `'Desligado'` | `t('positionIgnition')` + `t('sharedYes')`/`t('sharedNo')` ou novas: `statusIgnitionOn`/`statusIgnitionOff` |
| `'Movendo'` / `'Parado'` | Novas: `statusMoving` / `statusStopped` |
| `'Bloqueado'` / `'Desbloq.'` | `t('positionBlocked')` / nova: `statusUnblocked` |
| `'Âncora Ativa'` | Nova: `statusAnchorActive` |
| `'Velocidade'` | `t('positionSpeed')` |
| `'Direção'` | `t('positionCourse')` |
| `'Bateria'` | `t('positionBatteryLevel')` |
| `'Satélites'` | `t('positionSat')` |
| `'Altitude'` | `t('positionAltitude')` |
| `'Precisão'` | `t('positionAccuracy')` |
| `'Odômetro'` | `t('positionOdometer')` |
| `'Horímetro'` | `t('positionHours')` |
| `'Combustível'` | `t('positionFuel')` |
| `'Temperatura'` | `t('positionDeviceTemp')` |
| `'RPM'` | `t('positionRpm')` |
| `'Tensão'` | `t('positionPower')` |
| `'Carregando'` | `t('positionCharge')` |
| `'Sim'` / `'Não'` | `t('sharedYes')` / `t('sharedNo')` |
| `'Sinal GSM'` | `t('positionRssi')` |
| `'Entrada 1'` / `'Entrada 2'` | `t('positionInput')` |
| `'Coordenadas'` | Existente `settingsCoordinateFormat` ou nova |
| `'Protocolo'` | `t('positionProtocol')` |
| `'Rede'` | Nova: `positionNetwork` |
| `'Função indisponível no modo demo'` | Nova: `demoModeUnavailable` |

**2. `src/main/DeviceRow.jsx`** (mesmas chips: Ligado/Desligado, Movendo/Parado, Bloqueado/Desbloq.)

**3. `src/main/DashboardPage.jsx`**

| String hardcoded | Tradução |
|---|---|
| `'Total'` | Nova ou existente |
| `'Bloqueados'` | Nova: `statusBlocked` (plural) |
| `'Em Movimento'` | Nova: `statusMoving` |
| `'Veículos'` | `t('deviceTitle')` |
| `'Todos'` | Nova: `sharedAll` |
| `'Cercas'` | `t('sharedGeofences')` |
| `'Tempo Real'` / `'Desconectado'` | Novas |
| `'Olá, ...'` / `'Dashboard'` | Novas |
| `'... veículos online · ... em movimento'` | Novas |
| `'Painel de controle de frota'` | Nova |
| `'Modo Claro'` / `'Modo Escuro'` | Novas |
| `'Desativar Demo'` / `'Ativar Demo...'` | Novas |
| `'Modo demo ativo'` / `'Sair'` | Novas |
| `'Ignição Ligada'` / `'Ignição Desligada'` | Novas |
| `'Em movimento'` / `'Parado'` (tooltips) | Reutilizar |
| `'... satélites'` / `'Direção: ...'` | Reutilizar chaves |
| `'Combustível: ...'` / `'Bateria: ...'` | Reutilizar chaves |
| `'Última atualização'` | Nova |
| `'Bloq.'` | Reutilizar |
| `'Nenhum veículo ...'` / `'nesta categoria'` / `'encontrado'` | Novas |
| `'Ver todos'` / `'Mostrar menos'` | Novas |
| `'Acesso Rápido'` | Nova |

**4. `src/main/DemoController.jsx`**
- `'Excesso de velocidade detectado!'`, `'Veículo saiu da cerca...'`, etc. — Novas chaves

**5. `src/admin/AdminLoginPage.jsx`**
- `'Email ou senha inválidos'`, `'Senha'`, `'Entrando...'`, `'Entrar'`, `'Não tem conta?'`, `'Criar empresa'`, `'Voltar ao início'`

**6. `src/admin/AdminDashboard.jsx`**
- `'Nome da Empresa'` e outras labels de formulário

### Implementacao

1. Adicionar ~40 novas chaves em `src/resources/l10n/en.json` (valores em ingles)
2. Adicionar as mesmas chaves em `src/resources/l10n/pt_BR.json` (valores em portugues)
3. Substituir todas as strings hardcoded por `t('chaveCorrespondente')` nos 6 arquivos listados
4. Para arquivos que nao usam `useTranslation`, importar e usar

### Novas Chaves (resumo)

```json
{
  "statusIgnitionOn": "On",
  "statusIgnitionOff": "Off",
  "statusMoving": "Moving",
  "statusStopped": "Stopped",
  "statusUnblocked": "Unlocked",
  "statusAnchorActive": "Anchor Active",
  "statusBlocked": "Blocked",
  "sharedAll": "All",
  "sharedTotal": "Total",
  "sharedCoordinates": "Coordinates",
  "positionNetwork": "Network",
  "positionSignalGsm": "GSM Signal",
  "dashboardGreeting": "Hello, {0}",
  "dashboardTitle": "Dashboard",
  "dashboardFleetStatus": "{0} of {1} devices online · {2} moving",
  "dashboardFleetPanel": "Fleet Control Panel",
  "dashboardRealTime": "Real Time",
  "dashboardDisconnected": "Disconnected",
  "dashboardQuickAccess": "Quick Access",
  "dashboardDarkMode": "Dark Mode",
  "dashboardLightMode": "Light Mode",
  "dashboardDemoEnable": "Enable Demo",
  "dashboardDemoDisable": "Disable Demo",
  "dashboardDemoActive": "Demo mode active",
  "dashboardLastUpdate": "Last Update",
  "dashboardNoVehicles": "No vehicles found",
  "dashboardNoCategory": "in this category",
  "dashboardShowAll": "Show All",
  "dashboardShowLess": "Show Less",
  "dashboardExit": "Exit",
  "demoModeUnavailable": "Feature unavailable in demo mode",
  "loginPassword": "Password",
  "loginEnter": "Sign In",
  "loginEntering": "Signing in...",
  "loginInvalidCredentials": "Invalid email or password",
  "loginNoAccount": "Don't have an account?",
  "loginCreateCompany": "Create Company",
  "loginGoBack": "Back to Home"
}
```

Em `pt_BR.json` as mesmas chaves com valores em portugues (os atuais hardcoded).

