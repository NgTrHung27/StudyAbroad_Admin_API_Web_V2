import { UserRole } from "@prisma/client";

export const ROLE_PERMISSIONS = {
  [UserRole.ADMIN]: [
    "manage_users",
    "manage_schools",
    "manage_news",
    "manage_feedbacks",
    "manage_students",
    "manage_settings",
    "view_analytics",
  ],
  [UserRole.MODERATOR]: [
    "manage_news",
    "manage_feedbacks",
    "view_analytics",
  ],
  [UserRole.USER]: [
    "view_own_profile",
    "update_own_profile",
  ],
};

export const hasPermission = (role: UserRole, permission: string): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

export const hasAnyPermission = (
  role: UserRole,
  permissions: string[]
): boolean => {
  return permissions.some((permission) => hasPermission(role, permission));
};

export const hasAllPermissions = (
  role: UserRole,
  permissions: string[]
): boolean => {
  return permissions.every((permission) => hasPermission(role, permission));
};
