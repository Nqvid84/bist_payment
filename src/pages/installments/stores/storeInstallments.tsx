import { Button, Input, Select, SelectItem, Spinner } from '@nextui-org/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useState } from 'react';
import { toast } from 'sonner';
import type { StoreInstallments } from './types';
import StoreInstallmentsTable from './storeInstallmentsTable';
import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

const storeInstallmentsComponent = () => {
  // Get the current year and month in Persian calendar
  const currentYear = Number(new Date().toLocaleDateString('fa-IR-u-nu-latn', { year: 'numeric' }));
  const currentMonth = Number(new Date().toLocaleDateString('fa-IR-u-nu-latn', { month: 'numeric' }));

  // Set the default values for the month and year
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);

  const [installments, setInstallments] = useState<StoreInstallments[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (month && year?.toString().length === 4) {
      setIsLoading(true);

      axios
        .post<StoreInstallments[]>('/microservice/v1/payment/server/installment/monthly', {
          month,
          year
        })
        .then(res => {
          setInstallments(res.data);
        })
        .catch(err => {
          toast.error(err.response?.data?.message || 'خطایی رخ داده است');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [month, year]);

  return (
    <main dir="rtl" className="mx-auto space-y-6 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">اقساط فروشگاه</h1>

        <Button
          as={Link}
          to="/payment-card/installments"
          variant="light"
          color="primary"
          radius="lg"
          size="md"
          endContent={<IoIosArrowBack size={20} />}
        >
          برگشت
        </Button>
      </header>

      {/* Select month and date is mandatory */}
      <div className="flex flex-col items-center gap-4 md:flex-row">
        <Select
          label="ماه شمسی"
          radius="sm"
          className="w-full md:w-1/4"
          classNames={{ mainWrapper: 'h-14', innerWrapper: '*:!text-right', selectorIcon: 'right-auto !left-3' }}
          value={month.toString()}
          selectedKeys={[month.toString()]}
          onChange={e => setMonth(Number(e.target.value))}
        >
          <SelectItem aria-label="فروردین" key="1">فروردین</SelectItem>
          <SelectItem aria-label="اردیبهشت" key="2">اردیبهشت</SelectItem>
          <SelectItem aria-label="خرداد" key="3">خرداد</SelectItem>
          <SelectItem aria-label="تیر" key="4">تیر</SelectItem>
          <SelectItem aria-label="مرداد" key="5">مرداد</SelectItem>
          <SelectItem aria-label="شهریور" key="6">شهریور</SelectItem>
          <SelectItem aria-label="مهر" key="7">مهر</SelectItem>
          <SelectItem aria-label="آبان" key="8">آبان</SelectItem>
          <SelectItem aria-label="آذر" key="9">آذر</SelectItem>
          <SelectItem aria-label="دی" key="10">دی</SelectItem>
          <SelectItem aria-label="بهمن" key="11">بهمن</SelectItem>
          <SelectItem aria-label="اسفند" key="12">اسفند</SelectItem>
        </Select>

        <Input
          classNames={{ inputWrapper: 'h-14' }}
          className="w-full md:w-1/4"
          radius="sm"
          type="number"
          label="سال شمسی"
          value={String(year)}
          onChange={e => setYear(Number(e.target.value))}
        />

        {/* Message for user if month or year is not selected */}
        <AnimatePresence>
          {!month || year?.toString().length !== 4 ? (
            <motion.p
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ delay: 0.5 }}
              className="px-4 text-sm text-gray-600 dark:text-gray-400"
            >
              برای دریافت اطلاعات، لطفاً ماه و سال را وارد کنید.
            </motion.p>
          ) : null}
        </AnimatePresence>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center">
          <Spinner size="lg" color="primary" />
        </div>
      ) : (
        <StoreInstallmentsTable installments={installments} />
      )}
    </main>
  );
};

export const InstallmentStore = memo(storeInstallmentsComponent);