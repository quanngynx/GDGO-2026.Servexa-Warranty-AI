import type { CreateTechnicianDto, ReplaceTechnicianDto, UpdateTechnicianDto } from '../dtos/technician.dto'
import type { FindAllTechniciansInput } from '../services/technician.service'

export interface ITechnicianService {
  findAll(query: FindAllTechniciansInput): Promise<unknown>
  findOneById(technicianProfileId: string): Promise<unknown>
  create(input: CreateTechnicianDto): Promise<unknown>
  update(technicianProfileId: string, input: ReplaceTechnicianDto | UpdateTechnicianDto): Promise<unknown>
  delete(technicianProfileId: string): Promise<{ success: true }>
}
