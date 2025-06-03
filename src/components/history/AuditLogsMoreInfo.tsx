import { motion } from 'framer-motion';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import DifferenceAuditLogs from './DifferenceAuditLogs';

const AuditLogsMoreInfo = ({ resource, resourceAfter }: { resource: any; resourceAfter: any }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <BsFillInfoCircleFill onClick={onOpen} className="text-sky-600 rounded-full hover:text-sky-400 hover:shadow-lg hover:shadow-sky-600 transition-all active:scale-90" size={33} />
      <Modal
        scrollBehavior="outside"
        classNames={{
          body: 'bg-gradient-to-t from-slate-800 to-slate-700',
          header: 'bg-slate-700',
          footer: 'bg-gradient-to-t from-slate-700 to-slate-800',
          closeButton: 'bg-red-500 text-black'
        }}
        size="full"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col pl-4 md:pl-8 gap-y-4 md:gap-y-8 text-white text-3xl border-b-2 border-gray-600">More Information</ModalHeader>
              <ModalBody className={`${resourceAfter ? 'grid grid-cols-1 md:grid-cols-2' : 'flex justify-center items-center'} text-white space-y-2 md:space-y-5`}>
                {resourceAfter.id && (
                  <DifferenceAuditLogs className="cols-span-1 md:col-span-2 self-center place-self-center w-full pb-2 md:pb-4 border-b-2 border-sky-700" object1={resource} object2={resourceAfter} />
                )}
                <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.33, delay: 0.22 }}>
                  {Object.keys(resource).map(key => (
                    <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, ease: 'easeIn' }} key={key}>
                      <strong className="text-lg text-gray-200 mr-3 md:mr-5">{key}:</strong>
                      <span className={`${resourceAfter.id ? 'text-red-400' : 'text-sky-400'}`}>{String(resource[key])}</span>
                    </motion.div>
                  ))}
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.33, delay: 0.22 }}>
                  {resourceAfter.id &&
                    Object.keys(resourceAfter).map(key => (
                      <motion.div initial={{ opacity: 0, y: -20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, ease: 'easeIn' }} key={key}>
                        <strong className="text-lg text-gray-200 mr-3 md:mr-5">{key}:</strong>
                        <span className="text-green-400">{String(resourceAfter[key])}</span>
                      </motion.div>
                    ))}
                </motion.div>
              </ModalBody>
              <ModalFooter>
                <Button className="w-full font-semibold text-lg text-white" color="danger" variant="shadow" onPress={onClose}>
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

export default AuditLogsMoreInfo;
