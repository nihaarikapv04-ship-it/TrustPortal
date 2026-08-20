import Fastify from "fastify";
import cors from "@fastify/cors";
import { PipelineService } from "./services/pipeline_service.js";
import { registerV1Routes } from "./routes/v1_routes.js";
const server = Fastify({ logger: true });
// Register CORS for extension content script access
await server.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"]
});
const pipelineService = new PipelineService();
await registerV1Routes(server, pipelineService);
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
try {
    await server.listen({ port: PORT, host: HOST });
    console.log(`🚀 TrustPortal TSIF Backend API listening on http://${HOST}:${PORT}`);
}
catch (err) {
    server.log.error(err);
    process.exit(1);
}
