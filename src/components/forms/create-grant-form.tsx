'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createGrantSchema, type CreateGrant } from '@/lib/validations';
import { FormField } from './form-field';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useRouter } from 'next/navigation';

interface CreateGrantFormProps {
  onSuccess?: (grant: any) => void;
  onCancel?: () => void;
}

// Mock users data for now - in a real app this would come from tRPC
const mockUsers = [
  { id: 'user1', fullName: 'Dr. Jane Smith', role: 'PI' as const },
  { id: 'user2', fullName: 'Dr. John Doe', role: 'ADMIN' as const },
  { id: 'user3', fullName: 'Dr. Sarah Johnson', role: 'PI' as const },
];

export function CreateGrantForm({ onSuccess, onCancel }: CreateGrantFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CreateGrant>({
    resolver: zodResolver(createGrantSchema),
    defaultValues: {
      grantTitle: '',
      grantNumberMaster: '',
      agencyName: '',
      principalInvestigatorId: '',
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      totalYears: 1,
      status: 'DRAFT',
      description: '',
    },
  });

  const principalInvestigators = mockUsers.filter(
    user => user.role === 'ADMIN' || user.role === 'PI'
  );

  const onSubmit = async (data: CreateGrant) => {
    setIsSubmitting(true);
    try {
      // Mock API call - in a real app this would use tRPC
      console.log('Creating grant:', data);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful response
      const mockGrant = {
        id: 'grant-' + Date.now(),
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      form.reset();
      if (onSuccess) {
        onSuccess(mockGrant);
      } else {
        router.push(`/grant/${mockGrant.id}`);
      }
    } catch (error) {
      console.error('Failed to create grant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'CLOSED', label: 'Closed' },
    { value: 'NOT_AWARDED', label: 'Not Awarded' },
  ];

  const agencyOptions = [
    { value: 'NSF', label: 'National Science Foundation (NSF)' },
    { value: 'NIH', label: 'National Institutes of Health (NIH)' },
    { value: 'DOE', label: 'Department of Energy (DOE)' },
    {
      value: 'NASA',
      label: 'National Aeronautics and Space Administration (NASA)',
    },
    { value: 'USDA', label: 'United States Department of Agriculture (USDA)' },
    { value: 'DOD', label: 'Department of Defense (DOD)' },
    { value: 'EPA', label: 'Environmental Protection Agency (EPA)' },
    { value: 'Other', label: 'Other Agency' },
  ];

  return (
    <Card className='mx-auto w-full max-w-4xl'>
      <CardHeader>
        <CardTitle>Create New Grant</CardTitle>
        <CardDescription>
          Enter the details for the new federal grant. All required fields must
          be completed.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Grant Title */}
              <div className='md:col-span-2'>
                <FormField
                  name='grantTitle'
                  label='Grant Title'
                  placeholder='Enter the full grant title'
                  required
                />
              </div>

              {/* Grant Number */}
              <FormField
                name='grantNumberMaster'
                label='Grant Number'
                placeholder='e.g., NSF-2024-001'
                required
              />

              {/* Agency Name */}
              <FormField
                name='agencyName'
                label='Funding Agency'
                type='select'
                options={agencyOptions}
                required
              />

              {/* Principal Investigator */}
              <FormField
                name='principalInvestigatorId'
                label='Principal Investigator'
                type='select'
                options={principalInvestigators.map(user => ({
                  value: user.id,
                  label: user.fullName,
                }))}
                required
              />

              {/* Status */}
              <FormField
                name='status'
                label='Grant Status'
                type='select'
                options={statusOptions}
                required
              />

              {/* Start Date */}
              <FormField
                name='startDate'
                label='Start Date'
                type='date'
                required
              />

              {/* End Date */}
              <FormField name='endDate' label='End Date' type='date' required />

              {/* Total Years */}
              <FormField
                name='totalYears'
                label='Total Years'
                type='number'
                placeholder='1-5 years'
                required
              />
            </div>

            {/* Description */}
            <FormField
              name='description'
              label='Grant Description'
              type='textarea'
              placeholder='Optional description of the grant project...'
              rows={4}
            />

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
                {isSubmitting ? 'Creating...' : 'Create Grant'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
