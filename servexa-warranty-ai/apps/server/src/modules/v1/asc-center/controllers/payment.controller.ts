import type { NextFunction, Request, Response } from 'express';

import { ErrorHandler } from '@/core/helpers/error-handling.helper';
import { logger } from '@/core/logging/logging.config';
import { getRequestInfo } from '@/core/logging/logging.utils';
import { SuccessResponse } from '@/utils/success-response';

import type { IPaymentService } from '../interfaces/payment-service.interface';
import { PaymentService } from '../services/payment.service';
import {
  findAllPaymentsSchema,
  findAllPaymentPeriodsSchema,
  markPaidParamsSchema,
} from '../validations/payment';

export class PaymentController {
  errorHandler: ErrorHandler;

  constructor(private readonly service: IPaymentService = new PaymentService()) {
    this.errorHandler = ErrorHandler.getInstance();
  }

  findAllPayments = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching payments', {
        ...getRequestInfo(req, 'PaymentController.findAllPayments'),
      });

      const query = findAllPaymentsSchema.parse(req.query);
      const result = await this.service.findAllPayments(query);

      new SuccessResponse({
        message: 'Payments fetched successfully',
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  findAllPaymentPeriods = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Fetching payment periods', {
        ...getRequestInfo(req, 'PaymentController.findAllPaymentPeriods'),
      });

      const query = findAllPaymentPeriodsSchema.parse(req.query);
      const result = await this.service.findAllPaymentPeriods(query);

      new SuccessResponse({
        message: 'Payment periods fetched successfully',
        metadata: result,
      }).send(res);
    })(req, res, next);
  };

  markPaid = async (req: Request, res: Response, next: NextFunction) => {
    return this.errorHandler.asyncHandler(async () => {
      logger.info('Marking payment as paid', {
        ...getRequestInfo(req, 'PaymentController.markPaid'),
      });

      const { id, paymentPeriodId } = markPaidParamsSchema.parse(req.params);
      const userId = req.user.id;

      const result = await this.service.markPaid(id, paymentPeriodId, userId);

      new SuccessResponse({
        message: 'Payment marked as paid successfully',
        metadata: result,
      }).send(res);
    })(req, res, next);
  };
}
