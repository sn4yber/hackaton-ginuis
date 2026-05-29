import { Router } from "express";
import { list } from "../controllers/map.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const mapRouter = Router();

mapRouter.get("/", asyncHandler(list));

export default mapRouter;
