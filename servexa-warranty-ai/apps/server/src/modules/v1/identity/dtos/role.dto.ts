import z from 'zod/v4';
import {
  addParentToRoleSchema,
  deleteParentFromRoleSchema,
  findAllRolesSchema,
  findByIdSchema,
  findChildrenRolesSchema,
  findParentsRolesSchema,
  roleCreationSchema,
} from '../validations/role';

export type AddParentToRoleDto = z.infer<typeof addParentToRoleSchema>;
export type DeleteParentFromRoleDto = z.infer<
  typeof deleteParentFromRoleSchema
>;
export type FindAllRolesDto = z.infer<typeof findAllRolesSchema>;
export type FindByIdDto = z.infer<typeof findByIdSchema>;
export type FindParentsRolesDto = z.infer<typeof findParentsRolesSchema>;
export type FindChildrenRolesDto = z.infer<typeof findChildrenRolesSchema>;
export type RoleCreationDto = z.infer<typeof roleCreationSchema>;
