import { motion } from 'motion/react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { DURATION } from '../../constants';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'lime' | 'outline' | 'ghost';
type Size = 'lg' | 'md' | 'sm';

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-bold whitespace-nowrap select-none transition-colors disabled:opacity-45 disabled:cursor-not-allowed tap';

const variants: Record<Variant, string> = {
  primary: 'bg-forest-900 text-white hover:bg-forest-800 active:bg-forest-950 shadow-sm',
  secondary: 'bg-surface-2 text-forest-900 hover:bg-line-soft border border-line',
  tertiary: 'bg-transparent text-forest-900 hover:bg-surface-2',
  destructive: 'bg-red-600 text-white hover:bg-red-700',
  lime: 'bg-lime-500 text-forest-950 hover:bg-lime-400',
  outline: 'bg-white text-ink border border-line hover:bg-surface-2',
  ghost: 'bg-transparent text-variant hover:text-forest-900 hover:bg-surface-2',
};

const sizes: Record<Size, string> = {
  lg: 'h-[52px] px-6 text-[15px]',
  md: 'h-11 px-4 text-sm',
  sm: 'h-9 px-3 text-[13px]',
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  block?: boolean;
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'lg', loading, block, children, className = '', disabled, ...rest }: Props) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      transition={{ duration: DURATION.instant }}
      className={`${base} ${variants[variant]} ${sizes[size]} ${block ? 'w-full' : ''} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...(rest as object)}
    >
      {loading && <Loader2 size={17} className="animate-spin" aria-hidden />}
      {children}
    </motion.button>
  );
}
