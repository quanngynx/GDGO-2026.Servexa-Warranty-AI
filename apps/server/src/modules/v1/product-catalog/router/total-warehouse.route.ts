import { Router, type IRouter } from "express";

import { authenticatedWithPermissions } from "@/middlewares/authz.middleware";

import { TotalWarehouseController } from "../controllers/total-warehouse.controller";
import { TotalWarehouseRepository } from "../repositories/total-warehouse.repository";
import { TotalWarehouseService } from "../services/total-warehouse.service";
import { catalogRead, catalogWrite } from "../use-cases/permission.uc";

const totalWarehouseRoute: IRouter = Router();

const totalWarehouseRepository = new TotalWarehouseRepository();
const totalWarehouseService = new TotalWarehouseService(
  totalWarehouseRepository,
);
const totalWarehouseController = new TotalWarehouseController(
  totalWarehouseService,
);

totalWarehouseRoute.use(...authenticatedWithPermissions);

totalWarehouseRoute.get("/", catalogRead, totalWarehouseController.findAll);
totalWarehouseRoute.get(
  "/:totalWarehouseId",
  catalogRead,
  totalWarehouseController.findOneById,
);
totalWarehouseRoute.post("/", catalogWrite, totalWarehouseController.create);
totalWarehouseRoute.put(
  "/:totalWarehouseId",
  catalogWrite,
  totalWarehouseController.replace,
);
totalWarehouseRoute.patch(
  "/:totalWarehouseId",
  catalogWrite,
  totalWarehouseController.update,
);
totalWarehouseRoute.delete(
  "/:totalWarehouseId",
  catalogWrite,
  totalWarehouseController.delete,
);

export default totalWarehouseRoute;
