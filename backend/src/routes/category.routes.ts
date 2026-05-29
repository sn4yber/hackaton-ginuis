import { Router } from "express";
import * as categoryController from "../controllers/category.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRoles } from "../middleware/role.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const categoryRouter = Router();

categoryRouter.get("/", asyncHandler(categoryController.list));
categoryRouter.get("/:id", asyncHandler(categoryController.getById));
categoryRouter.post(
  "/",
  authMiddleware,
  requireRoles("admin"),
  asyncHandler(categoryController.create)
);
categoryRouter.put(
  "/:id",
  authMiddleware,
  requireRoles("admin"),
  asyncHandler(categoryController.update)
);
categoryRouter.delete(
  "/:id",
  authMiddleware,
  requireRoles("admin"),
  asyncHandler(categoryController.remove)
);

export default categoryRouter;
