import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate, getStatusBadgeVariant } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState } from 'react';

interface GrantCardProps {
  grant: {
    id: string;
    grantTitle: string;
    grantNumberMaster: string;
    agencyName: string;
    status: string;
    currentYearNumber: number;
    totalYears: number;
    startDate: Date;
    endDate: Date;
    principalInvestigator: {
      fullName: string;
      email: string;
    };
    grantYears?: Array<{
      awardAmount: number;
      budgetLineItems: Array<{
        budgetedAmount: number;
        actualSpent: number;
        encumberedAmount: number;
      }>;
    }>;
  };
}

export function GrantCard({ grant }: GrantCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const currentYear = grant.grantYears?.[0];
  const totalBudgeted =
    currentYear?.budgetLineItems.reduce(
      (sum, item) => sum + Number(item.budgetedAmount),
      0
    ) || 0;
  const totalSpent =
    currentYear?.budgetLineItems.reduce(
      (sum, item) => sum + Number(item.actualSpent),
      0
    ) || 0;

  return (
    <Card className='transition-shadow hover:shadow-lg'>
      <CardHeader>
        <div className='flex items-start justify-between'>
          <div className='flex-1'>
            <CardTitle className='mb-2 text-lg'>{grant.grantTitle}</CardTitle>
            <div className='space-y-1 text-sm text-gray-600'>
              <p>
                <span className='font-medium'>Grant #:</span>{' '}
                {grant.grantNumberMaster}
              </p>
              <p>
                <span className='font-medium'>Agency:</span> {grant.agencyName}
              </p>
              <p>
                <span className='font-medium'>PI:</span>{' '}
                {grant.principalInvestigator.fullName}
              </p>
            </div>
          </div>
          <div className='flex flex-col items-end space-y-2'>
            <Badge
              variant={getStatusBadgeVariant(grant.status)}
              className={
                grant.status === 'ACTIVE'
                  ? 'border-green-200 bg-green-100 text-green-600'
                  : grant.status === 'DRAFT'
                    ? 'border-yellow-200 bg-yellow-100 text-yellow-600'
                    : grant.status === 'CLOSED'
                      ? 'border-gray-200 bg-gray-100 text-gray-600'
                      : ''
              }
            >
              {grant.status}
            </Badge>
            <Badge variant='outline'>
              Year {grant.currentYearNumber} of {grant.totalYears}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {/* Budget Summary */}
          {currentYear && (
            <div className='rounded-md bg-gray-50 p-3'>
              <h4 className='mb-2 text-sm font-medium'>Current Year Budget</h4>
              <div className='grid grid-cols-2 gap-4 text-sm'>
                <div>
                  <p className='text-gray-600'>Award Amount</p>
                  <p className='font-medium'>
                    {formatCurrency(currentYear.awardAmount)}
                  </p>
                </div>
                <div>
                  <p className='text-gray-600'>Spent</p>
                  <p className='font-medium'>{formatCurrency(totalSpent)}</p>
                </div>
              </div>
              {totalBudgeted > 0 && (
                <div className='mt-2'>
                  <div className='mb-1 flex justify-between text-xs text-gray-600'>
                    <span>Budget Utilization</span>
                    <span>
                      {Math.round((totalSpent / totalBudgeted) * 100)}%
                    </span>
                  </div>
                  <div className='h-2 w-full rounded-full bg-gray-200'>
                    <div
                      className='h-2 rounded-full bg-blue-600'
                      style={{
                        width: `${Math.min((totalSpent / totalBudgeted) * 100, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Grant Period */}
          <div className='text-sm'>
            <p className='text-gray-600'>
              <span className='font-medium'>Period:</span>{' '}
              {formatDate(grant.startDate)} - {formatDate(grant.endDate)}
            </p>
          </div>

          {/* Actions */}
          <div className='flex space-x-2 pt-2'>
            <Button asChild size='sm'>
              <Link href={`/grant/${grant.id}`}>View Details</Link>
            </Button>
            {grant.id === '1' ? (
              <Button asChild variant='outline' size='sm'>
                <Link
                  href={`/grant/${grant.id}/year/${grant.currentYearNumber}`}
                >
                  Current Year
                </Link>
              </Button>
            ) : (
              <div className='relative'>
                <Button
                  variant='outline'
                  size='sm'
                  disabled
                  className='cursor-not-allowed opacity-60'
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                >
                  Current Year
                </Button>
                {showTooltip && (
                  <div className='absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform whitespace-nowrap rounded-md bg-gray-900 px-3 py-2 text-xs text-white'>
                    Demo: Only Grant ID '1' has detailed data
                    <div className='absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 transform border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900'></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
