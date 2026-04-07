import routeVersionApi from "@/modules/route-version-api";
import { Router, type IRouter } from "express";

// ROUTES FOR THE APP
const mainRouter: IRouter = Router();

mainRouter.use("/api", routeVersionApi);

export default mainRouter;