

# Fix Map Style Switcher: Positioning + Icon Visibility

## Problems (from screenshot)
1. **Popup too low** — `top: calc(100% + 12px)` places it below the button; needs to align vertically centered with the button
2. **Icon invisible** — The `filter: brightness(0) invert(0.92)` on `.maplibregl-ctrl-icon` is being overridden by the global `public/styles.css` rule at line 91-93 which applies the filter to the button itself (not the icon inside). The layers SVG icon inside `.maplibregl-style-switcher` becomes invisible because the button has `background: transparent !important` from line 79, and the `filter` on the button element affects the background-image but the global rule conflicts.

## Solution

### 1. Reposition popup to center-align with button (`switcher.css`)
- Change from `top: calc(100% + 12px)` to `top: 50%; transform: translateY(-50%)` so it vertically centers relative to the button
- Keep `right: calc(100% + 12px)` to open to the left

### 2. Fix icon visibility (`switcher.css` + `public/styles.css`)
- The switcher button uses `background-image` for its icon. The global rule `.maplibregl-ctrl-group > button.maplibregl-ctrl-icon` applies filter to the entire button — but the switcher button also has class `maplibregl-ctrl-icon`, so the filter applies correctly in theory.
- **Root cause**: `public/styles.css` line 63 sets `overflow: hidden !important` on `.maplibregl-ctrl-group`, but the switcher has `overflow: visible !important` — these compete. More importantly, the `background: transparent !important` at line 79 may override the background-image.
- **Fix**: Add `!important` to the switcher's `background-image` and ensure the filter is applied directly on `.maplibregl-style-switcher` with higher specificity. Also add a tooltip (`title` attribute) to the button so users know what it does.

### 3. Add tooltip to switcher button (`switcher.js`)
- Set `this.styleButton.title = 'Mapas'` so on hover users see what the button does.

### Files to modify
- **`src/map/switcher/switcher.css`** — Reposition popup (center-align), ensure icon background-image has `!important`
- **`src/map/switcher/switcher.js`** — Add `title` attribute to the button
- **`public/styles.css`** — Ensure the switcher-control exception for overflow isn't overridden

