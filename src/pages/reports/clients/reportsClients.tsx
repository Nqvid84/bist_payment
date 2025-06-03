import type { APIResponse, ClientsWithdraw, PaginationInfo } from './types';
import { useEffect, useState, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { FiX } from 'react-icons/fi';
import { TbCurrencyIranianRial } from 'react-icons/tb';
import { toast } from 'sonner';
import { Button, Skeleton, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Card, CardBody, Spinner, Input, Pagination } from '@nextui-org/react';

const reportClinetsComponent = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState<ClientsWithdraw[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    limit: 10
  });
  const [searchParams, setSearchParams] = useState({
    fullName: '',
    codeMeli: '',
    phoneNumber: ''
  });

  const formatNumber = (num: number) => {
    return num.toLocaleString('fa-IR');
  };

  const fetchClientData = useCallback(() => {
    setLoading(true);

    const formatDateToAPI = (date: Date | null) => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const params = new URLSearchParams();

    if (dateRange[0] && dateRange[1]) {
      params.append('dateFrom', formatDateToAPI(dateRange[0]));
      params.append('dateTo', formatDateToAPI(dateRange[1]));
    }

    // Add pagination parameters
    params.append('page', pagination.currentPage.toString());

    // Add search parameters if they exist
    if (searchParams.fullName) params.append('fullName', searchParams.fullName);
    if (searchParams.codeMeli) params.append('codeMeli', searchParams.codeMeli);
    if (searchParams.phoneNumber) params.append('phoneNumber', searchParams.phoneNumber);

    const queryString = params.toString() ? `?${params.toString()}` : '';

    axios
      .get<APIResponse>(`/microservice/v1/payment/server/reports/clients/withdraw${queryString}`, {
        withCredentials: true
      })
      .then(response => {
        if (response.data.success === 'success') {
          const clients = response.data.clientsWithdraw;
          setClientData(clients);

          // Update pagination info if available
          if (response.data.pagination) {
            setPagination(response.data.pagination);
          }
        }
      })
      .catch(error => {
        toast.error(error.response?.data?.error || 'خطا در دریافت اطلاعات');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dateRange, pagination.currentPage, searchParams]);

  const clearDateRange = () => {
    setDateRange([null, null]);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchClientData();
  };

  const clearSearch = () => {
    setSearchParams({
      fullName: '',
      codeMeli: '',
      phoneNumber: ''
    });
    setSearchQuery('');
    // Reset to page 1 when clearing search
    setPagination(prev => ({ ...prev, currentPage: 1 }));
    fetchClientData();
  };

  useEffect(() => {
    fetchClientData();
  }, [dateRange, pagination.currentPage]);

  // Filter client data based on search query (client-side filtering)
  const filteredClientData = useMemo(() => {
    if (!searchQuery.trim()) return clientData;

    const query = searchQuery.toLowerCase().trim();
    return clientData.filter(
      client => client.fullName.toLowerCase().includes(query) || client.codeMeli.includes(query) || client.phoneNumber.includes(query) || client.total_withdraw.toString().includes(query)
    );
  }, [clientData, searchQuery]);

  return (
    <main className="min-h-screen p-8 light:bg-neutral-100 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row-reverse md:items-center md:justify-between">
          <h1 className="text-xl font-bold light:text-neutral-900 dark:text-white md:text-2xl">گزارش برداشت مشتریان</h1>
        </div>

        {/* Date Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border p-6 shadow-lg light:border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div dir="rtl" className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <h2 className="text-right text-lg font-medium light:text-neutral-900 dark:text-white">فیلتر بازه زمانی</h2>
            <div className="flex items-center gap-4">
              {(dateRange[0] || dateRange[1]) && (
                <Button
                  isIconOnly
                  onPress={clearDateRange}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-neutral-600 light:bg-neutral-300 light:text-black dark:bg-neutral-700 dark:text-white"
                >
                  <FiX size={20} />
                </Button>
              )}

              <DatePicker
                range
                value={dateRange}
                onChange={(dates: any) => {
                  if (Array.isArray(dates) && dates.length === 2) {
                    const [startDate, endDate] = dates;
                    const newStartDate = startDate?.toDate() || null;
                    const newEndDate = endDate?.toDate() || null;
                    setDateRange([newStartDate, newEndDate]);
                  }
                }}
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-left"
                inputClass="w-full md:w-64 px-4 py-2 rounded-lg dark:bg-neutral-700 light:bg-neutral-300 dark:text-white light:text-black border dark:border-neutral-600 light:border-neutral-400 focus:border-blue-500 focus:outline-none transition-colors"
                containerClassName="w-full"
                placeholder="انتخاب بازه زمانی"
                format="YYYY/MM/DD"
              />
            </div>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-xl border p-6 shadow-lg light:border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <div dir="rtl" className="flex flex-col gap-4">
            <h2 className="text-right text-lg font-medium light:text-neutral-900 dark:text-white">جستجوی پیشرفته</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input
                dir="rtl"
                placeholder="نام و نام خانوادگی"
                value={searchParams.fullName}
                onValueChange={value => setSearchParams(prev => ({ ...prev, fullName: value }))}
                classNames={{
                  inputWrapper:
                    'light:bg-neutral-300 dark:bg-neutral-700 border-neutral-600 dark:hover:!bg-neutral-600 light:hover:!bg-neutral-600 dark:focus-within:!bg-neutral-600 light:focus-within:!bg-neutral-600',
                  input: 'light:text-neutral-900 dark:text-white dark:group-data-[has-value=true]:text-white light:group-data-[has-value=true]:text-black',
                  label: 'light:text-neutral-900 dark:text-white'
                }}
              />
              <Input
                dir="rtl"
                placeholder="کد ملی"
                value={searchParams.codeMeli}
                onValueChange={value => setSearchParams(prev => ({ ...prev, codeMeli: value }))}
                classNames={{
                  inputWrapper:
                    'light:bg-neutral-300 dark:bg-neutral-700 border-neutral-600 dark:hover:!bg-neutral-600 light:hover:!bg-neutral-600 dark:focus-within:!bg-neutral-600 light:focus-within:!bg-neutral-600',
                  input: 'light:text-neutral-900 dark:text-white dark:group-data-[has-value=true]:text-white light:group-data-[has-value=true]:text-black',
                  label: 'light:text-neutral-900 dark:text-white'
                }}
              />
              <Input
                dir="rtl"
                placeholder="شماره موبایل"
                value={searchParams.phoneNumber}
                onValueChange={value => setSearchParams(prev => ({ ...prev, phoneNumber: value }))}
                classNames={{
                  inputWrapper:
                    'light:bg-neutral-300 dark:bg-neutral-700 border-neutral-600 dark:hover:!bg-neutral-600 light:hover:!bg-neutral-600 dark:focus-within:!bg-neutral-600 light:focus-within:!bg-neutral-600',
                  input: 'light:text-neutral-900 dark:text-white dark:group-data-[has-value=true]:text-white light:group-data-[has-value=true]:text-black',
                  label: 'light:text-neutral-900 dark:text-white'
                }}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button color="primary" onPress={handleSearch} className="px-4">
                جستجو
              </Button>
              <Button variant="flat" onPress={clearSearch} className="px-4">
                پاک کردن
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Table Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-xl border p-6 shadow-lg light:border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <h2 className="mb-6 text-right text-lg font-medium light:text-neutral-900 dark:text-white">جدول برداشت‌ها</h2>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} classNames={{ base: 'dark:bg-neutral-700 light:bg-neutral-400' }} className="h-10 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <Card className="shadow-xl light:bg-neutral-100 dark:bg-neutral-900">
              <CardBody className="p-0">
                <Table
                  aria-label="جدول برداشت‌های مشتریان"
                  dir="rtl"
                  color="primary"
                  isHeaderSticky
                  isStriped
                  classNames={{
                    wrapper: 'max-h-[70vh] light:bg-neutral-100 dark:bg-neutral-900',
                    th: 'py-3 light:bg-neutral-200 dark:bg-neutral-800 light:text-neutral-900 dark:text-white',
                    td: 'py-3 light:text-neutral-900 dark:text-white',
                    thead: '!-top-4'
                  }}
                >
                  <TableHeader>
                    <TableColumn className="text-center text-base first:rounded-l-none first:rounded-r-lg last:rounded-l-lg last:rounded-r-none">نام و نام خانوادگی</TableColumn>
                    <TableColumn className="text-center text-base first:rounded-l-none first:rounded-r-lg last:rounded-l-lg last:rounded-r-none">کد ملی</TableColumn>
                    <TableColumn className="text-center text-base first:rounded-l-none first:rounded-r-lg last:rounded-l-lg last:rounded-r-none">شماره موبایل</TableColumn>
                    <TableColumn className="text-center text-base first:rounded-l-none first:rounded-r-lg last:rounded-l-lg last:rounded-r-none">مبلغ کل برداشت</TableColumn>
                  </TableHeader>

                  <TableBody items={filteredClientData} emptyContent={loading ? <Spinner color="primary" size="lg" /> : 'هیچ داده‌ای یافت نشد'}>
                    {client => (
                      <TableRow key={client.id} className="transition-colors light:hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50">
                        <TableCell className="text-center before:!rounded-l-none before:!rounded-r-lg">{client.fullName}</TableCell>
                        <TableCell className="text-center">{client.codeMeli}</TableCell>
                        <TableCell className="text-center">{client.phoneNumber}</TableCell>
                        <TableCell className="text-center before:!rounded-l-lg before:!rounded-r-none">
                          <div className="flex items-center justify-center gap-1">
                            {formatNumber(client.total_withdraw)}
                            <TbCurrencyIranianRial />
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardBody>
            </Card>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center p-4">
              <Pagination
                total={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                showControls
                classNames={{
                  wrapper: 'gap-2',
                  item: 'w-8 h-8 text-sm rounded-lg',
                  cursor: 'bg-primary text-white font-medium',
                  prev: 'bg-transparent',
                  next: 'bg-transparent'
                }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
};

export const ReportClients = memo(reportClinetsComponent);
