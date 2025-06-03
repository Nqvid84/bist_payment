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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tooltip
} from '@nextui-org/react';
import { FiFilter, FiPlus } from 'react-icons/fi';
import { BiSolidEdit } from 'react-icons/bi';
import { IoIosArrowBack } from 'react-icons/io';

import type { IInstallmentLevel, InstallmentLevelResponse, PaginationData } from './types';

const installmentsLevelsComponent = () => {
  const [flag, setFlag] = useState(false);
  const [installmentLevels, setInstallmentLevels] = useState<IInstallmentLevel[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 1,
    itemsPerPage: 10
  });
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedInstallmentLevel, setSelectedInstallmentLevel] = useState<IInstallmentLevel | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    maxInstallment: 0,
    description: ''
  });

  // React Router hooks
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query params from URL
  const getQueryParams = () => {
    const params = new URLSearchParams(location.search);
    return {
      name: params.get('name') || '',
      page: parseInt(params.get('page') || '1', 10)
    };
  };

  // Search/filter state
  const [searchParamsState, setSearchParamsState] = useState({
    name: ''
  });

  // Build query params for API
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (searchParamsState.name) params.append('name', searchParamsState.name);
    params.append('page', pagination.currentPage.toString());
    return params.toString();
  };

  // Fetch data
  const fetchInstallmentLevels = async () => {
    setLoading(true);
    try {
      const queryParams = buildQueryParams();
      const response = await axios.get<InstallmentLevelResponse>(`/microservice/v1/payment/server/credit-level/list?${queryParams}`);
      if (response.data?.data) {
        setInstallmentLevels(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در دریافت اطلاعات رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = () => {
    navigate(`?name=${searchParamsState.name}&page=1`);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchParamsState({ name: '' });
    navigate(`?page=1`);
  };

  // Add
  const handleAddInstallmentLevel = async () => {
    try {
      const response = await axios.post('/microservice/v1/payment/server/credit-level/create', formData);
      toast.success(response.data.success || 'سطح اقساط با موفقیت ایجاد شد');
      setIsAddModalOpen(false);
      setFormData({ name: '', maxInstallment: 0, description: '' });
      setFlag(f => !f);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در ایجاد سطح اقساط رخ داده است');
    }
  };

  // Edit
  const handleEditInstallmentLevel = async () => {
    if (!selectedInstallmentLevel) return;
    try {
      const response = await axios.put(`/microservice/v1/payment/server/credit-level/update`, {
        id: selectedInstallmentLevel.id,
        ...formData
      });
      toast.success(response.data.success || 'سطح اقساط با موفقیت بروزرسانی شد');
      setIsEditModalOpen(false);
      setSelectedInstallmentLevel(null);
      setFormData({ name: '', maxInstallment: 0, description: '' });
      setFlag(f => !f);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در بروزرسانی سطح اقساط رخ داده است');
    }
  };

  // Delete
  const handleDeleteInstallmentLevel = async () => {
    if (!selectedInstallmentLevel) return;
    try {
      const response = await axios.delete('/microservice/v1/payment/server/credit-level/delete', {
        data: { id: selectedInstallmentLevel.id }
      });
      toast.success(response.data.success || 'سطح اقساط با موفقیت حذف شد');
      setIsDeleteModalOpen(false);
      setSelectedInstallmentLevel(null);
      setFlag(f => !f);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در حذف سطح اقساط رخ داده است');
    }
  };

  // Modal openers
  const openEditModal = (installmentLevel: IInstallmentLevel) => {
    setSelectedInstallmentLevel(installmentLevel);
    setFormData({
      name: installmentLevel.name,
      maxInstallment: installmentLevel.maxInstallment,
      description: installmentLevel.description
    });
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (installmentLevel: IInstallmentLevel) => {
    setSelectedInstallmentLevel(installmentLevel);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setFormData({ name: '', maxInstallment: 0, description: '' });
    setIsAddModalOpen(true);
  };

  // Sync state with URL params and fetch data
  useEffect(() => {
    const params = getQueryParams();
    setSearchParamsState({ name: params.name });
    setPagination(prev => ({ ...prev, currentPage: params.page }));
    fetchInstallmentLevels();
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
    { key: 'name', label: 'نام' },
    { key: 'description', label: 'توضیحات' },
    { key: 'maxInstallment', label: 'حداکثر مبلغ اقساط' },
    { key: 'createdAt', label: 'تاریخ ایجاد' },
    { key: 'updatedAt', label: 'تاریخ بروزرسانی' },
    { key: 'actions', label: 'عملیات' }
  ];

  return (
    <div dir="rtl" className="mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
        <h1 className="text-2xl font-bold light:text-slate-900 dark:text-slate-100">سطوح اقساط</h1>
        <div className="flex items-center justify-center gap-2">
          <Button color="primary" variant="flat" startContent={<FiPlus />} onClick={openAddModal}>
            افزودن سطح اقساط
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
                  <Input
                    label="نام"
                    value={searchParamsState.name}
                    onChange={e => setSearchParamsState(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="جستجو بر اساس نام"
                    variant="bordered"
                    classNames={{
                      label: 'light:text-slate-300 dark:text-slate-600',
                      input: 'light:text-slate-900 dark:text-slate-100',
                      inputWrapper: 'light:bg-slate-100 dark:bg-slate-800/50 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
                    }}
                  />
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

      {/* Installment Levels Table */}
      <Card className="shadow-xl">
        <CardBody className="p-0">
          <Table
            isStriped
            aria-label="Installment levels management table"
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

            <TableBody items={installmentLevels} emptyContent={loading ? <Spinner color="primary" size="lg" /> : 'سطح اقساطی یافت نشد'} isLoading={loading}>
              {installmentLevel => (
                <TableRow key={installmentLevel.id} className="transition-colors light:hover:bg-neutral-500/50 dark:hover:bg-neutral-800/50">
                  <TableCell className="text-center before:!rounded-l-none before:!rounded-r-lg">{installmentLevel.id}</TableCell>
                  <TableCell className="text-center">{installmentLevel.name}</TableCell>
                  <TableCell className="text-center">{installmentLevel.description}</TableCell>
                  <TableCell className="text-center">{installmentLevel.maxInstallment.toLocaleString('fa-IR')}ریال</TableCell>
                  <TableCell className="text-center">{new Date(installmentLevel.createdAt).toLocaleDateString('fa-IR')}</TableCell>
                  <TableCell className="text-center">{new Date(installmentLevel.updatedAt).toLocaleDateString('fa-IR')}</TableCell>
                  <TableCell className="text-center before:!rounded-l-lg before:!rounded-r-none">
                    <div className="flex justify-center gap-2">
                      <Tooltip content="ویرایش" radius="sm" delay={1000}>
                        <Button isIconOnly color="primary" variant="light" onClick={() => openEditModal(installmentLevel)}>
                          <BiSolidEdit size={20} />
                        </Button>
                      </Tooltip>
                      <Button isIconOnly color="danger" variant="light" onClick={() => openDeleteModal(installmentLevel)}>
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
      {pagination.totalPages > 1 && (
        <div dir="ltr" className="mt-4 flex justify-center">
          <Pagination
            total={pagination.totalPages}
            page={pagination.currentPage}
            onChange={page => {
              const params = new URLSearchParams(location.search);
              params.set('page', page.toString());
              if (searchParamsState.name) params.set('name', searchParamsState.name);
              navigate(`?${params.toString()}`);
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

      {/* Add Modal */}
      <Modal dir="rtl" hideCloseButton isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <ModalContent>
          <ModalHeader>افزودن سطح اقساط جدید</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input label="نام" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="نام سطح اقساط" variant="bordered" isRequired />
              <Input
                type="number"
                label="حداکثر مبلغ اقساط"
                value={formData.maxInstallment.toString()}
                onChange={e => setFormData(prev => ({ ...prev, maxInstallment: parseInt(e.target.value) }))}
                placeholder="حداکثر مبلغ اقساط"
                variant="bordered"
                description={
                  formData.maxInstallment > 0 && (
                    <span dir="rtl" className="text-sm text-gray-500">
                      {formData.maxInstallment.toLocaleString('fa-IR')} ریال
                    </span>
                  )
                }
                isRequired
              />
              <Input label="توضیحات" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="توضیحات سطح اقساط" variant="bordered" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsAddModalOpen(false)}>
              انصراف
            </Button>
            <Button color="primary" onPress={handleAddInstallmentLevel}>
              افزودن
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Modal */}
      <Modal dir="rtl" hideCloseButton isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <ModalContent>
          <ModalHeader>ویرایش سطح اقساط</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-4">
              <Input label="نام" value={formData.name} onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))} placeholder="نام سطح اقساط" variant="bordered" isRequired />
              <Input
                type="number"
                label="حداکثر مبلغ اقساط"
                value={formData.maxInstallment.toString()}
                onChange={e => setFormData(prev => ({ ...prev, maxInstallment: parseInt(e.target.value) }))}
                placeholder="حداکثر مبلغ اقساط"
                variant="bordered"
                description={
                  formData.maxInstallment > 0 && (
                    <span dir="rtl" className="text-sm text-gray-500">
                      {formData.maxInstallment.toLocaleString('fa-IR')} ریال
                    </span>
                  )
                }
                isRequired
              />
              <Input label="توضیحات" value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))} placeholder="توضیحات سطح اقساط" variant="bordered" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsEditModalOpen(false)}>
              انصراف
            </Button>
            <Button color="primary" onPress={handleEditInstallmentLevel}>
              بروزرسانی
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal dir="rtl" hideCloseButton isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <ModalContent>
          <ModalHeader>حذف سطح اقساط</ModalHeader>
          <ModalBody dir="rtl">
            <p>آیا از حذف این سطح اقساط اطمینان دارید؟</p>
            {selectedInstallmentLevel && (
              <div className="mt-4">
                <p>
                  <strong>نام:</strong> {selectedInstallmentLevel.name}
                </p>
                <p>
                  <strong>توضیحات:</strong> {selectedInstallmentLevel.description}
                </p>
                <p>
                  <strong>حداکثر مبلغ اقساط:</strong> {selectedInstallmentLevel.maxInstallment.toLocaleString('fa-IR')}
                </p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" variant="light" onPress={() => setIsDeleteModalOpen(false)}>
              انصراف
            </Button>
            <Button color="danger" onPress={handleDeleteInstallmentLevel}>
              حذف
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export const LevelInstallments = memo(installmentsLevelsComponent);