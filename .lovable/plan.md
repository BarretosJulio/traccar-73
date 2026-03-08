

# Diagnóstico: Veículos Demo Não Visíveis

## Causa Provável

O usuário está na rota `/admin` (painel SaaS). Os veículos de demonstração só existem na rota `/app` (app principal de rastreamento). O painel admin (`AdminDashboard`) usa dados do Supabase, não do Redux store onde os veículos demo são injetados.

Porém, ao revisar o código do `DemoController`, encontrei problemas que podem causar falhas mesmo ao navegar para `/app`:

## Problemas Identificados

### 1. Categoria inválida `pickup`
O veículo `S10 MAB-05` usa `category: 'pickup'`, que não existe no sistema de ícones (`deviceCategories.js`, `preloadImages.js`). Pode causar erro no mapa.

### 2. Campos obrigatórios ausentes nos veículos demo
Os objetos `DEMO_VEHICLES` não têm `lastUpdate`, `groupId`, `disabled`, `positionId` — campos que o `useFilter`, `DashboardPage` e `DeviceRow` esperam. Isso pode causar erros silenciosos.

### 3. `devicesActions.update` mistura com veículos reais
Quando o demo é ativado pelo toggle no Dashboard (usuário já logado), os 5 veículos demo são ADICIONADOS aos reais. Se o Traccar retornar 0 veículos (setup incompleto), funciona. Mas se retornar veículos reais com erros, pode confundir.

## Plano de Correção

### Arquivo: `src/main/DemoController.jsx`

1. **Corrigir categoria** `pickup` → `car` no veículo S10
2. **Adicionar campos faltantes** em cada veículo demo:
   - `lastUpdate: new Date().toISOString()`
   - `groupId: 0`
   - `disabled: false`
   - `positionId: 90000 + id`
3. **Usar `devicesActions.refresh`** em vez de `update` no `injectDemoData` para garantir que APENAS veículos demo apareçam (experiência demo limpa)

### Arquivo: `src/main/MainPage.jsx` (sem alteração)

O `MainPage` já consome `devices` e `positions` do Redux corretamente. Com os campos corrigidos, os filtros e a ordenação funcionarão.

### Resultado Esperado

- Ao clicar "Demo" no login → navega para `/app` → 5 veículos fictícios visíveis no Dashboard e no Mapa
- Ao clicar toggle demo no Dashboard → veículos reais substituídos por 5 fictícios
- Ao desativar demo → polling reinicia e veículos reais retornam

