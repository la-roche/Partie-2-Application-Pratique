const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

let db;

async function initDB() {
  db = await open({
    filename: "./database/blog.db",
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titre TEXT NOT NULL,
      contenu TEXT NOT NULL,
      auteur TEXT NOT NULL,
      date TEXT NOT NULL,
      categorie TEXT NOT NULL,
      tags TEXT
    )
  `);

  console.log("Base de données SQLite initialisée.");
}

function getDB() {
  if (!db) {
    throw new Error("La base de données n'est pas initialisée.");
  }
  return db;
}

module.exports = { initDB, getDB };
