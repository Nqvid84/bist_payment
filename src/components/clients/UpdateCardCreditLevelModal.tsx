'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Button, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, Select, SelectItem, useDisclosure, Tooltip } from '@nextui-org/react';
import { GiMoneyStack } from 'react-icons/gi';

interface CreditLevel {
  id: number;
  name: string;
  maxInstallment: number;
  description: string;
}

interface UpdateCardCreditLevelModalProps {
  cardId: number;
  currentCreditLevelId?: number;
  currentCreditLevelName: string;
  onSuccess?: () => void;
}

const UpdateCardCreditLevelModal = ({ cardId, currentCreditLevelId, currentCreditLevelName, onSuccess }: UpdateCardCreditLevelModalProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [creditLevels, setCreditLevels] = useState<CreditLevel[]>([]);
  const [selectedCreditLevelId, setSelectedCreditLevelId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [currentCreditLevel, setCurrentCreditLevel] = useState(currentCreditLevelName);

  const fetchCreditLevels = async () => {
    try {
      const response = await axios.get('/microservice/v1/payment/server/credit-level/list');
      if (response.data?.data) {
        setCreditLevels(response.data.data);
        if (currentCreditLevelId) {
          setSelectedCreditLevelId(currentCreditLevelId.toString());
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در دریافت سطوح اقساط رخ داده است');
    }
  };

  const handleUpdateCreditLevel = async () => {
    if (!selectedCreditLevelId) {
      toast.error('لطفا سطح اقساط را انتخاب کنید');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put('/microservice/v1/payment/server/card/update-credit-level', {
        cardId,
        creditLevelId: parseInt(selectedCreditLevelId)
      });

      toast.success(response.data.success || 'سطح اقساط کارت با موفقیت بروزرسانی شد');
      setCurrentCreditLevel(creditLevels.find(level => level.id === parseInt(selectedCreditLevelId))?.name || 'نامشخص');

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی در بروزرسانی سطح اقساط رخ داده است');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCreditLevels();
    }
  }, [isOpen]);

  return (
    <>
      <Tooltip content="تغییر سطح اقساط" radius="sm" delay={500}>
        <Button isIconOnly variant="light" radius="sm" size="sm" onPress={onOpen}>
          <GiMoneyStack className="text-secondary-500 transition-colors hover:text-secondary-600" size={25} />
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        classNames={{
          base: 'light:bg-neutral-100 dark:bg-neutral-900',
          header: 'border-b border-neutral-200 light:border-neutral-800 dark:border-neutral-700',
          body: 'p-6',
          footer: 'border-t border-neutral-200 light:border-neutral-800 dark:border-neutral-700'
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-xl font-bold light:text-black dark:text-white">تغییر سطح اقساط کارت</h3>
            <p className="text-sm light:text-gray-600 dark:text-gray-400">لطفا سطح اقساط جدید را انتخاب کنید</p>
          </ModalHeader>

          <ModalBody>
            {/* Current credit level */}
            <div className="flex items-center justify-between">
              <span className="text-sm light:text-gray-800 dark:text-gray-200">{currentCreditLevel}</span>
              <span className="text-sm light:text-gray-600 dark:text-gray-400"> : سطح اقساط فعلی</span>
            </div>

            <Select
              label="سطح اقساط"
              placeholder="انتخاب سطح اقساط"
              selectedKeys={selectedCreditLevelId ? [selectedCreditLevelId] : []}
              onChange={e => setSelectedCreditLevelId(e.target.value)}
              variant="bordered"
              classNames={{
                label: 'light:text-slate-300 dark:text-slate-600',
                value: 'light:text-slate-900 dark:text-slate-100',
                trigger: 'light:bg-slate-100 dark:bg-slate-800/50 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
              }}
            >
              {creditLevels.map(level => (
                <SelectItem textValue={level.name} key={level.id.toString()} value={level.id.toString()}>
                  <div className="flex items-center justify-between">
                    <span dir="rtl" className="text-sm light:text-gray-600 dark:text-gray-400">
                      {level.maxInstallment.toLocaleString('fa-IR')} ریال
                    </span>
                    <span className="text-sm light:text-gray-600 dark:text-gray-400">{level.name}</span>
                  </div>
                </SelectItem>
              ))}
            </Select>
          </ModalBody>

          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              انصراف
            </Button>
            <Button color="primary" onPress={handleUpdateCreditLevel} isLoading={loading}>
              بروزرسانی
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateCardCreditLevelModal;
