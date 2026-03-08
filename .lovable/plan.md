

## Plano: Dialog de Alertas WhatsApp dentro do Traccar

### Objetivo
Ao clicar em "Configurações WhatsApp" no menu de settings do Traccar, abrir um **Dialog (popup)** com o conteúdo de alertas diretamente na interface, sem redirecionar para o painel admin SaaS.

### Mudanças

**1. Criar `src/settings/WhatsAppAlertsDialog.jsx`**
- Um `Dialog` MUI (`fullWidth`, `maxWidth="md"`) com fundo escuro (dark theme inline)
- Reutiliza a mesma lógica do `WhatsAppAlerts.jsx` (carregar alertas via `whatsappService`, toggle, editar template, salvar)
- Recebe `open` e `onClose` como props
- Usa componentes MUI (`Switch`, `Button`, `TextField`) ao invés dos elementos HTML inline do admin, para manter consistencia visual

**2. Atualizar `src/settings/components/SettingsMenu.jsx`**
- Trocar o `MenuItem` de WhatsApp de `link="/admin?tab=whatsapp"` para um `onClick` que abre o dialog
- Adicionar state `whatsappDialogOpen` e renderizar o `WhatsAppAlertsDialog`

**3. Atualizar `src/main/MapSideMenu.jsx`**
- Mesmo ajuste: trocar o link `/admin?tab=whatsapp` por onClick que abre o dialog inline

### Detalhes Tecicos
- O `whatsappService` ja expoe `getAlerts()` e `saveAlerts()` -- sera reutilizado diretamente
- O dialog tera o mesmo visual escuro da screenshot (background dark, switches com cor teal/verde)
- Nenhuma mudanca no backend ou nas edge functions

