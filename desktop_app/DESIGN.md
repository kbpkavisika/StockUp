# Allora Design System — Desktop

Design system reference · v1.0-desktop · Windows / macOS / Linux (Electron)

Tokens and component specs for the StockUp desktop app (Electron + React + Tailwind). This is the Allora mobile system adapted for pointer, keyboard and large windows. The colour tokens are **identical** to mobile ([`../mobile_app/DESIGN.md`](../mobile_app/DESIGN.md)), so both apps read as one product. What changes is density, sizing, navigation and layout.

Achromatic surfaces, one hot accent, hairline structure. On desktop, data (tables, numbers, IDs) takes the place of product imagery as the main content.

**Header quick-facts**

| Key | Value |
|---|---|
| base unit | 4px |
| type | Archivo / IBM Plex Mono |
| accent | #D33A2C |
| default window | 1100 × 760 (see `electron.js`) |
| minimum window | 960 × 640 |

### What changes from mobile

| Concern | Mobile | Desktop |
|---|---|---|
| Input | Touch | Mouse + keyboard; hover and focus are first-class states |
| Minimum target | 44px | 32px pointer target (rows stay 40+) |
| Default control height | 52 | 40 (lg 44 / md 40 / sm 32) |
| Body text | 15 / 22 | 14 / 20 |
| Navigation | Bottom tab bar + top bar | Left sidebar + 56px page header |
| Lists | Cards, infinite scroll | Data tables with sort, selection, numbered pagination |
| Modals | Bottom sheet | Centred dialog, or side panel for forms |
| Toasts | Above tab bar | Bottom-right, 24px from window edge |
| Dictation mic in every field | Required | Optional — shown only when dictation is available (see §05) |

---

## 01 · Colour

Same tokens and values as mobile. Every token has a light and a dark value; neutrals and surfaces invert, brand hues keep their hue, and `success` / `warning` / `error` brighten in dark mode. Component specs below quote light-mode hexes; substitute the dark value when `<html class="dark">` is set.

Every foreground token clears WCAG 2.1 AA against the surfaces it sits on — 4.5:1 for text, 3:1 for borders and meaningful non-text — in both modes. `disabled` is the sole exception (inactive-component exemption). Re-check the ratio before changing a value.

### Ink & neutrals

| Name | Token | Light | Dark | Notes |
|---|---|---|---|---|
| Ink 900 | `primary` | `#101112` | `#F5F5F6` | |
| Ink 700 | `primary-hover` | `#2E3133` | `#E4E6E8` | |
| Ink 500 | `secondary` | `#63686D` | `#9BA0A5` | 5.63:1 on `surface` · 5.02:1 on `surface-sunken` · 7.17:1 (dark) |
| Ink 400 | `disabled` | `#9BA0A5` | `#5C6165` | disabled only · exempt |
| Grey 400 | `border-strong` | `#8C9297` | `#72777C` | 3.15:1 (light) · 4.18:1 (dark) |
| Grey 200 | `border` | `#E4E6E8` | `#2A2B2D` | |

### Surfaces

| Name | Token | Light | Dark | Desktop usage |
|---|---|---|---|---|
| Surface | `surface` | `#FFFFFF` | `#101112` | content area, tables, dialogs |
| Surface muted | `surface-muted` | `#F7F8F8` | `#1C1D1E` | sidebar, window background, row hover |
| Surface sunken | `surface-sunken` | `#F1F2F3` | `#252627` | table header, search field, selected row |

### Accent & info

| Name | Token | Light | Dark |
|---|---|---|---|
| Signal | `accent` | `#D33A2C` | `#D33A2C` |
| Signal press | `accent-pressed` | `#B62E22` | `#B62E22` |
| Signal tint | `accent-tint` | `#FBEDEB` (border `#F3DCD9`) | `#2C1613` (border `#4A241F`) |
| Tide | `info` | `#2F6BD8` | `#2F6BD8` |
| Tide 200 | `info-track` | `#B9CDF2` | `#24406E` |
| Tide tint | `info-tint` | `#EDF2FC` (border `#DDE6F8`) | `#16233B` (border `#223655`) |

### Semantic

| Name | Token | Light fill | Dark fill | Light tint | Dark tint |
|---|---|---|---|---|---|
| Success | `success` | `#197A4B` | `#22A566` | `#E8F3EC` | `#12261C` |
| Warning | `warning` | `#8A5300` | `#C97F1D` | `#FBF2E3` | `#2C2211` |
| Error | `error` | `#C4291F` | `#E5544A` | `#FBEBEA` | `#2E1614` |
| Info | `info` | `#2F6BD8` | `#2F6BD8` | `#EDF2FC` | `#16233B` |

> Accent is reserved: active sidebar indicator, active tab indicator, low-stock / alert flags, destructive confirmation. Never a large fill. On desktop there is no product imagery, so the screen should be almost entirely achromatic; colour appears only in status badges and the single accent indicator.

---

## 02 · Typography

Display & text: **Archivo** (400 / 500 / 600 / 700 / 800) · Data & labels: **IBM Plex Mono** (400 / 500)

Desktop is read at ~50–70cm instead of ~30cm, so body and label sizes drop one step. Headings keep their mobile sizes.

| Token | Size / Line-height / Weight / Letter-spacing | Mobile equivalent | Example | Color |
|---|---|---|---|---|
| display | 34 / 38 / 800 / -0.03em | same | "Inventory" (empty-state hero only) | `primary` |
| h1 | 28 / 32 / 700 / -0.025em | same | Page title "All items" | `primary` |
| h2 | 22 / 28 / 700 / -0.02em | same | Dialog / panel title | `primary` |
| h3 | 18 / 24 / 600 / -0.01em | same | Section heading | `primary` |
| text-lg | 16 / 24 / 400 / 0 | 17 / 24 | Empty-state copy | `primary` |
| text-primary | 14 / 20 / 400 / 0 | 15 / 22 | Table cells, body | `primary` |
| label-lg | 14 / 20 / 600 / 0 | 15 / 22 | Button labels (lg, md) | `primary` |
| label | 13 / 18 / 600 / 0 | 14 / 20 | Field labels, sidebar items | `primary` |
| text-secondary | 13 / 18 / 400 / 0 | same | Captions, helper text, "42 items" | `secondary` |
| label-sm | 12 / 16 / 600 / 0 | 13 / 18 | Small buttons, chips | `primary` |
| overline | 11 / 14 / 700 / 0.1em / caps | same | Table headers, sidebar group labels | `secondary` (not accent) |
| mono | 13 / 18 / 400 / 0 | same | IDs, SKUs, quantities, timestamps | `primary` |

Rules:

- Sentence case everywhere except badges and overlines.
- Numbers in tables (quantity, price, ID) use `mono` with `font-variant-numeric: tabular-nums` and are right-aligned.
- Timestamps use `mono` in the format `2025-09-10 14:32`.

---

## 03 · Spacing, radius & layout

### Spacing scale

Same scale as mobile; desktop usage differs.

| Token | px | Desktop usage |
|---|---|---|
| space-0.5 | 2 | icon nudge |
| space-1 | 4 | label to value |
| space-2 | 8 | button gap, chip gap, icon-to-label |
| space-3 | 12 | table cell horizontal padding, sidebar item padding |
| space-4 | 16 | field gap in forms |
| space-5 | 20 | card / dialog padding (compact) |
| space-6 | 24 | dialog padding, page padding (compact window) |
| space-8 | 32 | page padding (default), section gap |
| space-10 | 40 | block break |
| space-16 | 64 | empty-state inset |

### Radius

| Value | Usage |
|---|---|
| 0 | table cells, images |
| 4 | checkbox, badge, tooltip |
| 8 | input, filter chip, menu item, sidebar item |
| 12 | card, dropdown, dialog, side panel |
| full (999px) | button, search, tag, toggle |

### Window layout

```
┌──────────┬───────────────────────────────────────────┐
│          │ Page header  h 56 · 1px border bottom     │
│ Sidebar  ├───────────────────────────────────────────┤
│ w 240    │ Toolbar      h 56 (search · filters · CTA)│
│ (72 when │───────────────────────────────────────────│
│ collapsed│ Content      padding 32 · max-width 1440  │
│ )        │ (table / cards)                           │
│          │                                           │
└──────────┴───────────────────────────────────────────┘
```

- Sidebar: 240px, `surface-muted`, right hairline 1px `border`. Collapses to a 72px icon rail below 1100px window width.
- Content: 12-column fluid grid, column gap 24, page padding 32 (24 in compact). Max content width 1440, left-aligned (no centred island on wide screens).
- Side panel (forms): 480px, slides in from the right over the content.

### Breakpoints (window width)

```
compact   960–1099   sidebar collapsed to rail · page padding 24
regular   1100–1439  sidebar expanded · page padding 32
wide      1440+      content capped at 1440 · card grids go 4-up
```

Set the Electron `BrowserWindow` `minWidth: 960, minHeight: 640`.

> Bars and regions are separated by 1px `border` hairlines, not shadows. Shadows are only for things that float (menus, dialogs, panels, toasts).

---

## 04 · Elevation

| Level | box-shadow | Radius | Desktop usage |
|---|---|---|---|
| e0 · flat | none + 1px border `#E4E6E8` | — | sidebar, header, toolbar, tables |
| e1 · resting card | `0 1px 2px rgba(16,17,18,.06)` | 12 | stat cards, item cards |
| e2 · raised | `0 2px 8px rgba(16,17,18,.08)` | 12 | card on hover, sticky table header when scrolled |
| e3 · dropdown | `0 8px 24px rgba(16,17,18,.10)` | 12 | dropdowns, context menus, popovers, toasts |
| e4 · modal | `0 16px 40px rgba(16,17,18,.16)` | 12 dialog / 0 panel edge | dialogs, side panel · scrim `rgba(16,17,18,.45)` |

Dark mode: keep the shadows but raise floating surfaces one step (`surface-muted` for menus, `surface-sunken` for hover inside them), because shadows barely show on near-black.

---

## 05 · Iconography

Outline only, **1.75px stroke**, round caps and joins, **24px grid**, 2px safe margin. Fill only for a selected state. Icons inherit text colour; never accent unless the state is accent.

### Sizes

| Token | px | Desktop usage |
|---|---|---|
| icon-sm | 16 | inside buttons, table row actions, menu items |
| icon-md | 20 | inputs, sidebar items, toolbar |
| icon-lg | 24 | empty states, page header actions |
| pointer target | 32 minimum | icon-only buttons are 32×32 (sm) or 40×40 (md) |

### Icon list

Mobile set plus desktop additions:

- **search**, **filters**, **chevron**, **back**, **account**, **show**, **hide**, **dictate** — as mobile
- **plus** — add item
- **edit** — pencil
- **delete** — trash can
- **more** — three horizontal dots (row overflow menu)
- **sort** — up/down arrows; shows a single arrow when the column is sorted
- **close** — × (dialogs, panels, toasts, clear search)
- **sidebar** — panel-left (collapse/expand sidebar)
- **theme** — sun (light) / moon (dark)
- **box** — inventory / items nav
- **alert** — triangle with exclamation (low stock)

### Dictation on desktop

Mobile pairs every field with a mic. In Electron the Chromium Web Speech API is not available out of the box, and the OS already provides dictation (Windows `Win + H`, macOS Fn-Fn). So on desktop:

- The `dictate` button is **hidden by default**.
- Show it (20px, trailing, 28px circle) only if the app wires up a working speech provider.
- Secure fields always use the `show` / `hide` toggle in that trailing slot.

---

## 06 · Components

### Buttons

Spec line: `h 44 (lg) / 40 (md, default) / 32 (sm) · radius full · label 14/600 (sm 12/600) · padding 0 20 (sm 0 14) · icon 16, gap 8`

| Variant / State | Background | Text / Border | Notes |
|---|---|---|---|
| Primary / default | `#101112` | `#FFFFFF` | "Add item" — at most one per view |
| Primary / hover | `#2E3133` | `#FFFFFF` | 120ms ease-out |
| Primary / pressed | `#2E3133` | `#FFFFFF` | `scale(0.98)` (subtler than mobile 0.97) |
| Primary / disabled | `#E4E6E8` | `#9BA0A5` | `cursor: not-allowed` |
| Secondary / default | `#FFFFFF` | border 1.5px `#101112`, text `#101112` | "Cancel", "Export" |
| Secondary / hover | `#F7F8F8` | border 1.5px `#101112` | |
| Secondary / pressed | `#F1F2F3` | border 1.5px `#101112` | |
| Secondary / disabled | `#FFFFFF` | border 1.5px `#C9CDD1`, text `#9BA0A5` | |
| Ghost / default | transparent | text `#101112` | toolbar and row actions |
| Ghost / hover | `#F1F2F3` | text `#101112` | |
| Icon button | transparent, 32×32 or 40×40, radius full | icon `#63686D` → `#101112` on hover, bg `#F1F2F3` on hover | always has a tooltip and `aria-label` |
| Destructive | `#C4291F` | `#FFFFFF` | only inside a confirmation dialog — "Delete item" |
| Destructive / hover | `#B62E22` | `#FFFFFF` | |
| Text link | none | `#101112` 14/600, 1.5px underline, underline-offset 3px | hover: `#2E3133` |

All buttons: focus = 3px `info` ring, 2px offset (see §08). Loading = keep width, swap label for a 16px spinner.

### Inputs

Spec line: `h 40 · radius 8 · 1px #8C9297 · label 13/600 above, gap 6 · padding 0 12 · text 14/400`

| Variant / State | Background | Border | Notes |
|---|---|---|---|
| Search / rest | `#F1F2F3` | none | h 40, radius full, leading search icon 16 `#63686D`, placeholder "Search items" + shortcut hint `Ctrl K` in a 4-radius `mono` keycap on the right |
| Search / focus | `#FFFFFF` | 1.5px `#101112` | trailing `close` icon button clears the query |
| Field / rest | `#FFFFFF` | 1px `#8C9297` | |
| Field / hover | `#FFFFFF` | 1px `#63686D` | |
| Field / focus | `#FFFFFF` | 1.5px `#101112` + 3px `info` ring | |
| Field / error | `#FFFFFF` | 1.5px `#C4291F` | label turns `#C4291F`; message 13px `#C4291F` below, gap 6 — e.g. "Name is required" |
| Field / disabled | `#F7F8F8` | 1px `#E4E6E8` | text `#9BA0A5` |
| Field / required | `#FFFFFF` | 1px `#8C9297` | label row: `Label` + "Required" in `#63686D` 13/400, gap 8 |
| Textarea | `#FFFFFF` | 1px `#8C9297` | min-height 96, padding 10 12, vertical resize only |
| Number / quantity | `#FFFFFF` | 1px `#8C9297` | `mono`, right-aligned, width 120 |
| Field / secure | `#FFFFFF` | 1px `#8C9297` | trailing 28px `show`/`hide` toggle, icon 20 `#63686D` |

Placeholder text: `#63686D` (meets 4.5:1). Never use a placeholder as the only label.

### Data table

The primary desktop component. Spec line: `header h 40 · row h 48 (comfortable) / 40 (compact) · cell padding 0 12 · 1px border hairlines between rows · no vertical rules`

| Part | Spec |
|---|---|
| Container | `surface`, 1px `border`, radius 12, overflow hidden; or e0 flush with the page |
| Header row | h 40, bg `surface-sunken`, `overline` text in `secondary`, sticky on scroll (gains e2 when scrolled) |
| Sortable header | hover text `primary`; sorted column shows `sort` arrow 16 in `primary` and `aria-sort` |
| Body row | h 48, `text-primary`; 1px `border` bottom; last row no border |
| Row hover | bg `surface-muted`; row actions fade in (120ms) |
| Row selected | bg `surface-sunken` + 3px `primary` bar on the left edge |
| Row focus (keyboard) | 3px `info` ring inset |
| Checkbox column | 48 wide, 18×18 checkbox (radius 4, 1.75px border) |
| Text columns | left-aligned; long text truncates with ellipsis + full value in a tooltip |
| Numeric columns | right-aligned, `mono`, tabular nums |
| Timestamp column | `mono`, `secondary` |
| Actions column | right-aligned, 96 wide; `edit` and `more` icon buttons (32×32). Secondary actions (Duplicate, Delete) live in the `more` menu |
| Bulk bar | replaces the toolbar when ≥1 row is selected: "3 selected" `label` + Ghost actions + Destructive-text "Delete" |
| Empty | see Empty state below |
| Loading | 8 skeleton rows at final geometry, `#F1F2F3` shimmer to `#F7F8F8`, 1.4s |
| Pagination | footer h 56: "1–50 of 312" `text-secondary` left; page buttons right (below) |

Do not use coloured action buttons in rows (the current yellow Edit / red Delete). Destruction is confirmed in a dialog, which is where red appears.

### Pagination

- Desktop uses numbered pagination for tables (50 rows per page, selectable 25 / 50 / 100). No infinite scroll.
- Page buttons: 32×32, radius 8; current page bg `#101112`, text `#FFFFFF` 13/600; others transparent, text `#101112`, hover bg `#F1F2F3`; disabled arrow icon `#C9CDD1`; ellipsis `…` `#63686D`.

### Filter chips, dropdown, menu, toggle, checkbox

| Component | Dimensions | Colors | Notes |
|---|---|---|---|
| Filter chip (default) | h 32, radius 8, padding 0 12 | border 1px `#8C9297`, bg `#FFFFFF`, text 13/500 `#101112` | "Sort: Newest" + chevron 16 |
| Filter chip (hover) | | bg `#F7F8F8` | |
| Filter chip (selected) | | border 1.5px `#101112`, bg `#F1F2F3`, text 13/600 | "Status · 2" |
| Filter chip (disabled) | | border 1px `#E4E6E8`, text `#C9CDD1` | |
| Dropdown / menu panel | min-width 200, radius 12, padding 4, e3 | bg `#FFFFFF`, border 1px `#E4E6E8` | group header `overline` `#63686D` padding 8 12 |
| Menu item | h 32, radius 8, padding 0 12, icon 16 + gap 8 | text 14/400 `#101112`; hover/keyboard-active bg `#F1F2F3` | right-aligned shortcut in `mono` `#63686D` |
| Menu item (selected) | | `✓` 16 in `#B62E22` trailing | |
| Menu item (destructive) | | text `#C4291F`, icon `#C4291F`; hover bg `#FBEBEA` | "Delete" — always last, after a divider |
| Context menu | same as menu panel | | opens on right-click on a table row; same items as the `more` menu |
| Toggle / Off | 36×20, radius full, padding 2 | track `#E4E6E8`, border 1px `#8C9297`, knob 16×16 `#FFFFFF` + `0 1px 2px rgba(16,17,18,.2)` | |
| Toggle / On | 36×20 | track `#101112`, knob right | |
| Checkbox / unchecked | 18×18, radius 4 | border 1.75px `#101112` | hover bg `#F1F2F3` |
| Checkbox / checked | 18×18, radius 4 | bg `#101112`, `✓` `#FFFFFF` 12px | |
| Checkbox / indeterminate | 18×18, radius 4 | bg `#101112`, 8×2 bar `#FFFFFF` | header "select all" when some rows are selected |

### Badges & tags

| Component | Size | Radius | Colors |
|---|---|---|---|
| Badge "In stock" | h 22, padding 0 8 | 4 | bg `#E8F3EC`, text `#197A4B` 11/700 caps 0.06em |
| Badge "Low stock" | h 22 | 4 | bg `#FBF2E3`, text `#8A5300` |
| Badge "Out of stock" | h 22 | 4 | bg `#F1F2F3`, text `#63686D` |
| Badge "Archived" | h 22 | 4 | bg `#101112`, text `#FFFFFF` |
| Alert flag | text row | — | 6px dot `#D33A2C` + `overline` `#B62E22` — e.g. "REORDER" |
| Tag (category) | h 22, padding 0 10 | full | border 1px `#8C9297`, text `#2E3133` 12px |
| Count badge | 18×18 | full | bg `#D33A2C`, text `#FFFFFF` `mono` 10px — sidebar alert count only |

### Cards

- Stat card: radius 12, 1px `border`, e1, padding 20. Label `text-secondary`, value `h1` in `mono` weight 500, delta `text-secondary` (success/error colour only on the arrow glyph).
- Item card (grid view, optional): radius 12, 1px `border`, e1 → e2 on hover (120ms). Padding 20; title `h3`, description `text-secondary` clamped to 2 lines, footer row with badge + timestamp `mono`.

### Dialog

Replaces the mobile bottom sheet for confirmations and short tasks.

Spec line: `centred · width 400 (sm) / 560 (md) / 720 (lg) · radius 12 · padding 24 · e4 · scrim rgba(16,17,18,.45) · enter 160ms cubic-bezier(.2,0,0,1) fade + 0.98→1 scale`

- Header: title `h2` + `close` icon button (32) top-right.
- Body: `text-primary`, gap 16.
- Footer: right-aligned buttons, gap 8; order **Secondary (Cancel) then Primary/Destructive**. Buttons md (40).
- `Esc` and the close button cancel; clicking the scrim cancels only for non-destructive dialogs.
- Focus is trapped inside; initial focus on the least destructive action (Cancel) for destructive dialogs.

Delete confirmation (replaces `window.confirm`):

```
Delete "Blue hoodie"?                                  ×
This removes the item and its history. This can't be undone.

                                  [ Cancel ]  [ Delete item ]
```

### Side panel

For create / edit forms so the table stays visible.

- Width 480, full window height, slides in from the right (240ms cubic-bezier(.2,0,0,1)), e4, left edge radius 0.
- Header h 56: title `h2` ("Add item" / "Edit item") + `close` icon button; 1px `border` bottom.
- Body: padding 24, fields stacked with gap 16.
- Footer h 72: 1px `border` top, buttons right-aligned (Cancel, Save). `Ctrl + Enter` saves.
- Unsaved changes + close → confirm dialog "Discard changes?".

### Toast

- Bottom-right, 24px from window edges, width 360, radius 12, e3, bg `#101112`, text `#FFFFFF` 14/400 (inverse in dark mode: bg `#F5F5F6`, text `#101112`).
- Optional action as a text link ("Undo") and a `close` icon button.
- Auto-dismiss after 4s; paused while hovered. Stack upward with gap 8, max 3.

### Tooltip

- bg `#101112`, text `#FFFFFF` 12/16, radius 4, padding 4 8, max-width 240.
- Appears after 500ms hover (instantly on keyboard focus), 8px from the target. Required for every icon-only button; include the shortcut in `mono` if one exists.

### Empty state

- Centred in the content area, inset 64. `box` icon 24 in `secondary`, `h2` "No items yet", `text-secondary` "Add your first item to start tracking stock.", Primary button "Add item".
- Search with no results: `h3` "No matches for "hood"", Ghost button "Clear search".

### Divider

1px `#E4E6E8`. Labelled divider ("OR") uses `overline` in `secondary`, gap 12 either side, margin 24 0.

---

## 07 · Navigation

### Sidebar

Spec line: `w 240 · bg surface-muted · 1px border right · item h 36 radius 8 · active = surface + 3px accent bar`

- Top (h 56): wordmark "stockup" 20/800 `-0.03em` `#101112`, padding 0 16; `sidebar` icon button to collapse.
- Group label: `overline` `secondary`, padding 16 12 4.
- Item: h 36, radius 8, margin 0 8, padding 0 12, icon 20 + gap 12 + `label` (13/600 in active, 13/500 `secondary` inactive). Hover bg `#F1F2F3`.
- Active item: bg `surface`, text `primary`, icon filled where it has a fill state, 3px × 20px `accent` bar on the left edge of the sidebar aligned to the item.
- Items: Items, Low stock (count badge), Categories, Reports; bottom group: Settings, theme toggle.
- Collapsed rail (72): icons only, centred, tooltips on hover.

### Page header

- h 56, bg `surface`, 1px `border` bottom, padding 0 32.
- Left: page title `h3` (18/600) + item count `text-secondary` ("312 items").
- Right: Ghost/icon actions, then the one Primary action.

### Toolbar

- h 56, padding 0 32, gap 8: search (width 320) → filter chips → spacer → view toggle (table / grid) → density toggle.

### Tabs (in-page)

- h 40, gap 24, 1px `border` bottom. Active: `label-lg` `primary` + 3px `accent` bottom indicator. Inactive: 14/500 `secondary`, hover `primary`.
- Arrow keys move between tabs.

### Keyboard shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` / `Ctrl + F` | Focus search |
| `Ctrl + N` | Add item (opens side panel) |
| `Enter` on a row | Edit item |
| `Delete` on a row / selection | Delete (opens confirmation dialog) |
| `Ctrl + Enter` | Save the open form |
| `Esc` | Close menu / dialog / panel; clear search when search is focused |
| `↑` / `↓` | Move row focus |
| `Space` | Toggle row selection |
| `Ctrl + A` (table focused) | Select all rows on the page |
| `Ctrl + Shift + L` | Toggle light / dark |
| `Ctrl + \` | Collapse / expand sidebar |

On macOS, `Ctrl` is `Cmd`. Show shortcuts in tooltips and menus, formatted per platform.

---

## 08 · Interaction states

| State | Treatment | Motion |
|---|---|---|
| Hover | Always present on desktop. Filled controls darken one step (`#101112` → `#2E3133`); outlined and ghost take `#F7F8F8` / `#F1F2F3`; table rows take `surface-muted`; cards rise e1 → e2. Cursor `pointer` on clickable controls only (not on table rows that just select). | 120ms ease-out |
| Pressed | Primary `scale(0.98)`; outlined fills `#F1F2F3`. | 80ms in / 160ms out |
| Focus | `:focus-visible` only: 3px solid `info` `#2F6BD8` ring, 2px offset, radius follows the control. Inside tables the ring is inset. Never removed. | instant |
| Selected | 1.5px `primary` border + `surface-sunken` fill on chips; rows get `surface-sunken` + 3px left bar; 3px `accent` indicator on tabs and sidebar. | 140ms ease-out |
| Disabled | Fill `#E4E6E8` / label `#9BA0A5`; outlined border `#E4E6E8`. `cursor: not-allowed`. No opacity fades. | none |
| Loading | Skeletons in `#F1F2F3` at final geometry, 1.4s shimmer to `#F7F8F8`. Buttons keep width, swap label for a 16px ring. Show skeletons only after 300ms to avoid flashes on fast local SQLite reads. | 1400ms loop |
| Error | 1.5px `#C4291F` border, 13px message below the field, label turns `#C4291F`. Operation failures go to a toast. | no shake |

Respect `prefers-reduced-motion`: drop scale and slide transitions, keep fades ≤ 120ms.

---

## 09 · The system in use

Five StockUp screens at 1100 × 760 (default window), built only from the tokens above.

### 01 · Items (main view)
Sidebar (Items active, accent bar) → page header ("Items" + "312 items", Primary "Add item" with `plus` icon) → toolbar (search "Search items" + `Ctrl K` keycap, chips "Sort: Newest", "Status: All") → data table: checkbox · Name (`label` 14/600) · Description (`text-secondary`, truncated) · Stock (badge) · Updated (`mono`) · actions (`edit`, `more`) → pagination footer "1–50 of 312".

### 02 · Add / edit item (side panel)
Items table stays visible under the scrim → 480 side panel: header "Add item" + close → Name (Field / required) → Description (Textarea) → Quantity (Number) → footer Cancel / Save. Validation error example: Name field in error state, "Name is required".

### 03 · Delete confirmation (dialog)
Scrim over the Items view → 400 dialog: `h2` "Delete "Blue hoodie"?" → `text-primary` consequence line → Cancel (Secondary, initially focused) + "Delete item" (Destructive). On success: toast "Item deleted" with "Undo".

### 04 · Empty state
Sidebar + header ("Items", "0 items") → toolbar hidden → empty state centred: `box` icon, "No items yet", helper copy, Primary "Add item".

### 05 · Settings
Sidebar (Settings active) → page header "Settings" → sections separated by 1px dividers, each `h3` + rows (h 56, `label` left / control right): Appearance (System / Light / Dark segmented control), Table density (Comfortable / Compact), Database location (`mono` path + Secondary "Open folder").

---

## 10 · Implementation in this app

### CSS variables (`src/index.css`)

Define tokens once as CSS variables; `.dark` on `<html>` (already used by `ThemeContext.tsx` with Tailwind `darkMode: 'class'`) swaps them. Components then never need `dark:` variants for colour.

```css
:root {
  --primary: #101112;        --primary-hover: #2E3133;
  --secondary: #63686D;      --disabled: #9BA0A5;
  --border-strong: #8C9297;  --border: #E4E6E8;
  --surface: #FFFFFF;        --surface-muted: #F7F8F8;   --surface-sunken: #F1F2F3;
  --accent: #D33A2C;         --accent-pressed: #B62E22;  --accent-tint: #FBEDEB;
  --info: #2F6BD8;           --info-track: #B9CDF2;      --info-tint: #EDF2FC;
  --success: #197A4B;        --success-tint: #E8F3EC;
  --warning: #8A5300;        --warning-tint: #FBF2E3;
  --error: #C4291F;          --error-tint: #FBEBEA;
  --on-primary: #FFFFFF;
}
.dark {
  --primary: #F5F5F6;        --primary-hover: #E4E6E8;
  --secondary: #9BA0A5;      --disabled: #5C6165;
  --border-strong: #72777C;  --border: #2A2B2D;
  --surface: #101112;        --surface-muted: #1C1D1E;   --surface-sunken: #252627;
  --accent-tint: #2C1613;
  --info-track: #24406E;     --info-tint: #16233B;
  --success: #22A566;        --success-tint: #12261C;
  --warning: #C97F1D;        --warning-tint: #2C2211;
  --error: #E5544A;          --error-tint: #2E1614;
  --on-primary: #101112;
}
```

### Tailwind (`tailwind.config.js` → `theme.extend`)

```js
colors: {
  primary: { DEFAULT: 'var(--primary)', hover: 'var(--primary-hover)' },
  secondary: 'var(--secondary)',
  disabled: 'var(--disabled)',
  border: { DEFAULT: 'var(--border)', strong: 'var(--border-strong)' },
  surface: { DEFAULT: 'var(--surface)', muted: 'var(--surface-muted)', sunken: 'var(--surface-sunken)' },
  accent: { DEFAULT: 'var(--accent)', pressed: 'var(--accent-pressed)', tint: 'var(--accent-tint)' },
  info: { DEFAULT: 'var(--info)', track: 'var(--info-track)', tint: 'var(--info-tint)' },
  success: { DEFAULT: 'var(--success)', tint: 'var(--success-tint)' },
  warning: { DEFAULT: 'var(--warning)', tint: 'var(--warning-tint)' },
  error: { DEFAULT: 'var(--error)', tint: 'var(--error-tint)' },
  'on-primary': 'var(--on-primary)',
},
fontFamily: {
  sans: ['Archivo', 'system-ui', 'sans-serif'],
  mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
},
borderRadius: { none: '0', sm: '4px', md: '8px', lg: '12px', xl: '16px', full: '999px' },
boxShadow: {
  e1: '0 1px 2px rgba(16,17,18,.06)',
  e2: '0 2px 8px rgba(16,17,18,.08)',
  e3: '0 8px 24px rgba(16,17,18,.10)',
  e4: '0 16px 40px rgba(16,17,18,.16)',
  focus: '0 0 0 2px var(--surface), 0 0 0 5px var(--info)',
},
```

Usage: `className="bg-surface text-primary border-border"` — works in both themes.

### Fonts

The desktop app must work offline, so bundle fonts instead of loading Google Fonts:

```
npm install @fontsource/archivo @fontsource/ibm-plex-mono
```

Import the weights in `src/main.tsx`: Archivo 400/500/600/700/800, IBM Plex Mono 400/500.

### Electron

- `BrowserWindow`: `minWidth: 960, minHeight: 640`, `backgroundColor` = `surface` for the current theme (avoids a white flash in dark mode).
- Default theme follows the OS via `nativeTheme.shouldUseDarkColors`; the user's explicit choice in Settings overrides it.

### Current component mapping

| File | Becomes |
|---|---|
| `src/frontend/App.tsx` | Window layout: Sidebar + Page header + Toolbar + content |
| `src/frontend/components/SearchFilter.tsx` | Search input (§06) + filter chips, inside the Toolbar |
| `src/frontend/components/ItemList.tsx` | Data table; row actions via `edit` + `more` icon buttons; delete via Dialog instead of `window.confirm` |
| `src/frontend/components/ItemForm.tsx` | Side panel with Field / required (Name) and Textarea (Description) |
| Theme button in `App.tsx` | Sidebar theme item + Settings → Appearance |
