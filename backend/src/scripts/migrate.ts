import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import { getPool, closePool } from "../lib/db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, "../db/migrations");

async function runMigrations() {
  const files = (await readdir(migrationsDir))
    .filter((file) => file.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("No hay migraciones para ejecutar");
    return;
  }

  const pool = getPool();

  for (const file of files) {
    const sql = await readFile(path.join(migrationsDir, file), "utf8");
    await pool.query(sql);
    console.log(`Migración aplicada: ${file}`);
  }
}

runMigrations()
  .then(() => {
    console.log("Migraciones completadas");
  })
  .catch((error) => {
    console.error("Error ejecutando migraciones:");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
