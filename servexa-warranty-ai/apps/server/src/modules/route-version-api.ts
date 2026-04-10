import { VERSION_API } from "@/core/constants/common.constant";
import { Router, type IRouter } from "express";
import routeIdentityV1 from "./v1/identity/router/route";

const routeVersionApi: IRouter = Router();

routeVersionApi.use(`/${VERSION_API.V1}/identity`, routeIdentityV1);

export default routeVersionApi;