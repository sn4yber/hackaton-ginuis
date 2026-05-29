import "dotenv/config";
import cors from "cors";
import express from "express";
import apiRouter from "./routes/index.js";
import { closePool, testConnection } from "./lib/db.js";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { notFoundMiddleware } from "./middleware/notFound.middleware.js";

const app = express();
const port = Number(process.env.PORT ?? 4001);

app.use(cors({ origin: process.env.FRONTEND_URL ?? "http://localhost:3000" }));
app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const db = await testConnection();
    res.json({ status: "ok", database: "connected", serverTime: db.now });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error desconocido";
    res.status(503).json({ status: "error", database: "disconnected", message });
  }
});

app.use("/api", apiRouter);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const server = app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});

async function shutdown() {
  server.close();
  await closePool();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
