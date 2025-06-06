import { cn } from '@nextui-org/react';
import React, { memo, ReactNode } from 'react'

interface iconButtonProps {
  icon: ReactNode;
  variant: "primary" | "secondary" | "tertiary" | "ghost" | "surface"
  size?: "l" | "s" | "m"
  disabled?: boolean
  onClick?: () => void;
}

const iconButton = ({
  icon,
  size = "m",
  variant,
  disabled = false,
  onClick
}: iconButtonProps) => {
  return (
    <button
      className={cn(
        "rounded-full cursor-pointer flex justify-center items-center text-xl text-text",
        size === "s" && "w-8 h-8 ",
        size === "m" && "w-10 h-10 ",
        size === "l" && "w-12 h-12 ",
        variant === "ghost" && "bg-background-alt dark:bg-dark-background-alt hover:bg-background hover:bg-opacity-15",
        variant === "surface" && "bg-surface dark:bg-dark-surface bg-opacity-50 dark:bg-opacity-50",
        variant === "tertiary" && "bg-muted !text-dark-text",
        disabled && "opacity-50"
      )}
      disabled={disabled}
      onClick={onClick}
      >
      {icon}
    </button>)
}

export const IconButton = memo(iconButton)