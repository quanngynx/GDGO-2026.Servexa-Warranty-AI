import { Router, type IRouter } from "express";
import authRoute from "./auth.route";

const routeIdentityV1: IRouter = Router();

routeIdentityV1.use("/auth", authRoute);

export default routeIdentityV1;