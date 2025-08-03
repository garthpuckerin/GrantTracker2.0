import { useUser } from '@clerk/nextjs';
import { UserRole } from '@prisma/client';
import {
  Permission,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessGrant,
  canEditGrant,
  canApproveBudget,
  canManageUsers,
  getRolePermissions,
  getAvailableGrantActions,
} from '@/lib/permissions';

// Mock user data for demo purposes (since Clerk is disabled)
const MOCK_USER = {
  id: 'demo-user-id',
  role: 'ADMIN' as UserRole,
  fullName: 'Demo User',
  email: 'demo@university.edu',
};

export function usePermissions() {
  // In production, this would use the actual Clerk user
  // const { user, isLoaded } = useUser();

  // For demo purposes, use mock user
  const user = MOCK_USER;
  const isLoaded = true;

  const userRole = user?.role || 'VIEWER';
  const userId = user?.id || '';

  return {
    // User info
    user,
    userRole,
    userId,
    isLoaded,

    // Permission checking functions
    hasPermission: (permission: Permission) =>
      hasPermission(userRole, permission),
    hasAnyPermission: (permissions: Permission[]) =>
      hasAnyPermission(userRole, permissions),
    hasAllPermissions: (permissions: Permission[]) =>
      hasAllPermissions(userRole, permissions),

    // Grant-specific permissions
    canAccessGrant: (grant: { principalInvestigatorId: string }) =>
      canAccessGrant(userRole, userId, grant),
    canEditGrant: (grant: { principalInvestigatorId: string }) =>
      canEditGrant(userRole, userId, grant),

    // Specific permission checks
    canApproveBudget: () => canApproveBudget(userRole),
    canManageUsers: () => canManageUsers(userRole),

    // Utility functions
    getRolePermissions: () => getRolePermissions(userRole),
    getAvailableGrantActions: (grant: { principalInvestigatorId: string }) =>
      getAvailableGrantActions(userRole, userId, grant),

    // Role checks
    isAdmin: userRole === 'ADMIN',
    isPI: userRole === 'PI',
    isFinance: userRole === 'FINANCE',
    isViewer: userRole === 'VIEWER',
  };
}

// Hook for checking if user can perform a specific action
export function usePermissionCheck(permission: Permission) {
  const { hasPermission } = usePermissions();
  return hasPermission(permission);
}

// Hook for checking multiple permissions
export function usePermissionChecks(permissions: Permission[]) {
  const { hasAnyPermission, hasAllPermissions } = usePermissions();

  return {
    hasAny: hasAnyPermission(permissions),
    hasAll: hasAllPermissions(permissions),
  };
}

// Hook for grant-specific permissions
export function useGrantPermissions(grant: {
  principalInvestigatorId: string;
}) {
  const { canAccessGrant, canEditGrant, getAvailableGrantActions } =
    usePermissions();

  return {
    canAccess: canAccessGrant(grant),
    canEdit: canEditGrant(grant),
    availableActions: getAvailableGrantActions(grant),
  };
}

// Hook for role-based UI customization
export function useRoleBasedUI() {
  const { userRole, isAdmin, isPI, isFinance, isViewer } = usePermissions();

  // Define UI configurations for different roles
  const uiConfig = {
    showAdminPanel: isAdmin,
    showUserManagement: isAdmin,
    showFinanceTools: isAdmin || isFinance,
    showBudgetApproval: isAdmin || isFinance,
    showCreateGrant: isAdmin || isPI,
    showBulkOperations: isAdmin || isFinance,
    showAdvancedReports: isAdmin || isFinance,
    maxGrantsVisible: isAdmin ? Infinity : isPI ? 50 : 25,
    canExportData: isAdmin || isFinance,
    canModifySettings: isAdmin,
  };

  return {
    userRole,
    isAdmin,
    isPI,
    isFinance,
    isViewer,
    ...uiConfig,
  };
}

// Hook for navigation permissions
export function useNavigationPermissions() {
  const { hasPermission } = usePermissions();

  return {
    canViewDashboard: hasPermission('grants:view'),
    canViewReports: hasPermission('reports:view'),
    canViewUsers: hasPermission('users:view'),
    canAccessAdmin: hasPermission('admin:all'),
  };
}
