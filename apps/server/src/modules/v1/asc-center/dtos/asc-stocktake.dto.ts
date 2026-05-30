import { z } from 'zod';
import {
  findAllAscStocktakesSchema,
  findStocktakeAccessoriesSchema,
  findStocktakeStockLevelsSchema,
  createAscStocktakeSchema,
} from '../validations/asc-stocktake';

export type FindAllAscStocktakesInput = z.infer<typeof findAllAscStocktakesSchema> & { ascCenterId: string };
export type FindStocktakeAccessoriesInput = z.infer<typeof findStocktakeAccessoriesSchema> & { ascCenterId: string };
export type FindStocktakeStockLevelsInput = z.infer<typeof findStocktakeStockLevelsSchema> & { ascCenterId: string };
export type CreateAscStocktakeInput = z.infer<typeof createAscStocktakeSchema>;
