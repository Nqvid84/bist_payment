'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'sonner';
import { IoSettingsOutline, IoExitOutline, IoHomeOutline, IoHome, IoMenuOutline, IoCloseOutline } from 'react-icons/io5';
import { PiDevicesLight, PiDevicesFill, PiGraphLight, PiGraphBold } from 'react-icons/pi';
import { RiExchangeLine, RiExchangeFill, RiUser3Fill, RiUser3Line, RiShieldKeyholeFill, RiShieldKeyholeLine, RiInstallFill, RiInstallLine } from 'react-icons/ri';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ThemeToggle from './UI/ThemeToggle';
import { cn } from '@nextui-org/react';

// Navigation items with their icons and labels
const navItems = [
  {
    id: 'home',
    label: 'خانه',
    path: '/payment-card',
    icon: IoHomeOutline,
    activeIcon: IoHome
  },
  {
    id: 'clients',
    label: 'مشتریان',
    path: '/payment-card/client',
    icon: RiUser3Line,
    activeIcon: RiUser3Fill
  },
  {
    id: 'transactions',
    label: 'تراکنش ها',
    path: '/payment-card/transactions-network',
    icon: RiExchangeLine,
    activeIcon: RiExchangeFill
  },
  {
    id: 'installments',
    label: 'قسط ها',
    path: '/payment-card/installments',
    icon: RiInstallLine,
    activeIcon: RiInstallFill
  },
  {
    id: 'networks',
    label: 'شبکه ها',
    path: '/payment-card/networks',
    icon: PiGraphLight,
    activeIcon: PiGraphBold
  },
  {
    id: 'devices',
    label: 'دستگاه ها',
    path: '/payment-card/device-management',
    icon: PiDevicesLight,
    activeIcon: PiDevicesFill
  },
  {
    id: 'admins',
    label: 'ادمین‌ها',
    path: '/payment-card/users',
    icon: RiShieldKeyholeLine,
    activeIcon: RiShieldKeyholeFill
  }
];

// Secondary menu items
const secondaryMenuItems = [
  {
    id: 'settings',
    label: 'تنظیمات',
    path: '/payment-card/profile',
    icon: IoSettingsOutline
  },
  {
    id: 'theme',
    label: 'تم',
    icon: null // Special case for theme toggle
  },
  {
    id: 'logout',
    label: 'خروج',
    icon: IoExitOutline,
    isDanger: true
  }
];

const MobileNav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleLogout = () => {
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
  };

  const handleSecondaryItemClick = (id: string) => {
    if (id === 'logout') {
      handleLogout();
    }
    setIsMenuOpen(false);
  };

  // Don't render anything if not on mobile
  if (!isMobile) return null;

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white/90 shadow-lg backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-900/90 md:hidden"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
          {/* Main Navigation Tabs */}
          <div className="flex items-center justify-center gap-1">
            {navItems.slice(0, 4).map(item => {
              const isActive = location.pathname === item.path || (item.path !== '/payment-card' && location.pathname.includes(item.path));
              const Icon = isActive ? item.activeIcon : item.icon;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'flex flex-col items-center justify-center rounded-xl p-2 transition-all duration-200',
                    isActive ? 'text-primary-600 dark:text-primary-400' : 'text-neutral-600 hover:text-primary-500 dark:text-neutral-400 dark:hover:text-primary-300'
                  )}
                >
                  <Icon size={24} />
                  <span className="mt-1 text-xs font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex size-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition-colors dark:bg-primary-900/20 dark:text-primary-400"
          >
            {isMenuOpen ? <IoCloseOutline size={24} /> : <IoMenuOutline size={24} />}
          </button>
        </div>
      </motion.div>

      {/* Bottom Sheet Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-10 bg-black/20 backdrop-blur-sm dark:bg-black/40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Bottom Sheet */}
            <motion.div
              dir="rtl"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed bottom-16 left-0 right-0 z-20 overflow-hidden rounded-t-3xl bg-white shadow-xl dark:bg-neutral-900 md:hidden"
            >
              <div className="p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-white">منو</h3>
                  <button onClick={() => setIsMenuOpen(false)} className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                    <IoCloseOutline size={24} className="text-neutral-600 dark:text-neutral-400" />
                  </button>
                </div>

                {/* Secondary Navigation Items */}
                <div className="grid grid-cols-2 gap-2">
                  {secondaryMenuItems.map(item => (
                    <div key={item.id}>
                      {item.id === 'theme' ? (
                        <div className="flex items-center justify-between rounded-xl bg-neutral-50 p-3 dark:bg-neutral-800/50">
                          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{item.label}</span>
                          <ThemeToggle />
                        </div>
                      ) : (
                        <Link
                          to={item.path || '#'}
                          onClick={() => handleSecondaryItemClick(item.id)}
                          className={cn(
                            'flex items-center rounded-xl p-3 transition-colors',
                            item.isDanger
                              ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
                              : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                          )}
                        >
                          {item.icon && <item.icon size={20} className="ml-2" />}
                          <span className="text-sm font-medium">{item.label}</span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Additional Navigation Items */}
                <div className="mt-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                  <h4 className="mb-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">بیشتر</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {navItems.slice(4).map(item => {
                      const isActive = location.pathname === item.path || (item.path !== '/payment-card' && location.pathname.includes(item.path));
                      const Icon = isActive ? item.activeIcon : item.icon;

                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            'flex flex-col items-center justify-center rounded-xl p-3 transition-all',
                            isActive
                              ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400'
                              : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                          )}
                        >
                          <Icon size={22} />
                          <span className="mt-1 text-xs font-medium">{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNav;
