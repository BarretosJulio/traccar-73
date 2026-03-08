

# Fix Map Control Icons: Consistent Visibility and Hover Behavior

## Problem
The map control buttons have inconsistent icon behavior:
- **Switcher (layers)**: Icon visible at rest but disappears on hover
- **Notification (bell)**: Icon disappears on hover
- **WhatsApp**: Works correctly (reference standard) — uses pre-colored SVGs with `filter: none`

**Root cause**: The global rules in `public/styles.css` (lines 90-106) apply CSS `filter` chains to `.maplibregl-ctrl-icon` buttons and child spans. The `brightness(0)` + `invert` approach conflicts with buttons that use `background-image` SVGs, causing them to vanish on hover.

## Solution
Adopt the same pattern used by the WhatsApp button: use **pre-colored SVGs** (white for normal, teal for hover) and set `filter: none !important` to bypass global filter interference.

### Files to modify

**1. `src/map/notification/notification.css`**
- Add `filter: none !important` to `.maplibre-ctrl-notification`
- Change the "off" bell SVG to use `fill='%23e2e8f0'` (light gray/white) so it's visible
- Change the "on" bell SVG to keep `fill='%232dd4bf'` (teal)
- Add hover states for both: on hover, "off" becomes teal, "on" becomes brighter teal
- Add `background-size`, ensure `!important` on `background-image`

**2. `src/map/switcher/switcher.css`**
- Change `.maplibregl-style-switcher` to use `filter: none !important`
- Replace the black SVG with a pre-colored white/light version (`fill='%23e2e8f0'`)
- On hover, swap to teal-colored SVG (`fill='%232dd4bf'`)

**3. `public/styles.css`**
- Keep global filter rules for native MapLibre controls (zoom +/-, compass) which work fine
- No changes needed here since the specific selectors in notification.css and switcher.css will override with `!important`

### Behavior after fix
- **Normal state**: All icons show in light gray/white — clearly visible on dark glassmorphism background
- **Hover state**: All icons change to teal (#2dd4bf) — consistent with WhatsApp and the reference image (image-119)
- **Icons never disappear**

