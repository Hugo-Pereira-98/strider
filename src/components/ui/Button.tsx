import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
  {
    variants: {
      variant: {
        default:
          'bg-gray-light-900 text-gray-light-50 hover:bg-gray-light-900/90 dark:bg-gray-dark-50 dark:text-gray-dark-900 dark:hover:bg-gray-dark-50/90',
        destructive:
          'bg-red-500 text-gray-light-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-gray-dark-50 dark:hover:bg-red-900/90',
        outline:
          'bg-white dark:bg-gray-dark-950 border border-gray-light-300  hover:bg-gray-light-100 hover:text-gray-light-900 dark:border-gray-dark-700 dark:hover:bg-gray-dark-800 dark:hover:text-gray-light-50',
        secondary:
          'bg-gray-light-100 text-gray-light-900 hover:bg-gray-light-100/80 dark:bg-gray-dark-800 dark:text-gray-dark-50 dark:hover:bg-gray-dark-800/80',
        ghost:
          'hover:bg-gray-light-100 hover:text-gray-light-900 dark:hover:bg-gray-dark-800 dark:hover:text-gray-light-50',
        link: 'text-gray-light-900 underline-offset-4 hover:underline dark:text-gray-dark-50',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
