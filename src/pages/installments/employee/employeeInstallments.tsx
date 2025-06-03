'use client';

import { Button, Input, Select, SelectItem, Spinner } from '@nextui-org/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { memo, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useReactToPrint } from 'react-to-print';
import { IoPrintOutline } from 'react-icons/io5';
import type { IEmployeeInstallments } from './types';
import * as XLSX from 'xlsx';
import EmployeeInstallmentsTable from './employeeInstallmentsTable';
import { PiMicrosoftExcelLogoFill } from 'react-icons/pi';
import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';

const employeeInstallmentsPageComponent = () => {
  // Get the current year and month in Persian calendar
  const currentYear = Number(new Date().toLocaleDateString('fa-IR-u-nu-latn', { year: 'numeric' }));
  const currentMonth = Number(new Date().toLocaleDateString('fa-IR-u-nu-latn', { month: 'numeric' }));

  // Set the default values for the month and year
  const [month, setMonth] = useState<number>(currentMonth);
  const [year, setYear] = useState<number>(currentYear);

  const [installments, setInstallments] = useState<IEmployeeInstallments[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const printFunction = useReactToPrint({ contentRef });

  useEffect(() => {
    if (month && year?.toString().length === 4) {
      setIsLoading(true);

      axios
        .post<IEmployeeInstallments[]>('/microservice/v1/payment/server/installment/monthly/employees', {
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

  const exportToExcel = () => {
    const currentTime = new Date().toLocaleString('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });

    const formattedInstallments = installments.map(installment => ({
      ...installment,
      installment: parseFloat(installment.installment)
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedInstallments);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.sheet_add_aoa(worksheet, [['شناسه مشتری', 'نام کامل', 'ماه پرداخت', '(ریال) مبلغ اقساط']], { origin: 'A1' });

    // Set column widths
    const wscols = [
      { wch: 10 }, // شناسه مشتری
      { wch: 30 }, // نام کامل
      { wch: 15 }, // ماه پرداخت
      { wch: 25 } // مبلغ اقساط
    ];
    worksheet['!cols'] = wscols;

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Installments');
    XLSX.writeFile(workbook, `اقساط_کارمندان_${currentTime}.xlsx`);
  };

  return (
    <main dir="rtl" className="mx-auto space-y-6 p-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">اقساط کارمندان</h1>
        <Button as={Link} to="/payment-card/installments" variant="light" color="primary" radius="lg" size="md" endContent={<IoIosArrowBack size={20} />}>
          برگشت
        </Button>
      </header>

      {/* Select month and date is mandatory */}
      <div className="flex flex-col items-center gap-4 md:mx-2 md:flex-row">
        <Select
          label="ماه شمسی"
          radius="sm"
          className="w-full md:w-1/4"
          classNames={{ mainWrapper: 'h-14', innerWrapper: '*:!text-right', selectorIcon: 'right-auto !left-3' }}
          value={month}
          defaultSelectedKeys={[month.toString()]}
          onChange={e => setMonth(Number(e.target.value))}
        >
          <SelectItem aria-label="فروردین" key="1">
            فروردین
          </SelectItem>
          <SelectItem aria-label="اردیبهشت" key="2">
            اردیبهشت
          </SelectItem>
          <SelectItem aria-label="خرداد" key="3">
            خرداد
          </SelectItem>
          <SelectItem aria-label="تیر" key="4">
            تیر
          </SelectItem>
          <SelectItem aria-label="مرداد" key="5">
            مرداد
          </SelectItem>
          <SelectItem aria-label="شهریور" key="6">
            شهریور
          </SelectItem>
          <SelectItem aria-label="مهر" key="7">
            مهر
          </SelectItem>
          <SelectItem aria-label="آبان" key="8">
            آبان
          </SelectItem>
          <SelectItem aria-label="آذر" key="9">
            آذر
          </SelectItem>
          <SelectItem aria-label="دی" key="10">
            دی
          </SelectItem>
          <SelectItem aria-label="بهمن" key="11">
            بهمن
          </SelectItem>
          <SelectItem aria-label="اسفند" key="12">
            اسفند
          </SelectItem>
        </Select>

        <Input
          classNames={{ inputWrapper: 'h-14' }}
          className="w-full md:w-1/4"
          radius="sm"
          type="number"
          label="سال شمسی"
          value={String(year)}
          defaultValue={String(year)}
          onChange={e => setYear(Number(e.target.value))}
        />

        <div className="grow" />

        <Button title="دریافت اطلاعات به صورت اکسل" onClick={exportToExcel} isIconOnly variant="light" color="success" radius="full" size="lg">
          <PiMicrosoftExcelLogoFill size={25} />
        </Button>

        <Button title="چاپ" onClick={printFunction} isIconOnly variant="light" color="primary" radius="full" size="lg">
          <IoPrintOutline size={25} />
        </Button>

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
        <EmployeeInstallmentsTable ref={contentRef} installments={installments} />
      )}
    </main>
  );
};

export const EmployeeInstallments = memo(employeeInstallmentsPageComponent);
