import { Router } from "express";
import { search } from "../controllers/search.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const searchRouter = Router();

searchRouter.get("/", asyncHandler(search));

export default searchRouter;
