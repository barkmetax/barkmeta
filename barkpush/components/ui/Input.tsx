import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[#f5f5f5]">{label}</label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-[#141414] border border-[#222] rounded-lg text-[#f5f5f5] placeholder-[#666] focus:outline-none focus:border-[#d4a843] transition-colors',
            error && 'border-red-500',
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
