'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Building,
  Edit,
  Trash2,
  ListTodo,
  Plus,
} from 'lucide-react';
import { formatCurrency, getStatusBadgeVariant } from '@/lib/utils';
import { SimpleDocumentManager } from '@/components/documents/simple-document-manager';
import { TaskList } from '@/components/tasks/task-list';
import { CreateTaskForm } from '@/components/forms/create-task-form';
import { usePermissions } from '@/hooks/use-permissions';
import {
  PermissionGuard,
  AdminOnly,
  PIOnly,
} from '@/components/auth/permission-guard';

// Mock data for demonstration
const mockGrantData = {
  '1': {
    id: '1',
    grantTitle: 'Improving STEM Education Through Technology',
    grantNumberMaster: 'EDU-STEM-2024',
    agencyName: 'Department of Education',
    status: 'ACTIVE',
    currentYearNumber: 2,
    totalYears: 5,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2028-12-31'),
    description:
      'This comprehensive grant focuses on integrating cutting-edge technology into STEM education curricula across multiple educational institutions. The project aims to enhance student engagement, improve learning outcomes, and prepare students for careers in science, technology, engineering, and mathematics fields.',
    principalInvestigator: {
      fullName: 'Dr. Jane Smith',
      email: 'jane.smith@university.edu',
      department: 'Computer Science',
      institution: 'State University',
    },
    grantYears: [
      {
        yearNumber: 1,
        awardAmount: 900000,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        status: 'COMPLETED',
        budgetLineItems: [
          {
            id: '1',
            category: 'Personnel',
            budgetedAmount: 400000,
            actualSpent: 395000,
            encumberedAmount: 0,
            description: 'Faculty salaries and graduate student stipends',
          },
          {
            id: '2',
            category: 'Equipment',
            budgetedAmount: 200000,
            actualSpent: 185000,
            encumberedAmount: 0,
            description: 'Laboratory equipment and software licenses',
          },
          {
            id: '3',
            category: 'Travel',
            budgetedAmount: 50000,
            actualSpent: 45000,
            encumberedAmount: 0,
            description: 'Conference attendance and research collaboration',
          },
          {
            id: '4',
            category: 'Supplies',
            budgetedAmount: 150000,
            actualSpent: 140000,
            encumberedAmount: 0,
            description: 'Research materials and consumables',
          },
          {
            id: '5',
            category: 'Other',
            budgetedAmount: 100000,
            actualSpent: 95000,
            encumberedAmount: 0,
            description: 'Publication costs and miscellaneous expenses',
          },
        ],
      },
      {
        yearNumber: 2,
        awardAmount: 950000,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
        status: 'ACTIVE',
        budgetLineItems: [
          {
            id: '6',
            category: 'Personnel',
            budgetedAmount: 420000,
            actualSpent: 105000,
            encumberedAmount: 52500,
            description: 'Faculty salaries and graduate student stipends',
          },
          {
            id: '7',
            category: 'Equipment',
            budgetedAmount: 220000,
            actualSpent: 55000,
            encumberedAmount: 27500,
            description: 'Advanced computing equipment and software',
          },
          {
            id: '8',
            category: 'Travel',
            budgetedAmount: 60000,
            actualSpent: 15000,
            encumberedAmount: 7500,
            description: 'International conference participation',
          },
          {
            id: '9',
            category: 'Supplies',
            budgetedAmount: 160000,
            actualSpent: 40000,
            encumberedAmount: 20000,
            description: 'Specialized research materials',
          },
          {
            id: '10',
            category: 'Other',
            budgetedAmount: 90000,
            actualSpent: 22500,
            encumberedAmount: 11250,
            description: 'Dissemination and outreach activities',
          },
        ],
      },
      {
        yearNumber: 3,
        awardAmount: 980000,
        startDate: new Date('2026-01-01'),
        endDate: new Date('2026-12-31'),
        status: 'PLANNED',
        budgetLineItems: [
          {
            id: '11',
            category: 'Personnel',
            budgetedAmount: 440000,
            actualSpent: 0,
            encumberedAmount: 0,
            description: 'Expanded research team',
          },
          {
            id: '12',
            category: 'Equipment',
            budgetedAmount: 240000,
            actualSpent: 0,
            encumberedAmount: 0,
            description: 'Next-generation laboratory equipment',
          },
          {
            id: '13',
            category: 'Travel',
            budgetedAmount: 70000,
            actualSpent: 0,
            encumberedAmount: 0,
            description: 'Global research collaborations',
          },
          {
            id: '14',
            category: 'Supplies',
            budgetedAmount: 170000,
            actualSpent: 0,
            encumberedAmount: 0,
            description: 'Advanced research materials',
          },
          {
            id: '15',
            category: 'Other',
            budgetedAmount: 60000,
            actualSpent: 0,
            encumberedAmount: 0,
            description: 'Technology transfer activities',
          },
        ],
      },
    ],
    documents: [
      {
        id: '1',
        name: 'Original Proposal.pdf',
        type: 'proposal',
        uploadDate: new Date('2023-12-01'),
      },
      {
        id: '2',
        name: 'Year 1 Progress Report.pdf',
        type: 'report',
        uploadDate: new Date('2024-12-15'),
      },
      {
        id: '3',
        name: 'Budget Modification Request.pdf',
        type: 'budget',
        uploadDate: new Date('2024-06-01'),
      },
    ],
  },
};

export default function GrantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const grantId = params.id as string;
  const [selectedYear, setSelectedYear] = useState<number>(2);
  const [showCreateTask, setShowCreateTask] = useState<boolean>(false);

  const { canAccessGrant, canEditGrant, hasPermission } = usePermissions();
  const grant = mockGrantData[grantId as keyof typeof mockGrantData];

  if (!grant) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <Card className='max-w-md'>
          <CardContent className='py-12 text-center'>
            <h2 className='mb-2 text-xl font-semibold'>Demo Grant Not Found</h2>
            <p className='mb-4 text-gray-600'>
              This is a demonstration application with limited sample data. Only
              Grant ID "1" is available for viewing.
            </p>
            <p className='mb-6 text-sm text-gray-500'>
              Try accessing <strong>/grant/1</strong> to see the sample grant
              details.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check if user can access this grant
  if (!canAccessGrant({ principalInvestigatorId: 'demo-user-id' })) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-gray-50'>
        <Card className='max-w-md border-red-200'>
          <CardContent className='py-12 text-center'>
            <h2 className='mb-2 text-xl font-semibold text-red-800'>
              Access Denied
            </h2>
            <p className='mb-4 text-red-600'>
              You don't have permission to view this grant.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentYear = grant.grantYears.find(
    year => year.yearNumber === selectedYear
  );
  const totalBudgeted =
    currentYear?.budgetLineItems.reduce(
      (sum, item) => sum + item.budgetedAmount,
      0
    ) || 0;
  const totalSpent =
    currentYear?.budgetLineItems.reduce(
      (sum, item) => sum + item.actualSpent,
      0
    ) || 0;
  const totalEncumbered =
    currentYear?.budgetLineItems.reduce(
      (sum, item) => sum + item.encumberedAmount,
      0
    ) || 0;
  const utilizationPercentage =
    totalBudgeted > 0
      ? Math.round(((totalSpent + totalEncumbered) / totalBudgeted) * 100)
      : 0;

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='border-b bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center'>
            <Button
              variant='ghost'
              onClick={() => router.push('/dashboard')}
              className='mr-4'
            >
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to Dashboard
            </Button>
            <h1 className='text-xl font-semibold text-gray-900'>
              Grant Details
            </h1>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
        {/* Grant Overview */}
        <div className='mb-8'>
          <div className='mb-4 flex items-start justify-between'>
            <div>
              <h2 className='mb-2 text-3xl font-bold text-gray-900'>
                {grant.grantTitle}
              </h2>
              <div className='flex items-center gap-4 text-sm text-gray-600'>
                <span className='flex items-center'>
                  <FileText className='mr-1 h-4 w-4' />
                  {grant.grantNumberMaster}
                </span>
                <span className='flex items-center'>
                  <Building className='mr-1 h-4 w-4' />
                  {grant.agencyName}
                </span>
                <span className='flex items-center'>
                  <Calendar className='mr-1 h-4 w-4' />
                  {grant.startDate.toLocaleDateString()} -{' '}
                  {grant.endDate.toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className='flex items-center space-x-2'>
              <Badge
                variant={getStatusBadgeVariant(grant.status)}
                className={
                  grant.status === 'ACTIVE'
                    ? 'border-green-200 bg-green-100 text-green-800'
                    : ''
                }
              >
                {grant.status}
              </Badge>

              <PermissionGuard
                grant={{ principalInvestigatorId: 'demo-user-id' }}
                requireGrantEdit={true}
                showFallback={false}
              >
                <Button variant='outline' size='sm'>
                  <Edit className='mr-2 h-4 w-4' />
                  Edit Grant
                </Button>
              </PermissionGuard>

              <AdminOnly showFallback={false}>
                <Button
                  variant='outline'
                  size='sm'
                  className='text-red-600 hover:text-red-700'
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete
                </Button>
              </AdminOnly>
            </div>
          </div>

          <p className='mb-6 max-w-4xl text-gray-700'>{grant.description}</p>

          {/* PI Information */}
          <Card className='mb-6'>
            <CardHeader>
              <CardTitle className='flex items-center'>
                <Users className='mr-2 h-5 w-5' />
                Principal Investigator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <p className='font-medium'>
                    {grant.principalInvestigator.fullName}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {grant.principalInvestigator.department}
                  </p>
                  <p className='text-sm text-gray-600'>
                    {grant.principalInvestigator.institution}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-600'>Email</p>
                  <p className='font-medium'>
                    {grant.principalInvestigator.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Year Navigation */}
        <div className='mb-6'>
          <h3 className='mb-4 text-lg font-medium text-gray-900'>
            Grant Years
          </h3>
          <div className='flex flex-wrap gap-2'>
            {grant.grantYears.map(year => (
              <Button
                key={year.yearNumber}
                variant={
                  selectedYear === year.yearNumber ? 'default' : 'outline'
                }
                onClick={() => setSelectedYear(year.yearNumber)}
                className='flex items-center gap-2'
              >
                Year {year.yearNumber}
                <Badge
                  variant={
                    year.status === 'ACTIVE'
                      ? 'default'
                      : year.status === 'COMPLETED'
                        ? 'secondary'
                        : 'outline'
                  }
                  className={`text-xs ${
                    year.status === 'ACTIVE'
                      ? 'border-green-200 bg-green-100 text-green-800'
                      : year.status === 'PLANNED'
                        ? 'border-orange-200 bg-orange-100 text-orange-800'
                        : ''
                  }`}
                >
                  {year.status}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Current Year Details */}
        <PermissionGuard permission='budgets:view'>
          {currentYear && (
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
              {/* Budget Summary */}
              <div className='lg:col-span-1'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center'>
                      <DollarSign className='mr-2 h-5 w-5' />
                      Year {selectedYear} Budget Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-3'>
                    <div className='grid grid-cols-2 gap-4 text-sm'>
                      <div>
                        <div className='mb-1 text-gray-600'>Award</div>
                        <div className='font-semibold'>
                          {formatCurrency(currentYear.awardAmount)}
                        </div>
                      </div>
                      <div>
                        <div className='mb-1 text-gray-600'>Budgeted</div>
                        <div className='font-semibold'>
                          {formatCurrency(totalBudgeted)}
                        </div>
                      </div>
                      <div>
                        <div className='mb-1 text-gray-600'>Spent</div>
                        <div className='font-semibold text-red-600'>
                          {formatCurrency(totalSpent)}
                        </div>
                      </div>
                      <div>
                        <div className='mb-1 text-gray-600'>Encumbered</div>
                        <div className='font-semibold text-yellow-600'>
                          {formatCurrency(totalEncumbered)}
                        </div>
                      </div>
                      <div className='col-span-2'>
                        <div className='mb-1 text-gray-600'>Available</div>
                        <div className='font-semibold text-green-600'>
                          {formatCurrency(
                            totalBudgeted - totalSpent - totalEncumbered
                          )}
                        </div>
                      </div>
                    </div>

                    <div className='border-t pt-2'>
                      <div className='mb-2 flex items-center justify-between'>
                        <span className='text-sm font-medium'>
                          Budget Utilization
                        </span>
                        <span className='font-medium'>
                          {utilizationPercentage}%
                        </span>
                      </div>
                      <div className='h-2 w-full rounded-full bg-gray-200'>
                        <div
                          className={`h-2 rounded-full ${
                            utilizationPercentage > 90
                              ? 'bg-red-500'
                              : utilizationPercentage > 75
                                ? 'bg-yellow-500'
                                : 'bg-blue-500'
                          }`}
                          style={{
                            width: `${Math.min(utilizationPercentage, 100)}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className='border-t pt-2 text-xs text-gray-500'>
                      Period: {currentYear.startDate.toLocaleDateString()} -{' '}
                      {currentYear.endDate.toLocaleDateString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Budget Line Items */}
              <div className='lg:col-span-2'>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      Budget Line Items - Year {selectedYear}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='overflow-x-auto'>
                      <table className='w-full'>
                        <thead>
                          <tr className='border-b'>
                            <th className='w-1/3 px-3 py-3 text-left font-medium text-gray-900'>
                              <div className='break-words text-center'>
                                Category
                              </div>
                            </th>
                            <th className='px-2 py-3 text-center font-medium text-gray-900'>
                              <div className='break-words'>Budgeted</div>
                            </th>
                            <th className='px-2 py-3 text-center font-medium text-gray-900'>
                              <div className='break-words'>Spent</div>
                            </th>
                            <th className='px-2 py-3 text-center font-medium text-gray-900'>
                              <div className='break-words'>Encumbered</div>
                            </th>
                            <th className='px-2 py-3 text-center font-medium text-gray-900'>
                              <div className='break-words'>Available</div>
                            </th>
                            <th className='px-2 py-3 text-center font-medium text-gray-900'>
                              <div className='break-words'>Utilization</div>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentYear.budgetLineItems.map(item => {
                            const available =
                              item.budgetedAmount -
                              item.actualSpent -
                              item.encumberedAmount;
                            const utilization =
                              item.budgetedAmount > 0
                                ? Math.round(
                                    ((item.actualSpent +
                                      item.encumberedAmount) /
                                      item.budgetedAmount) *
                                      100
                                  )
                                : 0;

                            return (
                              <tr
                                key={item.id}
                                className='border-b hover:bg-gray-50'
                              >
                                <td className='px-3 py-3'>
                                  <div>
                                    <div className='font-medium'>
                                      {item.category}
                                    </div>
                                    <div className='break-words text-sm text-gray-600'>
                                      {item.description}
                                    </div>
                                  </div>
                                </td>
                                <td className='px-2 py-3 text-center font-medium'>
                                  {formatCurrency(item.budgetedAmount)}
                                </td>
                                <td className='px-2 py-3 text-center text-red-600'>
                                  {formatCurrency(item.actualSpent)}
                                </td>
                                <td className='px-2 py-3 text-center text-yellow-600'>
                                  {formatCurrency(item.encumberedAmount)}
                                </td>
                                <td className='px-2 py-3 text-center text-green-600'>
                                  {formatCurrency(available)}
                                </td>
                                <td className='px-2 py-3 text-center'>
                                  <span
                                    className={`font-medium ${
                                      utilization > 90
                                        ? 'text-red-600'
                                        : utilization > 75
                                          ? 'text-yellow-600'
                                          : 'text-blue-600'
                                    }`}
                                  >
                                    {utilization}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </PermissionGuard>

        {/* Documents Section */}
        <PermissionGuard permission='documents:view'>
          <div className='mt-8'>
            <SimpleDocumentManager
              grantId={grantId}
              currentYear={selectedYear}
            />
          </div>
        </PermissionGuard>

        {/* Tasks Section */}
        <div className='mt-8'>
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h3 className='flex items-center text-lg font-semibold text-gray-900'>
                <ListTodo className='mr-2 h-5 w-5' />
                Tasks & Milestones - Year {selectedYear}
              </h3>
              <p className='mt-1 text-sm text-gray-600'>
                Track progress and manage deliverables for this grant year
              </p>
            </div>
            <PermissionGuard
              grant={{ principalInvestigatorId: 'demo-user-id' }}
              requireGrantEdit={true}
              showFallback={false}
            >
              <Button
                onClick={() => setShowCreateTask(true)}
                className='flex items-center gap-2'
              >
                <Plus className='h-4 w-4' />
                Add Task
              </Button>
            </PermissionGuard>
          </div>

          {showCreateTask ? (
            <CreateTaskForm
              grantYearId={`${grantId}-year-${selectedYear}`}
              onSuccess={() => setShowCreateTask(false)}
              onCancel={() => setShowCreateTask(false)}
            />
          ) : (
            <TaskList
              grantYearId={`${grantId}-year-${selectedYear}`}
              showFilters={false}
              compact={true}
              showCreateButton={false}
            />
          )}
        </div>
      </main>
    </div>
  );
}
