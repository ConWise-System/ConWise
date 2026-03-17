import { DASHBOARD_BY_ROLE, ROLES } from "../../config/constants.js";

const DEFAULT_PERMISSIONS = Object.freeze({
  canManagePlatform: false,
  canManageCompany: false,
  canManageUsers: false,
  canAssignRoles: false,
  canCreateProject: false,
  canApproveWorkflows: false,
  canViewAllCompanyProjects: false,
  canManageOwnAssignedTasks: false,
  canUpdateTaskProgress: false,
  canSubmitDailyReports: false,
  canSubmitIssueReports: false,
  canViewAnalytics: false,
  canAccessAdminDashboard: false,
});

const ROLE_PERMISSIONS = Object.freeze({
  [ROLES.PLATFORM_ADMIN]: Object.freeze({
    ...DEFAULT_PERMISSIONS,
    canManagePlatform: true,
    canManageCompany: true,
    canManageUsers: true,
    canAssignRoles: true,
    canViewAnalytics: true,
    canAccessAdminDashboard: true,
  }),

  [ROLES.COMPANY_ADMIN]: Object.freeze({
    ...DEFAULT_PERMISSIONS,
    canManageCompany: true,
    canManageUsers: true,
    canAssignRoles: true,
    canCreateProject: true,
    canApproveWorkflows: true,
    canViewAllCompanyProjects: true,
    canViewAnalytics: true,
    canAccessAdminDashboard: true,
  }),

  [ROLES.PROJECT_MANAGER]: Object.freeze({
    ...DEFAULT_PERMISSIONS,
    canCreateProject: true,
    canApproveWorkflows: true,
    canViewAllCompanyProjects: true,
    canViewAnalytics: true,
  }),

  [ROLES.SITE_ENGINEER]: Object.freeze({
    ...DEFAULT_PERMISSIONS,
    canManageOwnAssignedTasks: true,
    canUpdateTaskProgress: true,
  }),

  [ROLES.SITE_SUPERVISOR]: Object.freeze({
    ...DEFAULT_PERMISSIONS,
    canSubmitDailyReports: true,
    canSubmitIssueReports: true,
  }),
});

const COMPANY_ADMIN_MANAGEABLE_ROLES = Object.freeze([
  ROLES.PROJECT_MANAGER,
  ROLES.SITE_ENGINEER,
  ROLES.SITE_SUPERVISOR,
]);

export function isValidRole(role) {
  return Object.values(ROLES).includes(role);
}

export function getRolePermissions(role) {
  if (!role || !ROLE_PERMISSIONS[role]) {
    return { ...DEFAULT_PERMISSIONS };
  }

  return { ...ROLE_PERMISSIONS[role] };
}

export function hasPermission(role, permission) {
  if (!permission || typeof permission !== "string") {
    return false;
  }

  const permissions = getRolePermissions(role);
  return permissions[permission] === true;
}

export function hasAnyPermission(role, permissions = []) {
  if (!Array.isArray(permissions) || permissions.length === 0) {
    return false;
  }

  return permissions.some((permission) => hasPermission(role, permission));
}

export function hasAllPermissions(role, permissions = []) {
  if (!Array.isArray(permissions) || permissions.length === 0) {
    return false;
  }

  return permissions.every((permission) => hasPermission(role, permission));
}

export function canManageUserRole(actorRole, targetRole) {
  if (!isValidRole(actorRole) || !isValidRole(targetRole)) {
    return false;
  }

  if (actorRole === ROLES.PLATFORM_ADMIN) {
    return true;
  }

  if (actorRole === ROLES.COMPANY_ADMIN) {
    return COMPANY_ADMIN_MANAGEABLE_ROLES.includes(targetRole);
  }

  return false;
}

export function getAssignableRoles(actorRole) {
  if (actorRole === ROLES.PLATFORM_ADMIN) {
    return Object.values(ROLES);
  }

  if (actorRole === ROLES.COMPANY_ADMIN) {
    return [...COMPANY_ADMIN_MANAGEABLE_ROLES];
  }

  return [];
}

export function canAssignRole(actorRole, targetRole) {
  return canManageUserRole(actorRole, targetRole);
}

export function canChangeRole(actorRole, currentTargetRole, nextTargetRole) {
  if (!isValidRole(actorRole)) {
    return false;
  }

  if (!isValidRole(currentTargetRole) || !isValidRole(nextTargetRole)) {
    return false;
  }

  if (actorRole === ROLES.PLATFORM_ADMIN) {
    return true;
  }

  if (actorRole === ROLES.COMPANY_ADMIN) {
    return (
      COMPANY_ADMIN_MANAGEABLE_ROLES.includes(currentTargetRole) &&
      COMPANY_ADMIN_MANAGEABLE_ROLES.includes(nextTargetRole)
    );
  }

  return false;
}

export function canViewUser(actorRole, targetRole) {
  if (!isValidRole(actorRole) || !isValidRole(targetRole)) {
    return false;
  }

  if (actorRole === ROLES.PLATFORM_ADMIN) {
    return true;
  }

  if (actorRole === ROLES.COMPANY_ADMIN) {
    return (
      COMPANY_ADMIN_MANAGEABLE_ROLES.includes(targetRole) ||
      targetRole === ROLES.COMPANY_ADMIN
    );
  }

  return false;
}

export function canDeactivateUser(actorRole, targetRole) {
  if (!isValidRole(actorRole) || !isValidRole(targetRole)) {
    return false;
  }

  if (actorRole === ROLES.PLATFORM_ADMIN) {
    return true;
  }

  if (actorRole === ROLES.COMPANY_ADMIN) {
    return COMPANY_ADMIN_MANAGEABLE_ROLES.includes(targetRole);
  }

  return false;
}

export function getDefaultDashboardPath(role) {
  return DASHBOARD_BY_ROLE[role] || "/dashboard";
}

export function isAdminRole(role) {
  return role === ROLES.PLATFORM_ADMIN || role === ROLES.COMPANY_ADMIN;
}

export function isCompanyScopedRole(role) {
  return [
    ROLES.COMPANY_ADMIN,
    ROLES.PROJECT_MANAGER,
    ROLES.SITE_ENGINEER,
    ROLES.SITE_SUPERVISOR,
  ].includes(role);
}

export function isPlatformRole(role) {
  return role === ROLES.PLATFORM_ADMIN;
}

export function isCompanyAdminManageableRole(role) {
  return COMPANY_ADMIN_MANAGEABLE_ROLES.includes(role);
}

export function buildRoleAccessProfile(role) {
  return {
    role,
    dashboardPath: getDefaultDashboardPath(role),
    isAdmin: isAdminRole(role),
    isPlatformRole: isPlatformRole(role),
    isCompanyScoped: isCompanyScopedRole(role),
    isCompanyAdminManageableRole: isCompanyAdminManageableRole(role),
    permissions: getRolePermissions(role),
  };
}

export default {
  isValidRole,
  getRolePermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canManageUserRole,
  getAssignableRoles,
  canAssignRole,
  canChangeRole,
  canViewUser,
  canDeactivateUser,
  getDefaultDashboardPath,
  isAdminRole,
  isCompanyScopedRole,
  isPlatformRole,
  isCompanyAdminManageableRole,
  buildRoleAccessProfile,
};
