import { FC } from 'react';

// Helper function to format card number
const formatCardNumber = (number: string): string => {
  // Remove non-digit characters and trim
  const digits = number.replace(/\D/g, '').trim();
  // Split into groups of 4
  const groups = digits.match(/.{1,4}/g);
  return groups ? groups.join(' ') : digits;
};

// Define BistCard Props
interface BistCardProps {
  cardNumber: string;
  clientName: string;
  //   cardId: number;
}

const BistCard: FC<BistCardProps> = ({ cardNumber, clientName }) => {
  const formattedCardNumber = formatCardNumber(cardNumber);

  return (
    <div className="relative mx-auto mt-4 aspect-[1.586/1] w-full max-w-sm overflow-hidden rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 font-sans shadow-lg dark:from-neutral-950 dark:to-gray-950">
      {/* --- Card Content --- */}
      <div className="relative z-10 flex h-full flex-col justify-between p-4 md:p-5">
        {/* Top Section: Chip and Logo */}
        <div className="flex items-start justify-between">
          {/* Chip */}
          {/* <div className="h-9 w-12 rounded bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 p-px shadow-md md:h-11 md:w-14">
              <div className="flex h-full w-full items-center justify-center rounded bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-400">
                <div className="h-3/5 w-3/5 rounded-sm border border-yellow-600/50"></div>
              </div>
            </div> */}
          <img src="/securityChip.png" alt="Security chip" className='w-72 h-56' />
          {/* BIST Logo */}
          <div className="grid h-10 w-10 grid-cols-2 gap-0.5 md:h-12 md:w-12">
            <div className="flex items-center justify-center rounded-tl-md bg-yellow-400 text-sm font-bold text-black md:text-base">B</div>
            <div className="flex items-center justify-center rounded-tr-md bg-green-500 text-sm font-bold text-black md:text-base">I</div>
            <div className="flex items-center justify-center rounded-bl-md bg-red-500 text-sm font-bold text-black md:text-base">S</div>
            <div className="flex items-center justify-center rounded-br-md bg-gray-100 text-sm font-bold text-black shadow-md dark:bg-white md:text-base">T</div>
          </div>
        </div>

        {/* Middle Section: Title, Card Number, Name */}
        <div className="-mt-4 flex flex-col items-center text-center md:-mt-6">
          <p className="mb-2 text-lg font-semibold text-gray-800 dark:text-white md:mb-3 md:text-xl">بیست کارت</p>
          <p className="mb-1 font-mono text-base tracking-widest text-blue-600 dark:text-yellow-500 md:mb-2 md:text-xl">{formattedCardNumber}</p>
          <p className="text-sm font-medium text-gray-700 dark:text-white md:text-base">{clientName}</p>
        </div>

        {/* Bottom Section: Website */}
        <div className="text-center">
          {/* TODO: Get this address from the env variables or database (what ever😒) */}
          <p className="text-xs text-gray-600 dark:text-white md:text-sm">www.bistcard.shop</p>
        </div>
      </div>
    </div>
  );
};

export default BistCard;
