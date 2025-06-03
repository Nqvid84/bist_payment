'use client';

import { motion } from 'framer-motion';
import { IoMoon, IoSunny } from 'react-icons/io5';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
  const { theme, toggleTheme, mounted } = useTheme();
  const isDark = theme === 'dark';

  // Don't render anything until after hydration to avoid hydration mismatch
  if (!mounted) {
    return <div className="h-10 w-10 rounded-full bg-neutral-300 dark:bg-neutral-950" />;
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative flex h-10 w-10 items-center justify-center rounded-full light:bg-neutral-300 dark:bg-neutral-950"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 0 : 1,
          opacity: isDark ? 0 : 1,
          rotate: isDark ? 90 : 0
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <IoSunny className="h-5 w-5 text-amber-500" />
      </motion.div>
      <motion.div
        initial={false}
        animate={{
          scale: isDark ? 1 : 0,
          opacity: isDark ? 1 : 0,
          rotate: isDark ? 0 : -90
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="absolute"
      >
        <IoMoon className="h-5 w-5 text-blue-400" />
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
