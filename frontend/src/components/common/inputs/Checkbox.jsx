import React, { forwardRef } from 'react';

const Checkbox = forwardRef(({
  label,
  name,
  error,
  required = false,
  className = '',
  disabled = false,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label className="inline-flex items-start gap-2.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
        <input
          ref={ref}
          type="checkbox"
          name={name}
          disabled={disabled}
          className="mt-1 h-4.5 w-4.5 rounded border-border text-primary focus:ring-primary focus:ring-opacity-40 transition-colors disabled:opacity-50"
          {...props}
        />
        {label && (
          <span className="text-sm font-medium text-text-secondary select-none">
            {label}
            {required && <span className="text-accent-red font-bold ml-1">*</span>}
          </span>
        )}
      </label>
      {error && (
        <span className="text-xs font-medium text-accent-red">
          {error}
        </span>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
