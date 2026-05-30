import type { NextFunction, Request, Response } from "express";

import { ErrorHandler } from "@/core/helpers/error-handling.helper";
import { logger } from "@/core/logging/logging.config";
import { getRequestInfo } from "@/core/logging/logging.utils";
import { SuccessResponse } from "@/utils/success-response";

import type { IEmployeeService } from "../interfaces/employee-service.interface";
import { EmployeeService } from "../services/employee.service";
import {
  createEmployeeSchema,
  findAllEmployeesSchema,
  findEmployeeByIdSchema,
  linkEmployeeUserSchema,
  replaceEmployeeSchema,
  updateEmployeeSchema,
} from "../validations";

export class EmployeeController {
  errorHandler: ErrorHandler;

  constructor(
    private readonly employeeService: IEmployeeService = new EmployeeService(),
  ) {
    this.errorHandler = ErrorHandler.getInstance();
  }

  findAll = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching employees", {
        ...getRequestInfo(req, "EmployeeController.findAll"),
      });
      const query = findAllEmployeesSchema.parse(req.query);
      const result = await this.employeeService.findAll(query);
      new SuccessResponse({
        message: "Employees fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findOneById = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Fetching employee", {
        ...getRequestInfo(req, "EmployeeController.findOneById"),
      });
      const { employeeId } = findEmployeeByIdSchema.parse(req.params);
      const result = await this.employeeService.findOneById(employeeId);
      new SuccessResponse({
        message: "Employee fetched successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Creating employee", {
        ...getRequestInfo(req, "EmployeeController.create"),
      });
      const body = createEmployeeSchema.parse(req.body);
      const result = await this.employeeService.create(body);
      new SuccessResponse({
        message: "Employee created successfully",
        status: 201,
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  replace = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Replacing employee", {
        ...getRequestInfo(req, "EmployeeController.replace"),
      });
      const { employeeId } = findEmployeeByIdSchema.parse(req.params);
      const body = replaceEmployeeSchema.parse(req.body);
      const result = await this.employeeService.update(employeeId, body);
      new SuccessResponse({
        message: "Employee updated successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Updating employee", {
        ...getRequestInfo(req, "EmployeeController.update"),
      });
      const { employeeId } = findEmployeeByIdSchema.parse(req.params);
      const body = updateEmployeeSchema.parse(req.body);
      const result = await this.employeeService.update(employeeId, body);
      new SuccessResponse({
        message: "Employee updated successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  linkUser = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Linking employee user", {
        ...getRequestInfo(req, "EmployeeController.linkUser"),
      });
      const { employeeId } = findEmployeeByIdSchema.parse(req.params);
      const body = linkEmployeeUserSchema.parse(req.body);
      const result = await this.employeeService.linkUser(employeeId, body);
      new SuccessResponse({
        message: "Employee linked successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info("Deleting employee", {
        ...getRequestInfo(req, "EmployeeController.delete"),
      });
      const { employeeId } = findEmployeeByIdSchema.parse(req.params);
      const result = await this.employeeService.delete(employeeId);
      new SuccessResponse({
        message: "Employee deleted successfully",
        metadata: result,
      }).send(res);
    })(req, res, next);
  };
}
