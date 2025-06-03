import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { TbCurrencyIranianRial } from 'react-icons/tb';
import { FiCopy, FiFilter } from 'react-icons/fi';
import { Spinner, Button, Tooltip, Card, CardBody, Chip } from '@nextui-org/react';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { AnimatePresence, motion } from 'framer-motion';

// Types based on API response
interface NetworkSummary {
  id: number;
  name: string;
  type: string;
  deviceName: string;
  charge: string;
  withdraw: string;
}

interface ApiResponse {
  success: string;
  summery: NetworkSummary[];
  error?: string;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const NetworkTransactionsReportPage = () => {
  const [summery, setSummery] = useState<NetworkSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const query = useQuery();

  // Search states
  const [searchParamsState, setSearchParamsState] = useState({
    dateFrom: '',
    dateTo: ''
  });

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    const paramNames = ['dateFrom', 'dateTo'];

    paramNames.forEach(param => {
      const urlValue = query.get(param);
      const stateValue = searchParamsState[param as keyof typeof searchParamsState];
      const value = stateValue || urlValue;
      if (value) params.append(param, value);
    });

    return params.toString();
  };

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams();
      const response = await axios.get<ApiResponse>(`/microservice/v1/payment/server/network/transactions/report${queryParams ? `?${queryParams}` : ''}`, { withCredentials: true });

      if (response.data.success === 'network summery retrieved successfully') {
        setSummery(response.data.summery);
      } else {
        throw new Error(response.data.error || 'API response unsuccessful');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در دریافت اطلاعات رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(searchParamsState).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    navigate(`/payment-card/network-transactions-report?${params.toString()}`);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('کپی شد', { duration: 1500 });
  };

  const formatBalance = (value: string) => {
    return Number(value).toLocaleString('fa-IR');
  };

  useEffect(() => {
    const initialParams = {
      dateFrom: query.get('dateFrom') || '',
      dateTo: query.get('dateTo') || ''
    };
    setSearchParamsState(initialParams);
    fetchSummary();
    // eslint-disable-next-line
  }, [location.search]);

  return (
    <div dir="rtl" className="mx-auto space-y-6 p-4">
      {/* Header */}
      <header className="flex flex-col items-center justify-between gap-x-4 px-4 py-2 md:flex-row">
        <h1 className="text-2xl font-bold text-slate-900">گزارش تراکنش‌های شبکه‌ها</h1>
        <Button color="secondary" variant="flat" startContent={<FiFilter />} onClick={() => setFiltersVisible(!filtersVisible)}>
          {filtersVisible ? 'بستن فیلترها' : 'نمایش فیلترها'}
        </Button>
      </header>

      {/* Search Filters */}
      <AnimatePresence>
        {filtersVisible && (
          <motion.div layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="w-full">
            <div className="rounded-xl border border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl">
              <div className="flex flex-col space-y-6">
                <div className="flex flex-col space-y-1">
                  <label className="text-sm text-slate-300">بازه زمانی</label>
                  <DatePicker
                    range
                    value={[searchParamsState.dateFrom ? new Date(searchParamsState.dateFrom) : null, searchParamsState.dateTo ? new Date(searchParamsState.dateTo) : null]}
                    onChange={dates => {
                      if (Array.isArray(dates)) {
                        const [startDate, endDate] = dates;
                        const formatGregorianDate = (date: any) => {
                          if (!date) return '';
                          const gregorianDate = date.toDate();
                          return `${gregorianDate.getFullYear()}-${String(gregorianDate.getMonth() + 1).padStart(2, '0')}-${String(gregorianDate.getDate()).padStart(2, '0')}`;
                        };
                        setSearchParamsState(prev => ({
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
                    inputClass="w-1/3 p-2 rounded-md bg-slate-800/50 text-white border border-slate-600 hover:border-slate-500 focus:border-blue-500"
                    placeholder="انتخاب بازه زمانی"
                    format="YYYY/MM/DD"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    className="bg-slate-700 px-8 font-medium text-white hover:bg-slate-600"
                    onClick={() => setSearchParamsState({ dateFrom: '', dateTo: '' })}
                    startContent={
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    }
                  >
                    پاک کردن
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-primary to-primary-500 px-8 font-medium text-white"
                    onClick={handleSearch}
                    isLoading={loading}
                    startContent={
                      !loading && (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                        </svg>
                      )
                    }
                  >
                    جستجو
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Network Summary Cards */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Spinner color="primary" label="در حال بارگذاری..." />
        </div>
      ) : summery.length === 0 ? (
        <p className="text-center text-slate-400">داده‌ای یافت نشد</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {summery.map(item => (
            <Card
              key={`${item.id}-${item.deviceName}`}
              className="group relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/90 to-slate-900/90 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-slate-600/50 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <CardBody className="relative p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">{item.name}</h2>
                  <Chip size="sm" variant="flat" className="bg-primary/40 font-medium text-primary-100">
                    {item.type}
                  </Chip>
                </div>

                <div className="mb-6 rounded-lg bg-slate-800/50 p-3">
                  <p className="flex items-center gap-2 text-sm text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-primary">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                      />
                    </svg>
                    {item.deviceName}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between rounded-lg bg-emerald-500/10 p-3 ring-1 ring-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-emerald-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                      <span className="text-sm text-emerald-300">شارژ</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-emerald-200">{formatBalance(item.charge)}</span>
                      <TbCurrencyIranianRial size={16} className="text-emerald-400" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-red-500/10 p-3 ring-1 ring-red-500/20">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4 text-red-400">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      <span className="text-sm text-red-300">برداشت</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-red-200">{formatBalance(item.withdraw)}</span>
                      <TbCurrencyIranianRial size={16} className="text-red-400" />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between border-t border-slate-700/50 pt-4">
                  <Tooltip delay={1000} content="کپی نام شبکه">
                    <Button variant="light" size="sm" onPress={() => copyToClipboard(item.name)} className="text-primary-400 hover:text-primary-300" endContent={<FiCopy size={14} />}>
                      نام
                    </Button>
                  </Tooltip>
                  <Tooltip delay={1000} content="کپی نام دستگاه">
                    <Button variant="light" size="sm" onPress={() => copyToClipboard(item.deviceName)} className="text-primary-400 hover:text-primary-300" endContent={<FiCopy size={14} />}>
                      دستگاه
                    </Button>
                  </Tooltip>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NetworkTransactionsReportPage;
