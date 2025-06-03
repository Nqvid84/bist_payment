import { useDisclosure, Button, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent, Chip } from '@nextui-org/react';
import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { GiCheckMark } from 'react-icons/gi';
import { RxCross1 } from 'react-icons/rx';
import { FaCircleNodes } from 'react-icons/fa6';
import { VscAdd } from 'react-icons/vsc';
import { toast } from 'sonner';

interface Network {
  id: number;
  name: string;
  type: 'internal' | 'external';
  subType: 'organization' | 'store' | 'connection';
  createdAt: string;
  updatedAt: string;
}

interface NetworkAccess {
  id: number;
  adminId: string;
  networkId: string;
  createdAt: string;
  updatedAt: string;
}

const AddNetworkAccesses = ({ adminId }: { adminId: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [loadingNetworks, setLoadingNetworks] = useState<number[]>([]);
  const [allNetworks, setAllNetworks] = useState<Network[]>([]);
  const [allNetworkAccesses, setAllNetworkAccesses] = useState<NetworkAccess[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setError(null);
    try {
      const [networksRes, accessesRes] = await Promise.all([axios.get('/microservice/v1/payment/server/network/list'), axios.get('/microservice/v1/payment/server/admin/network/access/list')]);

      // Check for success in both responses
      if (!networksRes.data.success || !accessesRes.data.success) {
        setError(networksRes.data.error || accessesRes.data.error || 'Failed to fetch data');
        return;
      }

      const internalNetworks = networksRes.data.networks.filter((network: Network) => network.type === 'internal');
      setAllNetworks(internalNetworks || []);
      setAllNetworkAccesses(accessesRes.data.admin_network_access || []);
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch data';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  function findId(adminId: string, networkId: number): string | undefined {
    const matchingNetwork = allNetworkAccesses.find(access => access.adminId === adminId && Number(access.networkId) === networkId);

    if (!matchingNetwork) {
      toast.error('رکورد دسترسی پیدا نشد');
    }

    return matchingNetwork ? String(matchingNetwork.id) : undefined;
  }

  const thisAdminAccesses = allNetworkAccesses.filter(access => access.adminId === adminId);
  const allowedNetworkIds = thisAdminAccesses.map(access => Number(access.networkId));

  const handleAccessToggle = async (network: Network) => {
    if (loadingNetworks.includes(network.id)) return;

    setLoadingNetworks(prev => [...prev, network.id]);

    try {
      if (!allowedNetworkIds.includes(network.id)) {
        const response = await axios.post(
          '/microservice/v1/payment/server/admin/network/access/create',
          {
            adminId: Number(adminId),
            networkId: network.id
          },
          { withCredentials: true }
        );

        if (response.data.success) {
          toast.success(response.data.data.message || 'دسترسی با موفقیت اعطا شد');
          await fetchData(); // Refresh data after successful creation
        } else {
          throw new Error(response.data.error || 'Failed to grant access');
        }
      } else {
        const accessId = findId(adminId, network.id);
        if (!accessId) {
          throw new Error('رکورد دسترسی پیدا نشد');
        }

        const response = await axios.delete('/microservice/v1/payment/server/admin/network/access/delete', {
          data: { id: Number(accessId) },
          withCredentials: true
        });

        if (response.data.success) {
          toast.success(response.data.data.message || 'دسترسی با موفقیت لغو شد');
          await fetchData(); // Refresh data after successful deletion
        } else {
          throw new Error(response.data.error || 'عملیات با خطا مواجه شد');
        }
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || err.message || 'عملیات با خطا مواجه شد';
      toast.error(errorMessage);
      // Refresh data on error to ensure UI is in sync
      await fetchData();
    } finally {
      setLoadingNetworks(prev => prev.filter(id => id !== network.id));
    }
  };

  const filteredNetworks = allNetworks.filter(network => network.name?.toLowerCase().includes(searchQuery.toLowerCase()) || String(network.id).includes(searchQuery));

  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <VscAdd size={30} className="cursor-pointer transition-all hover:text-amber-400 light:text-slate-700 dark:text-white" onClick={onOpen} />
      </motion.div>

      <Modal
        dir="rtl"
        hideCloseButton
        scrollBehavior="inside"
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
        classNames={{
          backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
          base: 'light:border-slate-200 light:bg-slate-100 dark:border-[#292f46] dark:bg-[#19172c] light:text-slate-900 dark:text-[#a8b0d3]',
          header: 'light:border-b-slate-200 dark:border-b-[#292f46]',
          footer: 'light:border-t-slate-200 dark:border-t-[#292f46]',
          closeButton: 'hover:bg-white/5 active:bg-white/10'
        }}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold light:text-slate-900 dark:text-white">دسترسی به شبکه</h2>
                <p className="text-sm light:text-slate-500 dark:text-gray-400">مدیریت دسترسی به شبکه برای دستگاه ها</p>
              </ModalHeader>

              <ModalBody>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="جستجوی شبکه..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border px-4 py-2 text-right transition-all focus:border-amber-400 focus:outline-none light:border-slate-300 light:bg-white light:text-slate-900 light:placeholder:text-slate-400 dark:border-[#464c6a] dark:bg-[#292f46] dark:text-white dark:placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-3">
                  {error ? (
                    <div className="flex h-40 items-center justify-center text-center">
                      <div className="space-y-2">
                        <p className="text-danger">{error}</p>
                        <Button size="sm" color="warning" variant="flat" onClick={fetchData}>
                          تلاش دوباره
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {filteredNetworks.map((network: Network, index: number) => (
                        <Button
                          as={motion.div}
                          key={network.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }} //@ts-ignore
                          transition={{ duration: 0.3, delay: index * 0.1, ease: 'easeInOut' }}
                          size="lg"
                          onClick={() => handleAccessToggle(network)}
                          className={` ${
                            allowedNetworkIds.includes(network.id) ? 'dark:bg-green-900/20 dark:hover:bg-green-900/30' : 'dark:bg-red-900/20 dark:hover:bg-red-900/30'
                          } ${loadingNetworks.includes(network.id) ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} flex items-center justify-between rounded-xl p-4 transition-all duration-300 hover:border-amber-400/50 light:border-slate-200 dark:border-[#292f46]`}
                        >
                          <div className="flex items-center gap-4">
                            <div className="rounded-xl p-2 light:bg-slate-200 dark:bg-[#292f46]">
                              <FaCircleNodes size={24} className="text-amber-400" />
                            </div>
                            <div>
                              <p className="font-medium light:text-slate-900 dark:text-white">
                                {network.name} <span className={network.type === 'external' ? 'text-yellow-600/80' : 'text-gray-600/80'}>{network.type === 'external' ? '(خارجی)' : '(داخلی)'}</span>
                              </p>

                              <p className="text-sm light:text-slate-500 dark:text-gray-400">{network.subType}</p>
                            </div>
                          </div>

                          <Chip
                            className={`${loadingNetworks.includes(network.id) ? 'opacity-50' : ''}`}
                            variant="flat"
                            color={allowedNetworkIds.includes(network.id) ? 'success' : 'danger'}
                            startContent={allowedNetworkIds.includes(network.id) ? <GiCheckMark /> : <RxCross1 />}
                          >
                            {allowedNetworkIds.includes(network.id) ? 'دسترسی داده شده' : 'بدون دسترسی'}
                          </Chip>
                        </Button>
                      ))}

                      {filteredNetworks.length === 0 && !error && <div className="py-8 text-center light:text-slate-500 dark:text-gray-400">هیچ شبکه ای یافت نشد</div>}
                    </AnimatePresence>
                  )}
                </div>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} className="min-w-[120px]">
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

export default AddNetworkAccesses;
