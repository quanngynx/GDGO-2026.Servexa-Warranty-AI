import { Router, type IRouter } from "express";
import authRoute from "./auth.route";
import userRoute from './user.route'
import roleRoute from './role.route'
import permissionRoute from './perrmission.route'

const routeIdentityV1: IRouter = Router();

routeIdentityV1.use("/auth", authRoute);
routeIdentityV1.use('/users', userRoute)
routeIdentityV1.use('/roles', roleRoute)
routeIdentityV1.use('/permissions', permissionRoute)

export default routeIdentityV1;