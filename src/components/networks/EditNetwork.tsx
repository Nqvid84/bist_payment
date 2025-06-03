import { Button, Input, Modal, ModalBody, ModalContent, ModalHeader, ModalFooter, useDisclosure, Select, SelectItem, Tooltip } from '@nextui-org/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';
import { FaCircleNodes } from 'react-icons/fa6';
import { VscEdit } from 'react-icons/vsc';

interface Node {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

type NetworkType = 'internal' | 'external';
type SubType = 'connection' | 'organization' | 'store';

// eslint-disable-next-line
const EditNetwork = ({ _nodes, setFlag, flag }: { _nodes: Node[]; setFlag: (flag: boolean) => void; flag: boolean }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [nodes, setNodes] = useState<Node[]>(_nodes);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<Node | null>(null);
  const [newName, setNewName] = useState('');
  const [selectedType, setSelectedType] = useState<NetworkType>('external');
  const [selectedSubType, setSelectedSubType] = useState<SubType>('connection');

  // Get all nodes
  const getNodes = async () => {
    setError(null);
    try {
      const res = await axios.get('/microservice/v1/payment/server/network/list');
      if (res.data.networks && res.data.networks.length > 0) {
        setNodes(res.data.networks);
      } else {
        setNodes([]);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.error || 'Failed to fetch networks';
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  // Edit network
  const editNetwork = async (networkId: number, networkName: string, networkType: NetworkType, subType: SubType) => {
    try {
      const res = await axios.put(`/microservice/v1/payment/server/network/update/${networkId}`, {
        networkName,
        networkType,
        subType
      });
      toast.success(res.data.success);
      setEditingNode(null);
      setNewName('');
      setSelectedType('internal');
      setSelectedSubType('connection');
      getNodes();
      setFlag(!flag);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Failed to update network');
    }
  };

  useEffect(() => {
    if (isOpen) {
      getNodes();
    }
  }, [isOpen]);

  const filteredNodes = nodes.filter(node => node.name?.toLowerCase().includes(searchQuery.toLowerCase()) || String(node.id).includes(searchQuery));

  const handleEditClick = (node: Node) => {
    setEditingNode(node);
    setNewName(node.name);
    setSelectedType(node.type as NetworkType);
    setSelectedSubType('connection'); // Default value, you might want to add this to your Node interface
  };

  return (
    <>
      <Tooltip content="ویرایش شبکه ها" delay={1000}>
        <Button isIconOnly variant="flat" color="primary" radius="full" className="fixed bottom-20 left-4 self-end transition-transform hover:scale-105 md:bottom-10" onClick={onOpen}>
          <VscEdit size={20} />
        </Button>
      </Tooltip>

      <Modal
        hideCloseButton
        scrollBehavior="inside"
        size="2xl"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        backdrop="blur"
        classNames={{
          backdrop: 'bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20',
          base: 'border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]',
          header: 'border-b-[1px] border-[#292f46]',
          footer: 'border-t-[1px] border-[#292f46]',
          closeButton: 'hover:bg-white/5 active:bg-white/10'
        }}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">ویرایش شبکه‌ها</h2>
                <p className="text-sm text-gray-400">مدیریت و ویرایش شبکه‌های موجود</p>
              </ModalHeader>

              <ModalBody>
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="...جستجوی شبکه"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full rounded-lg border border-[#464c6a] bg-[#292f46] px-4 py-2 text-right transition-all focus:border-amber-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  {error ? (
                    <div className="flex h-40 items-center justify-center text-center">
                      <div className="space-y-2">
                        <p className="text-danger">{error}</p>
                        <Button size="sm" color="warning" variant="flat" onClick={getNodes}>
                          تلاش دوباره
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {filteredNodes.map((node, index) => (
                        <motion.div
                          key={node.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.3, delay: index * 0.1, ease: 'easeInOut' }}
                          className="flex items-center justify-between rounded-xl border border-[#292f46] p-4 transition-all duration-300 hover:border-amber-400/50"
                        >
                          <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-[#292f46] p-2">
                              <FaCircleNodes size={24} className="text-amber-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{node.name}</p>
                              <p className="text-sm text-gray-400">شناسه: {node.id}</p>
                            </div>
                          </div>

                          {editingNode?.id === node.id ? (
                            <div className="flex w-[400px] flex-col gap-3">
                              <div className="flex items-center gap-2">
                                <Input dir="rtl" value={newName} onChange={e => setNewName(e.target.value)} placeholder="نام جدید شبکه" className="w-full" />
                              </div>
                              <div className="flex items-center gap-2 text-white">
                                <Select label="نوع شبکه" value={selectedType} onChange={e => setSelectedType(e.target.value as NetworkType)} className="w-full" color="primary">
                                  <SelectItem key="internal" value="internal">
                                    داخلی
                                  </SelectItem>
                                  <SelectItem key="external" value="external">
                                    خارجی
                                  </SelectItem>
                                </Select>
                                <Select label="زیر نوع" value={selectedSubType} onChange={e => setSelectedSubType(e.target.value as SubType)} className="w-full" color="primary">
                                  <SelectItem key="connection" value="connection">
                                    اتصال
                                  </SelectItem>
                                  <SelectItem key="organization" value="organization">
                                    سازمان
                                  </SelectItem>
                                  <SelectItem key="store" value="store">
                                    فروشگاه
                                  </SelectItem>
                                </Select>
                              </div>
                              <div className="flex items-center justify-end gap-2">
                                <Button color="success" size="sm" onClick={() => editNetwork(node.id, newName, selectedType, selectedSubType)}>
                                  ذخیره
                                </Button>
                                <Button
                                  color="danger"
                                  size="sm"
                                  variant="light"
                                  onClick={() => {
                                    setEditingNode(null);
                                    setNewName('');
                                    setSelectedType('internal');
                                    setSelectedSubType('connection');
                                  }}
                                >
                                  لغو
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button color="primary" size="sm" onClick={() => handleEditClick(node)}>
                              ویرایش
                            </Button>
                          )}
                        </motion.div>
                      ))}

                      {filteredNodes.length === 0 && !error && <div className="py-8 text-center text-gray-400">هیچ شبکه ای یافت نشد</div>}
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
    </>
  );
};

export default EditNetwork;
