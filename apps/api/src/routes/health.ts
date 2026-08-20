import { FastifyInstance } from "fastify";

export async function healthRoutes(server: FastifyInstance) {
  const handler = async (_request: any, _reply: any) => {
    return {
      status: "ok",
      service: "trustportal-api",
      version: "1.0.0",
      timestamp: new Date().toISOString()
    };
  };

  server.get("/health", handler);
  server.get("/v1/health", handler);
}
