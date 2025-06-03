'use client';

import { Tooltip, Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Card, CardBody } from '@nextui-org/react';
import { FiCreditCard, FiInfo, FiSmartphone, FiX } from 'react-icons/fi';
import { TbCurrencyIranianRial } from 'react-icons/tb';
import { toast } from 'sonner';
import axios from 'axios';
import { useState } from 'react';
import CardTransactionsModal from './CardTransactionsModal';
import { FaCreditCard } from 'react-icons/fa';
import UpdateCardCreditLevelModal from './UpdateCardCreditLevelModal';
import { CardData, Client } from './types';
import BistCard from './BistCard';

const ClientDetails = ({ client }: { client: Client }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingCardStatus, setLoadingCardStatus] = useState(false);
  const [cardStatus, setCardStatus] = useState<Pick<CardData, 'id' | 'active'>[]>(client.cards.map(card => ({ id: card.id, active: card.active })));

  const formatBalance = (balance: string) => {
    return Number(balance).toLocaleString('fa-IR');
  };

  const toggleCardStatus = async (cardId: number, isActive: boolean) => {
    setLoadingCardStatus(true);
    const endpoint = isActive ? '/microservice/v1/payment/server/card/block' : '/microservice/v1/payment/server/card/unblock';

    try {
      const response = await axios.post(endpoint, { cardId }, { withCredentials: true });
      toast.success(response.data.success);
      // We should update the UI here for that specific card
      setCardStatus(cardStatus.map(card => (card.id === cardId ? { ...card, active: !isActive } : card)));
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'خطایی رخ داده است');
    } finally {
      setLoadingCardStatus(false);
    }
  };

  return (
    <>
      <Tooltip content="مشاهده جزئیات" delay={500} radius="sm">
        <Button isIconOnly variant="light" className="text-blue-600 hover:text-blue-400 dark:text-blue-400 dark:hover:text-blue-300" onClick={onOpen}>
          <FaCreditCard size={23} />
        </Button>
      </Tooltip>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        className="light:text-dark rounded-xl backdrop-blur-sm light:bg-gray-900/95 dark:bg-gray-900/95 dark:text-white"
        scrollBehavior="inside"
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              scale: 1,
              y: 0,
              transition: { duration: 0.3, ease: 'easeOut' }
            },
            exit: {
              opacity: 0,
              scale: 0.98,
              y: 20,
              transition: { duration: 0.2, ease: 'easeIn' }
            }
          }
        }}
      >
        <ModalContent>
          <ModalHeader className="rounded-t-2xl border-b px-6 py-4 light:border-gray-200 light:bg-gray-900/80 dark:border-gray-800 dark:bg-gray-900/80">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-purple-500/30">
                <h6 className="block text-center text-lg font-bold text-purple-400">{client.fullName[0]}</h6>
              </div>

              <h3 className="text-xl font-bold text-white">{client.fullName}</h3>

              <div className="flex items-center gap-x-4 text-sm light:text-gray-600 dark:text-gray-400">
                <span>کد ملی: {client.codeMeli}</span>
                <span>•</span>
                <span>تلفن: {client.phoneNumber}</span>
              </div>
            </div>
          </ModalHeader>
          <ModalBody className="p-6">
            {client.cards.length > 0 ? (
              <div className="space-y-6">
                {client.cards.map((card, index) => (
                  <div className="space-y-1" key={`${client.id}-card-${index}`}>
                    {/* Bist Card black design*/}
                    <BistCard cardNumber={card.cardNumber} clientName={client.fullName} />

                    <Card className="mx-auto w-full overflow-hidden border p-0 shadow-md backdrop-blur-sm light:border-gray-200/50 light:bg-gray-300/80 dark:border-gray-700/50 dark:bg-gray-800/80 md:w-96">
                      <CardBody className="p-4">
                        <div className="flex flex-col gap-3">
                          {/* Status and Balance */}
                          <div className="flex items-center justify-between">
                            <Button
                              isDisabled={loadingCardStatus}
                              className="flex w-20 cursor-pointer items-center gap-2 transition-opacity hover:opacity-90"
                              onClick={() => toggleCardStatus(cardStatus[index].id, cardStatus[index].active)}
                              variant="light"
                              radius="sm"
                              size="sm"
                            >
                              <div className={`h-2.5 w-2.5 rounded-full ${cardStatus[index].active ? 'bg-green-600 dark:bg-green-400' : 'bg-red-600 dark:bg-red-400'}`}></div>
                              <span className={`text-xs ${cardStatus[index].active ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {cardStatus[index].active ? 'فعال' : 'غیرفعال'}
                              </span>
                            </Button>

                            <div className="flex items-center justify-center gap-x-2">
                              <CardTransactionsModal id={card.id} />
                              <UpdateCardCreditLevelModal cardId={card.id} currentCreditLevelName={card?.creditLevel?.name || 'نامشخص'} />
                            </div>

                            <div className="flex items-center gap-1 text-sm">
                              <TbCurrencyIranianRial className="text-purple-400" />
                              <span className="font-medium light:text-black dark:text-white">{formatBalance(card.balance)}</span>
                            </div>
                          </div>

                          {/* Devices */}
                          {card.devices.length > 0 ? (
                            <div dir="rtl" className="rounded-lg p-3 light:bg-gray-500/50 dark:bg-gray-900/30">
                              <div className="mb-2 flex items-center gap-2 text-sm">
                                <FiSmartphone className="text-purple-400" />
                                <span className="light:text-gray-300 dark:text-gray-600">دستگاه‌ها:</span>
                              </div>
                              <div className="grid gap-1.5 text-xs">
                                {card.devices.map((device, devIndex) => (
                                  <div key={`${client.id}-card-${index}-device-${devIndex}`} className="flex items-center gap-2">
                                    <div className={`h-1.5 w-1.5 rounded-full ${device.active ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                    <span className="light:text-gray-600 dark:text-gray-300">{device.deviceName}</span>
                                    {device.networks.length > 0 && (
                                      <span title="شبکه دستگاه" className="light:text-gray-600 dark:text-gray-300">
                                        ({device.networks.map(n => n.name).join(', ')})
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs light:text-gray-600 dark:text-gray-400">
                              <FiInfo className="text-gray-500" />
                              <span>بدون دستگاه متصل</span>
                            </div>
                          )}
                        </div>
                      </CardBody>
                    </Card>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center rounded-lg bg-gray-800/50 p-8 text-center">
                <div className="flex flex-col items-center gap-3">
                  <FiCreditCard className="size-10 text-gray-600" />
                  <p className="text-gray-400">کارتی یافت نشد</p>
                </div>
              </div>
            )}
          </ModalBody>
          <ModalFooter className="border-t px-6 py-4 light:border-gray-200 dark:border-gray-800">
            <Button color="danger" variant="light" onPress={onClose} className="bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300" startContent={<FiX className="size-4" />}>
              بستن
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ClientDetails;
