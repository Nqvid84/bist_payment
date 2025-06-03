export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface IInstallmentLevel {
  id: number;
  name: string;
  description: string;
  organizationId: number;
  maxInstallment: number;
  createdAt: string;
  updatedAt: string;
}

export interface InstallmentLevelResponse {
  success: string;
  data: IInstallmentLevel[];
  pagination: PaginationData;
}
