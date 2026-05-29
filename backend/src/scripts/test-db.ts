import "dotenv/config";
import { closePool, testConnection } from "../lib/db.js";

async function main() {
  const result = await testConnection();
  console.log("Conexión exitosa con Neon PostgreSQL");
  console.log(`Hora del servidor: ${result.now}`);
}

main()
  .catch((error) => {
    console.error("Error al conectar con la base de datos:");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closePool();
  });
