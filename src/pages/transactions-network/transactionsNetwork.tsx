import { memo, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCopy, FiFilter, FiRefreshCcw } from 'react-icons/fi';
import {
  Table, TableHeader, TableBody, TableColumn, TableRow, TableCell,
  Spinner, Pagination, Button, Tooltip, Card, CardBody, Input, cn, Select, SelectItem
} from '@nextui-org/react';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { TbCurrencyIranianRial } from 'react-icons/tb';
import { decodeHtmlEntities } from '../../utils';

// Type based on API response
interface Transaction {
  id: number;
  amount: number;
  cardNetwork: string;
  cardNumber: string;
  codeMeli: string;
  createdAt: string;
  description: string;
  deviceName: string;
  deviceNetwork: string;
  fullName: string;
  phoneNumber: string;
  transactionNetwork: string;
  transactionType: 'charge' | 'withdraw';
  updatedAt: string;
}

interface PaginationData {
  limit: number;
  page: number;
  pages: number;
  total: number;
}

interface ApiResponse {
  transactions: Transaction[];
  pagination: PaginationData;
  success: string;
}

const defaultFilters = {
  fullName: '',
  codeMeli: '',
  operatorName: '',
  phoneNumber: '',
  dateFrom: '',
  dateTo: '',
  deviceNetworkName: '',
  cardNetworkName: '',
  transactionNetworkName: '',
  transactionType: ''
};

const transactionsNetworkComponent = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    limit: 50,
    page: 1,
    pages: 1,
    total: 0
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [filters, setFilters] = useState({ ...defaultFilters });

  // Build query params for API
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    params.append('page', pagination.page.toString());
    return params.toString();
  };

  // Fetch transactions from API
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams();
      const response = await axios.get<ApiResponse>(
        `/microservice/v1/payment/server/transactions/list/network?${queryParams}`,
        { withCredentials: true }
      );
      if (response.data?.success === 'success') {
        setTransactions(response.data.transactions);
        setPagination(response.data.pagination);
      } else {
        throw new Error('API response unsuccessful');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در دریافت اطلاعات رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Handle search
  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchTransactions();
  };

  // Handle clear search
  const handleClearSearch = () => {
    setFilters({ ...defaultFilters });
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchTransactions();
  };

  // Fetch data on mount and when filters or page changes
  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line
  }, [pagination.page]);

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fa-IR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('کپی شد', { duration: 1500 });
  };

  const columns = [
    { key: 'id', label: 'شناسه' },
    { key: 'cardNumber', label: 'شماره کارت' },
    { key: 'deviceName', label: 'نام دستگاه' },
    { key: 'deviceNetwork', label: 'شبکه دستگاه' },
    { key: 'cardNetwork', label: 'شبکه کارت' },
    { key: 'transactionNetwork', label: 'شبکه تراکنش' },
    { key: 'clientInfo', label: 'اطلاعات مشتری' },
    { key: 'transactionType', label: 'مبلغ' },
    { key: 'description', label: 'توضیحات' },
    { key: 'createdAt', label: 'تاریخ ایجاد' },
    { key: 'updatedAt', label: 'تاریخ آپدیت' }
  ];

  return (
    <div dir="rtl" className="mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-2xl font-bold light:text-slate-900 dark:text-slate-100">مدیریت تراکنش‌های شبکه</h1>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button className="transition-transform ease-in-out active:rotate-180" isLoading={loading} isIconOnly variant="light" radius="full" color="secondary" onClick={fetchTransactions}>
            <FiRefreshCcw />
          </Button>
          <Button color="secondary" variant="flat" startContent={<FiFilter />} onClick={() => setFiltersVisible(!filtersVisible)}>
            {filtersVisible ? 'بستن فیلترها' : 'نمایش فیلترها'}
          </Button>
        </div>
      </div>

      {/* Search Filters */}
      <AnimatePresence>
        {filtersVisible && (
          <motion.div layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="w-full">
            <section className="rounded-xl border bg-gradient-to-br p-6 shadow-xl light:border-slate-200 light:from-slate-100 light:to-slate-200 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
              <div className="flex flex-col space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Input label="نام مشتری" value={filters.fullName} onChange={e => handleFilterChange('fullName', e.target.value)} placeholder="جستجو بر اساس نام" variant="bordered" />
                  <Input label="کدملی" value={filters.codeMeli} onChange={e => handleFilterChange('codeMeli', e.target.value)} placeholder="جستجو بر اساس کدملی" variant="bordered" />
                  <Input label="نام اپراتور" value={filters.operatorName} onChange={e => handleFilterChange('operatorName', e.target.value)} placeholder="جستجو بر اساس نام اپراتور" variant="bordered" />
                  <Input label="شماره تلفن" value={filters.phoneNumber} onChange={e => handleFilterChange('phoneNumber', e.target.value)} placeholder="جستجو بر اساس شماره تلفن" variant="bordered" />
                  <Input label="شبکه دستگاه" value={filters.deviceNetworkName} onChange={e => handleFilterChange('deviceNetworkName', e.target.value)} placeholder="جستجو بر اساس شبکه دستگاه" variant="bordered" />
                  <Input label="شبکه کارت" value={filters.cardNetworkName} onChange={e => handleFilterChange('cardNetworkName', e.target.value)} placeholder="جستجو بر اساس شبکه کارت" variant="bordered" />
                  <Input label="شبکه تراکنش" value={filters.transactionNetworkName} onChange={e => handleFilterChange('transactionNetworkName', e.target.value)} placeholder="جستجو بر اساس شبکه تراکنش" variant="bordered" />
                  <Select label="نوع تراکنش" selectedKeys={[filters.transactionType]} onChange={e => handleFilterChange('transactionType', e.target.value)} variant="bordered">
                    <SelectItem className="text-red-500" key="withdraw">برداشت</SelectItem>
                    <SelectItem className="text-green-500" key="charge">شارژ</SelectItem>
                  </Select>
                  <DatePicker
                    range
                    value={[
                      filters.dateFrom ? new Date(filters.dateFrom) : null,
                      filters.dateTo ? new Date(filters.dateTo) : null
                    ]}
                    onChange={dates => {
                      if (Array.isArray(dates)) {
                        const [startDate, endDate] = dates;
                        const formatGregorianDate = (date: any) => {
                          if (!date) return '';
                          const gregorianDate = date.toDate();
                          return `${gregorianDate.getFullYear()}-${String(gregorianDate.getMonth() + 1).padStart(2, '0')}-${String(gregorianDate.getDate()).padStart(2, '0')}`;
                        };
                        setFilters(prev => ({
                          ...prev,
                          dateFrom: formatGregorianDate(startDate),
                          dateTo: formatGregorianDate(endDate)
                        }));
                      }
                    }}
                    calendar={persian}
                    locale={persian_fa}
                    calendarPosition="bottom-right"
                    zIndex={66}
                    inputClass="w-full p-2 rounded-md"
                    placeholder="انتخاب بازه زمانی"
                    format="YYYY/MM/DD"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button className="px-8 font-medium" onClick={handleClearSearch}>پاک کردن</Button>
                  <Button className="bg-gradient-to-r from-primary to-primary-500 px-8 font-medium text-white hover:bg-primary/80" onClick={handleSearch} isLoading={loading}>جستجو</Button>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transactions Table */}
      <Card className="shadow-xl">
        <CardBody className="p-0">
          <Table
            aria-label="Transactions table"
            dir="rtl"
            color="primary"
            isHeaderSticky
            isStriped
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
            <TableBody items={transactions} emptyContent={loading ? <Spinner color="primary" size="lg" /> : 'هیچ تراکنشی یافت نشد'} isLoading={loading}>
              {transaction => (
                <TableRow key={transaction.id} className="transition-colors light:hover:bg-neutral-500/50 dark:hover:bg-neutral-800/50">
                  <TableCell className="text-center">{transaction.id}</TableCell>
                  <TableCell className="text-center">
                    <Tooltip content="کپی شماره کارت" delay={1000} radius="sm">
                      <Button variant="light" size="sm" onClick={() => copyToClipboard(transaction.cardNumber)} className="font-mono text-teal-500" endContent={<FiCopy color="teal" size={14} />}>
                        {transaction.cardNumber}
                      </Button>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">{transaction.deviceName}</TableCell>
                  <TableCell className="text-center">{transaction.deviceNetwork}</TableCell>
                  <TableCell className="text-center">{transaction.cardNetwork}</TableCell>
                  <TableCell className="text-center">{transaction.transactionNetwork}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col">
                      <span>{transaction.fullName}</span>
                      <span className="text-sm light:text-gray-400 dark:text-gray-500">{transaction.codeMeli}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={cn(transaction.transactionType === 'charge' ? 'text-green-600 dark:text-green-500' : 'text-red-500')}>
                      {transaction.amount.toLocaleString('fa-IR')}
                      <TbCurrencyIranianRial className="inline" size={16} />
                    </span>
                    <p className={cn(transaction.transactionType === 'charge' ? 'text-green-600 dark:text-green-500' : 'text-red-500')}>
                      {transaction.transactionType === 'charge' ? 'شارژ' : 'برداشت'}
                    </p>
                  </TableCell>
                  <TableCell className="text-center">
                    <Tooltip content={decodeHtmlEntities(transaction.description)}>
                      <span className="block max-w-[150px] truncate">{decodeHtmlEntities(transaction.description)}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center text-sm">{formatDate(transaction.createdAt)}</TableCell>
                  <TableCell className="text-center text-sm">{formatDate(transaction.updatedAt)}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div dir="ltr" className="mt-4 flex justify-center">
          <Pagination
            total={pagination.pages}
            page={pagination.page}
            onChange={handlePageChange}
            showControls
            classNames={{
              wrapper: 'gap-1',
              item: 'light:bg-slate-700 light:text-white hover:light:bg-primary/80',
              cursor: 'light:bg-primary'
            }}
          />
        </div>
      )}
    </div>
  );
};

export const TransactionsNetwork = memo(transactionsNetworkComponent);