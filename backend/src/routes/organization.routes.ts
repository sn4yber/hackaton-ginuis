import { Router } from "express";
import * as organizationController from "../controllers/organization.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const organizationRouter = Router();

organizationRouter.get("/", asyncHandler(organizationController.list));
organizationRouter.get("/:id", asyncHandler(organizationController.getById));
organizationRouter.post("/", authMiddleware, asyncHandler(organizationController.create));
organizationRouter.put("/:id", authMiddleware, asyncHandler(organizationController.update));
organizationRouter.delete("/:id", authMiddleware, asyncHandler(organizationController.remove));

export default organizationRouter;
