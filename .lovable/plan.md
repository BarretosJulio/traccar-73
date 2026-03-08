

# Diagnóstico: Controles Duplicados na Tela de Cerca Virtual

## Causa Raiz

Em `App.jsx` linha 46, a rota `/app/geofences` é incluída em `isSettingsRoute`:

```javascript
const isSettingsRoute = pathname.startsWith('/app/settings') || pathname.startsWith('/app/geofences');
```

Isso faz o `App.jsx` renderizar um `MainMap` como fundo (linhas 100-103) quando o usuário está na página de cercas. Porém, `GeofencesPage` já renderiza seu próprio `MapView` com `MapGeofenceEdit`, `MapCurrentLocation`, etc.

Como o `map` é um **singleton** compartilhado, ambos adicionam controles à mesma instância, causando duplicação de: NavigationControl (+/-), SwitcherControl (camadas), GeolocateControl (GPS), e o WhatsApp control.

## Correção

### Arquivo: `src/App.jsx` (linha 46)

Excluir `/app/geofences` do `isSettingsRoute`, pois a `GeofencesPage` já possui seu próprio `MapView` completo com controles dedicados:

```javascript
const isSettingsRoute = pathname.startsWith('/app/settings');
```

Apenas uma linha alterada. Resultado: a página de cercas mostra apenas seus controles próprios (navegação, camadas, GPS, desenho) sem duplicatas.

