import { memo, useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { TbTrash } from 'react-icons/tb';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Spinner,
  Pagination,
  Button,
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip
} from '@nextui-org/react';
import { FiFilter, FiPlus } from 'react-icons/fi';
import DatePicker from 'react-multi-date-picker';
import 'react-multi-date-picker/styles/layouts/mobile.css';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { BiSolidEdit } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';

import type { Installment, Network, InstallmentsResponse, NetworksResponse, CreateInstallmentRequest, UpdateInstallmentRequest, ApiResponse } from './types';

const manageInstallmentsComponent = () => {
  const [flag, setFlag] = useState(false);
  const [installments, setInstallments] = useState<Installment[]>([]);
  const [networks, setNetworks] = useState<Network[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInstallment, setSelectedInstallment] = useState<Installment | null>(null);
  const [formData, setFormData] = useState<CreateInstallmentRequest>({
    storeId: 0,
    externalNetworkId: 0,
    installmentCount: 1,
    gracePeriodCount: 1
  });

  // React Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Search states
  const [searchParamsState, setSearchParamsState] = useState({
    storeId: '',
    externalNetworkId: '',
    dateFrom: '',
    dateTo: ''
  });

  // Parse query params from URL
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      storeId: params.get('storeId') || '',
      externalNetworkId: params.get('externalNetworkId') || '',
      dateFrom: params.get('dateFrom') || '',
      dateTo: params.get('dateTo') || '',
      page: parseInt(params.get('page') || '1', 10)
    };
  };

  const buildQueryParams = () => {
    const params = new URLSearchParams();
    Object.entries(searchParamsState).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    params.append('page', pagination.page.toString());
    return params.toString();
  };

  const fetchInstallments = async () => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams();
      const response = await axios.get<InstallmentsResponse>(`/microservice/v1/payment/server/installment/list?${queryParams}`);
      if (response.data?.installments) {
        setInstallments(response.data.installments);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در دریافت اطلاعات رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  const fetchNetworks = async () => {
    try {
      const response = await axios.get<NetworksResponse>('/microservice/v1/payment/server/network/list');
      if (response.data?.networks) {
        setNetworks(response.data.networks);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در دریافت اطلاعات شبکه‌ها رخ داده است');
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    Object.entries(searchParamsState).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', '1');
    navigate(`/payment-card/installments/management?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchParamsState({
      storeId: '',
      externalNetworkId: '',
      dateFrom: '',
      dateTo: ''
    });
    navigate('/payment-card/installments/management');
  };

  const handleAddInstallment = async () => {
    try {
      const response = await axios.post<ApiResponse>('/microservice/v1/payment/server/installment/create', formData);
      toast.success(response.data.success || 'اقساط با موفقیت ایجاد شد');
      setIsAddModalOpen(false);
      setFormData({
        storeId: 0,
        externalNetworkId: 0,
        installmentCount: 1,
        gracePeriodCount: 1
      });
      setFlag(f => !f);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در ایجاد اقساط رخ داده است');
    }
  };

  const handleEditInstallment = async () => {
    if (!selectedInstallment) return;
    try {
      const updateData: UpdateInstallmentRequest = {
        installmentCount: formData.installmentCount,
        gracePeriodCount: formData.gracePeriodCount
      };
      const response = await axios.put<ApiResponse>(`/microservice/v1/payment/server/installment/update/${selectedInstallment.id}`, updateData);
      toast.success(response.data.success || 'اقساط با موفقیت بروزرسانی شد');
      setIsEditModalOpen(false);
      setSelectedInstallment(null);
      setFormData({
        storeId: 0,
        externalNetworkId: 0,
        installmentCount: 1,
        gracePeriodCount: 1
      });
      setFlag(f => !f);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در بروزرسانی اقساط رخ داده است');
    }
  };

  const handleDeleteInstallment = async () => {
    if (!selectedInstallment) return;
    try {
      const response = await axios.delete<ApiResponse>(`/microservice/v1/payment/server/installment/delete/${selectedInstallment.id}`);
      toast.success(response.data.success || 'اقساط با موفقیت حذف شد');
      setIsDeleteModalOpen(false);
      setSelectedInstallment(null);
      setFlag(f => !f);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در حذف اقساط رخ داده است');
    }
  };

  const openEditModal = (installment: Installment) => {
    setSelectedInstallment(installment);
    setFormData({
      storeId: installment.storeId,
      externalNetworkId: installment.externalNetworkId,
      installmentCount: installment.installmentCount,
      gracePeriodCount: installment.gracePeriodCount
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (installment: Installment) => {
    setSelectedInstallment(installment);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({
      storeId: 0,
      externalNetworkId: 0,
      installmentCount: 1,
      gracePeriodCount: 1
    });
    setIsAddModalOpen(true);
  };

  // Sync state with URL params and fetch data
  useEffect(() => {
    const params = getQueryParams();
    setSearchParamsState({
      storeId: params.storeId,
      externalNetworkId: params.externalNetworkId,
      dateFrom: params.dateFrom,
      dateTo: params.dateTo
    });
    fetchNetworks();
    fetchInstallments();
    // eslint-disable-next-line
  }, [location.search, flag]);

  // Search on Enter press
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') handleSearch();
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
    // eslint-disable-next-line
  }, [searchParamsState]);

  const columns = [
    { key: 'id', label: 'شناسه' },
    { key: 'store', label: 'فروشگاه' },
    { key: 'externalNetwork', label: 'شبکه خارجی' },
    { key: 'installmentCount', label: 'تعداد اقساط' },
    { key: 'gracePeriodCount', label: 'تعداد ماه تنفس' },
    { key: 'createdAt', label: 'تاریخ ایجاد' },
    { key: 'updatedAt', label: 'تاریخ بروزرسانی' },
    { key: 'actions', label: 'عملیات' }
  ];

  const storeNetworks = networks.filter(network => network.type === 'internal' && network.subType === 'store');
  const externalNetworks = networks.filter(network => network.type === 'external');

  const renderSelectItems = (items: Network[]) => {
    return items.map(network => (
      <SelectItem textValue={network.name} dir="rtl" key={network.id} value={network.id.toString()}>
        <span className="text-sm">{network.name}</span>
      </SelectItem>
    ));
  };

  return (
    <div dir="rtl" className="mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-2xl font-bold light:text-slate-900 dark:text-slate-100">تنظیمات اقساط</h1>
        <div className="flex items-center justify-center gap-2">
          <Button color="primary" variant="flat" startContent={<FiPlus />} onClick={openAddModal}>
            افزودن اقساط
          </Button>
          <Button color="secondary" variant="flat" startContent={<FiFilter />} onClick={() => setFiltersVisible(f => !f)}>
            {filtersVisible ? 'بستن فیلترها' : 'نمایش فیلترها'}
          </Button>
          <Button as={Link} to="/payment-card/installments" variant="light" color="primary" radius="lg" size="md" endContent={<IoIosArrowBack size={20} />}>
            برگشت
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
                  <Select
                    dir="rtl"
                    label="فروشگاه"
                    value={searchParamsState.storeId}
                    onChange={e => setSearchParamsState(prev => ({ ...prev, storeId: e.target.value }))}
                    placeholder="انتخاب فروشگاه"
                    variant="bordered"
                    classNames={{
                      listbox: 'text-right',
                      label: 'light:text-slate-300 dark:text-slate-600',
                      value: 'light:text-slate-900 dark:text-slate-100',
                      trigger: 'light:bg-slate-100 dark:bg-slate-800/50 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
                    }}
                    selectedKeys={searchParamsState.storeId ? [searchParamsState.storeId] : []}
                  >
                    {renderSelectItems(storeNetworks)}
                  </Select>

                  <Select
                    dir="rtl"
                    label="شبکه خارجی"
                    value={searchParamsState.externalNetworkId}
                    onChange={e => setSearchParamsState(prev => ({ ...prev, externalNetworkId: e.target.value }))}
                    placeholder="انتخاب شبکه خارجی"
                    variant="bordered"
                    classNames={{
                      listbox: 'text-right',
                      label: 'light:text-slate-300 dark:text-slate-600',
                      value: 'light:text-slate-900 dark:text-slate-100',
                      trigger: 'light:bg-slate-100 dark:bg-slate-800/50 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
                    }}
                    selectedKeys={searchParamsState.externalNetworkId ? [searchParamsState.externalNetworkId] : []}
                  >
                    {renderSelectItems(externalNetworks)}
                  </Select>

                  <div className="flex flex-col space-y-1">
                    <label className="text-sm light:text-slate-600 dark:text-slate-300">بازه زمانی</label>
                    <DatePicker
                      range
                      value={[
                        searchParamsState.dateFrom ? new Date(searchParamsState.dateFrom) : null,
                        searchParamsState.dateTo ? new Date(searchParamsState.dateTo) : null
                      ]}
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
                  >
                    پاک کردن
                  </Button>
                  <Button
                    className="bg-gradient-to-r from-primary to-primary-500 px-8 font-medium text-white hover:bg-primary/80"
                    onClick={handleSearch}
                    isLoading={loading}
                  >
                    جستجو
                  </Button>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Installments Table */}
      <Card className="shadow-xl">
        <CardBody className="p-0">
          <Table
            aria-label="Installments management table"
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

            <TableBody items={installments} emptyContent={loading ? <Spinner color="primary" size="lg" /> : 'اقساطی یافت نشد'} isLoading={loading}>
              {installment => (
                <TableRow key={installment.id} className="transition-colors light:hover:bg-neutral-500/50 dark:hover:bg-neutral-800/50">
                  <TableCell className="text-center before:!rounded-l-none before:!rounded-r-lg">{installment.id}</TableCell>
                  <TableCell className="text-center">{installment.StoreNetwork?.name || 'N/A'}</TableCell>
                  <TableCell className="text-center">{installment.ExternalNetwork?.name || 'N/A'}</TableCell>
                  <TableCell className="text-center">{installment.installmentCount.toLocaleString('fa-IR')}</TableCell>
                  <TableCell className="text-center">{installment.gracePeriodCount.toLocaleString('fa-IR')}</TableCell>
                  <TableCell className="text-center">{new Date(installment.createdAt).toLocaleDateString('fa-IR')}</TableCell>
                  <TableCell className="text-center">{new Date(installment.updatedAt).toLocaleDateString('fa-IR')}</TableCell>
                  <TableCell className="text-center before:!rounded-l-lg before:!rounded-r-none">
                    <div className="flex justify-center gap-2">
                      <Tooltip content="ویرایش" radius="sm" delay={1000}>
                        <Button isIconOnly color="primary" variant="light" onClick={() => openEditModal(installment)}>
                          <BiSolidEdit size={20} />
                        </Button>
                      </Tooltip>
                      <Button isIconOnly color="danger" variant="light" onClick={() => openDeleteModal(installment)}>
                        <TbTrash size={20} />
                      </Button>
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
            onChange={page => {
              const params = new URLSearchParams(buildQueryParams());
              params.set('page', page.toString());
              navigate(`/payment-card/installments/management?${params.toString()}`);
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

      {/* Add Installment Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <ModalContent>
          <ModalHeader>افزودن اقساط جدید</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Select
                label="فروشگاه"
                value={formData.storeId.toString()}
                onChange={e => setFormData(prev => ({ ...prev, storeId: parseInt(e.target.value) }))}
                placeholder="انتخاب فروشگاه"
                variant="bordered"
                classNames={{ listboxWrapper: 'text-right' }}
                isRequired
              >
                {storeNetworks.map(network => (
                  <SelectItem key={network.id.toString()} value={network.id.toString()}>
                    {network.name}
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="شبکه خارجی"
                value={formData.externalNetworkId.toString()}
                onChange={e => setFormData(prev => ({ ...prev, externalNetworkId: parseInt(e.target.value) }))}
                placeholder="انتخاب شبکه خارجی"
                variant="bordered"
                classNames={{ listboxWrapper: 'text-right' }}
                isRequired
              >
                {externalNetworks.map(network => (
                  <SelectItem dir="rtl" key={network.id.toString()} value={network.id.toString()}>
                    {network.name}
                  </SelectItem>
                ))}
              </Select>

              <Input
                type="number"
                label="تعداد اقساط"
                value={formData.installmentCount.toString()}
                onChange={e => setFormData(prev => ({ ...prev, installmentCount: parseInt(e.target.value) }))}
                placeholder="تعداد اقساط"
                variant="bordered"
                min={1}
                isRequired
              />

              <Input
                type="number"
                label="تعداد ماه تنفس"
                value={formData.gracePeriodCount.toString()}
                onChange={e => setFormData(prev => ({ ...prev, gracePeriodCount: parseInt(e.target.value) }))}
                placeholder="تعداد ماه تنفس"
                variant="bordered"
                min={1}
                isRequired
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsAddModalOpen(false)}>
              انصراف
            </Button>
            <Button color="primary" onPress={handleAddInstallment}>
              افزودن
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Installment Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalContent>
          <ModalHeader>ویرایش اقساط</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input
                type="number"
                label="تعداد اقساط"
                value={formData.installmentCount.toString()}
                onChange={e => setFormData(prev => ({ ...prev, installmentCount: parseInt(e.target.value) }))}
                placeholder="تعداد اقساط"
                variant="bordered"
                min={1}
                isRequired
              />

              <Input
                type="number"
                label="تعداد ماه تنفس"
                value={formData.gracePeriodCount.toString()}
                onChange={e => setFormData(prev => ({ ...prev, gracePeriodCount: parseInt(e.target.value) }))}
                placeholder="تعداد ماه تنفس"
                variant="bordered"
                min={1}
                isRequired
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsEditModalOpen(false)}>
              انصراف
            </Button>
            <Button color="primary" onPress={handleEditInstallment}>
              بروزرسانی
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Installment Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalContent>
          <ModalHeader>حذف اقساط</ModalHeader>
          <ModalBody dir="rtl">
            <p>آیا از حذف این اقساط اطمینان دارید؟</p>
            {selectedInstallment && (
              <div className="mt-4">
                <p>
                  <strong>فروشگاه:</strong> {selectedInstallment.StoreNetwork?.name}
                </p>
                <p>
                  <strong>شبکه خارجی:</strong> {selectedInstallment.ExternalNetwork?.name}
                </p>
                <p>
                  <strong>تعداد اقساط:</strong> {selectedInstallment.installmentCount.toLocaleString('fa-IR')}
                </p>
                <p>
                  <strong>تعداد ماه تنفس:</strong> {selectedInstallment.gracePeriodCount.toLocaleString('fa-IR')}
                </p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="light" onPress={() => setIsDeleteModalOpen(false)}>
              انصراف
            </Button>
            <Button color="danger" onPress={handleDeleteInstallment}>
              حذف
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export const InstallmentManage = memo(manageInstallmentsComponent);