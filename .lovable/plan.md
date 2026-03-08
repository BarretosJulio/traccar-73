

# Fix: "removeChild" Error on Settings Panel Close

## Problem
Clicking the X button (or backdrop) on the floating settings panel triggers a `NotFoundError: Failed to execute 'removeChild' on 'Node'`. This is a known React 19 + MapLibre GL DOM conflict — React tries to unmount overlay nodes while MapLibre has already manipulated the underlying DOM.

## Root Cause
The `navigate(-1)` call triggers synchronous unmounting of the overlay while the map component underneath is also reconciling its DOM. React's virtual DOM gets out of sync with the actual DOM, causing the `removeChild` error.

## Solution
Two changes in `src/common/components/PageLayout.jsx`:

1. **Defer navigation** — Wrap `navigate(-1)` in `setTimeout(..., 0)` so React finishes its current render cycle before the overlay unmounts. This prevents the DOM conflict.

2. **Prevent double-fire** — Add a `closing` state ref to prevent the navigate from being called multiple times (backdrop click + button click race condition).

```javascript
const handleClose = useCallback(() => {
  if (closingRef.current) return;
  closingRef.current = true;
  setTimeout(() => navigate(-1), 0);
}, [navigate]);
```

Replace all three `onClick={() => navigate(-1)}` in the desktop branch (lines 139, 149, 160) with `onClick={handleClose}`.

## Files Changed
- `src/common/components/PageLayout.jsx` — Add `useCallback`, `useRef`, create `handleClose` handler, apply to overlay, back button, and close button.

