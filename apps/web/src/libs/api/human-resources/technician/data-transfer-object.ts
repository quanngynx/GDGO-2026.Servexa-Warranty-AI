export type TechnicianProfileDto = {
  id: string;
  userId: string;
  skillLevel: string;
  isAvailable: boolean;
  maxConcurrentCases: number;
  user?: {
    fullName: string | null;
    username: string;
  };
};

export type TechnicianListResponse = {
  items: TechnicianProfileDto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type ListTechniciansParams = {
  page?: number;
  limit?: number;
  isAvailable?: boolean;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "experienceYears" | "completedCases";
  sortOrder?: "asc" | "desc";
};
