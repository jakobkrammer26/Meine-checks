# Steckbrief-App (mit Postgres)

Ein Fragebogen (eine Frage pro Bildschirm) + passwortgeschützte Übersicht aller Antworten.
Daten werden dauerhaft in deiner eigenen Postgres-Datenbank gespeichert.

## Dateien

- `server.js` – Node.js/Express-Server, spricht Postgres an
- `public/index.html` – Fragebogen
- `public/admin.html` – Passwortgeschützte Übersicht
- `package.json` – Abhängigkeiten (express, pg)

## Lokal testen

```bash
npm install
export DATABASE_URL="postgres://user:passwort@host:5432/datenbank"
export ADMIN_PASSWORD="1234"   # optional, Standard ist 1234
npm start
```

Dann im Browser: http://localhost:3000

## Deployment auf Railway

1. Neues Projekt auf railway.app erstellen → "Deploy from GitHub repo" (Projektordner vorher zu GitHub pushen) oder "Empty Project" + Railway CLI nutzen
2. In den **Variables** des Projekts setzen:
   - `DATABASE_URL` = deine Postgres-Connection-String (aus deiner bestehenden DB-Instanz)
   - `ADMIN_PASSWORD` = dein gewünschtes Passwort für die Übersicht (optional)
3. Railway erkennt Node.js automatisch, führt `npm install` und `npm start` aus
4. Nach dem Deploy bekommst du eine öffentliche URL, z. B. `https://deine-app.up.railway.app`

## Deployment auf Render

1. Neuen "Web Service" erstellen, Repository verbinden
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Unter **Environment** die Variablen `DATABASE_URL` und optional `ADMIN_PASSWORD` setzen
5. Deployen – Render gibt dir eine öffentliche URL

## Wichtig

- Die Tabelle `entries` wird beim ersten Start automatisch angelegt
- Das Admin-Passwort ist standardmäßig `1234` – unbedingt über die Umgebungsvariable `ADMIN_PASSWORD` ändern, bevor die App öffentlich erreichbar ist
- Die Fragen lassen sich in `public/index.html` im `QUESTIONS`-Array anpassen (ebenso die angezeigten Felder in `admin.html` im `FIELD_LABELS`-Objekt)
