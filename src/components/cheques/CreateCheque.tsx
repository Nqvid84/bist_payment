import { Button, ModalFooter, ModalContent, Tooltip, Modal, ModalBody, ModalHeader, Input, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FiX, FiPlus } from 'react-icons/fi';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import persian from 'react-date-object/calendars/persian';
import persian_fa from 'react-date-object/locales/persian_fa';
import { TbCurrencyIranianRial } from 'react-icons/tb';
import BankIconDetector from '../../utils/bankIconDetector';

interface CreateChequeData {
  chequeNumber: number;
  SayadiNumber: string;
  price: number;
  receiverName: string;
  bankName: string;
  clientId: number;
}

const CreateCheque = ({ fetchCheques, clientId }: { fetchCheques: () => void; clientId: number }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [createLoading, setCreateLoading] = useState(false);
  const [chequeDate, setChequeDate] = useState<DateObject | null>(null);
  const [createFormData, setCreateFormData] = useState<CreateChequeData>({
    chequeNumber: 0,
    SayadiNumber: '',
    price: 0,
    receiverName: '',
    bankName: '',
    clientId: clientId
  });

  const handleCreateCheque = () => {
    setCreateLoading(true);
    axios
      .post('/microservice/v1/payment/server/cheque/create', { ...createFormData, chequeDate: chequeDate?.toDate() }, { withCredentials: true })
      .then(response => {
        toast.success(response.data.message || 'چک با موفقیت ایجاد شد');
        onClose();
        fetchCheques(); // Refresh the cheque list
        // Reset form data
        setCreateFormData({
          chequeNumber: 0,
          SayadiNumber: '',
          price: 0,
          receiverName: '',
          bankName: '',
          clientId: clientId
        });
        setChequeDate(null);
      })
      .catch(error => {
        toast.error(error.response?.data?.error || 'خطا در ایجاد چک');
      })
      .finally(() => {
        setCreateLoading(false);
      });
  };

  return (
    <>
      <Tooltip content="ایجاد چک جدید" delay={500}>
        <Button color="primary" variant="flat" startContent={<FiPlus />} onClick={onOpen}>
          ثبت چک جدید
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
          <ModalHeader className="rounded-t-2xl border-b border-gray-800 px-6 py-4 light:border-gray-200 light:bg-slate-100 dark:border-gray-800 dark:bg-gray-900/80">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/30">
                <FiPlus className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold light:text-slate-900 dark:text-slate-100">ایجاد چک جدید</h2>
                <p className="text-sm light:text-slate-600 dark:text-slate-400">لطفا اطلاعات چک را وارد کنید</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="p-6">
            <div className="space-y-4">
              <Input
                label="شماره چک"
                value={createFormData.chequeNumber.toString()}
                onChange={e => setCreateFormData(prev => ({ ...prev, chequeNumber: parseInt(e.target.value) || 0 }))}
                variant="bordered"
                classNames={{
                  label: 'light:text-slate-900 dark:text-slate-100',
                  input: 'dark:text-white light:text-slate-900 placeholder:text-slate-400',
                  inputWrapper:
                    'dark:bg-slate-800/50 light:bg-slate-100 dark:border-slate-600 light:border-slate-300 dark:ho ver:border-slate-500 light:hover:border-slate-300 group-data-[focus=true]:border-blue-500'
                }}
              />
              {/* <Input
                label="تاریخ چک"
                value={chequeDate}
                onChange={e => setChequeDate(e.target.value)}
                placeholder="تاریخ چک"
                variant="bordered"
                classNames={{
                  label: 'text-slate-300',
                  input: 'text-white placeholder:text-slate-400',
                  inputWrapper: 'bg-slate-800/50 border-slate-600 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
                }}
              /> */}

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
                value={createFormData.SayadiNumber}
                onChange={e => setCreateFormData(prev => ({ ...prev, SayadiNumber: e.target.value || '' }))}
                variant="bordered"
                classNames={{
                  label: 'light:text-slate-900 dark:text-slate-100',
                  input: 'dark:text-white light:text-slate-900 placeholder:text-slate-400',
                  inputWrapper:
                    'dark:bg-slate-800/50 light:bg-slate-100 dark:border-slate-600 light:border-slate-300 dark:hover:border-slate-500 light:hover:border-slate-300 group-data-[focus=true]:border-blue-500'
                }}
              />
              <Input
                label="مبلغ"
                value={createFormData.price.toString()}
                onChange={e => setCreateFormData(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
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
                    {createFormData.price.toLocaleString('fa-IR')}
                  </p>
                }
              />
              <Input
                label="دریافت کننده"
                value={createFormData.receiverName}
                onChange={e => setCreateFormData(prev => ({ ...prev, receiverName: e.target.value }))}
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
                  value={createFormData.bankName}
                  onChange={e => setCreateFormData(prev => ({ ...prev, bankName: e.target.value }))}
                  variant="bordered"
                  className="w-40"
                  classNames={{
                    label: 'light:text-slate-900 dark:text-slate-100',
                    input: 'dark:text-white light:text-slate-900 placeholder:text-slate-400',
                    inputWrapper:
                      'dark:bg-slate-800/50 light:bg-slate-100 dark:border-slate-600 light:border-slate-300 dark:hover:border-slate-500 light:hover:border-slate-300 group-data-[focus=true]:border-blue-500'
                  }}
                />
                <BankIconDetector bankName={createFormData.bankName} className="flex items-center justify-center overflow-hidden rounded-xl" />
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-gray-800 px-6 py-4">
            <Button color="danger" variant="light" onPress={onClose} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300" startContent={<FiX className="size-4" />}>
              انصراف
            </Button>
            <Button
              color="primary"
              onPress={handleCreateCheque}
              isLoading={createLoading}
              className="bg-green-500 text-white hover:bg-green-600"
              startContent={!createLoading && <FiPlus className="h-5 w-5" />}
            >
              ایجاد چک
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateCheque;
