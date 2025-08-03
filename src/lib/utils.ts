import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(numAmount);
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
}

export function formatDateShort(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2);
}

export function generateGrantNumber(
  masterNumber: string,
  fiscalYear: string
): string {
  return `${masterNumber}-${fiscalYear}`;
}

export function calculateBudgetUtilization(
  budgeted: number,
  spent: number,
  encumbered: number
): {
  available: number;
  utilization: number;
  status: 'under' | 'on-track' | 'over';
} {
  const available = budgeted - spent - encumbered;
  const utilization = ((spent + encumbered) / budgeted) * 100;

  let status: 'under' | 'on-track' | 'over';
  if (utilization < 75) {
    status = 'under';
  } else if (utilization <= 100) {
    status = 'on-track';
  } else {
    status = 'over';
  }

  return {
    available,
    utilization,
    status,
  };
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    ACTIVE: 'bg-green-100 text-green-800',
    CLOSED: 'bg-red-100 text-red-800',
    NOT_AWARDED: 'bg-red-100 text-red-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    SUBMITTED: 'bg-blue-100 text-blue-800',
    AWARDED: 'bg-green-100 text-green-800',
    OPEN: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
    COMPLETE: 'bg-green-100 text-green-800',
    LOW: 'bg-gray-100 text-gray-800',
    MEDIUM: 'bg-yellow-100 text-yellow-800',
    HIGH: 'bg-orange-100 text-orange-800',
    URGENT: 'bg-red-100 text-red-800',
  };

  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusBadgeVariant(
  status: string
): 'default' | 'destructive' | 'outline' | 'secondary' {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'default';
    case 'DRAFT':
      return 'secondary';
    case 'CLOSED':
      return 'outline';
    case 'COMPLETED':
      return 'secondary';
    case 'PLANNED':
      return 'outline';
    default:
      return 'outline';
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
