'use client';

import React from 'react';
import { useFormContext } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  name: string;
  label: string;
  type?:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'date'
    | 'textarea'
    | 'select';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  options?: { value: string; label: string }[];
  rows?: number;
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  className,
  children,
  options,
  rows = 3,
}: FormFieldProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name];
  const hasError = !!error;

  const baseInputClasses = cn(
    'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
    'file:border-0 file:bg-transparent file:text-sm file:font-medium',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    hasError && 'border-destructive focus-visible:ring-destructive',
    className
  );

  const textareaClasses = cn(
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    hasError && 'border-destructive focus-visible:ring-destructive',
    className
  );

  const selectClasses = cn(
    'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background',
    'placeholder:text-muted-foreground',
    'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    hasError && 'border-destructive focus:ring-destructive',
    className
  );

  const renderInput = () => {
    if (children) {
      return children;
    }

    switch (type) {
      case 'textarea':
        return (
          <textarea
            {...register(name)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={textareaClasses}
          />
        );

      case 'select':
        return (
          <select
            {...register(name)}
            disabled={disabled}
            className={selectClasses}
          >
            <option value=''>
              {placeholder || `Select ${label.toLowerCase()}`}
            </option>
            {options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'date':
        return (
          <input
            {...register(name, { valueAsDate: true })}
            type='date'
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClasses}
          />
        );

      case 'number':
        return (
          <input
            {...register(name, { valueAsNumber: true })}
            type='number'
            step='0.01'
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClasses}
          />
        );

      default:
        return (
          <input
            {...register(name)}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClasses}
          />
        );
    }
  };

  return (
    <div className='space-y-2'>
      <label
        htmlFor={name}
        className={cn(
          'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
          hasError && 'text-destructive'
        )}
      >
        {label}
        {required && <span className='ml-1 text-destructive'>*</span>}
      </label>
      {renderInput()}
      {hasError && (
        <p className='text-sm text-destructive'>{error?.message as string}</p>
      )}
    </div>
  );
}
