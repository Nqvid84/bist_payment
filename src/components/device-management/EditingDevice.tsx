'use client';
import { BiSolidEdit } from 'react-icons/bi';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Select, SelectItem, Checkbox } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

interface Network {
  id: number;
  name: string;
}

interface Device {
  id: number;
  deviceName: string;
  deviceHash: string;
  devicePhoneNumber: string;
  deviceDescription: string;
  deviceLocation: string;
  deviceType: string;
  active: boolean;
  readPermission: boolean;
  createPermission: boolean;
  updatePermission: boolean;
  deletePermission: boolean;
  networks: Network[];
}

interface Node {
  id: number;
  name: string;
  type?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EditingDeviceProps {
  device: Device; // eslint-disable-next-line
  setData: (data: any) => void;
  className?: string; // eslint-disable-next-line
  setFlag: (flag: boolean) => void;
  flag: boolean;
  networks: { id: number; name: string; type?: string }[]; // Simplify the networks prop type
}

const EditingDevice = ({ device, setData, className, setFlag, flag, networks }: EditingDeviceProps) => {
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const [loading, setLoading] = useState(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [editingDevice, setEditingDevice] = useState<Device>({
    id: device.id,
    active: device.active,
    deviceName: device.deviceName,
    deviceHash: device.deviceHash,
    deviceType: device.deviceType,
    deviceLocation: device.deviceLocation,
    devicePhoneNumber: device.devicePhoneNumber,
    deviceDescription: device.deviceDescription,
    readPermission: device.readPermission,
    createPermission: device.createPermission,
    updatePermission: device.updatePermission,
    deletePermission: device.deletePermission,
    networks: device.networks
  });

  const phoneNumberRegex = /^09\d{9}$/;

  const handleUpdateDevice = async () => {
    setLoading(true);
    try {
      const response = await axios.put('/microservice/v1/payment/server/device/update', {
        deviceId: editingDevice.id,
        active: editingDevice.active,
        deviceName: editingDevice.deviceName,
        deviceHash: editingDevice.deviceHash,
        deviceType: editingDevice.deviceType,
        deviceLocation: editingDevice.deviceLocation,
        devicePhoneNumber: editingDevice.devicePhoneNumber,
        deviceDescription: editingDevice.deviceDescription,
        readPermission: editingDevice.readPermission,
        createPermission: editingDevice.deviceType === 'ATM' ? editingDevice.createPermission : false,
        updatePermission: editingDevice.updatePermission,
        deletePermission: editingDevice.deletePermission,
        networkId: Number(editingDevice.networks[0].id)
      });

      if (response.status === 200) {
        setData((prev: Device[]) => prev.map(d => (d.id === editingDevice.id ? { ...d, ...response.data.device } : d)));
        toast.success('دستگاه با موفقیت ویرایش شد');
        onClose();
        setFlag(!flag);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'خطا در ویرایش دستگاه');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = () => editingDevice.deviceName.length > 0 && editingDevice.deviceHash.length > 0 && editingDevice.deviceType.length > 0 && phoneNumberRegex.test(editingDevice.devicePhoneNumber);

  useEffect(() => {
    const internalNodes = networks.filter((node: Node) => node.type === 'internal');
    setNodes(internalNodes);
  }, [networks]);

  return (
    <div className={className}>
      <BiSolidEdit className="cursor-pointer transition-all hover:text-blue-400 active:scale-90" size={25} onClick={onOpen} />
      <Modal size="lg" isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">ویرایش دستگاه</ModalHeader>
              <ModalBody className="space-y-6">
                <Input
                  value={editingDevice.deviceName}
                  onChange={e => setEditingDevice({ ...editingDevice, deviceName: e.target.value })}
                  dir="rtl"
                  label="اپراتور دستگاه"
                  placeholder="اپراتور دستگاه را وارد کنید"
                  variant="underlined"
                  isRequired
                />
                <Input
                  value={editingDevice.deviceHash}
                  onChange={e => setEditingDevice({ ...editingDevice, deviceHash: e.target.value })}
                  dir="rtl"
                  label="سریال دستگاه"
                  placeholder="سریال دستگاه را وارد کنید"
                  variant="underlined"
                  isRequired
                />
                <Input
                  value={editingDevice.devicePhoneNumber}
                  onChange={e => setEditingDevice({ ...editingDevice, devicePhoneNumber: e.target.value })}
                  dir="rtl"
                  label="شماره تماس دستگاه"
                  placeholder="شماره تماس دستگاه را وارد کنید"
                  variant="underlined"
                  isRequired
                  isInvalid={editingDevice.devicePhoneNumber.length > 0 && !phoneNumberRegex.test(editingDevice.devicePhoneNumber)}
                  errorMessage={editingDevice.devicePhoneNumber.length > 0 && !phoneNumberRegex.test(editingDevice.devicePhoneNumber) ? 'شماره باید با 09 شروع شود و 11 رقم باشد' : ''}
                />
                <Input
                  value={editingDevice.deviceLocation}
                  onChange={e => setEditingDevice({ ...editingDevice, deviceLocation: e.target.value })}
                  dir="rtl"
                  label="موقعیت دستگاه"
                  placeholder="موقعیت دستگاه را وارد کنید"
                  variant="underlined"
                />
                <Input
                  value={editingDevice.deviceDescription}
                  onChange={e => setEditingDevice({ ...editingDevice, deviceDescription: e.target.value })}
                  dir="rtl"
                  label="توضیحات دستگاه"
                  placeholder="توضیحات دستگاه را وارد کنید"
                  variant="underlined"
                />
                <Select
                  label="شبکه اتصال"
                  selectedKeys={editingDevice.networks[0].id ? [String(editingDevice.networks[0].id)] : []}
                  onChange={e => setEditingDevice({ ...editingDevice, networks: [{ id: parseInt(e.target.value), name: nodes.find(n => n.id === parseInt(e.target.value))?.name || '' }] })}
                  items={nodes}
                  isRequired
                >
                  {node => <SelectItem key={String(node.id)}>{node.name}</SelectItem>}
                </Select>
                <Select
                  label="نوع دستگاه"
                  onChange={e => setEditingDevice({ ...editingDevice, deviceType: e.target.value })}
                  selectedKeys={editingDevice.deviceType ? [editingDevice.deviceType] : []}
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
                  <Checkbox isSelected={editingDevice.readPermission} onValueChange={val => setEditingDevice({ ...editingDevice, readPermission: val })}>
                    خواندن
                  </Checkbox>
                  <Checkbox
                    isSelected={editingDevice.deviceType === 'ATM' ? editingDevice.createPermission : false}
                    onValueChange={val => setEditingDevice({ ...editingDevice, createPermission: editingDevice.deviceType === 'ATM' ? val : false })}
                    isDisabled={editingDevice.deviceType === 'POS'}
                  >
                    ایجاد
                  </Checkbox>
                  <Checkbox isSelected={editingDevice.updatePermission} onValueChange={val => setEditingDevice({ ...editingDevice, updatePermission: val })}>
                    ویرایش
                  </Checkbox>
                  <Checkbox isSelected={editingDevice.deletePermission} onValueChange={val => setEditingDevice({ ...editingDevice, deletePermission: val })}>
                    حذف
                  </Checkbox>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  بستن
                </Button>
                <Button color="primary" onPress={handleUpdateDevice} isLoading={loading} isDisabled={!isFormValid()}>
                  ذخیره
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default EditingDevice;
