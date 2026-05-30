import z from 'zod'

const genderSchema = z.enum(['male', 'female', 'other'])
const departmentSchema = z.enum(['technical', 'coordination'])
const positionSchema = z.enum([
  'supervisor',
  'receptionist',
  'home_appliance_technician',
  'home_service_technician',
  'workshop_technician',
  'warehouse_staff',
])
const employeeStatusSchema = z.enum(['active', 'resigned', 'on_leave'])

export const createEmployeeSchema = z.object({
  employeeCode: z.string().min(1),
  gender: genderSchema,
  fullName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  primaryPhone: z.string().min(1),
  secondaryPhone: z.string().optional(),
  email: z.email(),
  permanentAddress: z.string().min(1),
  avatar: z.string().optional(),
  department: departmentSchema,
  position: positionSchema,
  startDate: z.coerce.date(),
  ascCenterId: z.uuidv7(),
  baseSalary: z.union([z.null(), z.number().nonnegative()]).optional(),
  status: employeeStatusSchema.optional(),
  nationalId: z.string().min(1),
  idIssueDate: z.coerce.date(),
  idAddress: z.string().min(1),
  idIssuingAuthority: z.string().min(1),
  bankAccount: z.string().optional(),
  taxId: z.string().optional(),
  bankName: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  userId: z.uuidv7().optional(),
  notes: z.string().optional(),
  createdBy: z.uuidv7(),
})

export { departmentSchema, employeeStatusSchema, genderSchema, positionSchema }
