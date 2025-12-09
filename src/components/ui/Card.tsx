import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'gradient';
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants = {
      default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
      glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-white/20',
      gradient: 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-200/50 dark:border-blue-800/50',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl p-4 shadow-lg',
          variants[variant],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
