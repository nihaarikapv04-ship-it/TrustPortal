import { buildApp } from "./app.js";
import { loadConfig } from "./config/env.js";

const config = loadConfig();
const server = buildApp();

try {
  await server.listen({ port: config.port, host: config.host });
  console.log(`🚀 TrustPortal Fastify API listening on http://${config.host}:${config.port}`);
} catch (err) {
  server.log.error(err);
  process.exit(1);
}
