

## Plano: Pagina de Instalacao PWA com Solicitacao de Permissoes

### Contexto
O PWA ja esta configurado via `vite-plugin-pwa` e o manifest existe, mas nao ha nenhuma pagina dedicada para guiar o usuario na instalacao do app no celular. O evento `beforeinstallprompt` nao e capturado em nenhum lugar do codigo. Alem disso, apos instalar, o sistema precisa solicitar permissoes do telefone (notificacoes, localizacao, etc.).

### Mudancas

**1. Criar `src/common/util/usePwaInstallPrompt.js`**
- Hook que captura o evento `beforeinstallprompt` e armazena o `deferredPrompt`
- Exporta `{ canInstall, promptInstall, isInstalled }` 
- Detecta se ja esta instalado via `display-mode: standalone`

**2. Criar `src/common/util/useDevicePermissions.js`**
- Hook modular que gerencia permissoes do dispositivo:
  - **Notificacoes**: `Notification.requestPermission()`
  - **Localizacao**: `navigator.geolocation.getCurrentPosition()` / `navigator.permissions.query({ name: 'geolocation' })`
  - **Camera** (para QR scanner): `navigator.mediaDevices.getUserMedia({ video: true })`
- Exporta `{ permissions, requestAllPermissions, requestPermission }`
- Cada permissao tem status: `granted`, `denied`, `prompt`, `unsupported`

**3. Criar `src/pwa/InstallPage.jsx`**
- Pagina dedicada rota `/install`
- **Secao 1 — Instalar App**: Botao grande "Instalar App" que chama `promptInstall()`. Se ja instalado, mostra badge de sucesso. Se no iOS, mostra instrucoes "Compartilhar → Adicionar a Tela Inicio"
- **Secao 2 — Permissoes**: Cards para cada permissao (Notificacoes, Localizacao, Camera) com status visual (verde=concedido, amarelo=pendente, vermelho=negado) e botao para solicitar cada uma
- **Secao 3 — Botao "Permitir Tudo"**: Solicita todas as permissoes de uma vez
- Design responsivo, MUI, tema do sistema

**4. Atualizar `src/Navigation.jsx`**
- Adicionar rota `/install` → `InstallPage`

**5. Atualizar manifest no `vite.config.js`**
- Adicionar `display: 'standalone'`, `start_url: '/'`, `background_color`, `orientation: 'portrait'`

**6. Atualizar traducoes `pt_BR.json` e `en.json`**
- Chaves: `pwaInstallTitle`, `pwaInstallButton`, `pwaInstalled`, `pwaIosInstructions`, `pwaPermissions`, `pwaPermissionNotification`, `pwaPermissionLocation`, `pwaPermissionCamera`, `pwaPermissionGranted`, `pwaPermissionDenied`, `pwaPermissionPending`, `pwaAllowAll`

**7. Atualizar `AI_MEMORY.md` e `CHANGELOG.md`**

### Layout

```text
┌──────────────────────────────────────┐
│         Instalar Aplicativo          │
│                                      │
│    [Logo do tenant]                  │
│                                      │
│    ┌──────────────────────────┐      │
│    │  📱 Instalar no Celular  │      │
│    │  [Instalar Agora]        │      │
│    └──────────────────────────┘      │
│                                      │
│    Permissoes Necessarias:           │
│    ┌────────┐ ┌────────┐ ┌────────┐ │
│    │🔔Notif.│ │📍Local.│ │📷Camera│ │
│    │  ✅    │ │  ⏳    │ │  ⏳    │ │
│    └────────┘ └────────┘ └────────┘ │
│                                      │
│    [Permitir Todas as Permissoes]    │
└──────────────────────────────────────┘
```

### Arquivos Impactados
- `src/common/util/usePwaInstallPrompt.js` (novo)
- `src/common/util/useDevicePermissions.js` (novo)
- `src/pwa/InstallPage.jsx` (novo)
- `src/Navigation.jsx` (rota)
- `vite.config.js` (manifest)
- `src/resources/l10n/en.json`, `pt_BR.json` (traducoes)
- `AI_MEMORY.md`, `CHANGELOG.md`

