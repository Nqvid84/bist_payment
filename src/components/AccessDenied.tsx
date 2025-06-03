import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function AccessDenied() {
  return (
    <div className="flex min-h-[80vh] w-full flex-col items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
        <div className="relative mb-8 inline-block">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
            <FaLock className="h-12 w-12 text-primary" />
          </motion.div>
        </div>

        <h1 className="mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold text-transparent">دسترسی محدود</h1>

        <p className="mx-auto mb-8 max-w-md text-lg text-foreground/80">شما دسترسی به این صفحه را ندارید. لطفا اگر این یک خطا است، با مدیر سامانه تماس بگیرید</p>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link to="/payment-card" className="rounded-lg bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-primary/90">
            بازگشت به صفحه اصلی
          </Link>
          <button onClick={() => window.history.back()} className="border-border hover:bg-muted rounded-lg border px-6 py-3 transition-colors">
            بازگشت
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="h-3 w-3 rounded-full bg-primary/60" />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="h-3 w-3 rounded-full bg-primary/60" />
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="h-3 w-3 rounded-full bg-primary/60" />
        </div>
      </motion.div>
    </div>
  );
}
