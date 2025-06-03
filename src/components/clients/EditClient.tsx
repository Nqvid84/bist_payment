'use client';

import { Button, ModalFooter, ModalContent, Tooltip, Modal, ModalBody, ModalHeader, Input, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FiX } from 'react-icons/fi';
import type { Client } from './types';

interface UpdateClientData {
  clientId: string;
  fullName: string;
  codeMeli: string;
  phoneNumber: string;
}
// #endregion

const EditClient = ({ client, fetchClients }: { client: Client; fetchClients: () => void }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateFormData, setUpdateFormData] = useState<UpdateClientData>({
    clientId: client.id.toString(),
    fullName: client.fullName,
    codeMeli: client.codeMeli,
    phoneNumber: client.phoneNumber
  });

  const handleUpdateClient = async () => {
    if (!updateFormData.clientId) return;

    setUpdateLoading(true);
    try {
      const response = await axios.put('/microservice/v1/payment/server/clients/update', updateFormData, { withCredentials: true });

      if (response.data.success === 'success') {
        toast.success(response.data.message || 'اطلاعات مشتری با موفقیت بروزرسانی شد');
        onClose();
        fetchClients(); // Refresh the client list
      } else {
        throw new Error(response.data.error || 'خطا در بروزرسانی اطلاعات');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطا در بروزرسانی اطلاعات مشتری');
    } finally {
      setUpdateLoading(false);
    }
  };

  return (
    <>
      <Tooltip content="ویرایش" delay={500}>
        <Button isIconOnly variant="light" className="text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300" onClick={onOpen}>
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
        className="rounded-xl backdrop-blur-sm light:bg-gray-300/95 light:text-gray-900 dark:bg-gray-900/95 dark:text-white"
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
          <ModalHeader className="rounded-t-2xl border-b px-6 py-4 light:border-gray-200 light:bg-gray-200/80 dark:border-gray-800 dark:bg-gray-900/80">
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
                <h2 className="text-xl font-bold light:text-black dark:text-white">ویرایش اطلاعات مشتری</h2>
                <p className="text-sm light:text-gray-600 dark:text-gray-400">لطفا اطلاعات جدید را وارد کنید</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="p-6">
            <div className="space-y-4">
              <Input
                label="نام و نام خانوادگی"
                value={updateFormData.fullName}
                onChange={e => setUpdateFormData(prev => ({ ...prev, fullName: e.target.value }))}
                placeholder="نام و نام خانوادگی"
                variant="bordered"
                classNames={{
                  label: 'light:text-slate-300 dark:text-slate-600',
                  input: 'light:text-slate-900 dark:text-slate-100 placeholder:text-slate-400',
                  inputWrapper: 'light:bg-slate-100 dark:bg-slate-800/50 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
                }}
              />
              <Input
                label="کد ملی"
                value={updateFormData.codeMeli}
                onChange={e => setUpdateFormData(prev => ({ ...prev, codeMeli: e.target.value }))}
                placeholder="کد ملی"
                variant="bordered"
                classNames={{
                  label: 'light:text-slate-300 dark:text-slate-600',
                  input: 'light:text-slate-900 dark:text-slate-100 placeholder:text-slate-400',
                  inputWrapper: 'light:bg-slate-100 dark:bg-slate-800/50 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
                }}
                isInvalid={updateFormData.codeMeli.length !== 10}
              />
              <Input
                label="شماره تلفن"
                value={updateFormData.phoneNumber}
                onChange={e => setUpdateFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="شماره تلفن"
                variant="bordered"
                classNames={{
                  label: 'light:text-slate-300 dark:text-slate-600',
                  input: 'light:text-slate-900 dark:text-slate-100 placeholder:text-slate-400',
                  inputWrapper: 'light:bg-slate-100 dark:bg-slate-800/50 light:border-slate-200 dark:border-slate-700 hover:border-slate-500 group-data-[focus=true]:border-blue-500'
                }}
                isInvalid={updateFormData.phoneNumber.length !== 11 || !updateFormData.phoneNumber.startsWith('09')}
              />
            </div>
          </ModalBody>
          <ModalFooter className="border-t px-6 py-4 light:border-gray-200 dark:border-gray-800">
            <Button color="danger" variant="light" onPress={onClose} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300" startContent={<FiX className="size-4" />}>
              انصراف
            </Button>
            <Button
              color="primary"
              onPress={handleUpdateClient}
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

export default EditClient;
