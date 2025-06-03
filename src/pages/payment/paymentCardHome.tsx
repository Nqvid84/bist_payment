import { motion } from 'framer-motion';
import { TbCurrencyIranianRial } from 'react-icons/tb';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useState, useEffect, useCallback, memo } from 'react';
import axios from 'axios';
import DatePicker from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { FiX, FiUsers, FiShoppingBag } from 'react-icons/fi';
import { toast } from 'sonner';
import { Button, Skeleton } from '@nextui-org/react';
import { Link } from 'react-router-dom';

interface SummaryData {
  balance: string;
  totalCharge: string;
  totalWithdraw: string;
}

const homeComponent = () => {
  const [totalCharge, setTotalCharge] = useState(0);
  const [totalWithdraw, setTotalWithdraw] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const [data, setData] = useState([
    { name: 'باقیمانده', value: 0, color: '#3b82f6' },
    { name: 'برداشت‌ها', value: 0, color: '#E91E63' }
  ]);

  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [loading, setLoading] = useState(false);
  const formatNumber = (num: number) => {
    return num.toLocaleString('fa-IR');
  };

  const calculatePercentage = (value: number) => {
    if (totalCharge === 0) {
      // If there's no charge, calculate percentage based on total of balance and withdrawals
      const total = totalBalance + totalWithdraw;
      return total === 0 ? '0' : ((value / total) * 100).toFixed(1);
    }
    return ((value / totalCharge) * 100).toFixed(1);
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: { cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; value: number }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 2.2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    const percentage = calculatePercentage(value);

    // Don't render label if percentage is 0
    if (percentage === '0') return null;

    return (
      <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" className="text-sm light:fill-black dark:fill-white">
        {percentage}%
      </text>
    );
  };

  const fetchSummaryData = useCallback(() => {
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
      queryString = `?${params.toString()}`; // ?dateFrom=2025-03-01&dateTo=2025-03-31
    }

    axios
      .get<{ success: string; networksSummary: SummaryData }>(`/microservice/v1/payment/server/reports/networks/sumerize${queryString}`, {
        withCredentials: true
      })
      .then(response => {
        if (response.data.success === 'success') {
          const summary = response.data.networksSummary;
          setTotalBalance(parseInt(summary.balance));
          setTotalCharge(Number(summary.totalCharge));
          setTotalWithdraw(Number(summary.totalWithdraw));
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
    fetchSummaryData();
  }, [dateRange]);

  useEffect(() => {
    setData([
      { name: 'موجودی', value: totalBalance, color: '#3b82f6' },
      { name: 'برداشت‌ها', value: totalWithdraw, color: '#E91E63' }
    ]);
  }, [totalBalance, totalWithdraw]);

  return (
    <main className="min-h-screen p-8 light:bg-neutral-300 dark:bg-neutral-900">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Charges Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-xl border p-6 shadow-lg light:border-neutral-300 light:bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <h2 className="mb-2 text-right text-sm font-medium light:text-neutral-400 dark:text-neutral-400">کل شارژ ها</h2>

            {loading ? (
              <Skeleton classNames={{ base: 'dark:bg-neutral-700 light:bg-neutral-300' }} className="h-10 w-full rounded-lg" />
            ) : (
              <p className="flex justify-end gap-x-2 text-right text-3xl font-bold light:text-black dark:text-white">
                <TbCurrencyIranianRial /> {formatNumber(totalCharge)}
              </p>
            )}
          </motion.div>

          {/* Withdrawals Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl border p-6 shadow-lg light:border-neutral-300 light:bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <h2 className="mb-2 text-right text-sm font-medium light:text-neutral-900 dark:text-neutral-400">کل برداشت ها</h2>
            {loading ? (
              <Skeleton classNames={{ base: 'dark:bg-neutral-700 light:bg-neutral-300' }} className="h-10 w-full rounded-lg" />
            ) : (
              <p className="flex justify-end gap-x-2 text-right text-3xl font-bold light:text-black dark:text-white">
                <TbCurrencyIranianRial /> {formatNumber(totalWithdraw)}
              </p>
            )}
          </motion.div>

          {/* Total Box */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl border p-6 shadow-lg light:border-neutral-300 light:bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <h2 className="mb-2 text-right text-sm font-medium light:text-neutral-400 dark:text-neutral-400">جمع موجودی</h2>
            {loading ? (
              <Skeleton classNames={{ base: 'dark:bg-neutral-700 light:bg-neutral-300' }} className="h-11 w-full rounded-lg" />
            ) : (
              <p className="flex justify-end gap-x-2 text-right text-3xl font-bold light:text-black dark:text-white">
                <TbCurrencyIranianRial /> {formatNumber(totalBalance)}
              </p>
            )}
          </motion.div>
        </div>

        {/* Reports Grid Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="rounded-xl border p-6 shadow-lg light:border-neutral-300 light:bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <h2 className="mb-6 text-right text-lg font-medium light:text-neutral-400 dark:text-neutral-400">گزارش‌های برداشت</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Client Withdrawals Report */}
            <Link to="/payment-card/reports/clients" className="group">
              <motion.div
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                className="flex h-full flex-col rounded-xl border p-6 shadow-lg transition-all duration-300 group-hover:border-blue-500 light:border-neutral-300 light:bg-neutral-300 light:group-hover:bg-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:group-hover:bg-neutral-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
                    <FiUsers size={24} />
                  </div>
                  <h3 className="mb-2 text-right text-xl font-bold light:text-black dark:text-white">گزارش برداشت مشتریان</h3>
                </div>
                <p className="mb-4 text-right text-sm text-neutral-400">مشاهده جزئیات برداشت‌های مشتریان</p>
                <div className="mt-auto flex justify-end">
                  <span className="text-sm font-medium text-blue-400 transition-colors group-hover:text-blue-300">مشاهده گزارش →</span>
                </div>
              </motion.div>
            </Link>

            {/* Store Organization Withdrawals Report */}
            <Link to="/payment-card/reports/store-org" className="group">
              <motion.div
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.02 }}
                className="flex h-full flex-col rounded-xl border p-6 shadow-lg transition-all duration-300 group-hover:border-purple-500 light:border-neutral-300 light:bg-neutral-300 light:group-hover:bg-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:group-hover:bg-neutral-800"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-purple-500">
                    <FiShoppingBag size={24} />
                  </div>
                  <h3 className="mb-2 text-right text-xl font-bold light:text-black dark:text-white">گزارش برداشت سازمان‌های فروشگاهی</h3>
                </div>
                <p className="mb-4 text-right text-sm text-neutral-400">مشاهده جزئیات برداشت‌های سازمان‌ها و فروشگاه ها</p>
                <div className="mt-auto flex justify-end">
                  <span className="text-sm font-medium text-purple-400 transition-colors group-hover:text-purple-300">مشاهده گزارش →</span>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Date Filter and Pie Chart Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-xl border p-6 shadow-lg light:border-neutral-300 light:bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-800"
        >
          {/* Date Filter */}
          <div dir="rtl" className="mb-8 flex items-center justify-between">
            <h2 className="text-right text-lg font-medium light:text-neutral-400 dark:text-neutral-400">خلاصه گزارش</h2>
            <div className="flex items-center gap-4">
              {(dateRange[0] || dateRange[1]) && (
                <Button
                  isIconOnly
                  onPress={clearDateRange}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors light:bg-neutral-300 light:text-black light:hover:bg-neutral-600 dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
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

                    if (newStartDate && newEndDate) {
                      fetchSummaryData();
                    }
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

          {/* Pie Chart */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={2} dataKey="value" startAngle={90} endAngle={-270} labelLine={false} label={renderCustomizedLabel}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 flex justify-center gap-8">
            {data.map((entry, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm light:text-neutral-800 dark:text-neutral-400">{entry.name}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export const Home = memo(homeComponent);
