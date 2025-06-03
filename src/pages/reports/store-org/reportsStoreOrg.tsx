import { useEffect, useState, useCallback, memo } from 'react';
import { APIResponse, NetworkSummary } from './types';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { FiX } from 'react-icons/fi';
import { TbCurrencyIranianRial } from 'react-icons/tb';
import { toast } from 'sonner';
import { Button, Skeleton, Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Card, CardBody, Spinner } from '@nextui-org/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FaRegChartBar } from 'react-icons/fa';
import { useTheme } from '../../../hooks/useTheme';
import { NumberTicker } from '../../../components/UI/NumberTicker';

const reportStoreOrgComponent = () => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [loading, setLoading] = useState(false);
  const [networkData, setNetworkData] = useState<NetworkSummary[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showChart, setShowChart] = useState(false);

  const formatNumber = (num: number) => {
    return num.toLocaleString('fa-IR');
  };

  const fetchNetworkData = useCallback(() => {
    setLoading(true);

    const formatDateToAPI = (date: Date | null) => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    let queryString = '';
    if (dateRange[0] && dateRange[1]) {
      const params = new URLSearchParams({
        dateFrom: formatDateToAPI(dateRange[0]),
        dateTo: formatDateToAPI(dateRange[1])
      });
      queryString = `?${params.toString()}`;
    }

    axios
      .get<APIResponse>(`/microservice/v1/payment/server/reports/networks/withdraw-store-organization${queryString}`, {
        withCredentials: true
      })
      .then(response => {
        if (response.data.success === 'success') {
          const networks = response.data.networksSummary;
          setNetworkData(networks);

          // Calculate total amount for all networks
          const total = networks.reduce((sum, network) => sum + parseInt(network.total_amount), 0);
          setTotalAmount(total);
        }
      })
      .catch(error => {
        toast.error(error.response?.data?.error || 'خطا در دریافت اطلاعات');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dateRange]);

  const clearDateRange = () => {
    setDateRange([null, null]);
  };

  useEffect(() => {
    fetchNetworkData();
  }, [dateRange]);

  const { theme } = useTheme();

  // Prepare data for the chart
  const chartData = networkData.map(network => ({
    name: network.network_name,
    amount: parseInt(network.total_amount)
  }));

  return (
    <main className="min-h-screen p-8 light:bg-neutral-100 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Button onPress={() => setShowChart(!showChart)} color="primary" variant={showChart ? 'flat' : 'solid'} startContent={<FaRegChartBar />} className="font-medium">
            {showChart ? 'بستن نمودار' : 'نمایش نمودار'}
          </Button>
          <h1 className="text-xl font-bold light:text-neutral-900 dark:text-white md:text-2xl">گزارش برداشت سازمان‌های فروشگاهی</h1>
        </div>

        {/* Date Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-xl border p-6 shadow-lg light:border-neutral-200 light:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800"
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

        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl border p-6 shadow-lg light:border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <h2 className="mb-4 text-right text-lg font-medium light:text-neutral-900 dark:text-white">خلاصه برداشت‌ها</h2>
          {loading ? (
            <Skeleton classNames={{ base: 'dark:bg-neutral-700 light:bg-neutral-300' }} className="h-10 w-full rounded-lg" />
          ) : (
            <p className="flex justify-end gap-x-2 text-right text-3xl font-bold light:text-neutral-900 dark:text-white">
              <TbCurrencyIranianRial />
              <NumberTicker className="text-3xl font-bold light:text-neutral-900 dark:text-white" value={totalAmount} />
            </p>
          )}
        </motion.div>

        {/* Chart Section */}
        <AnimatePresence>
          {showChart && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl border p-6 shadow-lg light:border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800"
            >
              <h2 className="mb-6 text-right text-lg font-medium light:text-neutral-900 dark:text-white">نمودار برداشت‌ها</h2>
              {loading ? (
                <Skeleton classNames={{ base: 'dark:bg-neutral-700 light:bg-neutral-300' }} className="h-80 w-full rounded-lg" />
              ) : (
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#444' : '#aaa'} />
                      <XAxis dataKey="name" stroke={theme === 'dark' ? '#fff' : '#444'} />
                      <YAxis stroke={theme === 'dark' ? '#fff' : '#444'} tickFormatter={value => formatNumber(Number(value))} fontSize={12} />
                      <Tooltip
                        formatter={value => [formatNumber(Number(value)), 'مبلغ']}
                        contentStyle={{ backgroundColor: theme === 'dark' ? '#262626' : '#f9fafb', border: '1px solid #374151', borderRadius: '0.5rem' }}
                        labelStyle={{ color: theme === 'dark' ? '#9ca3af' : '#374151' }}
                        cursor={{ fill: theme === 'dark' ? '#404040' : '#f9f9f9' }}
                      />
                      <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Section */}
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-xl border p-6 shadow-lg light:border-neutral-200 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <h2 className="mb-6 text-right text-lg font-medium light:text-neutral-900 dark:text-white">جدول برداشت‌ها</h2>
          {loading ? (
            <div className="space-y-3">
              <Skeleton classNames={{ base: 'dark:bg-neutral-700 light:bg-neutral-300' }} className="h-10 w-full rounded-lg" />
              <Skeleton classNames={{ base: 'dark:bg-neutral-700 light:bg-neutral-300' }} className="h-10 w-full rounded-lg" />
              <Skeleton classNames={{ base: 'dark:bg-neutral-700 light:bg-neutral-300' }} className="h-10 w-full rounded-lg" />
            </div>
          ) : (
            <Card className="shadow-xl light:bg-neutral-100 dark:bg-neutral-900">
              <CardBody className="p-0">
                <Table
                  aria-label="جدول برداشت‌های سازمان‌های فروشگاهی"
                  dir="rtl"
                  color="primary"
                  isHeaderSticky
                  isStriped
                  classNames={{
                    wrapper: 'max-h-[70vh] light:bg-neutral-100 light:text-neutral-900 dark:bg-neutral-900 dark:text-white',
                    th: 'py-3 light:bg-neutral-200 dark:bg-neutral-800 light:text-neutral-900 dark:text-white',
                    td: 'py-3 light:text-neutral-900 dark:text-white',
                    thead: '!-top-4'
                  }}
                >
                  <TableHeader>
                    <TableColumn className="text-center text-base first:rounded-l-none first:rounded-r-lg last:rounded-l-lg last:rounded-r-none">نام شبکه</TableColumn>
                    <TableColumn className="text-center text-base first:rounded-l-none first:rounded-r-lg last:rounded-l-lg last:rounded-r-none">نوع شبکه</TableColumn>
                    <TableColumn className="text-center text-base first:rounded-l-none first:rounded-r-lg last:rounded-l-lg last:rounded-r-none">مبلغ کل</TableColumn>
                  </TableHeader>

                  <TableBody items={networkData} emptyContent={loading ? <Spinner color="primary" size="lg" /> : 'هیچ داده‌ای یافت نشد'}>
                    {network => (
                      <TableRow key={network.network_name} className="transition-colors light:hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50">
                        <TableCell className="text-center before:!rounded-l-none before:!rounded-r-lg">{network.network_name}</TableCell>
                        <TableCell className="text-center">{network.net_type}</TableCell>
                        <TableCell className="text-center before:!rounded-l-lg before:!rounded-r-none">
                          <div className="flex items-center justify-center gap-1">
                            {formatNumber(parseInt(network.total_amount))}
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
        </motion.div>
      </div>
    </main>
  );
};

export const ReportStoreOrg = memo(reportStoreOrgComponent);
