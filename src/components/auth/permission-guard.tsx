'use client';

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';
import { Permission } from '@/lib/permissions';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';

interface PermissionGuardProps {
  children: ReactNode;
  permission?: Permission;
  permissions?: Permission[];
  requireAll?: boolean;
  fallback?: ReactNode;
  showFallback?: boolean;
  grant?: { principalInvestigatorId: string };
  requireGrantAccess?: boolean;
  requireGrantEdit?: boolean;
}

export function PermissionGuard({
  children,
  permission,
  permissions = [],
  requireAll = false,
  fallback,
  showFallback = true,
  grant,
  requireGrantAccess = false,
  requireGrantEdit = false,
}: PermissionGuardProps) {
  const {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canAccessGrant,
    canEditGrant,
    isLoaded,
  } = usePermissions();

  // Show loading state while permissions are being loaded
  if (!isLoaded) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600'></div>
      </div>
    );
  }

  let hasAccess = true;

  // Check single permission
  if (permission) {
    hasAccess = hasPermission(permission);
  }

  // Check multiple permissions
  if (permissions.length > 0) {
    hasAccess = requireAll
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  // Check grant-specific access
  if (grant && requireGrantAccess) {
    hasAccess = hasAccess && canAccessGrant(grant);
  }

  // Check grant edit permissions
  if (grant && requireGrantEdit) {
    hasAccess = hasAccess && canEditGrant(grant);
  }

  // If user has access, render children
  if (hasAccess) {
    return <>{children}</>;
  }

  // If no access and showFallback is false, render nothing
  if (!showFallback) {
    return null;
  }

  // If custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback UI
  return (
    <Card className='border-red-200 bg-red-50'>
      <CardContent className='flex items-center space-x-3 p-4'>
        <AlertTriangle className='h-5 w-5 text-red-500' />
        <div>
          <p className='text-sm font-medium text-red-800'>Access Restricted</p>
          <p className='text-xs text-red-600'>
            You don't have permission to view this content.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// Specialized component for admin-only content
export function AdminOnly({
  children,
  fallback,
  showFallback = false,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  showFallback?: boolean;
}) {
  return (
    <PermissionGuard
      permission='admin:all'
      fallback={fallback}
      showFallback={showFallback}
    >
      {children}
    </PermissionGuard>
  );
}

// Specialized component for PI-only content
export function PIOnly({
  children,
  fallback,
  showFallback = false,
  grant,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  showFallback?: boolean;
  grant?: { principalInvestigatorId: string };
}) {
  return (
    <PermissionGuard
      permissions={['grants:edit', 'grants:create']}
      grant={grant}
      requireGrantEdit={!!grant}
      fallback={fallback}
      showFallback={showFallback}
    >
      {children}
    </PermissionGuard>
  );
}

// Specialized component for finance-only content
export function FinanceOnly({
  children,
  fallback,
  showFallback = false,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  showFallback?: boolean;
}) {
  return (
    <PermissionGuard
      permission='budgets:approve'
      fallback={fallback}
      showFallback={showFallback}
    >
      {children}
    </PermissionGuard>
  );
}

// Component for role-based conditional rendering
export function RoleBasedContent({
  admin,
  pi,
  finance,
  viewer,
  fallback,
}: {
  admin?: ReactNode;
  pi?: ReactNode;
  finance?: ReactNode;
  viewer?: ReactNode;
  fallback?: ReactNode;
}) {
  const { userRole } = usePermissions();

  switch (userRole) {
    case 'ADMIN':
      return admin ? <>{admin}</> : null;
    case 'PI':
      return pi ? <>{pi}</> : null;
    case 'FINANCE':
      return finance ? <>{finance}</> : null;
    case 'VIEWER':
      return viewer ? <>{viewer}</> : null;
    default:
      return fallback ? <>{fallback}</> : null;
  }
}

// Component for permission-based button rendering
export function PermissionButton({
  permission,
  permissions = [],
  requireAll = false,
  grant,
  requireGrantAccess = false,
  requireGrantEdit = false,
  children,
  fallback,
  ...buttonProps
}: PermissionGuardProps & {
  [key: string]: any;
}) {
  return (
    <PermissionGuard
      permission={permission}
      permissions={permissions}
      requireAll={requireAll}
      grant={grant}
      requireGrantAccess={requireGrantAccess}
      requireGrantEdit={requireGrantEdit}
      fallback={fallback}
      showFallback={!!fallback}
    >
      <button {...buttonProps}>{children}</button>
    </PermissionGuard>
  );
}

// Component for showing user role information
export function UserRoleIndicator() {
  const { userRole, user } = usePermissions();

  if (!user) return null;

  const roleColors = {
    ADMIN: 'bg-red-100 text-red-800 border-red-200',
    PI: 'bg-blue-100 text-blue-800 border-blue-200',
    FINANCE: 'bg-green-100 text-green-800 border-green-200',
    VIEWER: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div
      className={`inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium ${roleColors[userRole]}`}
    >
      <Shield className='mr-1 h-3 w-3' />
      {userRole}
    </div>
  );
}
