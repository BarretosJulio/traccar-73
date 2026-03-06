

## Problem

The Admin Dashboard has `backgroundColor: '#0a0a0f'` but the app's root/body background from the theme palette is `#111827` (dark mode). This lighter blue color bleeds through at the edges and between sections, creating an ugly two-tone effect visible in your screenshots.

## Solution

Unify the background colors so there's only one consistent dark background across the entire admin panel:

1. **`src/admin/AdminDashboard.jsx`** — Change the root `minHeight: '100vh'` container to also set `position: fixed` + `inset: 0` + `overflow: auto` so it fully covers the underlying app background. Alternatively, keep `#0a0a0f` but ensure it covers everything with `min-height: 100vh` and the body doesn't show through.

2. **`src/common/theme/palette.js`** — Optionally align the dark mode `background.default` from `#111827` to `#0a0a0f` so they match. However, since the admin panel is a standalone page with its own styling, the better fix is in the admin component itself.

### Specific changes:

**`src/admin/AdminDashboard.jsx`** (line 197-199):
- Change the root container to use `position: 'fixed'`, `inset: 0`, `overflow: 'auto'` instead of `minHeight: '100vh'`. This ensures the `#0a0a0f` background covers the entire viewport with no gaps where `#111827` can show through.
- Apply the same fix to the loading state container (line 151).

This eliminates the lighter blue band completely — the entire admin screen will be a single uniform `#0a0a0f` dark background.

