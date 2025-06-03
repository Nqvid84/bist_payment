import { Key, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { TbCurrencyIranianRial } from 'react-icons/tb';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Chip, Skeleton, useDisclosure, Tooltip } from '@nextui-org/react';
import { GrTransaction } from 'react-icons/gr';
import { IoArrowDown, IoArrowUp } from 'react-icons/io5';
import { decodeHtmlEntities } from '../../utils';

interface Network {
  id: number;
  name: string;
}

interface Device {
  deviceName: string;
  networks: Network[];
}

interface Card {
  cardNumber: string;
  devices: Device[];
}

interface Transaction {
  id: number;
  cardId: number;
  deviceId: number;
  transactionType: 'charge' | 'withdraw';
  amount: number;
  transactionNetworkId: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  card: Card;
  network: Network;
  device: Device;
}

interface CardTransactionsModalProps {
  id: number; // cardId
}

const CardTransactionsModal = ({ id }: CardTransactionsModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchTransactions = () => {
    setLoading(true);
    axios
      .get(`/microservice/v1/payment/server/transactions/list/card?cardId=${id}`)
      .then(response => {
        if (response.data.success === 'success' && response.data.data) {
          setTransactions(response.data.data.reverse());
        } else {
          setTransactions([]);
          toast.error('داده‌های تراکنش نامعتبر است');
        }
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'خطایی در دریافت تراکنش‌ها رخ داد');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (isOpen) {
      fetchTransactions();
    }
  }, [isOpen, id]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fa-IR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const columns = [
    { name: 'نوع تراکنش', uid: 'type' },
    { name: 'دستگاه', uid: 'device' },
    { name: 'شبکه‌ها', uid: 'networks' },
    { name: 'مبلغ', uid: 'amount' },
    { name: 'تاریخ', uid: 'date' },
    { name: 'توضیحات', uid: 'description' }
  ];

  const renderCell = (transaction: Transaction, columnKey: Key) => {
    switch (columnKey) {
      case 'type':
        return (
          <div className="flex items-center gap-2">
            {transaction.transactionType === 'charge' ? <IoArrowDown className="text-green-500" size={20} /> : <IoArrowUp className="text-red-500" size={20} />}
            <Chip className="capitalize" color={transaction.transactionType === 'charge' ? 'success' : 'danger'} variant="flat" size="sm">
              {transaction.transactionType === 'charge' ? 'شارژ' : 'برداشت'}
            </Chip>
          </div>
        );
      case 'device':
        return <div className="font-medium">{transaction.device.deviceName}</div>;
      case 'networks':
        return (
          <div className="flex flex-wrap gap-2">
            <Chip size="sm" variant="flat" className="bg-primary-600/50 text-white">
              دستگاه: {transaction.device.networks[0]?.name || 'نامشخص'}
            </Chip>
            <Chip size="sm" variant="flat" className="bg-secondary-600/50 text-white">
              تراکنش: {transaction.network.name}
            </Chip>
            <Chip size="sm" variant="flat" className="bg-warning-600/50 text-white">
              کارت: {transaction.card.devices[0]?.networks[0]?.name || 'نامشخص'}
            </Chip>
          </div>
        );
      case 'amount':
        return (
          <div className="flex items-center gap-1">
            <span className="font-bold light:text-black dark:text-white">{transaction.amount.toLocaleString('fa-IR')}</span>
            <TbCurrencyIranianRial size={16} />
          </div>
        );
      case 'date':
        return <div className="text-sm light:text-gray-600 dark:text-gray-400">{formatDate(transaction.createdAt)}</div>;
      case 'description':
        return <div className="text-sm light:text-gray-600 dark:text-gray-400">{decodeHtmlEntities(transaction.description)}</div>;
      default:
        return null;
    }
  };

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      <Table
        aria-label="Loading skeleton"
        dir="rtl"
        classNames={{
          wrapper: 'max-h-[60vh] dark:bg-neutral-900 light:bg-neutral-100',
          th: 'dark:bg-neutral-800 light:bg-neutral-200 dark:text-white light:text-black py-3',
          td: 'py-3 dark:text-white light:text-black'
        }}
      >
        <TableHeader>
          {columns.map(column => (
            <TableColumn className="text-right first:rounded-l-none first:rounded-r-lg last:rounded-l-lg last:rounded-r-none" key={column.uid}>
              {column.name}
            </TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {[1, 2, 3].map(i => (
            <TableRow key={i}>
              {columns.map(column => (
                <TableCell key={column.uid}>
                  <Skeleton className="h-6 w-full rounded-lg light:bg-neutral-200 dark:bg-neutral-800" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <>
      <Tooltip content="مشاهده تراکنش‌ها" delay={500} radius="sm">
        <Button isIconOnly variant="light" radius="sm" size="sm" onPress={onOpen}>
          <GrTransaction className="text-purple-500 transition-colors hover:text-purple-600" size={24} />
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="5xl"
        scrollBehavior="inside"
        classNames={{
          base: 'light:bg-neutral-100 dark:bg-neutral-900',
          header: 'border-b border-neutral-200 light:border-neutral-800 dark:border-neutral-700',
          body: 'p-0',
          footer: 'border-t border-neutral-200 light:border-neutral-800 dark:border-neutral-700',
          closeButton: 'text-neutral-900 light:text-neutral-100 hover:bg-neutral-200 light:hover:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800'
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold light:text-black dark:text-white">تراکنش‌ها</h3>
              <p className="text-sm light:text-gray-600 dark:text-gray-400">لیست تمام تراکنش‌های انجام شده</p>
            </div>
          </ModalHeader>

          <ModalBody>
            {loading ? (
              <LoadingSkeleton />
            ) : transactions.length > 0 ? (
              <Table
                aria-label="Transactions table"
                dir="rtl"
                isHeaderSticky
                classNames={{
                  wrapper: 'max-h-[60vh] light:bg-neutral-100 dark:bg-neutral-900',
                  th: 'light:bg-neutral-200 dark:bg-neutral-800 light:text-black dark:text-white py-3',
                  td: 'py-3 light:text-black dark:text-white'
                }}
              >
                <TableHeader columns={columns}>
                  {column => (
                    <TableColumn className="text-right first:rounded-l-none first:rounded-r-lg last:rounded-l-lg last:rounded-r-none" key={column.uid}>
                      {column.name}
                    </TableColumn>
                  )}
                </TableHeader>
                <TableBody items={transactions}>{transaction => <TableRow key={transaction.id}>{columnKey => <TableCell>{renderCell(transaction, columnKey)}</TableCell>}</TableRow>}</TableBody>
              </Table>
            ) : (
              <div className="flex h-40 items-center justify-center">
                <p className="light:text-gray-400 dark:text-gray-600">تراکنشی یافت نشد</p>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CardTransactionsModal;
