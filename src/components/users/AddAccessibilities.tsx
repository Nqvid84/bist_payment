'use client';
import { useDisclosure, Button, Modal, ModalHeader, ModalBody, ModalFooter, ModalContent, Input } from '@nextui-org/react';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

const AddingAccessibilities = ({ setData }: { setData: any }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [addingUser, setAddingUser] = useState({
    username: '',
    password: '',
    phone: ''
  });

  const phoneNumberRegex = /^09\d{9}$/; // a regex for 11 digits number that starts with 09

  return (
    <section dir="ltr">
      <Button radius="md" size="lg" className="mt-2 w-40 font-semibold text-white" color="primary" onClick={onOpen}>
        افزودن ادمین
      </Button>
      <Modal size="2xl" isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">افزودن کاربر</ModalHeader>
              <ModalBody className="space-y-6">
                <Input
                  value={addingUser?.username}
                  onChange={e =>
                    setAddingUser({
                      ...addingUser,
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
                  value={addingUser?.password}
                  onChange={e =>
                    setAddingUser({
                      ...addingUser,
                      password: e.target.value
                    })
                  }
                  dir="rtl"
                  classNames={{
                    label: 'text-red-500 text-lg mb-2 select-none text-center'
                  }}
                  label="password"
                  placeholder="رمز عبور را وارد کنید"
                  variant="underlined"
                  isInvalid={addingUser?.password.length < 8 && addingUser?.password !== ''}
                  errorMessage={addingUser?.password.length < 8 && addingUser?.password !== '' && 'رمز عبور باید بیشتر از 8 کاراکتر باشد'}
                />
                <Input
                  value={addingUser?.phone}
                  onChange={e =>
                    setAddingUser({
                      ...addingUser,
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
                  isInvalid={!phoneNumberRegex.test(addingUser?.phone) && addingUser?.phone !== ''}
                  errorMessage={!phoneNumberRegex.test(addingUser?.phone) && addingUser?.phone !== '' && 'شماره تلفن نامعتبر است'}
                />
              </ModalBody>
              <ModalFooter>
                <Button className="sm:px-10 md:px-16" size="lg" color="danger" variant="flat" onPress={onClose}>
                  بستن
                </Button>
                <Button
                  className="sm:px-10 md:px-16"
                  size="lg"
                  color="primary"
                  onPress={() => {
                    axios
                      .post('/microservice/v1/payment/server/admin/create', {
                        username: addingUser?.username,
                        password: addingUser?.password,
                        phone: addingUser?.phone
                      })
                      .then(res => {
                        toast.success(res.data.success);
                        setData(res.data.data);
                        setAddingUser({
                          username: '',
                          password: '',
                          phone: ''
                        });
                        onClose();
                      })
                      .catch(err => toast.error(err.response.data.error.msg));
                  }}
                  isDisabled={addingUser?.username === '' || addingUser?.password.length < 7 || !phoneNumberRegex.test(addingUser?.phone)}
                >
                  افزودن
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  );
};

export default AddingAccessibilities;
