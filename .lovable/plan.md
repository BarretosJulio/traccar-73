

## Análise: O que funciona e o que NÃO funciona em produção

### O que FUNCIONA ✅
1. **Criação da geocerca** (`POST /api/geofences`) — funcional
2. **Criação do calendário ICS** (`POST /api/calendars`) — funcional, o Traccar aplica o agendamento
3. **Vinculação via permissions** (`POST /api/permissions`) — funcional
4. **Pausar/ativar** (`PUT /api/geofences` com `attributes.disabled`) — **parcialmente**. O atributo `disabled` é salvo como atributo customizado, mas o Traccar **não reconhece nativamente** esse atributo para impedir o disparo de alertas. Seria necessário verificar o atributo via notificações customizadas ou scripts

### O que NÃO funciona ✅ → Problema real
O card expandido mostra `startTime`, `endTime` e `activeDays` dos **attributes** da geocerca. Porém, o `handleSave` do `GeofenceCreateDialog` **não salva** esses valores nos attributes:

```javascript
// Linha 162 — apenas 'hide' é salvo nos attributes
attributes: { hide },
```

Os campos `startTime`, `endTime`, `startDate`, `endDate` e `selectedDays` são usados **apenas** para gerar o ICS do calendário. Depois disso, são descartados. O card expandido tenta ler `item.attributes.startTime` etc., mas esses valores nunca existem.

### Plano de correção

**Arquivo: `src/map/draw/GeofenceCreateDialog.jsx`**
- Salvar nos `attributes` os valores de agendamento para fins de exibição no card:
  - `startTime`, `endTime`, `startDate`, `endDate`, `activeDays` (string dos dias selecionados)
- Isso não afeta o funcionamento do Traccar (ele usa o `calendarId`), mas permite que o card mostre as configurações corretamente

**Arquivo: `src/other/GeofencesList.jsx`**
- Buscar o nome do calendário via `/api/calendars/{id}` para mostrar em vez de "Calendário #123"
- Adicionar exibição de `startDate`/`endDate` 
- Adicionar info de dispositivos vinculados (quantos dispositivos estão ligados à cerca)

### Resumo
O **agendamento funciona em produção** (ICS + calendarId). A **vinculação a dispositivos funciona**. O problema é que o **card expandido não mostra as configurações** porque elas não são salvas nos attributes da geocerca. A correção é simples: incluir esses dados nos attributes ao salvar.

