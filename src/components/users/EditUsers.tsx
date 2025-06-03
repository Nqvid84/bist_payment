'use client';
import { useDisclosure, Button, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent, Input, Checkbox } from '@nextui-org/react';
import axios from 'axios';
import { useState } from 'react';
import { BiSolidEdit } from 'react-icons/bi';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const EditingAccessibilities = ({ data, setData, className }: { data: any; setData: any; className?: string }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [EditingAdmin, setEditingAdmin] = useState({
    adminId: data.id,
    username: data.username,
    phone: data.phone,
    readCards: data.readCards, // کارت ها
    createCard: data.createCard,
    deleteCard: data.deleteCard,
    updateCard: data.updateCard,
    readDevices: data.readDevices, // دستگاه ها
    createDevice: data.createDevice,
    deleteDevice: data.deleteDevice,
    updateDevice: data.updateDevice,
    readActivities: data.readActivities, // فعالیت ها
    createActivity: data.createActivity,
    deleteActivity: data.deleteActivity,
    updateActivity: data.updateActivity,
    readTransactions: data.readTransactions, // تراکنش ها
    createTransaction: data.createTransaction,
    deleteTransaction: data.deleteTransaction,
    updateTransaction: data.updateTransaction,
    readAdditional: data.readAdditional, // اضافه?!
    createAdditional: data.createAdditional,
    deleteAdditional: data.deleteAdditional,
    updateAdditional: data.updateAdditional,
    readAdmins: data.readAdmins, // ادمین ها
    createAdmin: data.createAdmin,
    deleteAdmin: data.deleteAdmin,
    updateAdmin: data.updateAdmin,
    readAdminNetworkAccess: data.readAdminNetworkAccess, // مدیریت دسترسی به شبکه ها
    createAdminNetworkAccess: data.createAdminNetworkAccess,
    deleteAdminNetworkAccess: data.deleteAdminNetworkAccess,
    readSetting: data.readSetting, // تنظیمات
    createSetting: data.createSetting,
    deleteSetting: data.deleteSetting,
    updateSetting: data.updateSetting,
    readAuditLog: data.readAuditLog, // وقایع کاربران
    createAuditLog: data.createAuditLog,
    deleteAuditLog: data.deleteAuditLog,
    updateAuditLog: data.updateAuditLog,
    readNetwork: data.readNetwork, // شبکه
    createNetwork: data.createNetwork,
    deleteNetwork: data.deleteNetwork,
    updateNetwork: data.updateNetwork,
    readCheque: data.readCheque, // چک
    createCheque: data.createCheque,
    deleteCheque: data.deleteCheque,
    updateCheque: data.updateCheque,
    readInstallment: data.readInstallment, // اقساط
    createInstallment: data.createInstallment,
    deleteInstallment: data.deleteInstallment,
    updateInstallment: data.updateInstallment
  });
  const navigate = useNavigate();
  const location = useLocation();


  const refresh = () => {
    navigate(location.pathname, { replace: true });
  };

  const phoneNumberRegex = /^09\d{9}$/; // a regex for 11 digits number that starts with 09

  return (
    <section className={`flex flex-col items-center justify-center ${className}`}>
      <BiSolidEdit className="cursor-pointer transition-all hover:text-blue-600 active:scale-90 light:text-black dark:text-white" size={25} onClick={onOpen} />
      <Modal scrollBehavior="inside" size="4xl" isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">ویرایش کاربر</ModalHeader>
              <ModalBody className="space-y-6">
                <Input
                  value={EditingAdmin?.username}
                  onChange={e =>
                    setEditingAdmin({
                      ...EditingAdmin,
                      username: e.target.value
                    })
                  }
                  dir="rtl"
                  classNames={{
                    label: 'text-red-500 text-lg mb-2 select-none text-center'
                  }}
                  autoFocus
                  label="username"
                  placeholder=" نام کاربری را وارد کنید"
                  variant="underlined"
                />

                <Input
                  value={EditingAdmin?.phone}
                  onChange={e =>
                    setEditingAdmin({
                      ...EditingAdmin,
                      phone: e.target.value
                    })
                  }
                  dir="rtl"
                  classNames={{
                    label: 'text-red-500 text-lg mb-2 select-none text-center'
                  }}
                  label="phoneNumber"
                  placeholder="شماره تلفن را وارد کنید"
                  variant="underlined"
                  isInvalid={!phoneNumberRegex.test(EditingAdmin?.phone) && EditingAdmin?.phone !== ''}
                  errorMessage={!phoneNumberRegex.test(EditingAdmin?.phone) && EditingAdmin?.phone !== '' && 'شماره تلفن نامعتبر است'}
                />
                {/* access section */}
                <h4 className="border-b-2 border-primary-200 text-center text-xl font-bold text-primary-600">دسترسی ها</h4>
                <section dir="rtl" className="mt-10 grid grid-cols-2 justify-items-start gap-y-5 md:mt-0 md:grid-cols-3 md:gap-x-2 md:gap-y-10">
                  <div className="flex flex-col gap-2 md:gap-4">
                    <Checkbox
                      isSelected={EditingAdmin.readCards && EditingAdmin.createCard && EditingAdmin.deleteCard && EditingAdmin.updateCard}
                      onValueChange={() => {
                        if (!EditingAdmin.readCards && !EditingAdmin.createCard && !EditingAdmin.deleteCard && !EditingAdmin.updateCard) {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readCards: true,
                            createCard: true,
                            deleteCard: true,
                            updateCard: true
                          });
                        } else {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readCards: false,
                            createCard: false,
                            deleteCard: false,
                            updateCard: false
                          });
                        }
                      }}
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center font-semibold mr-2'
                      }}
                      color="secondary"
                    >
                      دسترسی کارت ها
                    </Checkbox>
                    <Checkbox
                      isSelected={EditingAdmin.readCards}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          readCards: !EditingAdmin.readCards
                        })
                      }
                      classNames={{ wrapper: 'bg-white', label: 'text-center' }}
                      color="primary"
                    >
                      مشاهده کارت ها
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.createCard}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          createCard: !EditingAdmin.createCard
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ایجاد کارت
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.deleteCard}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          deleteCard: !EditingAdmin.deleteCard
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      حذف کارت
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.updateCard}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          updateCard: !EditingAdmin.updateCard
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ویرایش کارت
                    </Checkbox>
                  </div>
                  <div className="flex flex-col gap-2 md:gap-4">
                    <Checkbox
                      isSelected={EditingAdmin.readDevices && EditingAdmin.createDevice && EditingAdmin.deleteDevice && EditingAdmin.updateDevice}
                      onValueChange={() => {
                        if (!EditingAdmin.readDevices && !EditingAdmin.createDevice && !EditingAdmin.deleteDevice && !EditingAdmin.updateDevice) {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readDevices: true,
                            createDevice: true,
                            deleteDevice: true,
                            updateDevice: true
                          });
                        } else {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readDevices: false,
                            createDevice: false,
                            deleteDevice: false,
                            updateDevice: false
                          });
                        }
                      }}
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center font-semibold mr-2'
                      }}
                      color="secondary"
                    >
                      دسترسی دستگاه ها
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.readDevices}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          readDevices: !EditingAdmin.readDevices
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      مشاهده دستگاه
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.createDevice}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          createDevice: !EditingAdmin.createDevice
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ایجاد دستگاه
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.deleteDevice}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          deleteDevice: !EditingAdmin.deleteDevice
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      حذف دستگاه
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.updateDevice}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          updateDevice: !EditingAdmin.updateDevice
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ویرایش دستگاه
                    </Checkbox>
                  </div>
                  <div className="flex flex-col gap-2 md:gap-4">
                    <Checkbox
                      isSelected={EditingAdmin.readActivities && EditingAdmin.createActivity && EditingAdmin.deleteActivity && EditingAdmin.updateActivity}
                      onValueChange={() => {
                        if (!EditingAdmin.readActivities && !EditingAdmin.createActivity && !EditingAdmin.deleteActivity && !EditingAdmin.updateActivity) {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readActivities: true,
                            createActivity: true,
                            deleteActivity: true,
                            updateActivity: true
                          });
                        } else {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readActivities: false,
                            createActivity: false,
                            deleteActivity: false,
                            updateActivity: false
                          });
                        }
                      }}
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center font-semibold mr-2'
                      }}
                      color="secondary"
                    >
                      دسترسی فعالیت ها
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.readActivities}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          readActivities: !EditingAdmin.readActivities
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      مشاهده فعالیت
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.createActivity}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          createActivity: !EditingAdmin.createActivity
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ایجاد فعالیت
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.deleteActivity}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          deleteActivity: !EditingAdmin.deleteActivity
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      حذف فعالیت
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.updateActivity}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          updateActivity: !EditingAdmin.updateActivity
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ویرایش فعالیت
                    </Checkbox>
                  </div>
                  <div className="flex flex-col gap-2 md:gap-4">
                    <Checkbox
                      isSelected={EditingAdmin.readTransactions && EditingAdmin.createTransaction && EditingAdmin.deleteTransaction && EditingAdmin.updateTransaction}
                      onValueChange={() => {
                        if (!EditingAdmin.readTransactions && !EditingAdmin.createTransaction && !EditingAdmin.deleteTransaction && !EditingAdmin.updateTransaction) {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readTransactions: true,
                            createTransaction: true,
                            deleteTransaction: true,
                            updateTransaction: true
                          });
                        } else {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readTransactions: false,
                            createTransaction: false,
                            deleteTransaction: false,
                            updateTransaction: false
                          });
                        }
                      }}
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center font-semibold mr-2'
                      }}
                      color="secondary"
                    >
                      دسترسی تراکنش ها
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.readTransactions}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          readTransactions: !EditingAdmin.readTransactions
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      مشاهده تراکنش
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.createTransaction}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          createTransaction: !EditingAdmin.createTransaction
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ایجاد تراکنش
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.deleteTransaction}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          deleteTransaction: !EditingAdmin.deleteTransaction
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      حذف تراکنش
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.updateTransaction}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          updateTransaction: !EditingAdmin.updateTransaction
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ویرایش تراکنش
                    </Checkbox>
                  </div>

                  <div className="flex flex-col gap-2 md:gap-4">
                    <Checkbox
                      isSelected={EditingAdmin.readAdmins && EditingAdmin.createAdmin && EditingAdmin.deleteAdmin && EditingAdmin.updateAdmin}
                      onValueChange={() => {
                        if (!EditingAdmin.readAdmins && !EditingAdmin.createAdmin && !EditingAdmin.deleteAdmin && !EditingAdmin.updateAdmin) {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readAdmins: true,
                            createAdmin: true,
                            deleteAdmin: true,
                            updateAdmin: true
                          });
                        } else {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readAdmins: false,
                            createAdmin: false,
                            deleteAdmin: false,
                            updateAdmin: false
                          });
                        }
                      }}
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center font-semibold mr-2'
                      }}
                      color="secondary"
                    >
                      دسترسی ادمین ها
                    </Checkbox>
                    <Checkbox
                      isSelected={EditingAdmin.readAdmins}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          readAdmins: !EditingAdmin.readAdmins
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      مشاهده ادمین ها
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.createAdmin}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          createAdmin: !EditingAdmin.createAdmin
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ایجاد ادمین
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.deleteAdmin}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          deleteAdmin: !EditingAdmin.deleteAdmin
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      حذف ادمین
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.updateAdmin}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          updateAdmin: !EditingAdmin.updateAdmin
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ویرایش ادمین
                    </Checkbox>
                  </div>

                  <div className="flex flex-col gap-2 md:gap-4">
                    <Checkbox
                      isSelected={EditingAdmin.readSetting && EditingAdmin.createSetting && EditingAdmin.deleteSetting && EditingAdmin.updateSetting}
                      onValueChange={() => {
                        if (!EditingAdmin.readSetting && !EditingAdmin.createSetting && !EditingAdmin.deleteSetting && !EditingAdmin.updateSetting) {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readSetting: true,
                            createSetting: true,
                            deleteSetting: true,
                            updateSetting: true
                          });
                        } else {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readSetting: false,
                            createSetting: false,
                            deleteSetting: false,
                            updateSetting: false
                          });
                        }
                      }}
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center font-semibold mr-2'
                      }}
                      color="secondary"
                    >
                      دسترسی به تنظیمات
                    </Checkbox>
                    <Checkbox
                      isSelected={EditingAdmin.readSetting}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          readSetting: !EditingAdmin.readSetting
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      مشاهده تنظیمات
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.createSetting}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          createSetting: !EditingAdmin.createSetting
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ایجاد تنظیمات
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.deleteSetting}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          deleteSetting: !EditingAdmin.deleteSetting
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      حذف تنظیمات
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.updateSetting}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          updateSetting: !EditingAdmin.updateSetting
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ویرایش تنظیمات
                    </Checkbox>
                  </div>

                  <div className="flex flex-col gap-2 md:gap-4">
                    <Checkbox
                      isSelected={EditingAdmin.readAuditLog && EditingAdmin.createAuditLog && EditingAdmin.deleteAuditLog && EditingAdmin.updateAuditLog}
                      onValueChange={() => {
                        if (!EditingAdmin.readAuditLog && !EditingAdmin.createAuditLog && !EditingAdmin.deleteAuditLog && !EditingAdmin.updateAuditLog) {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readAuditLog: true,
                            createAuditLog: true,
                            deleteAuditLog: true,
                            updateAuditLog: true
                          });
                        } else {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readAuditLog: false,
                            createAuditLog: false,
                            deleteAuditLog: false,
                            updateAuditLog: false
                          });
                        }
                      }}
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center font-semibold mr-2'
                      }}
                      color="secondary"
                    >
                      دسترسی وقایع کاربران
                    </Checkbox>
                    <Checkbox
                      isSelected={EditingAdmin.readAuditLog}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          readAuditLog: !EditingAdmin.readAuditLog
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      مشاهده وقایع کاربران
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.createAuditLog}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          createAuditLog: !EditingAdmin.createAuditLog
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ایجاد وقایع کاربران
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.deleteAuditLog}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          deleteAuditLog: !EditingAdmin.deleteAuditLog
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      حذف وقایع کاربران
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.updateAuditLog}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          updateAuditLog: !EditingAdmin.updateAuditLog
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ویرایش وقایع کاربران
                    </Checkbox>
                  </div>

                  <div className="flex flex-col gap-2 md:gap-4">
                    <Checkbox
                      isSelected={EditingAdmin.readNetwork && EditingAdmin.createNetwork && EditingAdmin.deleteNetwork && EditingAdmin.updateNetwork}
                      onValueChange={() => {
                        if (!EditingAdmin.readNetwork && !EditingAdmin.createNetwork && !EditingAdmin.deleteNetwork && !EditingAdmin.updateNetwork) {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readNetwork: true,
                            createNetwork: true,
                            deleteNetwork: true,
                            updateNetwork: true
                          });
                        } else {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readNetwork: false,
                            createNetwork: false,
                            deleteNetwork: false,
                            updateNetwork: false
                          });
                        }
                      }}
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center font-semibold mr-2'
                      }}
                      color="secondary"
                    >
                      دسترسی شبکه ها
                    </Checkbox>
                    <Checkbox
                      isSelected={EditingAdmin.readNetwork}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          readNetwork: !EditingAdmin.readNetwork
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      مشاهده شبکه ها
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.createNetwork}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          createNetwork: !EditingAdmin.createNetwork
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ایجاد شبکه ها
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.deleteNetwork}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          deleteNetwork: !EditingAdmin.deleteNetwork
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      حذف شبکه ها
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.updateNetwork}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          updateNetwork: !EditingAdmin.updateNetwork
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ویرایش شبکه ها
                    </Checkbox>
                  </div>

                  <div className="flex flex-col gap-2 md:gap-4">
                    <Checkbox
                      isSelected={EditingAdmin.readAdminNetworkAccess && EditingAdmin.createAdminNetworkAccess && EditingAdmin.deleteAdminNetworkAccess}
                      onValueChange={() => {
                        if (!EditingAdmin.readAdminNetworkAccess && !EditingAdmin.createAdminNetworkAccess && !EditingAdmin.deleteAdminNetworkAccess) {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readAdminNetworkAccess: true,
                            createAdminNetworkAccess: true,
                            deleteAdminNetworkAccess: true
                          });
                        } else {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readAdminNetworkAccess: false,
                            createAdminNetworkAccess: false,
                            deleteAdminNetworkAccess: false
                          });
                        }
                      }}
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center font-semibold mr-2'
                      }}
                      color="secondary"
                    >
                      مدیریت دسترسی به شبکه ها
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.createAdminNetworkAccess}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          createAdminNetworkAccess: !EditingAdmin.createAdminNetworkAccess
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ایجاد مدیریت دسترسی به شبکه ها
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.deleteAdminNetworkAccess}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          deleteAdminNetworkAccess: !EditingAdmin.deleteAdminNetworkAccess
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      حذف مدیریت دسترسی به شبکه ها
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.readAdminNetworkAccess}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          readAdminNetworkAccess: !EditingAdmin.readAdminNetworkAccess
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      مشاهده مدیریت دسترسی به شبکه ها
                    </Checkbox>
                  </div>

                  <div className="flex flex-col gap-2 md:gap-4">
                    <Checkbox
                      isSelected={EditingAdmin.readCheque && EditingAdmin.createCheque && EditingAdmin.deleteCheque && EditingAdmin.updateCheque}
                      onValueChange={() => {
                        if (!EditingAdmin.readCheque && !EditingAdmin.createCheque && !EditingAdmin.deleteCheque && !EditingAdmin.updateCheque) {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readCheque: true,
                            createCheque: true,
                            deleteCheque: true,
                            updateCheque: true
                          });
                        } else {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readCheque: false,
                            createCheque: false,
                            deleteCheque: false,
                            updateCheque: false
                          });
                        }
                      }}
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center font-semibold mr-2'
                      }}
                      color="secondary"
                    >
                      مدیریت چک
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.createCheque}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          createCheque: !EditingAdmin.createCheque
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ایجاد چک
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.deleteCheque}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          deleteCheque: !EditingAdmin.deleteCheque
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      حذف چک
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.readCheque}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          readCheque: !EditingAdmin.readCheque
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      مشاهده چک
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.updateCheque}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          updateCheque: !EditingAdmin.updateCheque
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ویرایش چک
                    </Checkbox>
                  </div>

                  <div className="flex flex-col gap-2 md:gap-4">
                    <Checkbox
                      isSelected={EditingAdmin.readInstallment && EditingAdmin.createInstallment && EditingAdmin.deleteInstallment && EditingAdmin.updateInstallment}
                      onValueChange={() => {
                        if (!EditingAdmin.readInstallment && !EditingAdmin.createInstallment && !EditingAdmin.deleteInstallment && !EditingAdmin.updateInstallment) {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readInstallment: true,
                            createInstallment: true,
                            deleteInstallment: true,
                            updateInstallment: true
                          });
                        } else {
                          setEditingAdmin({
                            ...EditingAdmin,
                            readInstallment: false,
                            createInstallment: false,
                            deleteInstallment: false,
                            updateInstallment: false
                          });
                        }
                      }}
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center font-semibold mr-2'
                      }}
                      color="secondary"
                    >
                      مدیریت اقساط
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.createInstallment}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          createInstallment: !EditingAdmin.createInstallment
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ایجاد اقساط
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.deleteInstallment}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          deleteInstallment: !EditingAdmin.deleteInstallment
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      حذف اقساط
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.readInstallment}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          readInstallment: !EditingAdmin.readInstallment
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      مشاهده اقساط
                    </Checkbox>

                    <Checkbox
                      isSelected={EditingAdmin.updateInstallment}
                      onValueChange={() =>
                        setEditingAdmin({
                          ...EditingAdmin,
                          updateInstallment: !EditingAdmin.updateInstallment
                        })
                      }
                      classNames={{
                        wrapper: 'bg-white',
                        label: 'text-center mr-1'
                      }}
                      color="primary"
                    >
                      ویرایش اقساط
                    </Checkbox>
                  </div>
                </section>
              </ModalBody>

              <ModalFooter>
                <Button className="sm:px-10 md:px-16" size="lg" color="danger" variant="flat" onPress={onClose}>
                  بستن
                </Button>
                <Button
                  onClick={() => {
                    const adminData = { ...EditingAdmin };
                    axios
                      .put('/microservice/v1/payment/server/admin/update', adminData)
                      .then(res => {
                        toast.success(res.data.success);
                        axios
                          .get('/microservice/v1/payment/server/admin/list')
                          .then(res => {
                            setData(res.data.data);
                          })
                          .catch(err => toast.error(err.response.data.error || 'Unhandled error !'));

                        onClose();
                        refresh();
                      })
                      .catch(err => toast.error(err.response.data.error || 'Unhandled error !'));
                  }}
                  className="sm:px-10 md:px-16"
                  size="lg"
                  color="primary"
                >
                  ذخیره
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default EditingAccessibilities;
