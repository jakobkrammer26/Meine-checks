const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ====== DATENBANK-VERBINDUNG ======
// DATABASE_URL wird als Umgebungsvariable gesetzt (siehe README).
// Beispiel: postgres://user:passwort@host:5432/datenbank
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes("localhost")
    ? false
    : { rejectUnauthorized: false },
});

// Tabelle beim Start automatisch anlegen, falls sie noch nicht existiert
async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entries (
      id SERIAL PRIMARY KEY,
      name TEXT,
      age TEXT,
      hobby TEXT,
      pets TEXT,
      travel TEXT,
      submitted_at TIMESTAMPTZ DEFAULT now()
    );
  `);
  console.log("Datenbank bereit.");
}

// ====== API: Neuen Eintrag speichern ======
app.post("/api/entries", async (req, res) => {
  try {
    const { name, age, hobby, pets, travel } = req.body;
    await pool.query(
      `INSERT INTO entries (name, age, hobby, pets, travel) VALUES ($1, $2, $3, $4, $5)`,
      [name || null, age || null, hobby || null, pets || null, travel || null]
    );
    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("Fehler beim Speichern:", err);
    res.status(500).json({ ok: false, error: "Speichern fehlgeschlagen" });
  }
});

// ====== API: Alle Einträge abrufen (passwortgeschützt) ======
app.post("/api/entries/list", async (req, res) => {
  const { password } = req.body;
  const correctPassword = process.env.ADMIN_PASSWORD || "1234";

  if (password !== correctPassword) {
    return res.status(401).json({ ok: false, error: "Falsches Passwort" });
  }

  try {
    const result = await pool.query(
      `SELECT name, age, hobby, pets, travel, submitted_at FROM entries ORDER BY submitted_at DESC`
    );
    res.json({ ok: true, entries: result.rows });
  } catch (err) {
    console.error("Fehler beim Laden:", err);
    res.status(500).json({ ok: false, error: "Laden fehlgeschlagen" });
  }
});

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Server läuft auf Port ${PORT}`));
  })
  .catch((err) => {
    console.error("Datenbank-Initialisierung fehlgeschlagen:", err);
    process.exit(1);
  });
