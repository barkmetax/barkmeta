import { cn } from '@/lib/utils';
import { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[#f5f5f5]">{label}</label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-3 bg-[#141414] border border-[#222] rounded-lg text-[#f5f5f5] focus:outline-none focus:border-[#d4a843] transition-colors appearance-none',
            error && 'border-red-500',
            className,
          )}
          {...props}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
export default Select;
