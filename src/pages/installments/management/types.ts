export interface Network {
  id: number;
  name: string;
  type: 'internal' | 'external';
  subType: 'store' | 'organization' | 'connection';
}

export interface Installment {
  id: number;
  storeId: number;
  externalNetworkId: number;
  installmentCount: number;
  gracePeriodCount: number;
  createdAt: string;
  updatedAt: string;
  StoreNetwork?: Network;
  ExternalNetwork?: Network;
}

export interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface InstallmentsResponse {
  success: string;
  installments: Installment[];
  pagination: PaginationData;
}

export interface NetworksResponse {
  success: string;
  networks: Network[];
}

export interface CreateInstallmentRequest {
  storeId: number;
  externalNetworkId: number;
  installmentCount: number;
  gracePeriodCount: number;
}

export interface UpdateInstallmentRequest {
  installmentCount?: number;
  gracePeriodCount?: number;
}

export interface ApiResponse {
  success?: string;
  error?: string;
}
