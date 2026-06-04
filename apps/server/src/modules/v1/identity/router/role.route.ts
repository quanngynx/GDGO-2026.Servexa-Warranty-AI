import { Router, type IRouter } from "express";

import { RoutePermissions } from "@/core/constants/route-permissions";
import {
  authenticatedWithPermissions,
  requireRoutePermissions,
} from "@/middlewares/authz.middleware";

import roleController from "../controllers/role.controller";

const P = RoutePermissions.roles;

const roleRoute: IRouter = Router();

roleRoute.use(...authenticatedWithPermissions);

roleRoute.get(
  "/",
  requireRoutePermissions([P.read]),
  roleController.findAllRoles,
);
roleRoute.get(
  "/tree",
  requireRoutePermissions([P.read]),
  roleController.getRoleTree,
);
roleRoute.get(
  "/:roleId",
  requireRoutePermissions([P.read]),
  roleController.findOneById,
);
roleRoute.get(
  "/parent/:roleId",
  requireRoutePermissions([P.read]),
  roleController.findParentsByRoleId,
);
roleRoute.get(
  "/children/:roleId",
  requireRoutePermissions([P.read]),
  roleController.findChildrenByRoleId,
);
roleRoute.post(
  "/",
  requireRoutePermissions([P.write]),
  roleController.createRole,
);
roleRoute.post(
  "/:roleId/parent/:parentRoleId",
  requireRoutePermissions([P.write]),
  roleController.addParentToRole,
);
roleRoute.delete(
  "/:roleId/parent/:parentRoleId",
  requireRoutePermissions([P.write]),
  roleController.deleteParentFromRole,
);

export default roleRoute;
