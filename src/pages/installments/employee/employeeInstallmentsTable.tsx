import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Card, CardBody, Tooltip, Button } from '@nextui-org/react';
import { FiCopy } from 'react-icons/fi';
import { TbCurrencyIranianRial } from 'react-icons/tb';
import { toast } from 'sonner';
import { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { IEmployeeInstallments } from './types';

const EmployeeInstallmentsTable = forwardRef<HTMLDivElement, { installments: IEmployeeInstallments[] }>(({ installments }, ref) => {
  const columns = [
    { key: 'client_id', label: 'شناسه مشتری' },
    { key: 'fullName', label: 'نام کامل' },
    { key: 'payment_month', label: 'ماه پرداخت' },
    { key: 'installment', label: 'مبلغ اقساط' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('مبلغ اقساط کپی شد');
  };

  const navigate = useNavigate();

  return (
    <Card className="shadow-xl">
      <CardBody className="p-0">
        <Table
          ref={ref}
          aria-label="Employee Installments table"
          dir="rtl"
          isStriped
          color="primary"
          isHeaderSticky
          classNames={{
            base: 'print:p-4',
            wrapper: 'max-h-[70vh] light:bg-neutral-800 dark:bg-neutral-900',
            th: 'light:bg-neutral-700 light:text-white py-3',
            td: 'py-3 light:text-white',
            thead: '!-top-4'
          }}
        >
          <TableHeader columns={columns}>
            {column => (
              <TableColumn key={column.key} className="text-center text-base first:rounded-l-none first:rounded-r-lg last:rounded-l-lg last:rounded-r-none print:text-black">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody items={installments} emptyContent="هیچ اقساطی یافت نشد" isLoading={false}>
            {installment => (
              <TableRow
                onClick={() => navigate(`/payment-card/client/installments/${installment.client_id}`)}
                key={`${installment.client_id}-${installment.payment_month}`}
                className="cursor-pointer transition-all active:scale-95 light:hover:bg-neutral-500/50 dark:hover:bg-neutral-800/50"
              >
                <TableCell className="text-center before:!rounded-l-none before:!rounded-r-lg">{installment.client_id}</TableCell>
                <TableCell className="text-center">{installment.fullName}</TableCell>
                <TableCell className="text-center">{installment.payment_month}</TableCell>
                <TableCell className="text-center before:!rounded-l-lg before:!rounded-r-none">
                  <Tooltip content="کپی مبلغ" delay={1000} radius="sm">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => copyToClipboard(installment.installment)}
                      className="text-base font-medium text-teal-600 dark:text-teal-500 print:text-black"
                      endContent={<FiCopy className="print:hidden" color="teal" size={14} />}
                    >
                      {parseFloat(installment.installment).toLocaleString('fa-IR')}
                      <TbCurrencyIranianRial className="ml-1 inline" size={16} />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
});
EmployeeInstallmentsTable.displayName = 'EmployeeInstallmentsTable';

export default EmployeeInstallmentsTable;
