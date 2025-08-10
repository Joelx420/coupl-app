# rn-supa-notes

Eine React Native (Expo) App mit Supabase-Backend, Auth, CRUD, Realtime und Offline-Caching (React Query Persist).

## Voraussetzungen
- Node.js LTS
- Expo CLI (`npm i -g expo` optional) oder via `npx expo`
- Supabase Account

## Setup
1. Projekt klonen/öffnen und Abhängigkeiten sind bereits installiert.
2. `.env` erstellen und aus `.env.example` kopieren:

```
EXPO_PUBLIC_SUPABASE_URL=... // aus Supabase Projekt Einstellungen
EXPO_PUBLIC_SUPABASE_ANON_KEY=... // anon public key
```

3. Supabase SQL im Dashboard (SQL Editor) ausführen. Datei: `supabase/schema.sql`.
4. App starten:

```
npm run start
```

Mit Expo Go scannen oder Emulator nutzen.

## Ordnerstruktur (Auszug)
- `app/` Expo Router Screens
- `src/lib/supabase.ts` Supabase Client
- `src/providers/*` App- und Auth-Provider
- `src/services/*` CRUD und Realtime

## Sicherheit & Env
- Nutze ausschließlich `EXPO_PUBLIC_*` Variablen im Client. Geheime Keys (Service Role) NIEMALS in die App bundlen.
- RLS ist aktiviert und lässt nur Zugriff auf eigene Datensätze zu.

## Deployment (EAS Build)
1. `npm i -g eas-cli` (falls nicht installiert)
2. `eas login`
3. `eas build:configure`
4. In `app.json` Projektname, Icons etc. pflegen. Optional Bundle Identifier/Package setzen.
5. Umgebungsvariablen für Builds setzen:
   - Lokal: in Shell exportieren oder `.env` nutzen
   - EAS: `eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value <URL>` und analog für den Key
6. iOS Build (erfordert Apple Account): `eas build -p ios --profile production`
7. Android Build: `eas build -p android --profile production`
8. Upload:
   - iOS: `eas submit -p ios`
   - Android: `eas submit -p android`

Siehe Expo Doku: https://docs.expo.dev/build/introduction/

## Erweiterbarkeit
- Füge weitere Tabellen hinzu und erweitere RLS-Policies entsprechend.
- Services in `src/services/` nach Ressourcen trennen.
- React Query Keys konsistent halten (`['resource', id]`).