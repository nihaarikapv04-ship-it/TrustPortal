export async function healthRoutes(server) {
    server.get("/health", async (_request, _reply) => {
        return {
            status: "ok",
            service: "trustportal-api",
            version: "1.0.0"
        };
    });
}
