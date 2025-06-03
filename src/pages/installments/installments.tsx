import { Card, CardBody, Skeleton } from '@nextui-org/react';
import { MdManageAccounts, MdPerson } from 'react-icons/md';
import { SiLevelsdotfyi } from 'react-icons/si';
import { CiShop } from 'react-icons/ci';
import { GoOrganization } from 'react-icons/go';
import { useState, useEffect, memo } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const installmentsPageComponent = () => {
  const [subType, setSubType] = useState<'store' | 'organization' | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const getSubType = () => {
    axios
      .get('/microservice/v1/payment/server/auth/admin/subType')
      .then(res => {
        setSubType(res.data.subType);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getSubType();
    setIsMounted(true);
  }, []);

  if (!isMounted) return <Skeleton className="h-full w-full" />;
  return (
    <main dir="rtl" className="mx-auto space-y-6 p-4">
      <header className="w-full">
        <h1 className="text-2xl font-bold">اقساط</h1>
      </header>

      {/* TODO: The top margin is temporary, it should be removed */}
      <section className="grid grid-cols-1 gap-6 md:mt-40 md:grid-cols-2 lg:mt-60 lg:grid-cols-3">
        <Card as={Link} to="/payment-card/installments/management" isPressable isHoverable>
          <CardBody className="flex items-center justify-center gap-x-2">
            <h2 className="text-center text-lg font-semibold">تنظیمات اقساط</h2>
            <MdManageAccounts size={32} />
          </CardBody>
        </Card>

        <Card as={Link} to="/payment-card/installments/stores" isPressable isHoverable>
          <CardBody className="flex items-center justify-center gap-x-2">
            <h2 className="text-center text-lg font-semibold">اقساط {subType === 'organization' ? 'فروشگاه ها' : 'سازمان ها'}</h2>
            {subType === 'organization' ? <CiShop size={32} /> : <GoOrganization size={32} />}
          </CardBody>
        </Card>

        {subType === 'organization' && (
          <>
            <Card as={Link} to="/payment-card/installments/employees" isPressable isHoverable>
              <CardBody className="flex items-center justify-center gap-x-2">
                <h2 className="text-center text-lg font-semibold">اقساط کارمندان</h2>
                <MdPerson size={32} />
              </CardBody>
            </Card>

            {/* Installments levels */}
            <Card as={Link} to="/payment-card/installments/levels" isPressable isHoverable>
              <CardBody className="flex items-center justify-center gap-x-2">
                <h2 className="text-center text-lg font-semibold">سطوح اقساط</h2>
                <SiLevelsdotfyi size={32} />
              </CardBody>
            </Card>
          </>
        )}
      </section>
    </main>
  );
};

export const Installments = memo(installmentsPageComponent);
