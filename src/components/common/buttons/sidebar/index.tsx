import { cn } from '@nextui-org/react';
import React, { memo, ReactNode } from 'react'

interface sidebarButtonProps {
  icon?: ReactNode;
  variant: "primary" | "secondary" | "tertiary" | "ghost" | "surface"
  title: string,
  disabled?: boolean;
  isExpanded: boolean;
  onClick?: () => void;
}

const sidebarButton = ({
  isExpanded,
  variant,
  title,
  disabled,
  icon,
  onClick,
}: sidebarButtonProps) => {
  return (
    <button
      dir='rtl'
      className={cn(
        "h-11 rounded-lg bg-surface transition-all ease-in-out duration-300 flex flex-row gap-2 items-center text-lg hover:scale-105",
        isExpanded ? 'w-full pr-2' : 'w-11 justify-center',
        variant === "ghost" && "bg-background-alt dark:bg-dark-background-alt hover:bg-background hover:bg-opacity-15 dark:hover:bg-dark-background dark:hover:bg-opacity-65",
        variant === "surface" && "bg-surface dark:bg-dark-surface bg-opacity-50 dark:bg-opacity-50",
        variant === "tertiary" && "bg-muted !text-dark-text",
        variant === "primary" && "bg-primary text-dark-text",
        variant === "secondary" && "bg-primary-dark text-dark-text",
        disabled && "opacity-50"
      )}
      disabled={disabled}
      onClick={onClick}
    >
      <span className='text-xl'>
        {icon}
      </span>
      <h3 className={`${isExpanded ? 'opacity-100' : 'opacity-0 text-[0px] w-0 -mr-2 '} text-base text-nowrap transition-all ease-in-out duration-300`}>{title}</h3>
    </button>
  )
}

export const SidebarButton = memo(sidebarButton)