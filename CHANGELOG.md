# Changelog — HyperTraccar

Formato: [Semantic Versioning](https://semver.org/)

---

## [0.10.0] — 2026-03-08

### Added
- **Documentação completa das APIs** (`API_DOCS.md`)
  - Contexto: Documentação técnica das 4 Edge Functions com endpoints, autenticação, parâmetros e exemplos
  - Impacto em banco: Nenhum
  - Impacto em APIs: Nenhum (apenas documentação)

- **Guia de deploy** (`DEPLOY_GUIDE.md`)
  - Contexto: Instruções de deploy, variáveis de ambiente, configuração Supabase, troubleshooting
  - Impacto em banco: Nenhum

- **AI System Prompt** (`AI_SYSTEM_PROMPT.md`)
  - Contexto: 5º e último arquivo de controle da IA — contém regras de comportamento, padrões de código, segurança e fluxo de trabalho obrigatório
  - Justificativa: Exigido pelo Knowledge do projeto para manter consistência da IA
  - Impacto em banco: Nenhum

---

## [0.9.0] — 2026-03-08

### Fixed
- **Controles duplicados na tela de geofences**
  - Contexto: Página `/app/geofences` era incluída em `isSettingsRoute`, causando renderização de `MainMap` como background simultaneamente ao `MapView` da `GeofencesPage`
  - Justificativa: Como o mapa é singleton, ambos adicionavam controles à mesma instância (NavigationControl, SwitcherControl, GeolocateControl, WhatsApp)
  - Correção: Removido `/app/geofences` de `isSettingsRoute` em `App.jsx`
  - Impacto em banco: Nenhum
  - Impacto em APIs: Nenhum

- **Demo mode: categoria `pickup` normalizada para `car`**
  - Contexto: Veículos demo usavam categoria `pickup` que não existe nos ícones SVG
  - Correção: Normalização para `car` + campos obrigatórios adicionados
  - Impacto em banco: Nenhum

### Changed
- **UI: Controles do mapa com tema glassmorphism**
  - Contexto: Controles nativos do MapLibre estilizados com backdrop-filter, cantos arredondados, accent teal
  - Inclui: NavigationControl, GeolocateControl, SwitcherControl, geocoder, draw controls
  - Impacto: Apenas CSS, sem mudança funcional

### Added
- **Botão WhatsApp flutuante no mapa** (`MapWhatsApp.js`)
  - Contexto: Controle customizado MapLibre com ícone WhatsApp SVG
  - Número carregado do tenant via Supabase
  - Impacto em banco: Leitura de `tenants.whatsapp_number`

- **Alertas WhatsApp por dispositivo** (`WhatsAppDeviceAlerts.jsx`)
  - Contexto: Componente para configurar alertas WhatsApp individualmente por dispositivo
  - Impacto em banco: CRUD em `whatsapp_device_alert_prefs`

- **Arquivos de controle do projeto**
  - Criados: `AI_MEMORY.md`, `ARCHITECTURE.md`, `DATABASE_SCHEMA.md`, `CHANGELOG.md`, `SECURITY_POLICY.md`
  - Propósito: Manter contexto consistente para IA e equipe

---

## Última Atualização
2026-03-08
