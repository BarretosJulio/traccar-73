

# Popup de Configuração Rápida ao Criar Geocerca

## Problema
Atualmente, ao desenhar uma geocerca (polígono, linha ou círculo), ela é criada com nome genérico "Geofence" e o usuário é redirecionado para a página de configurações. Os campos importantes (nome, calendário, descrição) ficam escondidos em accordions e o fluxo é confuso.

## Solução
Criar um **dialog/popup** que aparece imediatamente após o desenho da geocerca, **antes** de salvar na API. O popup permite configurar nome, calendário (horários), descrição e visibilidade no mapa. Só após confirmar, a geocerca é criada via API com todos os dados preenchidos.

## Fluxo Novo

```text
Usuário desenha geocerca (polígono/linha/círculo)
  → Popup aparece com campos:
     - Nome (obrigatório)
     - Calendário (dropdown, opcional)
     - Descrição (opcional)
     - Ocultar no mapa (checkbox)
  → [Salvar] → POST /api/geofences com todos os dados → refresh geocercas
  → [Cancelar] → descarta a geometria, nada é criado
```

## Implementação

### 1. Criar `src/map/draw/GeofenceCreateDialog.jsx`
- Dialog MUI com campos: nome (TextField), calendário (SelectField com endpoint `/api/calendars`), descrição (TextField), ocultar (Checkbox)
- Props: `open`, `onSave(data)`, `onCancel`
- Botões: Cancelar / Salvar
- Validação: nome obrigatório

### 2. Modificar `src/map/draw/MapGeofenceEdit.js`
- Adicionar estado `pendingArea` para guardar a geometria temporariamente
- No `draw.create` e `handleCircleCreated`: em vez de criar direto na API, setar `pendingArea` com a área WKT
- Abrir o dialog quando `pendingArea` não é null
- No `onSave` do dialog: fazer POST com `{ name, area: pendingArea, calendarId, description, attributes: { hide } }`
- No `onCancel`: limpar `pendingArea`
- O componente deixa de retornar `null` e passa a renderizar o `GeofenceCreateDialog`
- **Remover** o `navigate` para a página de edição após criação (o popup já configurou tudo)

### Impacto
- **Banco**: Nenhum
- **APIs**: Mesma API `/api/geofences` POST, apenas com mais campos no body
- **UX**: Fluxo mais intuitivo, sem redirecionamento desnecessário

