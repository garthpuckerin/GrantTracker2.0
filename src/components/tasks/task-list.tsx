'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Circle,
  Calendar,
  User,
  Plus,
  Filter,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock task data - in real app this would come from tRPC
const mockTasks = [
  {
    id: 'task-1',
    title: 'Submit quarterly progress report',
    description:
      'Prepare and submit the Q1 2024 progress report to NSF including budget updates and milestone achievements.',
    status: 'PENDING' as const,
    priority: 'HIGH' as const,
    dueDate: new Date('2024-03-15'),
    assignedTo: { id: 'user1', fullName: 'Dr. Jane Smith' },
    grantYear: {
      grant: {
        grantTitle: 'Advanced Materials Research',
        grantNumberMaster: 'NSF-2024-001',
      },
    },
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'task-2',
    title: 'Review budget allocations for Year 2',
    description:
      'Analyze current spending patterns and adjust budget allocations for the upcoming grant year.',
    status: 'IN_PROGRESS' as const,
    priority: 'MEDIUM' as const,
    dueDate: new Date('2024-03-30'),
    assignedTo: { id: 'user2', fullName: 'Dr. John Doe' },
    grantYear: {
      grant: {
        grantTitle: 'Climate Change Impact Study',
        grantNumberMaster: 'EPA-2023-045',
      },
    },
    createdAt: new Date('2024-02-15'),
  },
  {
    id: 'task-3',
    title: 'Equipment procurement approval',
    description:
      'Obtain necessary approvals for specialized laboratory equipment purchase.',
    status: 'COMPLETED' as const,
    priority: 'URGENT' as const,
    dueDate: new Date('2024-02-28'),
    completedAt: new Date('2024-02-25'),
    assignedTo: { id: 'user3', fullName: 'Dr. Sarah Johnson' },
    grantYear: {
      grant: {
        grantTitle: 'Renewable Energy Systems',
        grantNumberMaster: 'DOE-2023-078',
      },
    },
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'task-4',
    title: 'Prepare annual compliance audit',
    description:
      'Gather all required documentation for the annual grant compliance audit.',
    status: 'CANCELLED' as const,
    priority: 'LOW' as const,
    dueDate: new Date('2024-04-15'),
    assignedTo: { id: 'user1', fullName: 'Dr. Jane Smith' },
    grantYear: {
      grant: {
        grantTitle: 'Biomedical Research Initiative',
        grantNumberMaster: 'NIH-2023-112',
      },
    },
    createdAt: new Date('2024-01-20'),
  },
];

interface TaskListProps {
  grantYearId?: string;
  showFilters?: boolean;
  compact?: boolean;
  onCreateTask?: () => void;
  showCreateButton?: boolean;
}

export function TaskList({
  grantYearId,
  showFilters = true,
  compact = false,
  onCreateTask,
  showCreateButton = true,
}: TaskListProps) {
  const [filter, setFilter] = React.useState<
    'all' | 'pending' | 'in_progress' | 'completed' | 'overdue'
  >('all');
  const [priorityFilter, setPriorityFilter] = React.useState<
    'all' | 'urgent' | 'high' | 'medium' | 'low'
  >('all');

  // Filter tasks based on current filters
  const filteredTasks = React.useMemo(() => {
    let tasks = mockTasks;

    // Filter by grant year if specified
    if (grantYearId) {
      tasks = tasks.filter(
        task => task.grantYear.grant.grantNumberMaster === grantYearId
      );
    }

    // Filter by status
    if (filter !== 'all') {
      if (filter === 'overdue') {
        tasks = tasks.filter(
          task =>
            task.status !== 'COMPLETED' &&
            task.status !== 'CANCELLED' &&
            task.dueDate &&
            task.dueDate < new Date()
        );
      } else {
        tasks = tasks.filter(task => task.status.toLowerCase() === filter);
      }
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      tasks = tasks.filter(
        task => task.priority.toLowerCase() === priorityFilter
      );
    }

    return tasks;
  }, [filter, priorityFilter, grantYearId]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className='h-4 w-4 text-green-500' />;
      case 'IN_PROGRESS':
        return <Clock className='h-4 w-4 text-blue-500' />;
      case 'PENDING':
        return <Circle className='h-4 w-4 text-gray-500' />;
      case 'CANCELLED':
        return <AlertTriangle className='h-4 w-4 text-red-500' />;
      default:
        return <Circle className='h-4 w-4 text-gray-500' />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      COMPLETED: 'default',
      IN_PROGRESS: 'secondary',
      PENDING: 'outline',
      CANCELLED: 'destructive',
    } as const;

    return (
      <Badge
        variant={variants[status as keyof typeof variants] || 'outline'}
        className={
          status === 'COMPLETED'
            ? 'border-emerald-200 bg-emerald-100 text-emerald-800'
            : status === 'IN_PROGRESS'
              ? 'border-indigo-200 bg-indigo-100 text-indigo-800'
              : status === 'PENDING'
                ? 'border-amber-200 bg-amber-100 text-amber-800'
                : status === 'CANCELLED'
                  ? 'border-orange-200 bg-orange-100 text-orange-800'
                  : ''
        }
      >
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      URGENT: 'bg-red-100 text-red-800 border-red-200',
      HIGH: 'bg-pink-100 text-pink-800 border-pink-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      LOW: 'bg-slate-100 text-slate-800 border-slate-200',
    };

    return (
      <Badge
        variant='outline'
        className={
          colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800'
        }
      >
        {priority}
      </Badge>
    );
  };

  const isOverdue = (task: any) => {
    return (
      task.status !== 'COMPLETED' &&
      task.status !== 'CANCELLED' &&
      task.dueDate &&
      task.dueDate < new Date()
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Task Management</h2>
          <p className='text-muted-foreground'>
            Track and manage grant-related tasks and milestones
          </p>
        </div>
        {showCreateButton && (
          <Button onClick={onCreateTask} className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            Add Task
          </Button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader className='pb-3'>
            <CardTitle className='flex items-center gap-2 text-lg'>
              <Filter className='h-5 w-5' />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex flex-wrap gap-4'>
              {/* Status Filter */}
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Status</label>
                <select
                  value={filter}
                  onChange={e => setFilter(e.target.value as any)}
                  className='flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                >
                  <option value='all'>All Tasks</option>
                  <option value='pending'>Pending</option>
                  <option value='in_progress'>In Progress</option>
                  <option value='completed'>Completed</option>
                  <option value='overdue'>Overdue</option>
                </select>
              </div>

              {/* Priority Filter */}
              <div className='space-y-2'>
                <label className='text-sm font-medium'>Priority</label>
                <select
                  value={priorityFilter}
                  onChange={e => setPriorityFilter(e.target.value as any)}
                  className='flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring'
                >
                  <option value='all'>All Priorities</option>
                  <option value='urgent'>Urgent</option>
                  <option value='high'>High</option>
                  <option value='medium'>Medium</option>
                  <option value='low'>Low</option>
                </select>
              </div>

              {/* Task Count */}
              <div className='flex items-end'>
                <Badge
                  variant='secondary'
                  className='flex h-9 items-center border-teal-200 bg-teal-100 text-teal-800'
                >
                  {filteredTasks.length} task
                  {filteredTasks.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task List */}
      <div className='space-y-3'>
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <Circle className='mb-4 h-12 w-12 text-muted-foreground' />
              <h3 className='mb-2 text-lg font-semibold'>No tasks found</h3>
              <p className='text-center text-muted-foreground'>
                {filter === 'all'
                  ? 'No tasks have been created yet. Click "Add Task" to get started.'
                  : `No tasks match the current filters. Try adjusting your filter criteria.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map(task => (
            <Card
              key={task.id}
              className={cn(
                'transition-all hover:shadow-md',
                isOverdue(task) && 'border-red-200 bg-red-50/50',
                compact && 'py-2'
              )}
            >
              <CardContent className={cn('p-6', compact && 'p-4')}>
                <div className='flex items-start justify-between gap-4'>
                  {/* Task Info */}
                  <div className='flex-1 space-y-3'>
                    {/* Title and Status */}
                    <div className='flex items-start gap-3'>
                      {getStatusIcon(task.status)}
                      <div className='flex-1'>
                        <h3 className='text-lg font-semibold leading-tight'>
                          {task.title}
                        </h3>
                        {!compact && task.description && (
                          <p className='mt-1 text-sm leading-relaxed text-muted-foreground'>
                            {task.description}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className='flex flex-wrap items-center gap-4 text-sm'>
                      {/* Grant Info */}
                      <div className='flex items-center gap-1 text-muted-foreground'>
                        <span className='font-medium'>Grant:</span>
                        <span>{task.grantYear.grant.grantNumberMaster}</span>
                      </div>

                      {/* Due Date */}
                      {task.dueDate && (
                        <div
                          className={cn(
                            'flex items-center gap-1',
                            isOverdue(task)
                              ? 'text-red-600'
                              : 'text-muted-foreground'
                          )}
                        >
                          <Calendar className='h-3 w-3' />
                          <span>Due {formatDate(task.dueDate)}</span>
                          {isOverdue(task) && (
                            <Badge
                              variant='destructive'
                              className='ml-1 text-xs'
                            >
                              Overdue
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Assigned To */}
                      {task.assignedTo && (
                        <div className='flex items-center gap-1 text-muted-foreground'>
                          <User className='h-3 w-3' />
                          <span>{task.assignedTo.fullName}</span>
                        </div>
                      )}

                      {/* Completion Date */}
                      {task.completedAt && (
                        <div className='flex items-center gap-1 text-green-600'>
                          <CheckCircle className='h-3 w-3' />
                          <span>Completed {formatDate(task.completedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Badges and Actions */}
                  <div className='flex flex-col items-end gap-2'>
                    <div className='flex items-center gap-2'>
                      {getPriorityBadge(task.priority)}
                      {getStatusBadge(task.status)}
                    </div>
                    <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                      <MoreHorizontal className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
