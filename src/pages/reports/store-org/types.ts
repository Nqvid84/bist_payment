export interface NetworkSummary {
  network_name: string;
  net_type: 'store' | 'organization' | 'connection';
  total_amount: string;
}

export interface APIResponse {
  success: string;
  networksSummary: NetworkSummary[];
}
