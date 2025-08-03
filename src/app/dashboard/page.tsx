'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GrantCard } from '@/components/grants/grant-card';
import { Badge } from '@/components/ui/badge';
import { ThemePicker } from '@/components/ui/theme-picker';
import {
  Search,
  Plus,
  Filter,
  Settings,
  Users,
  BarChart3,
  ListTodo,
} from 'lucide-react';
import { usePermissions, useRoleBasedUI } from '@/hooks/use-permissions';
import {
  PermissionGuard,
  AdminOnly,
  UserRoleIndicator,
} from '@/components/auth/permission-guard';

// Mock data for demonstration
const mockGrants = [
  {
    id: '1',
    grantTitle: 'Improving STEM Education Through Technology',
    grantNumberMaster: 'EDU-STEM-2024',
    agencyName: 'Department of Education',
    status: 'ACTIVE',
    currentYearNumber: 2,
    totalYears: 5,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2028-12-31'),
    principalInvestigator: {
      fullName: 'Dr. Jane Smith',
      email: 'jane.smith@university.edu',
    },
    grantYears: [
      {
        awardAmount: 950000,
        budgetLineItems: [
          {
            budgetedAmount: 400000,
            actualSpent: 100000,
            encumberedAmount: 50000,
          },
          {
            budgetedAmount: 200000,
            actualSpent: 45000,
            encumberedAmount: 25000,
          },
          {
            budgetedAmount: 150000,
            actualSpent: 30000,
            encumberedAmount: 20000,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    grantTitle: 'Advanced Materials Research Initiative',
    grantNumberMaster: 'NSF-MAT-2024',
    agencyName: 'National Science Foundation',
    status: 'ACTIVE',
    currentYearNumber: 1,
    totalYears: 3,
    startDate: new Date('2024-06-01'),
    endDate: new Date('2027-05-31'),
    principalInvestigator: {
      fullName: 'Dr. Michael Johnson',
      email: 'michael.johnson@university.edu',
    },
    grantYears: [
      {
        awardAmount: 750000,
        budgetLineItems: [
          {
            budgetedAmount: 300000,
            actualSpent: 75000,
            encumberedAmount: 40000,
          },
          {
            budgetedAmount: 250000,
            actualSpent: 60000,
            encumberedAmount: 30000,
          },
        ],
      },
    ],
  },
  {
    id: '3',
    grantTitle: 'Climate Change Impact Assessment',
    grantNumberMaster: 'EPA-CLIMATE-2023',
    agencyName: 'Environmental Protection Agency',
    status: 'DRAFT',
    currentYearNumber: 1,
    totalYears: 4,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2028-02-29'),
    principalInvestigator: {
      fullName: 'Dr. Sarah Wilson',
      email: 'sarah.wilson@university.edu',
    },
    grantYears: [
      {
        awardAmount: 1200000,
        budgetLineItems: [
          { budgetedAmount: 500000, actualSpent: 0, encumberedAmount: 0 },
          { budgetedAmount: 400000, actualSpent: 0, encumberedAmount: 0 },
        ],
      },
    ],
  },
];

const mockStats = {
  totalGrants: 15,
  activeGrants: 8,
  draftGrants: 4,
  closedGrants: 3,
};

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { user, userRole, hasPermission } = usePermissions();
  const {
    showCreateGrant,
    showAdminPanel,
    showFinanceTools,
    maxGrantsVisible,
  } = useRoleBasedUI();

  const filteredGrants = mockGrants
    .filter(grant => {
      const matchesSearch =
        grant.grantTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grant.grantNumberMaster
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        grant.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        grant.principalInvestigator.fullName
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === 'ALL' || grant.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .slice(0, maxGrantsVisible);

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='border-b bg-white shadow-sm'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex h-16 items-center justify-between'>
            <div className='flex items-center'>
              <h1 className='text-xl font-semibold text-gray-900'>
                Grant Tracker 2.0
              </h1>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-sm text-gray-600'>
                Welcome, {user?.fullName || 'Demo User'}
              </span>
              <UserRoleIndicator />

              <ThemePicker />

              <Button
                variant='ghost'
                size='sm'
                onClick={() => (window.location.href = '/tasks')}
              >
                <ListTodo className='mr-2 h-4 w-4' />
                Tasks
              </Button>

              <AdminOnly>
                <Button variant='ghost' size='sm'>
                  <Settings className='mr-2 h-4 w-4' />
                  Admin
                </Button>
              </AdminOnly>

              <PermissionGuard permission='users:view'>
                <Button variant='ghost' size='sm'>
                  <Users className='mr-2 h-4 w-4' />
                  Users
                </Button>
              </PermissionGuard>

              <button
                className='text-sm text-gray-500 hover:text-gray-700'
                onClick={() => (window.location.href = '/sign-in')}
              >
                Sign Out (Demo)
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
        {/* Page Header */}
        <div className='mb-8'>
          <h2 className='text-3xl font-bold text-gray-900'>Dashboard</h2>
          <p className='mt-2 text-gray-600'>
            Managing Multi-Year Federal Grants
          </p>
        </div>

        {/* Stats Cards */}
        <PermissionGuard permission='grants:view'>
          <div className='mb-8 grid grid-cols-1 gap-6 md:grid-cols-4'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Total Grants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {mockStats.totalGrants}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Active Grants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-emerald-600'>
                  {mockStats.activeGrants}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Draft Grants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-amber-600'>
                  {mockStats.draftGrants}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-gray-600'>
                  Closed Grants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold text-slate-600'>
                  {mockStats.closedGrants}
                </div>
              </CardContent>
            </Card>

            <PermissionGuard permission='budgets:view'>
              <Card>
                <CardHeader className='pb-2'>
                  <CardTitle className='text-sm font-medium text-gray-600'>
                    Budget Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold text-indigo-600'>
                    <BarChart3 className='mr-2 inline h-6 w-6' />
                    Good
                  </div>
                </CardContent>
              </Card>
            </PermissionGuard>
          </div>
        </PermissionGuard>

        {/* Search and Filters */}
        <div className='mb-6 rounded-lg border bg-white p-6 shadow-sm'>
          <div className='flex flex-col gap-4 sm:flex-row'>
            <div className='relative flex-1'>
              <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
              <Input
                placeholder='Search by grant title, number, agency, or PI...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
            <div className='flex gap-2'>
              <Button
                variant={statusFilter === 'ALL' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter('ALL')}
              >
                All
              </Button>
              <Button
                variant={statusFilter === 'ACTIVE' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter('ACTIVE')}
              >
                Active
              </Button>
              <Button
                variant={statusFilter === 'DRAFT' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter('DRAFT')}
              >
                Draft
              </Button>
              <Button
                variant={statusFilter === 'CLOSED' ? 'default' : 'outline'}
                size='sm'
                onClick={() => setStatusFilter('CLOSED')}
              >
                Closed
              </Button>
            </div>
            <PermissionGuard permission='grants:create'>
              <Button>
                <Plus className='mr-2 h-4 w-4' />
                New Grant
              </Button>
            </PermissionGuard>
          </div>
        </div>

        {/* Grants Grid */}
        <div className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-medium text-gray-900'>
              Grants ({filteredGrants.length})
            </h3>
          </div>

          {filteredGrants.length === 0 ? (
            <Card>
              <CardContent className='py-12 text-center'>
                <p className='text-gray-500'>
                  No grants found matching your criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
              {filteredGrants.map(grant => (
                <GrantCard key={grant.id} grant={grant} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
