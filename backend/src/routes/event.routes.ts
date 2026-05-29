import { Router } from "express";
import * as eventController from "../controllers/event.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const eventRouter = Router();

eventRouter.get("/", asyncHandler(eventController.list));
eventRouter.get("/:id", asyncHandler(eventController.getById));
eventRouter.post("/", authMiddleware, asyncHandler(eventController.create));
eventRouter.put("/:id", authMiddleware, asyncHandler(eventController.update));
eventRouter.delete("/:id", authMiddleware, asyncHandler(eventController.remove));

export default eventRouter;
