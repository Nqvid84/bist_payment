import { Button, ModalFooter, ModalContent, Tooltip, Modal, ModalBody, ModalHeader, Input, useDisclosure, Select, SelectItem } from '@nextui-org/react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FiX } from 'react-icons/fi';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { TbCurrencyIranianRial } from 'react-icons/tb';
import { Cheque } from '../clients/types';
import BankIconDetector from '../../utils/bankIconDetector';

interface UpdateChequeData {
  chequeNumber: number;
  SayadiNumber: string;
  status: string;
  price: number;
  receiverName: string;
  bankName: string;
  clientId: number;
}

const EditCheque = ({ cheque, fetchCheques }: { cheque: Cheque; fetchCheques: () => void }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [chequeDate, setChequeDate] = useState<DateObject | null>(new DateObject(cheque.chequeDate));

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateFormData, setUpdateFormData] = useState<UpdateChequeData>({
    chequeNumber: cheque.chequeNumber,
    SayadiNumber: cheque.SayadiNumber,
    status: cheque.status,
    price: cheque.price,
    receiverName: cheque.receiverName,
    bankName: cheque.bankName,
    clientId: cheque.clientId
  });

  const handleUpdateCheque = () => {
    setUpdateLoading(true);
    axios
      .put(`/microservice/v1/payment/server/cheque/update/${cheque.id}`, { ...updateFormData, chequeDate: chequeDate?.toDate() }, { withCredentials: true })
      .then(response => {
        toast.success(response.data.message || 'اطلاعات چک با موفقیت بروزرسانی شد');
        onClose();
        fetchCheques(); // Refresh the cheque list
      })
      .catch(error => {
        toast.error(error.response?.data?.error || 'خطا در بروزرسانی اطلاعات چک');
      })
      .finally(() => {
        setUpdateLoading(false);
      });
  };

  return (
    <>
      <Tooltip content="ویرایش" delay={500}>
        <Button isIconOnly variant="light" className="hover:text-blue-300 dark:text-blue-400" onClick={onOpen}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            />
          </svg>
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        className="rounded-xl backdrop-blur-sm light:bg-slate-100 light:text-black dark:bg-gray-900/95 dark:text-white"
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.3, ease: 'easeOut' }
            },
            exit: {
              opacity: 0,
              scale: 0.98,
              y: 20,
              transition: { duration: 0.2, ease: 'easeIn' }
            }
          }
        }}
      >
        <ModalContent>
          <ModalHeader className="rounded-t-2xl border-b px-6 py-4 light:border-gray-200 light:bg-slate-100 dark:border-gray-800 dark:bg-gray-900/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-purple-400">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold light:text-slate-900 dark:text-slate-100">ویرایش اطلاعات چک</h2>
                <p className="text-sm light:text-slate-600 dark:text-slate-400">لطفا اطلاعات جدید را وارد کنید</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="p-6">
            <div className="space-y-4">
              <Input
                label="شناسه مشتری"
                value={updateFormData.clientId.toString()}
                onChange={e => setUpdateFormData(prev => ({ ...prev, clientId: parseInt(e.target.value) || 0 }))}
                variant="bordered"
                classNames={{
                  label: 'light:text-slate-900 dark:text-slate-100',
                  input: 'dark:text-white light:text-slate-900 placeholder:text-slate-400',
                  inputWrapper:
                    'dark:bg-slate-800/50 light:bg-slate-100 dark:border-slate-600 light:border-slate-300 dark:hover:border-slate-500 light:hover:border-slate-300 group-data-[focus=true]:border-blue-500'
                }}
              />

              <Input
                label="شماره چک"
                value={updateFormData.chequeNumber.toString()}
                onChange={e => setUpdateFormData(prev => ({ ...prev, chequeNumber: parseInt(e.target.value) || 0 }))}
                variant="bordered"
                classNames={{
                  label: 'light:text-slate-900 dark:text-slate-100',
                  input: 'dark:text-white light:text-slate-900 placeholder:text-slate-400',
                  inputWrapper:
                    'dark:bg-slate-800/50 light:bg-slate-100 dark:border-slate-600 light:border-slate-300 dark:hover:border-slate-500 light:hover:border-slate-300 group-data-[focus=true]:border-blue-500'
                }}
              />
              <DatePicker
                value={chequeDate}
                onChange={setChequeDate}
                calendar={persian}
                locale={persian_fa}
                inputClass="w-full md:w-64 px-4 py-2 rounded-lg dark:bg-neutral-700 light:bg-neutral-300 dark:text-white light:text-black border dark:border-neutral-600 light:border-neutral-400 focus:border-blue-500 focus:outline-none transition-colors"
                containerClassName="w-full"
                placeholder="تاریخ چک"
              />
              <Input
                label="شماره صیادی"
                value={updateFormData.SayadiNumber}
                onChange={e => setUpdateFormData(prev => ({ ...prev, SayadiNumber: e.target.value || '' }))}
                variant="bordered"
                classNames={{
                  label: 'light:text-slate-900 dark:text-slate-100',
                  input: 'dark:text-white light:text-slate-900 placeholder:text-slate-400',
                  inputWrapper:
                    'dark:bg-slate-800/50 light:bg-slate-100 dark:border-slate-600 light:border-slate-300 dark:hover:border-slate-500 light:hover:border-slate-300 group-data-[focus=true]:border-blue-500'
                }}
              />
              <Select
                label="وضعیت"
                value={updateFormData.status}
                onChange={e => setUpdateFormData(prev => ({ ...prev, status: e.target.value }))}
                variant="bordered"
                classNames={{
                  label: 'light:text-slate-900 dark:text-slate-100',
                  value: 'dark:text-white light:text-slate-900',
                  trigger:
                    'dark:bg-slate-800/50 light:bg-slate-100 dark:border-slate-600 light:border-slate-300 dark:hover:border-slate-500 light:hover:border-slate-300 group-data-[focus=true]:border-blue-500'
                }}
              >
                <SelectItem key="pending" value="pending">
                  در حال وصول
                </SelectItem>
                <SelectItem key="approved" value="approved">
                  نقد شده
                </SelectItem>
                <SelectItem key="rejected" value="rejected">
                  برگشت خورده
                </SelectItem>
              </Select>
              <Input
                label="مبلغ"
                value={updateFormData.price.toString()}
                onChange={e => setUpdateFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
                variant="bordered"
                classNames={{
                  label: 'light:text-slate-900 dark:text-slate-100',
                  input: 'dark:text-white light:text-slate-900 placeholder:text-slate-400',
                  inputWrapper:
                    'dark:bg-slate-800/50 light:bg-slate-100 dark:border-slate-600 light:border-slate-300 dark:hover:border-slate-500 light:hover:border-slate-300 group-data-[focus=true]:border-blue-500'
                }}
                description={
                  <p className="flex gap-x-1 text-sm light:text-slate-600 dark:text-slate-400">
                    <TbCurrencyIranianRial size={20} />
                    {updateFormData.price.toLocaleString('fa-IR')}
                  </p>
                }
              />
              <Input
                label="دریافت کننده"
                value={updateFormData.receiverName}
                onChange={e => setUpdateFormData(prev => ({ ...prev, receiverName: e.target.value }))}
                variant="bordered"
                classNames={{
                  label: 'light:text-slate-900 dark:text-slate-100',
                  input: 'dark:text-white light:text-slate-900 placeholder:text-slate-400',
                  inputWrapper:
                    'dark:bg-slate-800/50 light:bg-slate-100 dark:border-slate-600 light:border-slate-300 dark:hover:border-slate-500 light:hover:border-slate-300 group-data-[focus=true]:border-blue-500'
                }}
              />
              <div className="flex items-center gap-x-2">
                <Input
                  label="نام بانک"
                  value={updateFormData.bankName}
                  onChange={e => setUpdateFormData(prev => ({ ...prev, bankName: e.target.value }))}
                  variant="bordered"
                  className="w-40"
                  classNames={{
                    label: 'light:text-slate-900 dark:text-slate-100',
                    input: 'dark:text-white light:text-slate-900 placeholder:text-slate-400',
                    inputWrapper:
                      'dark:bg-slate-800/50 light:bg-slate-100 dark:border-slate-600 light:border-slate-300 dark:hover:border-slate-500 light:hover:border-slate-300 group-data-[focus=true]:border-blue-500'
                  }}
                />
                <BankIconDetector bankName={updateFormData.bankName} className="flex items-center justify-center overflow-hidden rounded-xl" />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-gray-800 px-6 py-4">
            <Button color="danger" variant="light" onPress={onClose} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300" startContent={<FiX className="size-4" />}>
              انصراف
            </Button>
            <Button
              color="primary"
              onPress={handleUpdateCheque}
              isLoading={updateLoading}
              className="bg-blue-500 text-white hover:bg-blue-600"
              startContent={
                !updateLoading && (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
                    />
                  </svg>
                )
              }
            >
              ذخیره تغییرات
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditCheque;
