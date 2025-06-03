'use client';
import { useDisclosure, Button, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent, Input, Select, SelectItem, Checkbox } from '@nextui-org/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Node {
  id: number;
  name: string;
  type: 'internal' | 'external';
  subType: 'organization' | 'store' | 'connection';
  createdAt: string;
  updatedAt: string;
}

interface DeviceFeatures {
  deviceName: string;
  deviceHash: string;
  devicePassword: string;
  deviceType: 'ATM' | 'POS' | null;
  deviceLocation: string;
  devicePhoneNumber: string;
  deviceDescription: string;
  networkId: string;
  readPermission: boolean;
  createPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
}

interface AddingDeviceProps {
  //eslint-disable-next-line
  setData: (data: any) => void;
  //eslint-disable-next-line
  setFlag: (flag: boolean) => void;
  flag: boolean;
}

const AddingDevice = ({ setData, setFlag, flag }: AddingDeviceProps) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingDevice, setAddingDevice] = useState<DeviceFeatures>({
    deviceName: '',
    deviceHash: '',
    devicePassword: '',
    deviceType: null,
    deviceLocation: '',
    devicePhoneNumber: '',
    deviceDescription: '',
    networkId: '',
    readPermission: false,
    createPermission: false,
    updatePermission: false,
    deletePermission: false
  });

  const phoneNumberRegex = /^09\d{9}$/;

  useEffect(() => {
    axios
      .get('/microservice/v1/payment/server/network/list')
      .then(res => {
        if (res.data.networks) {
          const internalNodes = res.data.networks.filter((node: Node) => node.type === 'internal');
          setNodes(internalNodes);
        } else {
          setNodes([]);
        }
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'خطا در دریافت شبکه‌ها');
      });
  }, []);

  const resetForm = () => {
    setAddingDevice({
      deviceName: '',
      deviceHash: '',
      devicePassword: '',
      deviceType: null,
      deviceLocation: '',
      devicePhoneNumber: '',
      deviceDescription: '',
      networkId: '',
      readPermission: false,
      createPermission: false,
      updatePermission: false,
      deletePermission: false
    });
  };

  const handleCreateDevice = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/microservice/v1/payment/server/device/create', {
        deviceName: addingDevice.deviceName,
        deviceHash: addingDevice.deviceHash,
        devicePassword: addingDevice.devicePassword,
        deviceType: addingDevice.deviceType,
        deviceLocation: addingDevice.deviceLocation,
        devicePhoneNumber: addingDevice.devicePhoneNumber,
        deviceDescription: addingDevice.deviceDescription,
        networkId: Number(addingDevice.networkId),
        readPermission: addingDevice.readPermission,
        createPermission: addingDevice.createPermission,
        updatePermission: addingDevice.updatePermission,
        deletePermission: addingDevice.deletePermission
      });

      if (response.status === 200) {
        setData((prev: any) => [...prev, response.data.device]); // Assuming response includes the new device
        toast.success('دستگاه با موفقیت ایجاد شد');
        resetForm();
        onClose();
        setFlag(!flag);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'خطا در ایجاد دستگاه');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () =>
    addingDevice.deviceName.length > 0 &&
    addingDevice.deviceHash.length > 0 &&
    addingDevice.devicePassword.length > 0 &&
    addingDevice.deviceType &&
    phoneNumberRegex.test(addingDevice.devicePhoneNumber) &&
    addingDevice.networkId.length > 0;

  return (
    <>
      <Button className="font-semibold" color="primary" onPress={onOpen}>
        افزودن دستگاه
      </Button>
      <Modal scrollBehavior="inside" size="lg" isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">افزودن دستگاه</ModalHeader>
              <ModalBody className="space-y-6">
                <Input
                  value={addingDevice.deviceName}
                  onChange={e => setAddingDevice({ ...addingDevice, deviceName: e.target.value })}
                  dir="rtl"
                  label="اپراتور دستگاه"
                  placeholder="اپراتور دستگاه را وارد کنید"
                  variant="underlined"
                  isRequired
                />
                <Input
                  value={addingDevice.deviceHash}
                  onChange={e => setAddingDevice({ ...addingDevice, deviceHash: e.target.value })}
                  dir="rtl"
                  label="سریال دستگاه"
                  placeholder="سریال دستگاه را وارد کنید"
                  variant="underlined"
                  isRequired
                />
                <Input
                  value={addingDevice.devicePassword}
                  onChange={e => {
                    if (/^[0-9]*$/.test(e.target.value) || e.target.value === '') setAddingDevice({ ...addingDevice, devicePassword: e.target.value });
                  }}
                  inputMode="numeric"
                  dir="rtl"
                  label="کلمه عبور دستگاه"
                  placeholder="کلمه عبور دستگاه را وارد کنید"
                  variant="underlined"
                  isRequired
                  isInvalid={addingDevice.devicePassword.length > 0 && !/^[0-9]*$/.test(addingDevice.devicePassword)}
                  errorMessage={addingDevice.devicePassword.length > 0 && !/^[0-9]*$/.test(addingDevice.devicePassword) ? 'فقط اعداد مجاز است' : ''}
                />
                <Input
                  value={addingDevice.devicePhoneNumber}
                  onChange={e => setAddingDevice({ ...addingDevice, devicePhoneNumber: e.target.value })}
                  dir="rtl"
                  label="شماره تماس دستگاه"
                  placeholder="شماره تماس دستگاه را وارد کنید"
                  variant="underlined"
                  isRequired
                  isInvalid={addingDevice.devicePhoneNumber.length > 0 && !phoneNumberRegex.test(addingDevice.devicePhoneNumber)}
                  errorMessage={addingDevice.devicePhoneNumber.length > 0 && !phoneNumberRegex.test(addingDevice.devicePhoneNumber) ? 'شماره باید با 09 شروع شود و 11 رقم باشد' : ''}
                />
                <Input
                  value={addingDevice.deviceLocation}
                  onChange={e => setAddingDevice({ ...addingDevice, deviceLocation: e.target.value })}
                  dir="rtl"
                  label="موقعیت دستگاه"
                  placeholder="موقعیت دستگاه را وارد کنید"
                  variant="underlined"
                />
                <Input
                  value={addingDevice.deviceDescription}
                  onChange={e => setAddingDevice({ ...addingDevice, deviceDescription: e.target.value })}
                  dir="rtl"
                  label="توضیحات دستگاه"
                  placeholder="توضیحات دستگاه را وارد کنید"
                  variant="underlined"
                />
                <Select
                  label="شبکه اتصال"
                  selectedKeys={addingDevice.networkId ? [addingDevice.networkId] : []}
                  onChange={e => setAddingDevice({ ...addingDevice, networkId: e.target.value })}
                  items={nodes}
                  isRequired
                >
                  {node => (
                    <SelectItem className="text-right" dir="rtl" key={node.id.toString()}>
                      {node.name}
                    </SelectItem>
                  )}
                </Select>
                <Select
                  label="نوع دستگاه"
                  onChange={e => setAddingDevice({ ...addingDevice, deviceType: e.target.value as 'ATM' | 'POS' })}
                  selectedKeys={addingDevice.deviceType ? [addingDevice.deviceType] : []}
                  isRequired
                >
                  <SelectItem key="POS" value="POS">
                    POS
                  </SelectItem>
                  <SelectItem key="ATM" value="ATM">
                    ATM
                  </SelectItem>
                </Select>
                <div className="grid grid-cols-2 gap-4">
                  <Checkbox isSelected={addingDevice.readPermission} onValueChange={val => setAddingDevice({ ...addingDevice, readPermission: val })}>
                    خواندن
                  </Checkbox>
                  <Checkbox
                    isDisabled={addingDevice.deviceType === 'POS'}
                    isSelected={addingDevice.createPermission}
                    onValueChange={val => addingDevice.deviceType === 'ATM' && setAddingDevice({ ...addingDevice, createPermission: val })}
                  >
                    ایجاد
                  </Checkbox>
                  <Checkbox isSelected={addingDevice.updatePermission} onValueChange={val => setAddingDevice({ ...addingDevice, updatePermission: val })}>
                    ویرایش
                  </Checkbox>
                  <Checkbox isSelected={addingDevice.deletePermission} onValueChange={val => setAddingDevice({ ...addingDevice, deletePermission: val })}>
                    حذف
                  </Checkbox>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  بستن
                </Button>
                <Button color="primary" onPress={handleCreateDevice} isLoading={loading} isDisabled={!isFormValid()}>
                  افزودن
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddingDevice;
