'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';
import { Spinner, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Card, CardBody } from '@nextui-org/react';
import { useParams } from 'react-router-dom';

interface Installments {
  paymentMonth: `${number}-${number}`;
  fullName: string;
  stores: string;
  totalPayment: number;
  paymentDetails: string;
}

const ClientInstallmentsPage = () => {
  const [installments, setInstallments] = useState<Installments[]>([]);
  const [loading, setLoading] = useState(false);

  const { clientId } = useParams();

  useEffect(() => {
    if (!clientId) {
      return;
    }
    setLoading(true);
    axios
      .post('/microservice/v1/payment/server/installment/client', {
        clientId
      })
      .then(res => {
        setInstallments(res.data);
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false);
      });
  }, [clientId]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Spinner color="primary" size="lg" />
      </div>
    );
  }

  const columns = [
    { key: 'stores', label: 'فروشگاه' },
    { key: 'paymentMonth', label: 'تاریخ پرداخت' },
    { key: 'totalPayment', label: 'مبلغ' },
    { key: 'paymentDetails', label: 'جزئیات پرداخت' }
  ];

  return (
    <div dir="rtl" className="mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-2xl font-bold light:text-slate-900 dark:text-slate-100">{installments[0]?.fullName || 'اطلاعات اقساط'}</h1>
      </div>

      {/* Installments Table */}
      <Card className="shadow-xl">
        <CardBody className="p-0">
          <Table
            isStriped
            aria-label="Client installments table"
            dir="rtl"
            color="primary"
            isHeaderSticky
            classNames={{
              wrapper: 'max-h-[70vh] light:bg-neutral-800 dark:bg-neutral-900',
              th: 'light:bg-neutral-700 light:text-white py-3',
              td: 'py-3 light:text-white',
              thead: '!-top-4'
            }}
          >
            <TableHeader columns={columns}>
              {column => (
                <TableColumn key={column.key} className="text-center text-base first:rounded-l-none first:rounded-r-xl last:rounded-l-xl last:rounded-r-none last:text-right">
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={installments} emptyContent={loading ? <Spinner color="primary" size="lg" /> : 'اقساطی یافت نشد'} isLoading={loading}>
              {installment => (
                <TableRow key={installment.paymentMonth} className="transition-colors last:!rounded-l-xl last:!rounded-r-none light:hover:bg-neutral-500/50 dark:hover:bg-neutral-800/50">
                  <TableCell className="text-center before:!rounded-l-none before:!rounded-r-lg">{installment.stores}</TableCell>
                  <TableCell className="text-center">{installment.paymentMonth}</TableCell>
                  <TableCell className="text-center">
                    <span className="font-medium text-green-600 dark:text-green-400">{installment.totalPayment.toLocaleString('fa-IR')} ریال</span>
                  </TableCell>
                  <TableCell className="text-right before:!rounded-l-lg before:!rounded-r-none">{installment.paymentDetails}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ClientInstallmentsPage;
