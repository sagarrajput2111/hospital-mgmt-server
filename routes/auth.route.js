import express from "express";
import {userAuthentication,accessTokenController,registerUserController} from "../controllers/user.controller.js";
import { verifyRefreshToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", userAuthentication);
router.post("/accessToken",verifyRefreshToken,accessTokenController);
router.post('/register',registerUserController)

export default router;
