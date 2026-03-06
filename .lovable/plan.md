

## Diagnóstico

### Problema principal: Links do SettingsMenu sem prefixo `/app`

O `SettingsMenu.jsx` usa caminhos como `/settings/preferences`, `/settings/devices`, `/geofences` — todos sem o prefixo `/app`. Isso faz com que **nenhum item do menu lateral funcione**. Os checks de `selected` também estão incorretos pelo mesmo motivo.

### Restyling: Popup flutuante sobre o mapa (desktop)

O usuário quer que as configurações apareçam como um **painel/popup flutuante moderno** sobreposto ao mapa no desktop, em vez de uma página separada com drawer lateral.

---

## Plano de Implementação

### 1. Corrigir todos os links do SettingsMenu

**Arquivo**: `src/settings/components/SettingsMenu.jsx`

Adicionar `/app` em todos os `link=` e `location.pathname` checks:
- `/settings/preferences` → `/app/settings/preferences`
- `/settings/notifications` → `/app/settings/notifications`
- `/settings/user/${userId}` → `/app/settings/user/${userId}`
- `/settings/devices` → `/app/settings/devices`
- `/geofences` → `/app/geofences`
- `/settings/groups` → `/app/settings/groups`
- `/settings/drivers` → `/app/settings/drivers`
- `/settings/calendars` → `/app/settings/calendars`
- `/settings/attributes` → `/app/settings/attributes`
- `/settings/maintenances` → `/app/settings/maintenances`
- `/settings/commands` → `/app/settings/commands`
- `/settings/announcement` → `/app/settings/announcement`
- `/settings/server` → `/app/settings/server`
- `/settings/users` → `/app/settings/users`

Todos os `location.pathname` checks também precisam do prefixo `/app`.

### 2. Modernizar ícones do SettingsMenu

Trocar ícones por versões mais modernas/expressivas:
- `TuneIcon` → `SettingsSuggestOutlined` (Preferências)
- `DnsIcon` → `DirectionsCarOutlined` (Dispositivos)
- `DrawIcon` → `ShareLocationOutlined` (Cercas)
- `PersonIcon` (Condutores) → `BadgeOutlined`
- `PersonIcon` (Conta) → `AccountCircleOutlined`
- `FolderIcon` → `FolderOpenOutlined`
- `BuildIcon` → `HandymanOutlined`
- `SendIcon` → `TerminalOutlined`
- `CalculateIcon` → `DataObjectOutlined`
- `SettingsIcon` → `AdminPanelSettingsOutlined`
- `PeopleIcon` → `GroupOutlined`

### 3. Restyling do PageLayout para desktop — Painel flutuante

**Arquivo**: `src/common/components/PageLayout.jsx`

No desktop, transformar o layout de "página inteira com drawer" para um **painel flutuante com backdrop semitransparente** sobre o mapa:

- Container principal: `position: fixed`, `inset: 0`, `zIndex: 1200`, backdrop blur
- Card central: `max-width: 900px`, `max-height: 85vh`, bordas arredondadas, sombra elevada
- Layout interno: drawer lateral fino (240px) + conteúdo à direita
- Botão X no canto para fechar (navega de volta)
- Scroll interno no conteúdo

```text
┌──────────────────────────────────────────────┐
│  (mapa visível atrás com blur)               │
│   ┌──────────────────────────────────┐       │
│   │ [←] Configurações          [✕]   │       │
│   │─────┬────────────────────────────│       │
│   │ 📋  │  Preferências             │       │
│   │ 🔔  │  ┌─────────────────┐      │       │
│   │ 👤  │  │ Custom Map      │      │       │
│   │ 🚗  │  │ Default Map     │      │       │
│   │ 📍  │  │ Coord Format    │      │       │
│   │ ...  │  │ ...             │      │       │
│   │     │  └─────────────────┘      │       │
│   │     │  [Cancelar] [Guardar]     │       │
│   └──────┴───────────────────────────┘       │
└──────────────────────────────────────────────┘
```

### 4. Verificar compatibilidade de todas as páginas de settings

Garantir que `EditItemView`, `DevicePage`, `UserPage`, `ServerPage`, `NotificationPage` e todas as outras páginas que usam `PageLayout` + `SettingsMenu` continuem funcionando com o novo layout.

---

## Arquivos a modificar

| Arquivo | Mudança |
|---|---|
| `src/settings/components/SettingsMenu.jsx` | Prefixo `/app` em todos os links + ícones modernos |
| `src/common/components/PageLayout.jsx` | Layout popup flutuante no desktop |
| `src/common/components/MenuItem.jsx` | Ajustes visuais (ícone menor, hover suave) |

Nenhuma alteração em endpoints da API Traccar — todas as chamadas existentes continuam iguais.

