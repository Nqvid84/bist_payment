import React, { memo } from 'react'
import { Link } from 'react-router-dom'

import ThemeToggle from '../../UI/ThemeToggle';
import { IoPerson } from 'react-icons/io5';
import { IconButton } from '../../common/buttons/icon';

const layoutHeaderComponent = () => {
  return (
    <header className='w-full flex flex-row justify-between items-center gap-4 h-12 pr-4'>
      <div className='flex flex-row gap-4 justify-center items-center'>
        <IconButton
          icon={<IoPerson />}
          variant='tertiary'
        />
        <IconButton
          icon={<ThemeToggle />}
          variant='surface'          
        />
        <div className='w-10 h-10 flex justify-center items-center  rounded-full'>
          
        </div>
      </div>
      <div className='flex flex-row gap-4 justify-center items-center'>
        <Link className="cursor-pointer" to="/payment-card">
          <h1 className="w-full text-center text-text font-bold text-xl">
            بیست
          </h1>
        </Link>
        <div className='w-4 h-4 rounded-full bg-primary saturate-200' />
      </div>
    </header>
  )
}

export const Header = memo(layoutHeaderComponent)