import { useDisclosure, Button, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent } from '@nextui-org/react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { GiCheckMark } from 'react-icons/gi';
import { RxCross1 } from 'react-icons/rx';
import { TbDeviceMobileFilled } from 'react-icons/tb';
import { VscAdd } from 'react-icons/vsc';
import { toast } from 'sonner';

const AddDeviceAccesses = ({ adminId }: { adminId: any }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [allDevices, setAllDevices] = useState([]);
  const [allDeviceAccesses, setAllDeviceAccesses] = useState([]);

  const [flag, setFlag] = useState(false);

  useMemo(() => {
    axios
      .get('/microservice/v1/payment/server/device/list')
      .then(res => {
        setAllDevices(res.data.devices);
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'خطا در دریافت دستگاه ها');
      });
    axios
      .get('/microservice/v1/payment/server/admin/device/access/list')
      .then(res => {
        setAllDeviceAccesses(res.data.admin_device_access);
      })
      .catch(err => {
        toast.error(err.response?.data?.error || 'خطا در دریافت دسترسی های دستگاه ها');
      });
  }, [isOpen, flag]);

  interface Device {
    id: number;
    adminId: string;
    deviceId: string;
    createdAt: string;
    updatedAt: string;
  }

  function findId(adminId: string, deviceId: string, devices: any): string | undefined {
    const matchingDevice = (devices as Device[]).find(device => device.adminId == adminId && device.deviceId == deviceId);

    if (matchingDevice) {
      return String(matchingDevice.id);
    } else {
      return undefined;
    }
  }

  const thisAdminAccesses: Array<any> = allDeviceAccesses.filter((access: any) => access.adminId == adminId);

  const allowedDeviceIds = thisAdminAccesses.map((access: any) => Number(access.deviceId));

  return (
    <div className="flex flex-col items-center justify-center">
      <VscAdd size={30} className="cursor-pointer text-white transition-all hover:text-amber-400 active:scale-90" onClick={onOpen} />

      <Modal scrollBehavior="inside" size="2xl" isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">افزودن دسترسی های دستگاه</ModalHeader>
              <ModalBody>
                {allDevices.map((device: any) => {
                  return (
                    <motion.section
                      onClick={() => {
                        if (!allowedDeviceIds.includes(device.id)) {
                          axios
                            .post('/microservice/v1/payment/server/admin/device/access/create', {
                              adminId: adminId,
                              deviceId: device.id
                            })
                            .then(res => {
                              toast.success(res.data.success);
                              setFlag(!flag);
                            })
                            .catch(err => {
                              toast.error(err.response.data.error.msg);
                              setFlag(!flag);
                            });
                        } else {
                          axios
                            .delete('/microservice/v1/payment/server/admin/device/access/delete', {
                              data: {
                                id: findId(adminId, device.id, allDeviceAccesses)
                              }
                            })
                            .then(res => {
                              toast.success(res.data.success);
                              setFlag(!flag);
                            })
                            .catch(err => toast.error(err.response.data.error.msg));
                        }
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.55 }}
                      key={device.id}
                      className={`${
                        allowedDeviceIds.includes(device.id)
                          ? 'bg-success-200 text-success-600 hover:bg-success-300 hover:text-success-800'
                          : 'bg-danger-200 text-danger-600 hover:bg-danger-300 hover:text-danger-800'
                      } flex cursor-pointer items-center rounded-xl p-2 transition-all duration-1000 md:p-3`}
                    >
                      <span className="flex basis-[10%] items-center justify-center text-center font-josefin text-lg">
                        <TbDeviceMobileFilled size={27} />
                        <span>
                          {'\t'} : {device.id}
                        </span>
                      </span>
                      <span className="block basis-[90%] text-center text-lg">{device.deviceName}</span>
                      {allowedDeviceIds.includes(device.id) ? (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
                          <GiCheckMark size={25} />
                        </motion.div>
                      ) : (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }}>
                          <RxCross1 size={25} />
                        </motion.div>
                      )}
                    </motion.section>
                  );
                })}
              </ModalBody>
              <ModalFooter>
                <Button className="sm:px-10 md:px-16" size="lg" color="secondary" variant="flat" onPress={onClose}>
                  بستن
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddDeviceAccesses;
