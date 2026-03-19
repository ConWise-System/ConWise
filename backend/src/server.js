import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import taskRoutes from "./modules/task/task.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import notFoundHandler from "./middlewares/notFound.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Mount routes
app.use("/api", taskRoutes);
app.use("/api/auth", authRoutes);

// not-found and error handler middlewares
app.use(errorHandler);
app.use(notFoundHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
