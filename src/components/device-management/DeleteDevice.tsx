'use client';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import axios from 'axios';
import { TbTrashX } from 'react-icons/tb';
import { toast } from 'sonner';

interface DeleteDeviceProps {
  id: number;
  className?: string; //eslint-disable-next-line
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const DeleteDevice = ({ id, setFlag, flag, className }: DeleteDeviceProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleDelete = async () => {
    try {
      const response = await axios.delete('/microservice/v1/payment/server/device/delete', {
        data: { id }
      });
      setFlag(!flag);
      toast.success(response.data.success, { duration: 1500 });
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'خطا در حذف دستگاه');
    }
  };

  return (
    <div className={className}>
      <TbTrashX onClick={onOpen} size={25} className="cursor-pointer text-red-500 transition-all hover:text-red-800 active:scale-90" />
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop: 'bg-gradient-to-t from-rose-800 to-red-800/10 backdrop-opacity-20'
        }}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center font-bold text-red-500">هشدار!</ModalHeader>
              <ModalBody className="text-center">آیا از حذف این دستگاه اطمینان دارید؟</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  خیر
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleDelete();
                    onClose();
                  }}
                >
                  بله
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DeleteDevice;
