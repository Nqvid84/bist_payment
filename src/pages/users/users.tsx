import { Checkbox, Pagination, Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useCheckbox } from '@nextui-org/react';
import { BsPersonFillLock } from 'react-icons/bs';
import { BsPersonFillCheck } from 'react-icons/bs';
import { useEffect, useState, useCallback, memo } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { RxCross2 } from 'react-icons/rx';
import { useNavigate } from 'react-router-dom';
import AddingAccessibilities from '../../components/users/AddAccessibilities';
import DeleteUser from '../../components/users/DeletedUser';
import EditingAccessibilities from '../../components/users/EditUsers';
import AddNetworkAccesses from '../../components/users/AddNetworkAccesses';

const usersPageComponent = () => {
  const [data, setData] = useState([]);
  const [flag, setFlag] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(1);
  const [isReallyEmpty, setIsReallyEmpty] = useState(false);

  const navigate = useNavigate();
  const { isSelected } = useCheckbox();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReallyEmpty(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/microservice/v1/payment/server/admin/list?page=${page}`);
      setData(response.data.data);
      setTotal(response.data.pagination.totalPages);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطا در دریافت ادمین ها');
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData, flag]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage);
      navigate(`/payment-card/users?page=${newPage || 1}`);
    }, []);

  const handleUserStatusChange = useCallback(async (user: any, newStatus: boolean) => {
    try {
      setIsLoading(true);
      toast.loading('Loading...');

      const endpoint = newStatus ? 'unblock' : 'block';
      const response = await axios.post(`/microservice/v1/payment/server/admin/${endpoint}`, {
        adminId: user.id
      });

      toast.dismiss();
      toast.success(response.data.success);
      setFlag(prev => !prev);
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.error || 'خطا در تغییر وضعیت کاربر');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <main dir="rtl" className="p-1 sm:p-1.5 md:p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold light:text-slate-900 dark:text-slate-100">ادمین ها</h1>
        <AddingAccessibilities setData={setData} />
      </header>

      <section className="mt-4">
        <Table
          dir="ltr"
          aria-label="admins table"
          color="primary"
          isHeaderSticky
          classNames={{
            wrapper: 'max-h-[70vh] light:bg-neutral-800 dark:bg-neutral-900',
            th: 'light:bg-neutral-700 light:text-white py-3',
            td: 'py-3 light:text-white'
          }}
        >
          <TableHeader>
            <TableColumn className="text-center text-base">اعمال ها</TableColumn>
            <TableColumn className="text-center text-base">افزودن شبکه ها</TableColumn>
            <TableColumn className="text-center text-base">وضعیت</TableColumn>
            <TableColumn className="text-center text-base">فعال / غیرفعال</TableColumn>
            <TableColumn className="text-center text-base">شماره تماس</TableColumn>
            <TableColumn className="text-center text-base">نام کابری</TableColumn>
            <TableColumn className="text-center text-base">ردیف</TableColumn>
          </TableHeader>
          <TableBody emptyContent={!isReallyEmpty ? <Spinner color="primary" /> : 'چطوری ادمین نداریم ؟!'} isLoading={isLoading}>
            {data?.map((user: any, index: number) => (
              <TableRow key={user.id} className="transition-colors light:hover:bg-neutral-500/50 dark:hover:bg-neutral-800/50">
                <TableCell className="flex items-center justify-center gap-x-1 md:gap-x-4">
                  <DeleteUser flag={flag} id={user.id} setFlag={setFlag} />
                  <EditingAccessibilities data={user} setData={setData} />
                </TableCell>
                <TableCell className="text-center">
                  <AddNetworkAccesses adminId={user.id} />
                </TableCell>
                <TableCell className="text-center">
                  {user.active ? <BsPersonFillCheck className="mx-auto" color="lime" size={25} /> : <BsPersonFillLock className="mx-auto" color="red" size={25} />}
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox
                    aria-disabled={isLoading}
                    isDisabled={isLoading}
                    isSelected={user.active}
                    onValueChange={() => handleUserStatusChange(user, !user.active)}
                    size="lg"
                    classNames={{
                      wrapper: `${isSelected ? 'bg-success-700' : 'bg-danger-600'}`,
                      icon: 'sm:scale-125 md:scale-150'
                    }}
                    color="success"
                    icon={!isSelected ? <IoMdCheckmarkCircleOutline color="white" /> : <RxCross2 color="red" />}
                  />
                </TableCell>
                <TableCell className="text-center font-mono tracking-wider light:text-teal-600 dark:text-teal-400 md:text-lg">{user.phone}</TableCell>
                <TableCell className="text-center">{user.username}</TableCell>
                <TableCell className="text-center font-mono">{index + 1}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {total > 1 && (
          <div dir="ltr" className="mt-2 flex w-full justify-center">
            <Pagination
              radius="sm"
              dir="ltr"
              classNames={{
                cursor: 'light:bg-primary dark:bg-slate-800',
                item: 'light:bg-slate-700 light:text-white hover:light:bg-primary/80 dark:bg-neutral-900 dark:text-white dark:hover:bg-slate-800'
              }}
              isCompact
              showShadow
              total={total}
              page={page}
              onChange={handlePageChange}
            />
          </div>
        )}
      </section>
    </main>
  );
};

export const Users = memo(usersPageComponent);
