

# Criar Arquivos de Controle do Projeto

Nenhum dos 5 arquivos de controle existe atualmente no projeto. Todos precisam ser criados.

## Arquivos a Criar

### 1. `AI_MEMORY.md`
Contexto do projeto: HyperTraccar — plataforma SaaS multi-tenant de rastreamento veicular baseada no Traccar, com frontend React + MUI, backend via Supabase Edge Functions (proxy para Traccar), integração WhatsApp (UAZAPI), sistema de tenants com white-label.

### 2. `ARCHITECTURE.md`
Documentação da arquitetura:
- **Frontend**: React 19 + Vite + MUI 7 + MapLibre GL + Redux Toolkit + tss-react
- **Rotas**: Landing (`/`), Admin (`/admin`), Login (`/login`), App (`/app/*`)
- **Estado**: Redux store com slices: devices, session, events, geofences, groups, drivers, maintenances, calendars, motion, errors
- **Mapa**: MapLibre com camadas modulares (positions, routes, geofences, accuracy, overlays)
- **Backend**: Supabase Edge Functions — `traccar-proxy`, `whatsapp-proxy`, `whatsapp-webhook`, `create-tenant`
- **Multi-tenant**: TenantProvider resolve tenant por slug/domínio, cada tenant tem traccar_url próprio

### 3. `DATABASE_SCHEMA.md`
Tabelas Supabase identificadas nos types:
- `tenants` — config do tenant (slug, traccar_url, plano, cores, logo, WhatsApp)
- `traccar_sessions` — sessões proxy Traccar por tenant/email
- `pwa_installations` — tracking de instalações PWA
- `whatsapp_instances` — instâncias WhatsApp por tenant (UAZAPI)
- `whatsapp_alert_configs` — configuração de alertas WhatsApp
- `whatsapp_device_alert_prefs` — preferências de alerta por dispositivo
- `whatsapp_message_log` — log de mensagens enviadas

### 4. `CHANGELOG.md`
Registro das alterações recentes:
- Fix: categoria demo `pickup` → `car`, campos obrigatórios adicionados
- Fix: controles duplicados na tela de geofences (rota excluída de isSettingsRoute)
- UI: controles de desenho de cerca reposicionados e estilizados com tema teal/glassmorphism

### 5. `SECURITY_POLICY.md`
Políticas de segurança:
- Autenticação via Traccar API (proxy através de Edge Functions)
- Multi-tenant isolado por `tenant_id` em todas as tabelas
- RLS habilitado no Supabase
- Sessões Traccar armazenadas em `traccar_sessions`
- Dados sensíveis (WhatsApp tokens) armazenados no Supabase com RLS

## Detalhes Técnicos

Todos os arquivos serão criados na raiz do projeto. O conteúdo será baseado na análise real do código-fonte — sem suposições. Cada arquivo seguirá formato Markdown com seções claras e será mantido atualizado em futuras alterações conforme o Knowledge define.

