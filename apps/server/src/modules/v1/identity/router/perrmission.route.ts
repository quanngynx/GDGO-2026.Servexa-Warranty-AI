import { Router, type IRouter } from "express";

import { RoutePermissions } from "@/core/constants/route-permissions";
import {
  authenticatedWithPermissions,
  requireRoutePermissions,
} from "@/middlewares/authz.middleware";

import permissionController from "../controllers/permission.controller";
import permissionCatalogController from "../controllers/permission-catalog.controller";

const P = RoutePermissions.permissions;

const permissionRoute: IRouter = Router();

permissionRoute.use(...authenticatedWithPermissions);

permissionRoute.post(
  "/check",
  requireRoutePermissions([P.read]),
  permissionController.checkPermission,
);
permissionRoute.get(
  "/",
  requireRoutePermissions([P.read]),
  permissionCatalogController.findAll,
);
permissionRoute.get(
  "/:permissionId",
  requireRoutePermissions([P.read]),
  permissionCatalogController.findOneById,
);
permissionRoute.post(
  "/",
  requireRoutePermissions([P.write]),
  permissionCatalogController.create,
);
permissionRoute.patch(
  "/:permissionId",
  requireRoutePermissions([P.write]),
  permissionCatalogController.update,
);
permissionRoute.delete(
  "/:permissionId",
  requireRoutePermissions([P.write]),
  permissionCatalogController.delete,
);

export default permissionRoute;
