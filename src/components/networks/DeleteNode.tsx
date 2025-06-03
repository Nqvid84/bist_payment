import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Autocomplete, AutocompleteItem } from '@nextui-org/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Node {
  id: number;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

const DeleteNode = ({ setFlag, flag }: { setFlag: any; flag: boolean }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get('/microservice/v1/payment/server/network/list')
      .then(res => {
        setNodes(res?.data?.networks);
      })
      .catch(() => {});
  }, [flag]);

  return (
    <>
      <Button
        className="w-48 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 p-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
        onPress={onOpen}
      >
        پاک کردن شبکه
      </Button>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">پاک کردن شبکه</ModalHeader>
              <ModalBody className="flex items-center justify-center">
                <Autocomplete
                  color="danger"
                  label="حذف شبکه"
                  className="mx-4 basis-3/12 md:mx-10"
                  aria-label="nodes"
                  selectedKey={selectedNodeId}
                  onSelectionChange={key => setSelectedNodeId(key ? String(key) : null)}
                  items={nodes ?? []}
                >
                  {(node) => (
                    <AutocompleteItem key={node.id} value={node.name}>
                      {node.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              </ModalBody>

              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  بستن
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    axios
                      .delete('/microservice/v1/payment/server/network/delete', {
                        data: {
                          networkId: selectedNodeId
                        }
                      })
                      .then(res => {
                        toast.success(res.data.success);
                        onClose();
                        setFlag(!flag);
                        setSelectedNodeId(null);
                      })
                      .catch(err => toast.error(err.response?.data?.error || 'خطایی رخ داده است'));
                  }}
                >
                  حذف
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default DeleteNode;
