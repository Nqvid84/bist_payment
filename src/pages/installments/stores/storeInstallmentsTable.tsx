import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Card, CardBody, Tooltip, Button } from '@nextui-org/react';
import { FiCopy } from 'react-icons/fi';
import { TbCurrencyIranianRial } from 'react-icons/tb';
import type { StoreInstallments } from './types';
import { toast } from 'sonner';

const StoreInstallmentsTable = ({ installments }: { installments: StoreInstallments[] }) => {
  const columns = [
    { key: 'network_name', label: 'نام شبکه' },
    { key: 'payment_month', label: 'ماه پرداخت' },
    { key: 'installment', label: 'مبلغ اقساط' }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('مبلغ اقساط کپی شد');
  };

  if (installments.length === 0) {
    return <p className="mt-10 text-center text-sm text-gray-600 dark:text-gray-400">هیچ اقساطی یافت نشد</p>;
  }

  return (
    <Card className="shadow-xl">
      <CardBody className="p-0">
        <Table
          aria-label="Store Installments table"
          dir="rtl"
          color="primary"
          isStriped
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
              <TableColumn key={column.key} className="text-center text-base first:rounded-l-none first:rounded-r-lg last:rounded-l-lg last:rounded-r-none">
                {column.label}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody items={installments} emptyContent="هیچ اقساطی یافت نشد" isLoading={false}>
            {installment => (
              <TableRow key={`${installment.network_name}-${installment.payment_month}`} className="transition-colors light:hover:bg-neutral-500/50 dark:hover:bg-neutral-800/50">
                <TableCell className="text-center before:!rounded-l-none before:!rounded-r-lg">{installment.network_name}</TableCell>
                <TableCell className="text-center">{installment.payment_month}</TableCell>
                <TableCell className="text-center before:!rounded-l-lg before:!rounded-r-none">
                  <Tooltip content="کپی مبلغ" delay={1000} radius="sm">
                    <Button
                      variant="light"
                      size="sm"
                      onClick={() => copyToClipboard(installment.installment)}
                      className="text-base font-medium text-teal-600 dark:text-teal-500"
                      endContent={<FiCopy color="teal" size={14} />}
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
};

export default StoreInstallmentsTable;
