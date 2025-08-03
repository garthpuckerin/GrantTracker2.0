import { auth, currentUser } from '@clerk/nextjs/server';
import { db } from './db';

// Define the enum values directly since Prisma client exports are inconsistent
const UserRole = {
  ADMIN: 'ADMIN',
  PI: 'PI',
  FINANCE: 'FINANCE',
  VIEWER: 'VIEWER',
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];

export async function getCurrentUser() {
  const { userId } = auth();
  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  // Sync user with database
  const user = await db.user.upsert({
    where: { clerkId: userId },
    update: {
      fullName:
        `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
    },
    create: {
      clerkId: userId,
      fullName:
        `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      role: UserRole.VIEWER, // Default role
    },
  });

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]) {
  const user = await requireAuth();
  if (!allowedRoles.includes(user.role as UserRole)) {
    throw new Error('Insufficient permissions');
  }
  return user;
}

export async function requireAdmin() {
  return requireRole([UserRole.ADMIN]);
}

export async function requirePIOrAdmin() {
  return requireRole([UserRole.PI, UserRole.ADMIN]);
}

export async function requireFinanceOrAdmin() {
  return requireRole([UserRole.FINANCE, UserRole.ADMIN]);
}

export function hasPermission(
  userRole: string,
  requiredRoles: UserRole[]
): boolean {
  return requiredRoles.includes(userRole as UserRole);
}

export function canEditGrant(userRole: string, isPI: boolean = false): boolean {
  return userRole === UserRole.ADMIN || (userRole === UserRole.PI && isPI);
}

export function canViewGrant(userRole: string, isPI: boolean = false): boolean {
  return (
    userRole === UserRole.ADMIN ||
    userRole === UserRole.FINANCE ||
    (userRole === UserRole.PI && isPI) ||
    userRole === UserRole.VIEWER
  );
}

export function canEditBudget(userRole: string): boolean {
  return userRole === UserRole.ADMIN || userRole === UserRole.FINANCE;
}

export function canUploadDocuments(
  userRole: string,
  isPI: boolean = false
): boolean {
  return (
    userRole === UserRole.ADMIN ||
    userRole === UserRole.FINANCE ||
    (userRole === UserRole.PI && isPI)
  );
}

export function canManageTasks(
  userRole: string,
  isPI: boolean = false
): boolean {
  return userRole === UserRole.ADMIN || (userRole === UserRole.PI && isPI);
}

export { UserRole };
