import express from "express";
import userAuthentication from "../controllers/user.controller.js"

const router = express.Router();

router.post("/login", userAuthentication);

export default router;
