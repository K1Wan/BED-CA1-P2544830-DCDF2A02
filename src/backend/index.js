import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import usersRoutes from "./routes/usersRoutes.js";
import summonsRoutes from "./routes/summonsRoutes.js";
import missionsRoutes from "./routes/missionsRoutes.js";
import questsRoutes from "./routes/questsRoutes.js";
import fusionsRoutes from "./routes/fusionsRoutes.js";
import { errorHandler } from "./utils/errors.js";
import { swaggerSpec } from "./utils/swagger.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("src/frontend"));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", game: "Fate Summoning Chamber" });
});

// Swagger docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/users", summonsRoutes);
app.use("/users", missionsRoutes);
app.use("/users", questsRoutes);
app.use("/users", fusionsRoutes);
app.use("/users", usersRoutes);

// Global error handler (must be last)
app.use(errorHandler);

// Start server only if run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  const server = app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`API docs at http://localhost:${PORT}/api-docs`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`Port ${PORT} is already in use. Try a different port by setting the PORT environment variable.`);
      process.exit(1);
    }
    throw err;
  });
}

export { app };