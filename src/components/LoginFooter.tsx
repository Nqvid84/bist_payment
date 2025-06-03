'use client';
import { AnimatePresence, motion } from 'framer-motion';

const Variant = {
  initial: {
    transition: {
      when: 'afterChildren'
    }
  },
  animate: {
    transition: {
      duration: 0.55,
      type: 'just',
      when: 'beforeChildren',
      staggerChildren: 0.55
    }
  },
  exit: {
    transition: {
      duration: 0.55,
      type: 'just',
      when: 'afterChildren',
      staggerChildren: 0.55
    }
  }
};
const Item = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 }
};

/**
 * Renders the login footer component.
 *
 * @param {object} data - The data object containing the HelloProps.
 * @param {HelloProps} data.data - The data object containing the HelloProps.
 * @return {JSX.Element} The rendered login footer component.
 */
const LoginFooter = ({
  data
}: {
  data: {
    message: string;
    developers: {
      backend: {
        name: string;
        email: string;
      };
      frontend: {
        name: string;
        email: string;
      };
    };
  };
}) => {
  return (
    <section className="absolute bottom-1 flex justify-around w-full">
      <AnimatePresence>
        <motion.div variants={Variant} initial="initial" animate="animate" exit="exit" className="flex flex-col justify-center items-center">
          <motion.h2 variants={Item} className="text-3xl text-white font-josefin">
            Backend Developer
          </motion.h2>
          <motion.h3 variants={Item} className="text-xl text-white font-josefin">
            {data?.developers?.backend?.name}
          </motion.h3>
          <motion.p
            variants={Item}
            onClick={() => {
              if (!data?.developers?.backend?.email) return;
              navigator.clipboard.writeText(data?.developers?.backend?.email);
            }}
            className="text-white select-all cursor-pointer"
          >
            {data?.developers?.backend?.email}
          </motion.p>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 333 }}
          transition={{
            duration: 0.66,
            delay: 0.1
          }}
          className="text-3xl text-white font-josefin overflow-hidden truncate"
        >
          {data?.message}
        </motion.h2>
        <motion.div variants={Variant} initial="initial" animate="animate" className="flex flex-col justify-center items-center">
          <motion.h2 variants={Item} className="text-3xl text-white font-josefin">
            Frontend Developer
          </motion.h2>
          <motion.h3 variants={Item} className="text-xl text-white font-josefin">
            {data?.developers?.frontend?.name}
          </motion.h3>
          <motion.p
            variants={Item}
            onClick={() => {
              if (!data?.developers?.frontend?.email) return;
              navigator.clipboard.writeText(data?.developers?.frontend?.email);
            }}
            className="text-white select-all cursor-pointer"
          >
            {data?.developers?.frontend?.email}
          </motion.p>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default LoginFooter;
