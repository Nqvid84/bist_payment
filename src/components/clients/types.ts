// Network types
export interface Network {
  id: number;
  name: string;
  Parents: {
    id: number;
    name: string;
    type: string;
    subType: string;
    createdAt: string;
    updatedAt: string;
    netconn: {
      id: number;
      parentNetwork: number;
      childNetwork: number;
      createdAt: string;
      updatedAt: string;
    };
  }[];
}

// Device types
export interface Device {
  id: number;
  active: boolean;
  deviceName: string;
  networks: Network[];
}

// Card types
export interface CardData {
  id: number;
  cardNumber: string;
  active: boolean;
  balance: string;
  creditLevel: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  devices: Device[];
}

// Client types
export interface Client {
  id: number;
  fullName: string;
  codeMeli: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
  cards: CardData[];
}

// Pagination types
export interface PaginationData {
  limit: number;
  page: number;
  pages: number;
  total: number;
}

// Api Response types (for clients)
export interface ApiResponse {
  clients: Client[];
  pagination: PaginationData;
  success: string;
  error?: string;
}

// Cheque Types
export interface Cheque {
  id: number;
  chequeNumber: number;
  chequeDate: string;
  SayadiNumber: string;
  status: string;
  price: number;
  receiverName: string;
  bankName: string;
  clientId: number;
  updatedAt: string;
  createdAt: string;
}
