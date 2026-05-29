import { Router } from "express";
import { login, me, register, updateMe } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const authRouter = Router();

authRouter.post("/register", asyncHandler(register));
authRouter.post("/login", asyncHandler(login));
authRouter.get("/me", authMiddleware, asyncHandler(me));
authRouter.patch("/me", authMiddleware, asyncHandler(updateMe));

export default authRouter;
