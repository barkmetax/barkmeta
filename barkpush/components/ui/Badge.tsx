import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'gold' | 'outline';
  className?: string;
}

export default function Badge({ children, variant = 'gold', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-block px-3 py-1 text-xs font-semibold rounded-full',
        variant === 'gold' && 'bg-[#d4a843] text-[#0a0a0a]',
        variant === 'outline' && 'border border-[#d4a843] text-[#d4a843]',
        className,
      )}
    >
      {children}
    </span>
  );
}
