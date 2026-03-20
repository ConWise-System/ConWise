import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import notFoundHandler from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

import taskRoutes from "./modules/task/task.routes.js";
import projectRoutes from "./modules/project/project.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running" });
});

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api", taskRoutes);
app.use("/api/projects", projectRoutes);

app.use(errorHandler);
app.use(notFoundHandler);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
