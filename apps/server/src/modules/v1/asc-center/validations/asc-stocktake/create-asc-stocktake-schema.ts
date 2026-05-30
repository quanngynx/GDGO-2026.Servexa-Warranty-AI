import { z } from 'zod';

export const createAscStocktakeSchema = z.object({
  ascCenterId: z.uuidv7('Invalid ASC center ID'),
  notes: z.string().max(1000).optional(),
  items: z.array(
    z.object({
      accessoryId: z.uuidv7('Invalid accessory ID'),
      newQty: z.number().int().min(0),
      notes: z.string().max(500).optional(),
    })
  ).min(1).superRefine((items, ctx) => {
    const ids = new Set<string>();
    items.forEach((item, i) => {
      if (ids.has(item.accessoryId)) {
        ctx.addIssue({
          code: 'custom',
          message: `Duplicate accessoryId found: ${item.accessoryId}`,
          path: [i, 'accessoryId'],
        });
      }
      ids.add(item.accessoryId);
    });
  }),
});
