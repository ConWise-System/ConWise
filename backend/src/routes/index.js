// ConWise/backend/src/routes/index.js
import express from "express";
import authRoutes from "../modules/auth/auth.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.json({ message: "API working 🚀" });
});

router.use("/auth", authRoutes);

export default router;
