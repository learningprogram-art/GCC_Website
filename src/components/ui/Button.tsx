import React from 'react'
import { cn } from '@/utils/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'on-dark'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface BaseButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  showIcon?: boolean
  icon?: React.ReactNode
  fullWidth?: boolean
  className?: string
  children?: React.ReactNode
}

export type ButtonAsButton = BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & {
    href?: undefined
  }

export type ButtonAsLink = BaseButtonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps> & {
    href: string
  }

export type ButtonProps = ButtonAsButton | ButtonAsLink

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('shrink-0 size-[24px]', className)}
      aria-hidden="true"
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  )
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#6F1D1B] text-white hover:bg-[#5A1716] active:bg-[#481211] shadow-sm',
  secondary:
    'border border-[#252422] text-[#252422] bg-transparent hover:bg-[#252422]/5 active:bg-[#252422]/10',
  'on-dark':
    'bg-[#FFFCF2] text-[#252422] hover:bg-[#f5efe2] active:bg-[#ece5d2] shadow-sm',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'py-3 pl-6 pr-5 text-[14px] font-semibold uppercase leading-4 tracking-[1.12px]',
  md: 'py-3 pl-6 pr-5 text-[18px] font-bold leading-7 tracking-[-0.36px]',
  lg: 'py-[15px] pl-6 pr-5 text-[18px] font-bold leading-7 tracking-[-0.36px]',
}

export const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>(function Button(
  {
    variant = 'primary',
    size = 'md',
    showIcon = true,
    icon,
    fullWidth = false,
    className,
    children,
    ...props
  },
  ref
) {
  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 rounded-[8px] font-["Hanken_Grotesk",sans-serif] whitespace-nowrap transition-colors duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50',
    variantStyles[variant],
    sizeStyles[size],
    fullWidth && 'w-full',
    className
  )

  const iconElement =
    icon !== undefined ? icon : showIcon ? <ChevronRight /> : null

  if (props.href !== undefined) {
    const { href, ...anchorProps } = props as ButtonAsLink
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={baseClasses}
        {...anchorProps}
      >
        <span>{children}</span>
        {iconElement}
      </a>
    )
  }

  const { type = 'button', ...buttonProps } = props as ButtonAsButton
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={type}
      className={baseClasses}
      {...buttonProps}
    >
      <span>{children}</span>
      {iconElement}
    </button>
  )
})

export default Button

