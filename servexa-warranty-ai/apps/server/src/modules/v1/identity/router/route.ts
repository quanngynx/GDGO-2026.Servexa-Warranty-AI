import { Router, type IRouter } from "express";
import authRoute from "./auth.route";
import userRoute from './user.route'

const routeIdentityV1: IRouter = Router();

routeIdentityV1.use("/auth", authRoute);
routeIdentityV1.use('/users', userRoute)

export default routeIdentityV1;