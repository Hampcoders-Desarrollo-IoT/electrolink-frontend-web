# Fix: Component Type Status Reactivity

## Root Cause

PrimeVue's DataTable (`el-table-card.vue:53`) uses `dataKey="id"` for row identity. When the store replaces objects via `.map()` (creating new instances with same IDs), PrimeVue **does not propagate the new object data to existing row components** — the `#body="{ data }"` slot receives stale references.

## Fix

Replace `.map()` with in-place `Object.assign` mutation in 4 locations across 2 files. Vue 3's Proxy system tracks property-level changes, so PrimeVue's row components will re-render when `isActive` changes on the existing object.

## Files to Change

### 1. `src/features/assets/application/component-type.store.js`

**Location 1 — `updateComponentType` (line 70):**
```
Before:
componentTypes.value = componentTypes.value.map(ct => ct.id === id ? updated : ct);

After:
const existing = componentTypes.value.find(ct => ct.id === id);
if (existing) Object.assign(existing, updated);
```

**Location 2 — `activateComponentType` (line 108):**
```
Before:
componentTypes.value = componentTypes.value.map(ct => ct.id === id ? updated : ct);

After:
const existing = componentTypes.value.find(ct => ct.id === id);
if (existing) Object.assign(existing, updated);
```

**Location 3 — `deactivateComponentType` (line 125):**
```
Before:
componentTypes.value = componentTypes.value.map(ct => ct.id === id ? updated : ct);

After:
const existing = componentTypes.value.find(ct => ct.id === id);
if (existing) Object.assign(existing, updated);
```

### 2. `src/features/assets/application/component.store.js`

**Location 4 — `updateComponent` (line 70-71):**
```
Before:
components.value = components.value.map(c => c.id === id ? updated : c);

After:
const existing = components.value.find(c => c.id === id);
if (existing) Object.assign(existing, updated);
```

## Verification

Build passes: `npm run build`
