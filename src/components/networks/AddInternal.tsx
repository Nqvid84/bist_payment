import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, useDisclosure, Select, SelectItem } from '@nextui-org/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

type NetworkSubType = 'store' | 'organization';

export default function AddInternal({ setFlag, flag }: { setFlag: any; flag: boolean }) {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [networkName, setNetworkName] = useState('');
  const [networkSubType, setNetworkSubType] = useState<NetworkSubType>();

  const createInternalNetwork = () => {
    axios
      .post('/microservice/v1/payment/server/network/create', {
        networkName: networkName,
        networkType: 'internal',
        subType: networkSubType
      })
      .then(res => {
        toast.success(res.data.success);
        onClose();
        setFlag(!flag);
        setNetworkName('');
      })
      .catch(err => toast.error(err.response.data.error));
  };
  return (
    <>
      <Button className="w-48 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 p-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl" onPress={onOpen}>
        افزودن شبکه داخلی
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">افزودن شبکه داخلی</ModalHeader>
              <ModalBody>
                <Input dir="rtl" value={networkName} onValueChange={setNetworkName} autoFocus label="نام شبکه داخلی" />
                <Select label="نوع شبکه داخلی" onChange={e => setNetworkSubType(e.target.value as NetworkSubType)} value={networkSubType}>
                  <SelectItem classNames={{ base: 'bg-purple-200' }} key="store" value="store">
                    فروشگاه
                  </SelectItem>
                  <SelectItem classNames={{ base: 'bg-blue-200' }} key="organization" value="organization">
                    سازمان
                  </SelectItem>
                </Select>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  بستن
                </Button>
                <Button color="primary" onPress={createInternalNetwork}>
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
