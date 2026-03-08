

# Fix Map Style Switcher Popup + Contrast Audit

## Problem
1. The map style switcher opens as a narrow inline list inside the maplibre control group — hard to read, poor UX on the dark glassmorphism background
2. Text buttons in `.maplibregl-style-list` have no explicit `color` set, so they inherit browser defaults (black text on dark semi-transparent background = unreadable)

## Solution

### 1. Restyle `.maplibregl-style-list` as a floating popup (`src/map/switcher/switcher.css`)

Transform the style list into a proper popup card:
- Position it as `position: absolute` anchored to the switcher button (right-aligned, below the control)
- Apply the same glassmorphism style as other map controls (dark background, blur, border)
- Set explicit `color: rgba(255, 255, 255, 0.85)` on all buttons
- Active item gets teal accent (`color: #2dd4bf`, left border highlight)
- Hover state with `background: rgba(45, 212, 191, 0.12)`
- Add `border-radius: 14px`, proper padding, and `min-width: 180px`
- Smooth entry animation (opacity + translateY)

### 2. Fix contrast on all map control text elements (`public/styles.css`)

- `.maplibregl-style-list button` — white text on dark glass background
- `.maplibregl-ctrl-geocoder--input` — already handled (white text)
- Verify scale control text — already `rgba(255, 255, 255, 0.7)` ✓
- Attribution — already handled ✓

### 3. Minor adjustment to `switcher.js`

Update `onAdd` to set a positioning class on the container so the popup anchors correctly relative to the button, and ensure the popup gets proper `display: flex; flex-direction: column` when shown.

### Files to modify
- `src/map/switcher/switcher.css` — Complete restyle of the dropdown into a popup card
- `public/styles.css` — Add/fix contrast rules for style-list buttons within glassmorphism context
- `src/map/switcher/switcher.js` — Minor: add relative positioning to container, improve show/hide with class toggle instead of inline style

