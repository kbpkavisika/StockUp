# StockUp Mobile App (React Native + Expo)

A clean, offline-first CRUD mobile app for Android using React Native (Expo), NativeWind, and SQLite.

## Features

- Create, read, update, and delete items
- Item fields: `id`, `title`, `description`, `timestamp`
- Search by title or description
- Local persistence with SQLite (`expo-sqlite`)
- Light and dark theme toggle with local persistence
- Automatic list refresh after add, edit, and delete

## Tech Stack

- React Native + Expo
- TypeScript
- React Navigation (native stack)
- NativeWind (Tailwind for React Native)
- SQLite (`expo-sqlite`)

## Folder Structure

```text
src/
  App.tsx
  components/
    ItemCard.tsx
    PrimaryButton.tsx
    ScreenHeader.tsx
  screens/
    Home.tsx
    ItemForm.tsx
  types/
    item.ts
    navigation.ts
  utils/
    database.ts
    ThemeContext.tsx
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Run Android app:

```bash
npm run android
```

3. Start Expo dev server:

```bash
npm run start
```

## Notes

- SQLite tables are initialized on app startup.
- Theme selection is stored in the `settings` table.
- The app is fully offline and does not use any backend service.
