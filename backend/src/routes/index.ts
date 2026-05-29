import { Router } from "express";
import authRouter from "./auth.routes.js";
import categoryRouter from "./category.routes.js";
import eventRouter from "./event.routes.js";
import mapRouter from "./map.routes.js";
import opportunityRouter from "./opportunity.routes.js";
import organizationRouter from "./organization.routes.js";
import searchRouter from "./search.routes.js";

const apiRouter = Router();

apiRouter.get("/", (_req, res) => {
  res.json({
    name: "Conecta Joven Cartagena API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      organizations: "/api/organizations",
      categories: "/api/categories",
      opportunities: "/api/opportunities",
      events: "/api/events",
      search: "/api/search?q=",
      map: "/api/map",
    },
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/organizations", organizationRouter);
apiRouter.use("/categories", categoryRouter);
apiRouter.use("/opportunities", opportunityRouter);
apiRouter.use("/events", eventRouter);
apiRouter.use("/search", searchRouter);
apiRouter.use("/map", mapRouter);

export default apiRouter;
