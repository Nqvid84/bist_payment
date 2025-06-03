export interface ClientsWithdraw {
  id: number;
  fullName: string;
  codeMeli: string;
  phoneNumber: string;
  total_withdraw: number;
}

export interface PaginationInfo {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface APIResponse {
  success: string;
  clientsWithdraw: ClientsWithdraw[];
  pagination?: PaginationInfo;
}
