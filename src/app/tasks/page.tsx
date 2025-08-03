'use client';

import React from 'react';
import { TaskList } from '@/components/tasks/task-list';
import { CreateTaskForm } from '@/components/forms/create-task-form';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Circle,
  Plus,
  TrendingUp,
  Calendar,
  Users,
} from 'lucide-react';

// Mock data for task statistics
const taskStats = {
  total: 12,
  pending: 4,
  inProgress: 3,
  completed: 4,
  overdue: 2,
  thisWeek: 6,
  thisMonth: 12,
  completionRate: 75,
};

const upcomingDeadlines = [
  {
    id: 'task-1',
    title: 'Submit quarterly progress report',
    dueDate: new Date('2024-03-15'),
    priority: 'HIGH' as const,
    grant: 'NSF-2024-001',
  },
  {
    id: 'task-2',
    title: 'Equipment procurement approval',
    dueDate: new Date('2024-03-18'),
    priority: 'URGENT' as const,
    grant: 'DOE-2023-078',
  },
  {
    id: 'task-3',
    title: 'Review budget allocations',
    dueDate: new Date('2024-03-30'),
    priority: 'MEDIUM' as const,
    grant: 'EPA-2023-045',
  },
];

export default function TasksPage() {
  const [showCreateForm, setShowCreateForm] = React.useState(false);
  const [selectedGrantYear, setSelectedGrantYear] = React.useState<string>('');

  const handleTaskCreated = (task: any) => {
    console.log('Task created:', task);
    setShowCreateForm(false);
    // In a real app, this would refresh the task list
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className='container mx-auto space-y-8 py-8'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold'>Task Management</h1>
          <p className='mt-2 text-muted-foreground'>
            Manage tasks, milestones, and deadlines across all your grants
          </p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className='flex items-center gap-2'
        >
          <Plus className='h-4 w-4' />
          Add Task
        </Button>
      </div>

      {/* Task Statistics */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4'>
        {/* Total Tasks */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Total Tasks
                </p>
                <p className='text-2xl font-bold'>{taskStats.total}</p>
              </div>
              <Circle className='h-8 w-8 text-muted-foreground' />
            </div>
            <div className='mt-4 flex items-center text-sm'>
              <TrendingUp className='mr-1 h-4 w-4 text-green-500' />
              <span className='text-green-600'>+2 this week</span>
            </div>
          </CardContent>
        </Card>

        {/* In Progress */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  In Progress
                </p>
                <p className='text-2xl font-bold text-indigo-600'>
                  {taskStats.inProgress}
                </p>
              </div>
              <Clock className='h-8 w-8 text-indigo-500' />
            </div>
            <div className='mt-4 flex items-center text-sm'>
              <span className='text-amber-600'>
                {taskStats.pending} pending
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Completed */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Completed
                </p>
                <p className='text-2xl font-bold text-emerald-600'>
                  {taskStats.completed}
                </p>
              </div>
              <CheckCircle className='h-8 w-8 text-emerald-500' />
            </div>
            <div className='mt-4 flex items-center text-sm'>
              <span className='text-emerald-600'>
                {taskStats.completionRate}% completion rate
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Overdue */}
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-muted-foreground'>
                  Overdue
                </p>
                <p className='text-2xl font-bold text-red-600'>
                  {taskStats.overdue}
                </p>
              </div>
              <AlertTriangle className='h-8 w-8 text-red-500' />
            </div>
            <div className='mt-4 flex items-center text-sm'>
              <span className='text-red-600'>Needs attention</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
        {/* Task List */}
        <div className='lg:col-span-2'>
          {showCreateForm ? (
            <CreateTaskForm
              grantYearId={selectedGrantYear || 'demo-grant-year'}
              onSuccess={handleTaskCreated}
              onCancel={() => setShowCreateForm(false)}
            />
          ) : (
            <TaskList />
          )}
        </div>

        {/* Sidebar */}
        <div className='space-y-6'>
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Calendar className='h-5 w-5' />
                Upcoming Deadlines
              </CardTitle>
              <CardDescription>Tasks due in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              {upcomingDeadlines.map(task => (
                <div
                  key={task.id}
                  className='flex items-start gap-3 rounded-lg border p-3'
                >
                  <Calendar className='mt-1 h-4 w-4 text-muted-foreground' />
                  <div className='flex-1 space-y-1'>
                    <p className='text-sm font-medium leading-tight'>
                      {task.title}
                    </p>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant='outline'
                        className={getPriorityColor(task.priority)}
                      >
                        {task.priority}
                      </Badge>
                      <span className='text-xs text-muted-foreground'>
                        {task.grant}
                      </span>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      {formatDate(task.dueDate)}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <Users className='h-5 w-5' />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <Button
                variant='outline'
                className='w-full justify-start'
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className='mr-2 h-4 w-4' />
                Create New Task
              </Button>
              <Button variant='outline' className='w-full justify-start'>
                <Calendar className='mr-2 h-4 w-4' />
                View Calendar
              </Button>
              <Button variant='outline' className='w-full justify-start'>
                <CheckCircle className='mr-2 h-4 w-4' />
                Mark Tasks Complete
              </Button>
              <Button variant='outline' className='w-full justify-start'>
                <AlertTriangle className='mr-2 h-4 w-4' />
                Review Overdue
              </Button>
            </CardContent>
          </Card>

          {/* Task Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Task Distribution</CardTitle>
              <CardDescription>Current task status breakdown</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-3'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-amber-500'></div>
                    <span className='text-sm'>Pending</span>
                  </div>
                  <span className='text-sm font-medium'>
                    {taskStats.pending}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-indigo-500'></div>
                    <span className='text-sm'>In Progress</span>
                  </div>
                  <span className='text-sm font-medium'>
                    {taskStats.inProgress}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-emerald-500'></div>
                    <span className='text-sm'>Completed</span>
                  </div>
                  <span className='text-sm font-medium'>
                    {taskStats.completed}
                  </span>
                </div>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <div className='h-3 w-3 rounded-full bg-red-500'></div>
                    <span className='text-sm'>Overdue</span>
                  </div>
                  <span className='text-sm font-medium'>
                    {taskStats.overdue}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
