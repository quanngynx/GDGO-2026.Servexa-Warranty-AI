import { Router, type IRouter } from "express";

import { RoutePermissions } from "@/core/constants/route-permissions";
import {
  authenticatedWithPermissions,
  requireRoutePermissions,
} from "@/middlewares/authz.middleware";

import userController from "../controllers/user.controller";

const P = RoutePermissions.users;

const userRoute: IRouter = Router();

userRoute.use(...authenticatedWithPermissions);

userRoute.get("/", requireRoutePermissions([P.read]), userController.findAll);
userRoute.get(
  "/:userId",
  requireRoutePermissions([P.read]),
  userController.findOneById,
);
userRoute.post(
  "/",
  requireRoutePermissions([P.write]),
  userController.createUser,
);
userRoute.patch(
  "/:userId",
  requireRoutePermissions([P.write]),
  userController.updateUser,
);
userRoute.delete(
  "/:userId",
  requireRoutePermissions([P.delete]),
  userController.deleteUser,
);
userRoute.patch(
  "/:userId/restore",
  requireRoutePermissions([P.restore]),
  userController.restoreUser,
);

export default userRoute;
