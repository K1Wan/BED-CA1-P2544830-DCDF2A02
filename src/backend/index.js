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
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("src/frontend"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", game: "Fate Summoning Chamber" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/users", summonsRoutes);
app.use("/users", missionsRoutes);
app.use("/users", questsRoutes);
app.use("/users", fusionsRoutes);
app.use("/users", usersRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Summoning Chamber open on port ${PORT}!`);
});