import { Button, ModalFooter, ModalContent, Tooltip, Modal, ModalBody, ModalHeader, useDisclosure } from '@nextui-org/react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { FiX, FiTrash2 } from 'react-icons/fi';
import { Cheque } from '../clients/types';

const DeleteCheque = ({ cheque, fetchCheques }: { cheque: Cheque; fetchCheques: () => void }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleDeleteCheque = () => {
    setDeleteLoading(true);
    axios
      .delete(`/microservice/v1/payment/server/cheque/delete/${cheque.id}`, { withCredentials: true })
      .then(response => {
        toast.success(response.data.message || 'چک با موفقیت حذف شد');
        onClose();
        fetchCheques(); // Refresh the cheque list
      })
      .catch(error => {
        toast.error(error.response?.data?.error || 'خطا در حذف چک');
      })
      .finally(() => {
        setDeleteLoading(false);
      });
  };

  return (
    <>
      <Tooltip content="حذف" delay={500}>
        <Button isIconOnly variant="light" className="text-red-400 hover:text-red-300" onClick={onOpen}>
          <FiTrash2 className="h-5 w-5" />
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="md"
        className="rounded-xl bg-gray-900/95 text-white backdrop-blur-sm"
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
          <ModalHeader className="rounded-t-2xl border-b border-gray-800 bg-gray-900/80 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/30">
                <FiTrash2 className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">حذف چک</h2>
                <p className="text-sm text-gray-400">آیا از حذف این چک اطمینان دارید؟</p>
              </div>
            </div>
          </ModalHeader>
          <ModalBody dir="rtl" className="p-6">
            <div className="space-y-4">
              <div className="rounded-lg bg-red-500/10 p-4 text-red-400">
                <p>شماره چک: {cheque.chequeNumber}</p>
                <p>مبلغ: {cheque.price}</p>
                <p>دریافت کننده: {cheque.receiverName}</p>
                <p>نام بانک: {cheque.bankName}</p>
                <p>وضعیت: {cheque.status}</p>
              </div>
              <p className="text-center text-gray-400">این عملیات غیرقابل بازگشت است.</p>
            </div>
          </ModalBody>
          <ModalFooter className="border-t border-gray-800 px-6 py-4">
            <Button color="danger" variant="light" onPress={onClose} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300" startContent={<FiX className="size-4" />}>
              انصراف
            </Button>
            <Button
              color="danger"
              onPress={handleDeleteCheque}
              isLoading={deleteLoading}
              className="bg-red-500 text-white hover:bg-red-600"
              startContent={!deleteLoading && <FiTrash2 className="h-5 w-5" />}
            >
              حذف چک
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteCheque;
