'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createBudgetLineItemSchema,
  type CreateBudgetLineItem,
} from '@/lib/validations';
import { FormField } from './form-field';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface BudgetLineItemFormProps {
  grantYearId: string;
  onSuccess?: (item: any) => void;
  onCancel?: () => void;
  initialData?: Partial<CreateBudgetLineItem>;
}

export function BudgetLineItemForm({
  grantYearId,
  onSuccess,
  onCancel,
  initialData,
}: BudgetLineItemFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CreateBudgetLineItem>({
    resolver: zodResolver(createBudgetLineItemSchema),
    defaultValues: {
      grantYearId,
      category: initialData?.category || 'PERSONNEL',
      description: initialData?.description || '',
      budgetedAmount: initialData?.budgetedAmount || 0,
      actualSpent: initialData?.actualSpent || 0,
      encumberedAmount: initialData?.encumberedAmount || 0,
      lastUpdatedById: 'current-user-id', // In real app, get from auth
    },
  });

  const onSubmit = async (data: CreateBudgetLineItem) => {
    setIsSubmitting(true);
    try {
      // Mock API call - in a real app this would use tRPC
      console.log('Creating budget line item:', data);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock successful response
      const mockItem = {
        id: 'budget-item-' + Date.now(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      form.reset();
      if (onSuccess) {
        onSuccess(mockItem);
      }
    } catch (error) {
      console.error('Failed to create budget line item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = [
    { value: 'PERSONNEL', label: 'Personnel' },
    { value: 'FRINGE_BENEFITS', label: 'Fringe Benefits' },
    { value: 'TRAVEL', label: 'Travel' },
    { value: 'EQUIPMENT', label: 'Equipment' },
    { value: 'SUPPLIES', label: 'Supplies' },
    { value: 'CONTRACTUAL', label: 'Contractual' },
    { value: 'TOTAL_DIRECT_COSTS', label: 'Total Direct Costs' },
    { value: 'INDIRECT_COSTS', label: 'Indirect Costs' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader>
        <CardTitle>Add Budget Line Item</CardTitle>
        <CardDescription>
          Enter the details for this budget category. All amounts should be in
          USD.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Category */}
            <FormField
              name='category'
              label='Budget Category'
              type='select'
              options={categoryOptions}
              required
            />

            {/* Description */}
            <FormField
              name='description'
              label='Description'
              type='textarea'
              placeholder='Describe this budget line item...'
              required
              rows={3}
            />

            {/* Budget Amounts */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <FormField
                name='budgetedAmount'
                label='Budgeted Amount'
                type='number'
                placeholder='0.00'
                required
              />

              <FormField
                name='actualSpent'
                label='Actual Spent'
                type='number'
                placeholder='0.00'
              />

              <FormField
                name='encumberedAmount'
                label='Encumbered Amount'
                type='number'
                placeholder='0.00'
              />
            </div>

            {/* Budget Summary */}
            <div className='rounded-lg bg-muted p-4'>
              <h4 className='mb-2 font-medium'>Budget Summary</h4>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <span className='text-muted-foreground'>Budgeted:</span>
                  <span className='ml-2 font-medium'>
                    ${form.watch('budgetedAmount')?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Remaining:</span>
                  <span className='ml-2 font-medium'>
                    $
                    {(
                      (form.watch('budgetedAmount') || 0) -
                      (form.watch('actualSpent') || 0) -
                      (form.watch('encumberedAmount') || 0)
                    ).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Spent:</span>
                  <span className='ml-2 font-medium'>
                    ${form.watch('actualSpent')?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Encumbered:</span>
                  <span className='ml-2 font-medium'>
                    ${form.watch('encumberedAmount')?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className='flex justify-end space-x-4 border-t pt-6'>
              {onCancel && (
                <Button
                  type='button'
                  variant='outline'
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button
                type='submit'
                disabled={isSubmitting}
                className='min-w-[120px]'
              >
                {isSubmitting ? 'Adding...' : 'Add Line Item'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
