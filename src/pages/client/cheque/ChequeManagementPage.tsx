import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Spinner, Card, CardBody } from '@nextui-org/react';
import { Cheque } from '../../../components/clients/types';
import CreateCheque from '../../../components/cheques/CreateCheque';
import EditCheque from '../../../components/cheques/EditCheque';
import DeleteCheque from '../../../components/cheques/DeleteCheque';
import { useParams } from 'react-router-dom';
// import EditCheque from '@/components/cheques/EditCheque';
// import CreateCheque from '@/components/cheques/CreateCheque';
// import DeleteCheque from '@/components/cheques/DeleteCheque';

interface ChequeApiResponse {
  cheques: Cheque[];
  success: string;
  error?: string;
}

const ChequeManagementPage = () => {
  const [cheques, setCheques] = useState<Cheque[]>([]);
  const [loading, setLoading] = useState(false);

  const { clientId } = useParams();

  const fetchCheques = () => {
    setLoading(true);
    if (!clientId) {
      toast.error('شناسه مشتری یافت نشد');
      setLoading(false);
      return;
    }
    axios
      .get<ChequeApiResponse>(`/microservice/v1/payment/server/cheque/client/${clientId}`, { withCredentials: true })
      .then(response => {
        setCheques(response.data.cheques ?? []);
      })
      .catch(error => {
        toast.error(error.response?.data?.error || 'خطایی در دریافت اطلاعات رخ داده است');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fa-IR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('fa-IR') + ' ریال';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-400';
      case 'approved':
        return 'text-green-400';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'در حال وصول';
      case 'approved':
        return 'نقد شده';
      case 'rejected':
        return 'برگشت خورده';
      default:
        return status;
    }
  };

  const columns = [
    { key: 'id', label: 'شناسه' },
    { key: 'chequeNumber', label: 'شماره چک' },
    { key: 'chequeDate', label: 'تاریخ چک' },
    { key: 'SayadiNumber', label: 'شماره صیادی' },
    { key: 'price', label: 'مبلغ' },
    { key: 'receiverName', label: 'دریافت کننده' },
    { key: 'bankName', label: 'نام بانک' },
    { key: 'status', label: 'وضعیت' },
    { key: 'createdAt', label: 'تاریخ ایجاد' },
    { key: 'updatedAt', label: 'تاریخ ویرایش' },
    { key: 'actions', label: 'عملیات' }
  ];

  useEffect(() => {
    fetchCheques();
  }, [clientId]);

  return (
    <div dir="rtl" className="mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-2xl font-bold light:text-slate-900 dark:text-slate-100">مدیریت چک‌ها</h1>
        <CreateCheque fetchCheques={fetchCheques} clientId={parseInt(String(clientId))} />
      </div>

      {/* Cheques Table */}
      <Card className="shadow-xl light:bg-slate-100 dark:bg-slate-800">
        <CardBody className="p-0">
          <Table
            aria-label="Cheques management table"
            dir="rtl"
            isStriped
            color="primary"
            isHeaderSticky
            classNames={{
              wrapper: 'max-h-[70vh] light:bg-neutral-400 dark:bg-neutral-900',
              th: 'light:bg-neutral-700 light:text-black dark:text-white py-3',
              td: 'py-3 light:text-black dark:text-white'
            }}
          >
            <TableHeader columns={columns}>
              {column => (
                <TableColumn key={column.key} className="text-center text-base first:rounded-l-none first:rounded-r-xl last:rounded-l-xl last:rounded-r-none">
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={cheques} emptyContent={loading ? <Spinner color="primary" size="lg" /> : 'چکی یافت نشد'} isLoading={loading}>
              {cheque => (
                <TableRow key={cheque.id} className="transition-colors light:hover:bg-neutral-500/50 dark:hover:bg-neutral-800/50">
                  <TableCell className="text-center before:!rounded-l-none before:!rounded-r-lg">{cheque.id}</TableCell>
                  <TableCell className="text-center">{cheque.chequeNumber}</TableCell>
                  <TableCell className="text-center">{formatDate(cheque.chequeDate)}</TableCell>
                  <TableCell className="text-center">{cheque.SayadiNumber}</TableCell>
                  <TableCell className="text-center font-medium text-green-400">{formatPrice(cheque.price)}</TableCell>
                  <TableCell className="text-center">{cheque.receiverName}</TableCell>
                  <TableCell className="text-center">{cheque.bankName}</TableCell>
                  <TableCell className="text-center">
                    <span className={`font-medium ${getStatusColor(cheque.status)}`}>{getStatusText(cheque.status)}</span>
                  </TableCell>
                  <TableCell className="text-center text-sm">{formatDate(cheque.createdAt)}</TableCell>
                  <TableCell className="text-center text-sm">{formatDate(cheque.updatedAt)}</TableCell>
                  <TableCell className="text-center before:!rounded-l-lg before:!rounded-r-none">
                    <div className="flex items-center justify-center gap-2">
                      <EditCheque cheque={cheque} fetchCheques={fetchCheques} />
                      <DeleteCheque cheque={cheque} fetchCheques={fetchCheques} />
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

export default ChequeManagementPage;
