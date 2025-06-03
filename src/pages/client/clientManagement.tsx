import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';

// Icons
import { FiCopy, FiFilter } from 'react-icons/fi';
import { FaAddressCard, FaCalendarAlt } from 'react-icons/fa';

// NextUI
import {
  Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Spinner,
  Pagination, Button, Tooltip, Card, CardBody, Input
} from '@nextui-org/react';
import { ApiResponse, Client, PaginationData } from '../../components/clients/types';
import EditClient from '../../components/clients/EditClient';
import ClientDetails from '../../components/clients/ClientDetails';

// Components (replace with your actual import paths)

// Types

// If you use React Router, uncomment the following lines:
// import { useNavigate, Link } from 'react-router-dom';

const ClientManagementPage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [filtersVisible, setFiltersVisible] = useState(false);

  const [pagination, setPagination] = useState<PaginationData>({
    limit: 50,
    page: 1,
    pages: 1,
    total: 0
  });

  // If using React Router:
  // const navigate = useNavigate();

  // Search states
  const [searchParamsState, setSearchParamsState] = useState({
    fullName: '',
    codeMeli: '',
    phoneNumber: '',
    cardNumber: ''
  });

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    Object.entries(searchParamsState).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    params.append('page', pagination.page.toString());
    return params.toString();
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams();
      const response = await axios.get<ApiResponse>(
        `/microservice/v1/payment/server/clients/list?${queryParams}`,
        { withCredentials: true }
      );
      if (response.data.success === 'success') {
        setClients(response.data.clients);
        setPagination(response.data.pagination);
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
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchClients();
  };

  const handleClearSearch = () => {
    setSearchParamsState({
      fullName: '',
      codeMeli: '',
      phoneNumber: '',
      cardNumber: ''
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchClients();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('کپی شد', { duration: 1500 });
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

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
    { key: 'id', label: 'شناسه' },
    { key: 'fullName', label: 'نام و نام خانوادگی' },
    { key: 'codeMeli', label: 'کد ملی' },
    { key: 'phoneNumber', label: 'شماره تلفن' },
    { key: 'cards', label: 'تعداد کارت‌ها' },
    { key: 'balance', label: 'موجودی کل' },
    { key: 'createdAt', label: 'تاریخ ایجاد' },
    { key: 'updatedAt', label: 'تاریخ آپدیت' },
    { key: 'actions', label: 'عملیات' }
  ];

  const calculateTotalBalance = (cards: any[]) => {
    const totalBalance = cards.reduce((total, card) => total + Number(card.balance || 0), 0);
    return totalBalance.toLocaleString('fa-IR');
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line
  }, [pagination.page]);

  // Search on Enter press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line
  }, [searchParamsState]);

  return (
    <div dir="rtl" className="mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-2xl font-bold light:text-slate-900 dark:text-slate-100">مدیریت مشتریان</h1>
        <Button color="secondary" variant="flat" startContent={<FiFilter />} onClick={() => setFiltersVisible(!filtersVisible)}>
          {filtersVisible ? 'بستن فیلترها' : 'نمایش فیلترها'}
        </Button>
      </div>

      {/* Search Filters */}
      <AnimatePresence>
        {filtersVisible && (
          <motion.div layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="w-full">
            <Card className="border bg-gradient-to-br p-6 shadow-xl light:border-slate-200 light:from-slate-100 light:to-slate-200 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
              <CardBody className="p-6">
                <div className="flex flex-col space-y-6">
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Input
                      label="نام مشتری"
                      value={searchParamsState.fullName}
                      onChange={e => setSearchParamsState(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="جستجو بر اساس نام"
                      variant="bordered"
                    />
                    <Input
                      label="کدملی"
                      value={searchParamsState.codeMeli}
                      onChange={e => setSearchParamsState(prev => ({ ...prev, codeMeli: e.target.value }))}
                      placeholder="جستجو بر اساس کدملی"
                      variant="bordered"
                    />
                    <Input
                      label="شماره تلفن"
                      value={searchParamsState.phoneNumber}
                      onChange={e => setSearchParamsState(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="جستجو بر اساس شماره تلفن"
                      variant="bordered"
                    />
                    <Input
                      label="شماره کارت"
                      value={searchParamsState.cardNumber}
                      onChange={e => setSearchParamsState(prev => ({ ...prev, cardNumber: e.target.value }))}
                      placeholder="جستجو بر اساس شماره کارت"
                      variant="bordered"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button className="px-8 font-medium" onClick={handleClearSearch}>
                      پاک کردن
                    </Button>
                    <Button className="bg-gradient-to-r from-primary to-primary-500 px-8 font-medium text-white hover:bg-primary/80" onClick={handleSearch} isLoading={loading}>
                      جستجو
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Clients Table */}
      <Card className="shadow-xl">
        <CardBody className="p-0">
          <Table
            aria-label="Clients management table"
            dir="rtl"
            isStriped
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
                <TableColumn key={column.key} className="text-center text-base first:rounded-l-none first:rounded-r-xl last:rounded-l-xl last:rounded-r-none">
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>

            <TableBody items={clients} emptyContent={loading ? <Spinner color="primary" size="lg" /> : 'مشتری‌ای یافت نشد'} isLoading={loading}>
              {client => (
                <TableRow key={client.id} className="transition-colors light:hover:bg-neutral-500/50 dark:hover:bg-neutral-800/50">
                  <TableCell className="text-center before:!rounded-l-none before:!rounded-r-lg">{client.id}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span>{client.fullName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{client.codeMeli}</TableCell>
                  <TableCell className="text-center">
                    <Tooltip content="کپی شماره تلفن" delay={500}>
                      <Button variant="light" size="sm" onClick={() => copyToClipboard(client.phoneNumber)} className="font-mono text-teal-500" endContent={<FiCopy color="teal" size={14} />}>
                        {client.phoneNumber}
                      </Button>
                    </Tooltip>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-x-1">
                      <p className="text-center">{client.cards.length.toLocaleString('fa-IR')}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-x-1">
                      <p className="text-center font-medium text-green-600 dark:text-green-500">{calculateTotalBalance(client.cards)} ریال</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center text-sm">{formatDate(client.createdAt)}</TableCell>
                  <TableCell className="text-center text-sm">{formatDate(client.updatedAt)}</TableCell>
                  <TableCell className="text-center before:!rounded-l-lg before:!rounded-r-none">
                    <div className="grid grid-cols-2 items-center justify-center gap-x-4 md:gap-0">
                      <ClientDetails client={client} />
                      {/* If using React Router, use <Link> instead of <a> */}
                      <Tooltip content="چک ها" delay={500}>
                        <Button
                          isIconOnly
                          // as={Link}
                          // to={`/payment-card/client/cheques/${client.id}`}
                          as="a"
                          href={`/payment-card/client/cheques/${client.id}`}
                          variant="light"
                          size="sm"
                          className="text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FaAddressCard size={22} />
                        </Button>
                      </Tooltip>
                      <EditClient client={client} fetchClients={fetchClients} />
                      <Tooltip content="اقساط" delay={500}>
                        <Button
                          isIconOnly
                          // as={Link}
                          // to={`/payment-card/client/installments/${client.id}`}
                          as="a"
                          href={`/payment-card/client/installments/${client.id}`}
                          variant="light"
                          size="sm"
                          className="text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FaCalendarAlt size={22} />
                        </Button>
                      </Tooltip>
                    </div>
                  </TableCell>
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

export default ClientManagementPage;