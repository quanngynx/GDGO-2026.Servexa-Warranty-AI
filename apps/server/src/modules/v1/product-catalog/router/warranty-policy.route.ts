import { Router, type IRouter } from "express";

import { authenticatedWithPermissions } from "@/middlewares/authz.middleware";

import { WarrantyPolicyController } from "../controllers/warranty-policy.controller";
import { CategoryRepository } from "../repositories/category.repository";
import { ModelRepository } from "../repositories/model.repository";
import { WarrantyPolicyRepository } from "../repositories/warranty-policy.repository";
import { WarrantyPolicyService } from "../services/warranty-policy.service";
import { catalogRead, catalogWrite } from "../use-cases/permission.uc";

const warrantyPolicyRoute: IRouter = Router();

const warrantyPolicyRepository = new WarrantyPolicyRepository();
const categoryRepository = new CategoryRepository();
const modelRepository = new ModelRepository();
const warrantyPolicyService = new WarrantyPolicyService(
  warrantyPolicyRepository,
  categoryRepository,
  modelRepository,
);
const warrantyPolicyController = new WarrantyPolicyController(
  warrantyPolicyService,
);

warrantyPolicyRoute.use(...authenticatedWithPermissions);

warrantyPolicyRoute.get("/", catalogRead, warrantyPolicyController.findAll);
warrantyPolicyRoute.get(
  "/resolve",
  catalogRead,
  warrantyPolicyController.resolve,
);
warrantyPolicyRoute.get(
  "/:warrantyPolicyId",
  catalogRead,
  warrantyPolicyController.findOneById,
);
warrantyPolicyRoute.post("/", catalogWrite, warrantyPolicyController.create);
warrantyPolicyRoute.put(
  "/:warrantyPolicyId",
  catalogWrite,
  warrantyPolicyController.replace,
);
warrantyPolicyRoute.patch(
  "/:warrantyPolicyId",
  catalogWrite,
  warrantyPolicyController.update,
);
warrantyPolicyRoute.delete(
  "/:warrantyPolicyId",
  catalogWrite,
  warrantyPolicyController.delete,
);

export default warrantyPolicyRoute;
