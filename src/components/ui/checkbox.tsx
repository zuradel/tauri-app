import * as React from 'react';
import { CheckIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }
>(({ className, checked, onCheckedChange, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(checked || false);

  React.useEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleClick = React.useCallback(() => {
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onCheckedChange?.(newCheckedState);
  }, [isChecked, onCheckedChange]);

  return (
    <button
      type='button'
      role='checkbox'
      aria-checked={isChecked}
      data-state={isChecked ? 'checked' : 'unchecked'}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
        className
      )}
      ref={ref}
      onClick={handleClick}
      {...props}
    >
      {isChecked && <CheckIcon className='h-3 w-3' />}
    </button>
  );
});
Checkbox.displayName = 'Checkbox';

export { Checkbox };
