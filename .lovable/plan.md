

# Add WhatsApp Link in Traccar Admin Settings (Admin-only)

## What
Add a "WhatsApp" menu item in the Traccar Settings Menu that opens the SaaS Admin panel directly on the WhatsApp tab. Visible only to admin users.

## Changes

### 1. `src/settings/components/SettingsMenu.jsx`
- Import `WhatsAppIcon` from MUI icons
- Add a new `MenuItem` inside the `{admin && ...}` block (next to Server settings) that links to `/admin?tab=whatsapp`
- Use `target="_blank"` or direct navigation — since `/admin` is outside `/app`, it will navigate to the SaaS panel

### 2. `src/admin/AdminDashboard.jsx`
- Read `tab` query parameter from URL on mount
- If `tab=whatsapp`, auto-set `activeTab` to `'whatsapp'` so the panel opens directly on the WhatsApp configuration

### 3. `src/main/MapSideMenu.jsx`
- Add a WhatsApp shortcut icon (admin-only) in the top bar that navigates to `/admin?tab=whatsapp`

### 4. i18n keys
- Add `whatsappSettings` key to `en.json` and `pt_BR.json` (e.g., "WhatsApp Settings" / "Configurações WhatsApp")

