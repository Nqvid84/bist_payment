import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import { PiDevicesLight, PiDevicesFill, PiGraphBold, PiGraphLight } from 'react-icons/pi';
import { RiExchangeLine, RiExchangeFill, RiUser3Fill, RiUser3Line, RiShieldKeyholeFill, RiShieldKeyholeLine } from 'react-icons/ri';
import { AiFillDollarCircle, AiOutlineDollar } from 'react-icons/ai';
import { IoExit, IoExitOutline } from 'react-icons/io5';
import axios from 'axios';
import { toast } from 'sonner';
import ThemeToggle from './UI/ThemeToggle';
import { AuroraText } from './UI/AuroraText';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

type HoverStates = 'card-management' | 'device-management' | 'users' | 'profile' | 'history' | 'transactions-device' | 'transactions-network' | 'networks' | 'client' | 'installments' | 'exit';

const LayoutButtons = ({ className }: { className?: string }) => {
  const [infoVisible, setInfoVisible] = useState(false);
  const [isHovered, setIsHovered] = useState<HoverStates>();

  const pathname = useLocation().pathname;
  const navigate = useNavigate();

  return (
    <>
      <LayoutGroup>
        <motion.section
          onMouseEnter={() => setInfoVisible(true)}
          onMouseLeave={() => setInfoVisible(false)}
          className={`flex h-[70%] flex-col justify-center *:ml-px *:h-[66px] *:cursor-pointer light:text-black dark:text-white ${className}`}
        >
          <Link
            className="group relative flex origin-right scale-x-95 items-center justify-around"
            to={'/payment-card/device-management'}
            onMouseEnter={() => setIsHovered('device-management')}
            onMouseLeave={() => setIsHovered(undefined)}
          >
            {infoVisible && (
              <motion.span
                layout
                className="block text-sm group-hover:text-[#FF4081] group-hover:transition-colors light:text-black dark:text-[#EEEEEE]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.33, delay: 0.1, type: 'just' }}
              >
                دستگاه ها
              </motion.span>
            )}
            <motion.div layout>
              {pathname.includes('payment-card/device-management') || isHovered === 'device-management' ? (
                <AnimatePresence>
                  <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <PiDevicesFill size={50} />
                  </motion.i>
                </AnimatePresence>
              ) : (
                <PiDevicesLight size={50} />
              )}
            </motion.div>

            {pathname.includes('payment-card/device-management') && (
              <motion.div layoutId="navLine" className="absolute right-0 -z-10 h-full w-1 shadow-[-2px_0_5px_0_rgb(255,255,255,0.5)] light:bg-neutral-900 dark:bg-white" />
            )}
          </Link>

          <Link
            className="group flex origin-right scale-x-95 items-center justify-around"
            to={'/payment-card/transactions-network'}
            onMouseEnter={() => setIsHovered('transactions-network')}
            onMouseLeave={() => setIsHovered(undefined)}
          >
            {infoVisible && (
              <motion.span
                layout
                className="block text-center text-sm group-hover:text-[#FF4081] group-hover:transition-colors light:text-black dark:text-[#EEEEEE]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.33, delay: 0.1, type: 'just' }}
              >
                تراکنش ها
              </motion.span>
            )}
            <motion.div layout>
              {pathname.includes('payment-card/transactions-network') || isHovered === 'transactions-network' ? (
                <AnimatePresence>
                  <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <RiExchangeFill size={50} />
                  </motion.i>
                </AnimatePresence>
              ) : (
                <RiExchangeLine size={50} />
              )}
            </motion.div>

            {pathname.includes('payment-card/transactions-network') && (
              <motion.div layoutId="navLine" className="absolute right-0 -z-10 h-full w-1 shadow-[-2px_0_5px_0_rgb(255,255,255,0.5)] light:bg-neutral-900 dark:bg-white" />
            )}
          </Link>
          <Link
            className="group flex origin-right scale-x-95 items-center justify-around"
            to={'/payment-card/networks'}
            onMouseEnter={() => setIsHovered('networks')}
            onMouseLeave={() => setIsHovered(undefined)}
          >
            {infoVisible && (
              <motion.span
                layout
                className="block text-sm group-hover:text-[#FF4081] group-hover:transition-colors light:text-black dark:text-[#EEEEEE]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.33, delay: 0.1, type: 'just' }}
              >
                شبکه ها
              </motion.span>
            )}
            <motion.div layout>
              {pathname.includes('payment-card/networks') || isHovered === 'networks' ? (
                <AnimatePresence>
                  <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <PiGraphBold size={50} />
                  </motion.i>
                </AnimatePresence>
              ) : (
                <PiGraphLight size={50} />
              )}
            </motion.div>

            {pathname.includes('payment-card/networks') && (
              <motion.div layoutId="navLine" className="absolute right-0 -z-10 h-full w-1 shadow-[-2px_0_5px_0_rgb(255,255,255,0.5)] light:bg-neutral-900 dark:bg-white" />
            )}
          </Link>

          <Link
            className="group flex origin-right scale-x-95 items-center justify-around"
            to={'/payment-card/client'}
            onMouseEnter={() => setIsHovered('client')}
            onMouseLeave={() => setIsHovered(undefined)}
          >
            {infoVisible && (
              <motion.span
                layout
                className="block text-sm group-hover:text-[#FF4081] group-hover:transition-colors light:text-black dark:text-[#EEEEEE]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.33, delay: 0.1, type: 'just' }}
              >
                مشتریان
              </motion.span>
            )}
            <motion.div layout>
              {pathname.includes('payment-card/client') || isHovered === 'client' ? (
                <AnimatePresence>
                  <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <RiUser3Fill size={50} />
                  </motion.i>
                </AnimatePresence>
              ) : (
                <RiUser3Line size={50} />
              )}
            </motion.div>

            {pathname.includes('payment-card/client') && (
              <motion.div layoutId="navLine" className="absolute right-0 -z-10 h-full w-1 shadow-[-2px_0_5px_0_rgb(255,255,255,0.5)] light:bg-neutral-900 dark:bg-white" />
            )}
          </Link>

          <Link
            className="group flex origin-right scale-x-95 items-center justify-around"
            to={'/payment-card/installments'}
            onMouseEnter={() => setIsHovered('installments')}
            onMouseLeave={() => setIsHovered(undefined)}
          >
            {infoVisible && (
              <motion.span
                layout
                className="block text-sm group-hover:text-[#FF4081] group-hover:transition-colors light:text-black dark:text-[#EEEEEE]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.33, delay: 0.1, type: 'just' }}
              >
                قسط ها
              </motion.span>
            )}
            <motion.div layout>
              {pathname.includes('payment-card/installments') || isHovered === 'installments' ? (
                <AnimatePresence>
                  <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <AiFillDollarCircle size={50} />
                  </motion.i>
                </AnimatePresence>
              ) : (
                <AiOutlineDollar size={50} />
              )}
            </motion.div>

            {pathname.includes('payment-card/installments') && (
              <motion.div layoutId="navLine" className="absolute right-0 -z-10 h-full w-1 shadow-[-2px_0_5px_0_rgb(255,255,255,0.5)] light:bg-neutral-900 dark:bg-white" />
            )}
          </Link>

          <Link
            className="group flex origin-right scale-x-95 items-center justify-around"
            to={'/payment-card/users'}
            onMouseEnter={() => setIsHovered('users')}
            onMouseLeave={() => setIsHovered(undefined)}
          >
            {infoVisible && (
              <motion.span
                layout
                className="block text-sm group-hover:text-[#FF4081] group-hover:transition-colors light:text-black dark:text-[#EEEEEE]"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.33, delay: 0.1, type: 'just' }}
              >
                ادمین‌ها
              </motion.span>
            )}
            <motion.div layout>
              {pathname.includes('payment-card/users') || isHovered === 'users' ? (
                <AnimatePresence>
                  <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <RiShieldKeyholeFill size={50} />
                  </motion.i>
                </AnimatePresence>
              ) : (
                <RiShieldKeyholeLine size={50} />
              )}
            </motion.div>

            {pathname.includes('payment-card/users') && (
              <motion.div layoutId="navLine" className="absolute right-0 -z-10 h-full w-1 shadow-[-2px_0_5px_0_rgb(255,255,255,0.5)] light:bg-neutral-900 dark:bg-white" />
            )}
          </Link>
        </motion.section>
{/* 
        <section className="flex h-[20%] flex-col items-center justify-center gap-1">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              delay: 1.5,
              ease: 'easeInOut',
              damping: 15,
              stiffness: 99
            }}
          >
            <ThemeToggle />
          </motion.div>

          <Link to="/payment-card/profile">
            <div className="cursor-pointer rounded-3xl transition-all hover:animate-spin active:scale-90">
              <IoSettingsOutline className="light:text-black dark:text-white" size={50} />
            </div>
          </Link>

          <div
            className="cursor-pointer"
            title="خروج از حساب کاربری"
            onMouseEnter={() => setIsHovered('exit')}
            onMouseLeave={() => setIsHovered(undefined)}
            onClick={() => {
              axios
                .get('/microservice/v1/payment/server/auth/logout/admin')
                .then(res => {
                  if (res.data.success) {
                    toast.warning('Logged out successfully !');
                    navigate('/');
                  }
                })
                .catch(() => {
                  toast.error('Unhandled error');
                });
            }}
          >
            {isHovered === 'exit' ? (
              <AnimatePresence>
                <motion.i initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <IoExit className="light:text-black dark:text-white" size={50} />
                </motion.i>
              </AnimatePresence>
            ) : (
              <IoExitOutline className="light:text-black dark:text-white" size={50} />
            )}
          </div>
        </section> */}
      </LayoutGroup>
    </>
  );
};

export default LayoutButtons;
