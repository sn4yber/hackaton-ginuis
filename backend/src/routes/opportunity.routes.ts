import { Router } from "express";
import * as opportunityController from "../controllers/opportunity.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const opportunityRouter = Router();

opportunityRouter.get("/map", asyncHandler(opportunityController.mapPoints));
opportunityRouter.get("/", asyncHandler(opportunityController.list));
opportunityRouter.get("/:id", asyncHandler(opportunityController.getById));
opportunityRouter.post("/", authMiddleware, asyncHandler(opportunityController.create));
opportunityRouter.put("/:id", authMiddleware, asyncHandler(opportunityController.update));
opportunityRouter.delete("/:id", authMiddleware, asyncHandler(opportunityController.remove));

export default opportunityRouter;
