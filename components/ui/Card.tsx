import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({ className, hover = true, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-[#141414] border border-[#222] rounded-xl p-6',
        hover && 'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
