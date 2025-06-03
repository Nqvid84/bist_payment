import { useEffect, useState, memo, lazy, Suspense } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// NextUI
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell, Chip, Checkbox, Spinner, Pagination, Button, Card, CardBody, Input, Skeleton } from '@nextui-org/react';

// lazy import Components
const AddingDevice = lazy(() => import('../../components/device-management/AddingDevice'));
const EditingDevice = lazy(() => import('../../components/device-management/EditingDevice'));
const DeleteDevice = lazy(() => import('../../components/device-management/DeleteDevice'));

// Icons
import { FiFilter } from 'react-icons/fi';
import { TbTrash, TbTrashOff } from 'react-icons/tb';
import { MdOutlinePersonAddAlt1, MdOutlinePersonAddDisabled, MdUpdateDisabled } from 'react-icons/md';
import { IoCopyOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { RxCross2, RxUpdate } from 'react-icons/rx';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

// DatePicker
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { useLocation, useNavigate } from 'react-router-dom';

interface Network {
  id: number;
  name: string;
}

interface Device {
  id: number;
  deviceName: string;
  deviceHash: string;
  devicePhoneNumber: string;
  deviceDescription: string;
  deviceLocation: string;
  deviceType: string;
  active: boolean;
  readPermission: boolean;
  createPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  networks: Network[];
}

interface Node {
  id: number;
  name: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
}

// #region memorized components props

// DeviceTableRow props
interface DeviceTableRowProps {
  device: Device;
  loading: boolean; // eslint-disable-next-line no-unused-vars
  toggleDeviceStatus: (id: number, isActive: boolean) => void; // eslint-disable-next-line no-unused-vars
  copyToClipboard: (text: string) => void; // eslint-disable-next-line no-unused-vars
  setFlag: (flag: boolean) => void;
  flag: boolean; // eslint-disable-next-line no-unused-vars
  setDevices: (devices: Device[]) => void;
  networks: Node[];
}

// DeviceActionsCell props
interface DeviceActionsCellProps {
  device: Device; // eslint-disable-next-line no-unused-vars
  setFlag: (flag: boolean) => void;
  flag: boolean; // eslint-disable-next-line no-unused-vars
  setDevices: (devices: Device[]) => void;
  networks: Node[];
}

// DeviceHashCell props
interface DeviceHashCellProps {
  device: Device; // eslint-disable-next-line no-unused-vars
  copyToClipboard: (text: string) => void;
}

// DeviceStatusCell props
interface DeviceStatusCellProps {
  device: Device;
  loading: boolean; // eslint-disable-next-line no-unused-vars
  toggleDeviceStatus: (id: number, isActive: boolean) => void;
}

// #endregion

const deviceManagementComponent = () => {
  const [flag, setFlag] = useState(false);

  const [devices, setDevices] = useState<Device[]>([]);
  const [networks, setNetworks] = useState<Node[]>([]);

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1
  });
  const [filtersVisible, setFiltersVisible] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search); // Get query parameters from the URL

  // Search states
  const [searchParamsState, setSearchParamsState] = useState({
    deviceName: '',
    deviceHash: '',
    phoneNumber: '',
    location: '',
    type: '',
    dateFrom: '',
    dateTo: ''
  });

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    const paramNames = ['page', 'deviceName', 'deviceHash', 'phoneNumber', 'location', 'type', 'dateFrom', 'dateTo'];

    paramNames.forEach(param => {
      const urlValue = searchParams.get(param);
      const stateValue = searchParamsState[param as keyof typeof searchParamsState];
      const value = stateValue || urlValue;
      if (value) params.append(param, value);
    });

    if (!params.has('page')) {
      params.append('page', pagination.currentPage.toString());
    }

    return params.toString();
  };

  const fetchDevices = async () => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams();
      const response = await axios.get(`/microservice/v1/payment/server/device/list${queryParams ? `?${queryParams}` : ''}`);

      if (response.data?.devices) {
        setDevices(response.data.devices);
        setPagination({
          currentPage: response.data.currentPage || 1,
          totalPages: response.data.totalPages || 1
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در دریافت اطلاعات رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  const fetchNetworks = async () => {
    try {
      const response = await axios.get('/microservice/v1/payment/server/network/list');
      if (response.data.networks) {
        setNetworks(response.data.networks);
      } else {
        setNetworks([]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطا در دریافت شبکه‌ها');
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(searchParamsState).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', '1');
    navigate(`/payment-card/device-management?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchParamsState({
      deviceName: '',
      deviceHash: '',
      phoneNumber: '',
      location: '',
      type: '',
      dateFrom: '',
      dateTo: ''
    });
    navigate('/payment-card/device-management');
  };

  const toggleDeviceStatus = async (deviceId: number, isActive: boolean) => {
    setLoading(true);
    const endpoint = isActive ? '/microservice/v1/payment/server/device/block' : '/microservice/v1/payment/server/device/unblock';

    try {
      const response = await axios.post(endpoint, { deviceId });
      toast.success(response.data.success);
      await fetchDevices();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('کپی شد', { duration: 1500 });
  };

  useEffect(() => {
    const initialParams = {
      deviceName: searchParams.get('deviceName') || '',
      deviceHash: searchParams.get('deviceHash') || '',
      phoneNumber: searchParams.get('phoneNumber') || '',
      location: searchParams.get('location') || '',
      type: searchParams.get('type') || '',
      dateFrom: searchParams.get('dateFrom') || '',
      dateTo: searchParams.get('dateTo') || ''
    };
    setSearchParamsState(initialParams);
    fetchDevices();
    fetchNetworks();
  }, []);

  // Search on Enter press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleSearch();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [searchParamsState]);

  const columns = [
    { key: 'id', label: 'شناسه' },
    { key: 'operator', label: 'اپراتور دستگاه' },
    { key: 'deviceHash', label: 'سریال دستگاه' },
    { key: 'network', label: 'شبکه دستگاه' },
    { key: 'status', label: 'وضعیت دستگاه' },
    { key: 'permissions', label: 'دسترسی‌ها' },
    { key: 'deviceType', label: 'نوع دستگاه' },
    { key: 'location', label: 'موقعیت دستگاه' },
    { key: 'phoneNumber', label: 'شماره تماس' },
    { key: 'description', label: 'توضیحات' },
    { key: 'actions', label: 'عملیات' }
  ];

  // Memoized cell content components
  const DeviceStatusCell = memo(({ device, loading, toggleDeviceStatus }: DeviceStatusCellProps) => (
    <div className="flex items-center justify-center gap-2">
      <Checkbox
        isSelected={device.active}
        isDisabled={loading}
        onValueChange={() => toggleDeviceStatus(device.id, device.active)}
        size="lg"
        color={device.active ? 'success' : 'danger'}
        icon={device.active ? <IoMdCheckmarkCircleOutline /> : <RxCross2 />}
      />
      <Chip color={device.active ? 'success' : 'danger'} variant="flat" size="sm">
        {device.active ? 'فعال' : 'غیرفعال'}
      </Chip>
    </div>
  ));
  DeviceStatusCell.displayName = 'DeviceStatusCell';

  const DevicePermissionsCell = memo(({ device }: { device: Device }) => (
    <div className="grid grid-cols-2 gap-2">
      <div title={device.readPermission ? 'خواندن مجاز' : 'خواندن غیرمجاز'}>{device.readPermission ? <IoEyeOutline color="green" size={20} /> : <IoEyeOffOutline color="red" size={20} />}</div>
      <div title={device.createPermission ? 'ایجاد مجاز' : 'ایجاد غیرمجاز'}>
        {device.createPermission ? <MdOutlinePersonAddAlt1 color="green" size={20} /> : <MdOutlinePersonAddDisabled color="red" size={20} />}
      </div>
      <div title={device.updatePermission ? 'ویرایش مجاز' : 'ویرایش غیرمجاز'}>{device.updatePermission ? <RxUpdate color="green" size={20} /> : <MdUpdateDisabled color="red" size={20} />}</div>
      <div title={device.deletePermission ? 'حذف مجاز' : 'حذف غیرمجاز'}>{device.deletePermission ? <TbTrash color="green" size={20} /> : <TbTrashOff color="red" size={20} />}</div>
    </div>
  ));
  DevicePermissionsCell.displayName = 'DevicePermissionsCell';

  const DeviceHashCell = memo(({ device, copyToClipboard }: DeviceHashCellProps) => (
    <Button variant="light" size="sm" onClick={() => copyToClipboard(device.deviceHash)} endContent={<IoCopyOutline color="teal" />}>
      <span className="font-mono text-teal-500">{device.deviceHash}</span>
    </Button>
  ));
  DeviceHashCell.displayName = 'DeviceHashCell';

  const DeviceActionsCell = memo(({ device, setFlag, flag, setDevices, networks }: DeviceActionsCellProps) => (
    <div className="flex justify-center gap-2">
      <Suspense fallback={<Skeleton className="h-10 w-28 rounded-xl" />}>
        <EditingDevice device={device} setFlag={setFlag} flag={flag} setData={setDevices} networks={networks} />
      </Suspense>
      <Suspense fallback={<Skeleton className="h-10 w-28 rounded-xl" />}>
        <DeleteDevice id={device.id} flag={flag} setFlag={setFlag} />
      </Suspense>
    </div>
  ));
  DeviceActionsCell.displayName = 'DeviceActionsCell';

  // Memoized table row component
  const DeviceTableRow = memo(({ device, loading, toggleDeviceStatus, copyToClipboard, setFlag, flag, setDevices, networks }: DeviceTableRowProps) => (
    <TableRow key={device.id} className="transition-colors light:hover:bg-neutral-500/50 dark:hover:bg-neutral-800/50">
      <TableCell className="text-center before:!rounded-l-none before:!rounded-r-lg">{device.id}</TableCell>
      <TableCell className="text-center">{device.deviceName}</TableCell>
      <TableCell title="کپی سریال" className="text-center">
        <DeviceHashCell device={device} copyToClipboard={copyToClipboard} />
      </TableCell>
      <TableCell className="text-center">{device.networks[0]?.name || 'N/A'}</TableCell>
      <TableCell className="text-center">
        <DeviceStatusCell device={device} loading={loading} toggleDeviceStatus={toggleDeviceStatus} />
      </TableCell>
      <TableCell className="text-center">
        <DevicePermissionsCell device={device} />
      </TableCell>
      <TableCell className="text-center">{device.deviceType}</TableCell>
      <TableCell className="text-center">{device.deviceLocation}</TableCell>
      <TableCell className="text-center">{device.devicePhoneNumber}</TableCell>
      <TableCell className="text-center">{device.deviceDescription}</TableCell>
      <TableCell className="text-center before:!rounded-l-lg before:!rounded-r-none">
        <DeviceActionsCell device={device} setFlag={setFlag} flag={flag} setDevices={setDevices} networks={networks} />
      </TableCell>
    </TableRow>
  ));
  DeviceTableRow.displayName = 'DeviceTableRow';

  return (
    <div dir="rtl" className="mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-2xl font-bold light:text-slate-900 dark:text-slate-100">مدیریت دستگاه‌ها</h1>
        <div className="flex items-center justify-center gap-2">
          <Suspense fallback={<Skeleton className="h-10 w-28 rounded-xl" />}>
            <AddingDevice setFlag={setFlag} flag={flag} setData={setDevices} />
          </Suspense>
          <Button color="secondary" variant="flat" startContent={<FiFilter />} onClick={() => setFiltersVisible(!filtersVisible)}>
            {filtersVisible ? 'بستن فیلترها' : 'نمایش فیلترها'}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {/* Search Filters */}
        {filtersVisible && (
          <motion.div layout initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="w-full">
            <section className="rounded-xl border bg-gradient-to-br p-6 shadow-xl light:border-slate-200 light:from-slate-100 light:to-slate-200 dark:border-slate-700 dark:from-slate-800 dark:to-slate-900">
              <div className="flex flex-col space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <Input
                    label="نام دستگاه"
                    value={searchParamsState.deviceName}
                    onChange={e => setSearchParamsState(prev => ({ ...prev, deviceName: e.target.value }))}
                    placeholder="جستجو بر اساس نام"
                    variant="bordered"
                    classNames={{
                      label: 'light:text-slate-300 dark:text-slate-600',
                      input: 'light:text-slate-900 dark:text-slate-100 placeholder:text-slate-400',
                      inputWrapper: 'light:bg-slate-100 dark:bg-slate-800/50 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
                    }}
                    startContent={
                      <div className="light:text-slate-400 dark:text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                          />
                        </svg>
                      </div>
                    }
                  />
                  <Input
                    label="سریال دستگاه"
                    value={searchParamsState.deviceHash}
                    onChange={e => setSearchParamsState(prev => ({ ...prev, deviceHash: e.target.value }))}
                    placeholder="جستجو بر اساس سریال"
                    variant="bordered"
                    classNames={{
                      label: 'light:text-slate-300 dark:text-slate-600',
                      input: 'light:text-slate-900 dark:text-slate-100 placeholder:text-slate-400',
                      inputWrapper: 'light:bg-slate-100 dark:bg-slate-800/50 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
                    }}
                    startContent={
                      <div className="light:text-slate-400 dark:text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
                          />
                        </svg>
                      </div>
                    }
                  />
                  <Input
                    label="شماره تماس"
                    value={searchParamsState.phoneNumber}
                    onChange={e => setSearchParamsState(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    placeholder="جستجو بر اساس شماره"
                    variant="bordered"
                    classNames={{
                      label: 'light:text-slate-300 dark:text-slate-600',
                      input: 'light:text-slate-900 dark:text-slate-100 placeholder:text-slate-400',
                      inputWrapper: 'light:bg-slate-100 dark:bg-slate-800/50 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
                    }}
                    startContent={
                      <div className="light:text-slate-400 dark:text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                          />
                        </svg>
                      </div>
                    }
                  />
                  <Input
                    label="موقعیت"
                    value={searchParamsState.location}
                    onChange={e => setSearchParamsState(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="جستجو بر اساس موقعیت"
                    variant="bordered"
                    classNames={{
                      label: 'light:text-slate-300 dark:text-slate-600',
                      input: 'light:text-slate-900 dark:text-slate-100 placeholder:text-slate-400',
                      inputWrapper: 'light:bg-slate-100 dark:bg-slate-800/50 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
                    }}
                    startContent={
                      <div className="light:text-slate-400 dark:text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                      </div>
                    }
                  />
                  <Input
                    label="نوع دستگاه"
                    value={searchParamsState.type}
                    onChange={e => setSearchParamsState(prev => ({ ...prev, type: e.target.value }))}
                    placeholder="جستجو بر اساس نوع"
                    variant="bordered"
                    classNames={{
                      label: 'light:text-slate-300 dark:text-slate-600',
                      input: 'light:text-slate-900 dark:text-slate-100 placeholder:text-slate-400',
                      inputWrapper: 'light:bg-slate-100 dark:bg-slate-800/50 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
                    }}
                    startContent={
                      <div className="light:text-slate-400 dark:text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Z"
                          />
                        </svg>
                      </div>
                    }
                  />
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
                      inputClass="w-full p-2 rounded-md light:bg-slate-100 dark:bg-slate-800/50 light:text-slate-900 dark:text-slate-100 placeholder:text-slate-400 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500"
                      placeholder="انتخاب بازه زمانی"
                      format="YYYY/MM/DD"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    className="px-8 font-medium light:bg-slate-700 light:text-white hover:light:bg-slate-600 dark:bg-slate-600 dark:text-slate-100 dark:hover:bg-slate-500"
                    onClick={handleClearSearch}
                    startContent={
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    }
                  >
                    پاک کردن
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-primary to-primary-500 px-8 font-medium text-white hover:bg-primary/80"
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
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Devices Table */}
      <Card className="shadow-xl">
        <CardBody className="p-0">
          <Table
            isStriped
            aria-label="Devices management table"
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
                <TableColumn key={column.key} className="text-center text-base first:rounded-l-none first:rounded-r-lg last:rounded-l-lg last:rounded-r-none">
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={devices} emptyContent={loading ? <Spinner color="primary" size="lg" /> : 'دستگاهی یافت نشد'} isLoading={loading}>
              {device => (
                <TableRow key={device.id}>
                  <TableCell className="text-center before:!rounded-l-none before:!rounded-r-lg">{device.id}</TableCell>
                  <TableCell className="text-center">{device.deviceName}</TableCell>
                  <TableCell title="کپی سریال" className="text-center">
                    <DeviceHashCell device={device} copyToClipboard={copyToClipboard} />
                  </TableCell>
                  <TableCell className="text-center">{device.networks[0]?.name || 'N/A'}</TableCell>
                  <TableCell className="text-center">
                    <DeviceStatusCell device={device} loading={loading} toggleDeviceStatus={toggleDeviceStatus} />
                  </TableCell>
                  <TableCell className="text-center">
                    <DevicePermissionsCell device={device} />
                  </TableCell>
                  <TableCell className="text-center">{device.deviceType}</TableCell>
                  <TableCell className="text-center">{device.deviceLocation}</TableCell>
                  <TableCell className="text-center">{device.devicePhoneNumber}</TableCell>
                  <TableCell className="text-center">{device.deviceDescription}</TableCell>
                  <TableCell className="text-center before:!rounded-l-lg before:!rounded-r-none">
                    <DeviceActionsCell device={device} setFlag={setFlag} flag={flag} setDevices={setDevices} networks={networks} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div dir="ltr" className="mt-4 flex justify-center">
          <Pagination
            total={pagination.totalPages}
            page={pagination.currentPage}
            onChange={page => {
              const params = new URLSearchParams(buildQueryParams());
              params.set('page', page.toString());
              navigate(`/payment-card/device-management?${params.toString()}`);
            }}
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

export const DeviceManagement = memo(deviceManagementComponent);
