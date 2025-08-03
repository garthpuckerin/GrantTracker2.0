'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { searchGrantsSchema, type SearchGrants } from '@/lib/validations';
import { FormField } from './form-field';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, Filter } from 'lucide-react';

interface SearchGrantsFormProps {
  onSearch: (filters: SearchGrants) => void;
  onReset?: () => void;
  initialFilters?: Partial<SearchGrants>;
  isLoading?: boolean;
}

// Mock users data for PI filter
const mockUsers = [
  { id: 'user1', fullName: 'Dr. Jane Smith', role: 'PI' as const },
  { id: 'user2', fullName: 'Dr. John Doe', role: 'ADMIN' as const },
  { id: 'user3', fullName: 'Dr. Sarah Johnson', role: 'PI' as const },
];

export function SearchGrantsForm({
  onSearch,
  onReset,
  initialFilters,
  isLoading = false,
}: SearchGrantsFormProps) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const form = useForm<SearchGrants>({
    resolver: zodResolver(searchGrantsSchema),
    defaultValues: {
      search: initialFilters?.search || '',
      status: initialFilters?.status || undefined,
      agencyName: initialFilters?.agencyName || '',
      principalInvestigatorId:
        initialFilters?.principalInvestigatorId || undefined,
      startDateFrom: initialFilters?.startDateFrom || undefined,
      startDateTo: initialFilters?.startDateTo || undefined,
      limit: initialFilters?.limit || 50,
    },
  });

  const onSubmit = (data: SearchGrants) => {
    // Remove empty string values
    const cleanedData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== '' && value !== undefined
      )
    ) as SearchGrants;

    onSearch(cleanedData);
  };

  const handleReset = () => {
    form.reset({
      search: '',
      status: undefined,
      agencyName: '',
      principalInvestigatorId: undefined,
      startDateFrom: undefined,
      startDateTo: undefined,
      limit: 50,
    });

    if (onReset) {
      onReset();
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
  ];

  const principalInvestigators = mockUsers.filter(
    user => user.role === 'ADMIN' || user.role === 'PI'
  );

  const hasActiveFilters = React.useMemo(() => {
    const values = form.getValues();
    return !!(
      values.search ||
      values.status ||
      values.agencyName ||
      values.principalInvestigatorId ||
      values.startDateFrom ||
      values.startDateTo
    );
  }, [form.watch()]);

  return (
    <Card className='w-full'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2'>
            <Search className='h-5 w-5' />
            Search & Filter Grants
          </CardTitle>
          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={() => setShowAdvanced(!showAdvanced)}
            className='flex items-center gap-2'
          >
            <Filter className='h-4 w-4' />
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            {/* Basic Search */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
              <div className='md:col-span-2'>
                <FormField
                  name='search'
                  label='Search'
                  placeholder='Search by title, grant number, or description...'
                />
              </div>
              <FormField
                name='status'
                label='Status'
                type='select'
                options={statusOptions}
                placeholder='All statuses'
              />
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
              <div className='space-y-4 border-t pt-4'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <FormField
                    name='agencyName'
                    label='Funding Agency'
                    type='select'
                    options={agencyOptions}
                    placeholder='All agencies'
                  />
                  <FormField
                    name='principalInvestigatorId'
                    label='Principal Investigator'
                    type='select'
                    options={principalInvestigators.map(user => ({
                      value: user.id,
                      label: user.fullName,
                    }))}
                    placeholder='All PIs'
                  />
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
                  <FormField
                    name='startDateFrom'
                    label='Start Date From'
                    type='date'
                  />
                  <FormField
                    name='startDateTo'
                    label='Start Date To'
                    type='date'
                  />
                  <FormField
                    name='limit'
                    label='Results Limit'
                    type='number'
                    placeholder='50'
                  />
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className='flex items-center justify-between border-t pt-4'>
              <div className='flex items-center gap-2'>
                {hasActiveFilters && (
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={handleReset}
                    className='flex items-center gap-2'
                  >
                    <X className='h-4 w-4' />
                    Clear Filters
                  </Button>
                )}
                {hasActiveFilters && (
                  <span className='text-sm text-muted-foreground'>
                    Active filters applied
                  </span>
                )}
              </div>

              <div className='flex gap-2'>
                <Button
                  type='submit'
                  disabled={isLoading}
                  className='flex items-center gap-2'
                >
                  <Search className='h-4 w-4' />
                  {isLoading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
