import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(verifyToken);

router.get("/", (req, res) => {
  res.send("Hello");
});

export default router;
