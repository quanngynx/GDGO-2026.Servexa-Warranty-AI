import type z from 'zod'

import type { createPermissionSchema } from '../validations/permission/create-permission-schema'
import type { updatePermissionSchema } from '../validations/permission/update-permission-schema'

export type CreatePermissionDto = z.infer<typeof createPermissionSchema>
export type UpdatePermissionDto = z.infer<typeof updatePermissionSchema>
