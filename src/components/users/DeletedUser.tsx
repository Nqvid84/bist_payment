import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import axios from 'axios';
import { TbTrashX } from 'react-icons/tb';
import { toast } from 'sonner';

const DeleteUser = ({ id, flag, setFlag, className }: { id: number; flag: boolean; setFlag: any; className?: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className={className}>
      <TbTrashX onClick={onOpen} size={25} className="text-red-500 hover:text-red-800 transition-colors cursor-pointer" />
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
              <ModalHeader className="flex flex-col gap-1 text-center text-red-500 font-bold">Alert !</ModalHeader>
              <ModalBody className="text-center">آیا از حذف این ادمین اطمینان دارید؟</ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  خیر
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    axios
                      .delete('/microservice/v1/payment/server/admin/delete', {
                        data: {
                          id: id
                        }
                      })
                      .then(res => {
                        setFlag(!flag);
                        toast.success(res.data.success, {
                          duration: 1500
                        });
                      })
                      .catch(err => toast.error(err.error));
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

export default DeleteUser;
