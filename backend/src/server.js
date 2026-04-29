import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import http from "http"; // 1. Import http
import { initSocket } from "./socket.js";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger.js";
import notFoundHandler from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import authRoutes from "./modules/auth/auth.routes.js";
import projectRoutes from "./modules/project/project.routes.js";
import taskRoutes from "./modules/task/task.routes.js";
import materialRoutes from "./modules/material/material.routes.js";
import reportRotues from "./modules/report/report.routes.js";
import messagingRoutes from "./modules/messaging/messaging.routes.js";
import issueRoutes from "./modules/issue/issue.routes.js";
import milestoneRoutes from "./modules/milestone/milestone.routes.js";
import uploadRoute from '../routes/upload.js';

dotenv.config();

const app = express();
const server = http.createServer(app); // 3. Wrap Express with HTTP

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  }),
);
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "API is running 🚀" });
});

// Mount routes — specific before broad
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/reports", reportRotues);
app.use("/api/messaging", messagingRoutes);
app.use("/api/milestones", milestoneRoutes);
app.use("/api", taskRoutes);
app.use("/api/projects/:projectId/issues", issueRoutes);
app.use('/api/upload', uploadRoute)

// Swagger docs
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, {
    explorer: true,
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: "ConWise API Documentation",
    customCss: `
      .swagger-ui .topbar { background-color: #1e3a8a; }
      .swagger-ui .topbar .logo { color: white; }
    `,
  }),
);

app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(specs);
});

app.use(notFoundHandler);
app.use(errorHandler);

initSocket(server);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
