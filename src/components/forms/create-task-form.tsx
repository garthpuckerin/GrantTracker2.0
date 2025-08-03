'use client';

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema, type CreateTask } from '@/lib/validations';
import { FormField } from './form-field';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { X, Plus } from 'lucide-react';

interface CreateTaskFormProps {
  grantYearId: string;
  onSuccess?: (task: any) => void;
  onCancel?: () => void;
  isOpen?: boolean;
}

// Mock users data for assignment
const mockUsers = [
  { id: 'user1', fullName: 'Dr. Jane Smith', role: 'PI' as const },
  { id: 'user2', fullName: 'Dr. John Doe', role: 'ADMIN' as const },
  { id: 'user3', fullName: 'Dr. Sarah Johnson', role: 'PI' as const },
  { id: 'user4', fullName: 'Dr. Michael Brown', role: 'FINANCE' as const },
];

export function CreateTaskForm({
  grantYearId,
  onSuccess,
  onCancel,
  isOpen = true,
}: CreateTaskFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<CreateTask>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      grantYearId,
      title: '',
      description: '',
      status: 'PENDING',
      priority: 'MEDIUM',
      assignedToId: undefined,
      dueDate: undefined,
      createdById: 'current-user-id', // In real app, get from auth
    },
  });

  const onSubmit = async (data: CreateTask) => {
    setIsSubmitting(true);
    try {
      // Mock API call - in a real app this would use tRPC
      console.log('Creating task:', data);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock successful response
      const mockTask = {
        id: 'task-' + Date.now(),
        ...data,
        assignedTo: data.assignedToId
          ? mockUsers.find(u => u.id === data.assignedToId)
          : null,
        grantYear: {
          grant: {
            grantTitle: 'Mock Grant Title',
            grantNumberMaster: 'MOCK-2024-001',
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      form.reset();
      if (onSuccess) {
        onSuccess(mockTask);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' },
  ];

  const priorityOptions = [
    { value: 'LOW', label: 'Low' },
    { value: 'MEDIUM', label: 'Medium' },
    { value: 'HIGH', label: 'High' },
    { value: 'URGENT', label: 'Urgent' },
  ];

  const userOptions = mockUsers.map(user => ({
    value: user.id,
    label: `${user.fullName} (${user.role})`,
  }));

  if (!isOpen) {
    return null;
  }

  return (
    <Card className='mx-auto w-full max-w-2xl'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
        <div>
          <CardTitle className='flex items-center gap-2'>
            <Plus className='h-5 w-5' />
            Create New Task
          </CardTitle>
          <CardDescription>
            Add a new task or milestone for this grant year
          </CardDescription>
        </div>
        {onCancel && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onCancel}
            className='h-8 w-8 p-0'
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Task Title */}
            <FormField
              name='title'
              label='Task Title'
              placeholder='Enter a descriptive task title...'
              required
            />

            {/* Task Description */}
            <FormField
              name='description'
              label='Description'
              type='textarea'
              placeholder='Provide detailed information about this task...'
              rows={4}
            />

            {/* Status and Priority */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                name='status'
                label='Status'
                type='select'
                options={statusOptions}
                required
              />

              <FormField
                name='priority'
                label='Priority'
                type='select'
                options={priorityOptions}
                required
              />
            </div>

            {/* Assignment and Due Date */}
            <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
              <FormField
                name='assignedToId'
                label='Assign To'
                type='select'
                options={userOptions}
                placeholder='Select team member (optional)'
              />

              <FormField name='dueDate' label='Due Date' type='date' />
            </div>

            {/* Task Preview */}
            <div className='rounded-lg bg-muted p-4'>
              <h4 className='mb-2 font-medium'>Task Preview</h4>
              <div className='space-y-2 text-sm'>
                <div>
                  <span className='text-muted-foreground'>Title:</span>
                  <span className='ml-2 font-medium'>
                    {form.watch('title') || 'Untitled Task'}
                  </span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Status:</span>
                  <span className='ml-2'>
                    {
                      statusOptions.find(s => s.value === form.watch('status'))
                        ?.label
                    }
                  </span>
                </div>
                <div>
                  <span className='text-muted-foreground'>Priority:</span>
                  <span className='ml-2'>
                    {
                      priorityOptions.find(
                        p => p.value === form.watch('priority')
                      )?.label
                    }
                  </span>
                </div>
                {form.watch('assignedToId') && (
                  <div>
                    <span className='text-muted-foreground'>Assigned to:</span>
                    <span className='ml-2'>
                      {
                        userOptions.find(
                          u => u.value === form.watch('assignedToId')
                        )?.label
                      }
                    </span>
                  </div>
                )}
                {form.watch('dueDate') && (
                  <div>
                    <span className='text-muted-foreground'>Due:</span>
                    <span className='ml-2'>
                      {form.watch('dueDate') &&
                        new Date(form.watch('dueDate')!).toLocaleDateString(
                          'en-US',
                          {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                    </span>
                  </div>
                )}
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
                {isSubmitting ? 'Creating...' : 'Create Task'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
