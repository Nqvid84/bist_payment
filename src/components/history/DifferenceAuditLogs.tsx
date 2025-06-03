'use client';

import { motion } from 'framer-motion';
interface ObjectShape {
  [key: string]: any;
}

interface DifferenceProps {
  object1: ObjectShape;
  object2: ObjectShape;
  className?: string;
}

const DifferenceAuditLogs: React.FC<DifferenceProps> = ({ object1, object2, className }) => {
  const keys = Object.keys({ ...object1, ...object2 });
  const differences: { [key: string]: { oldValue: any; newValue: any } } = keys.reduce((acc, key) => {
    if (object1[key] !== object2[key]) {
      //@ts-ignore
      acc[key] = {
        oldValue: String(object1[key]),
        newValue: String(object2[key])
      };
    }
    return acc;
  }, {});

  return (
    <motion.div initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.33, delay: 0.11 }} className={className}>
      <h2 className="text-2xl text-center text-sky-500 font-josefin font-bold py-2 md:py-5">Differences</h2>
      {Object.entries(differences).map(([key, { oldValue, newValue }]) => (
        <div className="w-full py-1 md:py-3 grid grid-cols-1 sm:grid-cols-3" key={key}>
          <p className="text-sky-200">
            <strong>{key} :</strong>
          </p>

          <span className="text-red-400 ml-2 md:ml-4">{oldValue}</span>

          <span className="text-green-400 ml-2 md:ml-4">{newValue}</span>
        </div>
      ))}
    </motion.div>
  );
};

export default DifferenceAuditLogs;
