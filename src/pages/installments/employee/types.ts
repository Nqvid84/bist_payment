export interface IEmployeeInstallments {
  client_id: number;
  fullName: string;
  payment_month: `${number}-${number}`;
  installment: string; // Actually float string
}
