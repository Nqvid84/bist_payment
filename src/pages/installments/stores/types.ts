export interface StoreInstallments {
  network_name: string;
  payment_month: `${number}-${number}`;
  installment: string; // Actually float string
}
