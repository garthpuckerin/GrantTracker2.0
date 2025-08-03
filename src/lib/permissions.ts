import { UserRole } from '@prisma/client';

// Define permission types
export type Permission =
  | 'grants:view'
  | 'grants:create'
  | 'grants:edit'
  | 'grants:delete'
  | 'budgets:view'
  | 'budgets:edit'
  | 'budgets:approve'
  | 'documents:view'
  | 'documents:upload'
  | 'documents:delete'
  | 'reports:view'
  | 'reports:create'
  | 'users:view'
  | 'users:manage'
  | 'admin:all';

// Role-based permissions mapping
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    'grants:view',
    'grants:create',
    'grants:edit',
    'grants:delete',
    'budgets:view',
    'budgets:edit',
    'budgets:approve',
    'documents:view',
    'documents:upload',
    'documents:delete',
    'reports:view',
    'reports:create',
    'users:view',
    'users:manage',
    'admin:all',
  ],
  PI: [
    'grants:view',
    'grants:create',
    'grants:edit',
    'budgets:view',
    'budgets:edit',
    'documents:view',
    'documents:upload',
    'documents:delete',
    'reports:view',
    'reports:create',
  ],
  FINANCE: [
    'grants:view',
    'budgets:view',
    'budgets:edit',
    'budgets:approve',
    'documents:view',
    'documents:upload',
    'reports:view',
  ],
  VIEWER: ['grants:view', 'budgets:view', 'documents:view', 'reports:view'],
};

// Check if a user has a specific permission
export function hasPermission(
  userRole: UserRole,
  permission: Permission
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole];
  return (
    rolePermissions.includes(permission) ||
    rolePermissions.includes('admin:all')
  );
}

// Check if a user has any of the specified permissions
export function hasAnyPermission(
  userRole: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.some(permission => hasPermission(userRole, permission));
}

// Check if a user has all of the specified permissions
export function hasAllPermissions(
  userRole: UserRole,
  permissions: Permission[]
): boolean {
  return permissions.every(permission => hasPermission(userRole, permission));
}

// Get all permissions for a role
export function getRolePermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole];
}

// Check if user can access a specific grant (PI can only access their own grants)
export function canAccessGrant(
  userRole: UserRole,
  userId: string,
  grant: { principalInvestigatorId: string }
): boolean {
  // Admins can access all grants
  if (userRole === 'ADMIN') {
    return true;
  }

  // PIs can only access their own grants
  if (userRole === 'PI') {
    return grant.principalInvestigatorId === userId;
  }

  // Finance and Viewers can access all grants they have permission to view
  return hasPermission(userRole, 'grants:view');
}

// Check if user can edit a specific grant
export function canEditGrant(
  userRole: UserRole,
  userId: string,
  grant: { principalInvestigatorId: string }
): boolean {
  // Must have edit permission
  if (!hasPermission(userRole, 'grants:edit')) {
    return false;
  }

  // Admins can edit all grants
  if (userRole === 'ADMIN') {
    return true;
  }

  // PIs can only edit their own grants
  if (userRole === 'PI') {
    return grant.principalInvestigatorId === userId;
  }

  return false;
}

// Check if user can approve budgets
export function canApproveBudget(userRole: UserRole): boolean {
  return hasPermission(userRole, 'budgets:approve');
}

// Check if user can manage other users
export function canManageUsers(userRole: UserRole): boolean {
  return hasPermission(userRole, 'users:manage');
}

// Get user role display name
export function getRoleDisplayName(role: UserRole): string {
  const roleNames: Record<UserRole, string> = {
    ADMIN: 'Administrator',
    PI: 'Principal Investigator',
    FINANCE: 'Finance Officer',
    VIEWER: 'Viewer',
  };
  return roleNames[role];
}

// Get user role description
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    ADMIN: 'Full system access with user management capabilities',
    PI: 'Can create and manage their own grants and budgets',
    FINANCE: 'Can view and approve budgets across all grants',
    VIEWER: 'Read-only access to grants, budgets, and reports',
  };
  return descriptions[role];
}

// Check if role can perform bulk operations
export function canPerformBulkOperations(userRole: UserRole): boolean {
  return userRole === 'ADMIN' || userRole === 'FINANCE';
}

// Get available actions for a user on a grant
export function getAvailableGrantActions(
  userRole: UserRole,
  userId: string,
  grant: { principalInvestigatorId: string }
): string[] {
  const actions: string[] = [];

  if (canAccessGrant(userRole, userId, grant)) {
    actions.push('view');
  }

  if (canEditGrant(userRole, userId, grant)) {
    actions.push('edit');
  }

  if (hasPermission(userRole, 'grants:delete') && userRole === 'ADMIN') {
    actions.push('delete');
  }

  if (hasPermission(userRole, 'documents:upload')) {
    actions.push('upload_documents');
  }

  if (hasPermission(userRole, 'reports:create')) {
    actions.push('create_reports');
  }

  return actions;
}
