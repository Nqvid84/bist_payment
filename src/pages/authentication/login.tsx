import { useState, useEffect, memo } from 'react';
import { Button } from '@nextui-org/react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

const LoginComponent = () => {
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countDown, setCountdown] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/microservice/v1/payment/server/auth/admin')
      .then(res => {
        if (res.status === 200) {
          navigate('/payment-card');
        }
      })
      .catch(() => {
      });
  }, []);

  useEffect(() => {
    // Countdown timer
    if (countDown > 0) {
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev === 1) {
            clearInterval(interval);
            return 0;
          }

          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [countDown]);

  const requestOtpCode = () => {
    axios
      .post('/microservice/v1/payment/server/auth/login/admin-request-code', { phone: phoneNumber })
      .then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            // If there is an error in the response, show the error message
            toast.warning(res.data.error);
          } else {
            // If there is no error, show the success message
            toast.success(res.data.success || 'OTP code sent successfully');
          }

          // Update the initial time which will trigger the countdown
          setCountdown(res.data?.remainingTime);

          if (!res.data.error) setIsCodeSent(true);
        } else {
          toast.error(res.data.error);
        }
      })
      .catch(err => {
        toast.error(err.response ? err.response.data.error : 'Error sending OTP code');
      });
  };

  const verifyOtpCode = () => {
    axios
      .post('/microservice/v1/payment/server/auth/login/admin-verify-code', { phone: phoneNumber, code: otpCode.join('') })
      .then(res => {
        if (res.status === 200) {
          // toast.success(res.data.success || 'Redirecting to payment card page');
          setLoading(true);
          navigate('/payment-card');
        } else {
          toast.error(res.data.error || 'Error verifying OTP code');
        }
      })
      .catch(err => {
        toast.error(err.response ? err.response.data.error : 'Error verifying OTP code');
      });
  };

  // Auto login when OTP is filled
  useEffect(() => {
    const isOTPCodeFilled = otpCode.every(code => code.length === 1);

    if (isOTPCodeFilled) verifyOtpCode();
  }, [otpCode]);

  return (
    <main className={`h-screen transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'}`}>
      {/* Theme Toggle Button */}
      <Button
        isIconOnly
        radius="full"
        size="lg"
        className="fixed bottom-6 left-6 z-50 shadow-lg transition-all duration-300 hover:scale-110"
        color={theme === 'dark' ? 'warning' : 'primary'}
        variant="shadow"
        onClick={toggleTheme}
      >
        {theme === 'dark' ? <FiSun size={20} /> : <FiMoon size={20} />}
      </Button>

      {loading && ( // Loading animation
        <motion.div
          className={`absolute inset-0 z-40 flex items-center justify-center backdrop-blur-sm ${theme === 'dark' ? 'bg-slate-900/80' : 'bg-slate-100/80'}`}
          initial={{ y: '100vh' }}
          animate={{ y: loading ? 0 : '100vh' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.p
            className={`animate-pulse text-center text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}
            initial={{ opacity: 0, scale: 0.5, y: -100 }}
            animate={loading && { opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, ease: 'easeInOut' }}
          >
            ... درحال انتقال به صفحه پرداخت
          </motion.p>
        </motion.div>
      )}

      <section
        className={`absolute right-1/2 top-1/2 flex h-[250px] w-[90%] -translate-y-1/2 translate-x-1/2 flex-col items-center gap-y-5 rounded-2xl p-1 shadow transition-all duration-1000 sm:w-[500px] md:w-[580px] ${
          theme === 'dark' ? 'bg-slate-900 shadow-white/30' : 'bg-white shadow-slate-300/50'
        }`}
      >
        {!isCodeSent ? (
          <div className="relative flex h-full w-full flex-col items-center p-4">
            <h3 className={`my-4 text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>شماره تلفن خود را وارد کنید</h3>
            <input
              dir="rtl"
              placeholder="۰۹۱۲۳۴۵۶۷۸۹"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              name="phoneNumber"
              className={`w-10/12 rounded-xl border p-3 text-lg shadow outline-none ring-0 focus:shadow-lg focus:ring-0 focus:transition-shadow ${
                theme === 'dark'
                  ? 'border-white bg-slate-950/80 text-white shadow-white/30 focus:shadow-white/30'
                  : 'border-slate-300 bg-slate-50 text-slate-900 shadow-slate-300/30 focus:shadow-slate-400/30'
              }`}
              type="tel"
            />
            <Button
              variant="ghost"
              color="primary"
              radius="sm"
              onPress={requestOtpCode}
              isDisabled={!/^09\d{9}$/.test(phoneNumber) || countDown > 0}
              className="mt-4 w-10/12 py-5 text-lg font-semibold text-primary-500"
            >
              {countDown > 0 ? `دوباره در ${countDown} ثانیه` : 'ارسال کد یکبار مصرف'}
            </Button>
          </div>
        ) : (
          <div className="relative flex h-full w-full flex-col items-center p-4">
            <h3 className={`my-4 text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>کد 4 رقمی را وارد کنید</h3>
            <div className="flex items-center justify-center gap-x-2 *:aspect-square *:size-16">
              {
                // OTP Code
                otpCode.map((_, index) => (
                  <motion.input
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    autoFocus={index === 0}
                    key={index}
                    dir="rtl"
                    value={otpCode[index]}
                    onChange={e => {
                      if (e.target.value.length === 1) {
                        // If the input is filled, focus on the next input
                        const nextInput = document.getElementById(`otpCode-${index + 1}`);
                        if (nextInput) {
                          nextInput.focus();
                        }
                      }

                      if (e.target.value.length === 0 && index > 0) {
                        // If the input is empty and the index is greater than 0, focus on the previous input
                        const prevInput = document.getElementById(`otpCode-${index - 1}`);
                        if (prevInput) {
                          prevInput.focus();
                        }
                      }

                      setOtpCode(prev => {
                        // Update the OTP code
                        const newOtpCode = [...prev];
                        newOtpCode[index] = e.target.value;
                        return newOtpCode;
                      });
                    }}
                    id={`otpCode-${index}`}
                    className={`rounded-lg border p-1 text-center text-lg shadow outline-none ring-0 focus:shadow-lg focus:ring-0 focus:transition-shadow ${
                      theme === 'dark'
                        ? 'border-white bg-slate-800 text-white shadow-white/30 focus:shadow-white/30'
                        : 'border-slate-300 bg-slate-50 text-slate-900 shadow-slate-300/30 focus:shadow-slate-400/30'
                    }`}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))
              }
            </div>
            <Button
              variant="ghost"
              color="secondary"
              radius="sm"
              onPress={() => {
                setOtpCode(['', '', '', '']);
                setIsCodeSent(false);
              }}
              className="mt-6 w-8/12 py-4 text-lg font-semibold text-secondary-500"
            >
              شماره تلفن را تغییر دهید
            </Button>
          </div>
        )}
      </section>
    </main>
  );
};

export const Login = memo(LoginComponent) 
