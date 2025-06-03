import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from '@nextui-org/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AddExternal({ setFlag, flag }: { setFlag: any; flag: boolean }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [networkName, setNetworkName] = useState('');

  return (
    <>
      <Button className="w-48 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 p-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl" onPress={onOpen}>
        افزودن شبکه خارجی
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">افزودن شبکه خارجی</ModalHeader>
              <ModalBody>
                <Input value={networkName} onValueChange={setNetworkName} autoFocus label="نام شبکه خارجی" />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  بستن
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    axios
                      .post('/microservice/v1/payment/server/network/create', {
                        networkName: networkName,
                        networkType: 'external',
                        subType: 'connection'
                      })
                      .then(res => {
                        toast.success(res.data.success);
                        onClose();
                        setFlag(!flag);
                        setNetworkName('');
                      });
                  }}
                >
                  ذخیره
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
