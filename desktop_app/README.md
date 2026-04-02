# StockUp Desktop App

Desktop CRUD application built for the Zynologic assignment.

## Stack

- Electron (Windows desktop runtime)
- React + TypeScript (UI)
- Tailwind CSS (styling)
- SQLite using better-sqlite3 (local persistence, offline)

## Features

- Create, read, update, delete items
- Fields: id, title/name, description, timestamp (plus quantity/category for filtering)
- Search by text
- Category filter
- Light/Dark theme toggle with local persistence
- Local SQLite database (no external backend)

## Project Structure

```text
desktop_app/
   electron.js              # Electron main process
   src/
      backend/
         database.ts          # SQLite table + CRUD queries
      frontend/
         App.tsx              # Main UI screen
         ThemeContext.tsx     # Theme state/persistence
         components/
            ItemForm.tsx
            ItemList.tsx
            SearchFilter.tsx
         hooks/
            useItems.ts        # UI state + CRUD handlers
      main.tsx               # React entry
      index.css              # Global styles
```

## Run

From desktop_app:

1. Install packages

```bash
npm install
```

2. Start frontend dev server

```bash
npm run dev
```

3. In another terminal, start Electron

```bash
npm run electron
```

## Scripts

- npm run dev
- npm run electron
- npm run build
- npm run lint

## Notes

- App is fully offline.
- SQLite DB file is created locally when app starts and initializes the table automatically.
