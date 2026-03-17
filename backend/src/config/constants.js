export const ROLES = {
  PLATFORM_ADMIN: "PLATFORM_ADMIN",
  COMPANY_ADMIN: "COMPANY_ADMIN",
  PROJECT_MANAGER: "PROJECT_MANAGER",
  SITE_ENGINEER: "SITE_ENGINEER",
  SITE_SUPERVISOR: "SITE_SUPERVISOR",
};

export const USER_STATUSES = {
  PENDING_VERIFICATION: "PENDING_VERIFICATION",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  SUSPENDED: "SUSPENDED",
};

export const COMPANY_STATUSES = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  SUSPENDED: "SUSPENDED",
};

export const VERIFICATION_TYPES = {
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
  PHONE_VERIFICATION: "PHONE_VERIFICATION",
  PASSWORD_RESET: "PASSWORD_RESET",
  INVITE: "INVITE",
};

export const AUTH_MESSAGES = {
  COMPANY_ALREADY_EXISTS: "A company with this email or phone already exists.",
  USER_ALREADY_EXISTS: "A user with this email or phone already exists.",
  INVALID_CREDENTIALS: "Invalid email/phone or password.",
  ACCOUNT_NOT_VERIFIED: "Your account is not verified yet.",
  ACCOUNT_INACTIVE: "Your account is not active.",
  ACCOUNT_SUSPENDED: "Your account has been suspended.",
  INVALID_VERIFICATION_CODE: "Invalid or expired verification code.",
  LOGIN_SUCCESS: "Login successful.",
  REGISTRATION_SUCCESS:
    "Registration successful. Please verify your account using the code sent to you.",
  VERIFICATION_SUCCESS: "Account verified successfully.",
  LOGOUT_SUCCESS: "Logged out successfully.",
  SESSION_EXPIRED: "Session expired. Please log in again.",
  UNAUTHORIZED: "Unauthorized access.",
  FORBIDDEN: "You do not have permission to perform this action.",
};

export const AUTH_LIMITS = {
  VERIFICATION_CODE_LENGTH: 6,
  VERIFICATION_CODE_TTL_MINUTES: 10,
  REFRESH_TOKEN_TTL_DAYS: 7,
  ACCESS_TOKEN_TTL: "1d",
  MIN_PASSWORD_LENGTH: 8,
  MAX_NAME_LENGTH: 100,
  MAX_COMPANY_NAME_LENGTH: 150,
};

export const TOKEN_TYPES = {
  ACCESS: "ACCESS",
  REFRESH: "REFRESH",
};

export const DASHBOARD_BY_ROLE = {
  [ROLES.PLATFORM_ADMIN]: "/platform/dashboard",
  [ROLES.COMPANY_ADMIN]: "/company/dashboard",
  [ROLES.PROJECT_MANAGER]: "/manager/dashboard",
  [ROLES.SITE_ENGINEER]: "/site-engineer/dashboard",
  [ROLES.SITE_SUPERVISOR]: "/site-supervisor/dashboard",
};

export const PUBLIC_AUTH_ROUTES = [
  "/api/auth/register-company",
  "/api/auth/login",
  "/api/auth/verify-account",
  "/api/auth/resend-verification-code",
  "/api/auth/refresh-token",
];
