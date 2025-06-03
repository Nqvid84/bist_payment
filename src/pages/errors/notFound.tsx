import { memo } from 'react'
import { useTheme } from '../../hooks/useTheme';
import { cn } from '@nextui-org/react';
import { Link } from 'react-router-dom';

const notFoundComponent = () => {
  const { theme } = useTheme();

  return (
    <main className={cn(
      "flex flex-col items-center justify-center h-screen w-screen",
      theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'
    )}>
      <div className={cn(
        "flex flex-col items-center justify-center gap-4 py-8 px-16 rounded-lg shadow-lg",
        theme === 'dark' ? 'bg-slate-900' : 'bg-white'
      )}>
        <h1 className='text-primary-800 text-bold'>صفحه مورد نظر یافت نشد</h1>
        <p className='text-gray-500'>از آدرس و مسیر درخواست خود مطمعن شوید و باری دیگر تلاش کنید</p>
        <Link to='/payment-card' className='text-primary-500 hover:underline'>Go to Homepage</Link>
      </div>
    </main>
  )
}

export const NotFound = memo(notFoundComponent)