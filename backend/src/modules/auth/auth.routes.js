import express from "express";

import authController from "./auth.controller.js";
import validate from "../../middlewares/validate.middleware.js";
import authenticate from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

import {
  registerCompanySchema,
  loginSchema,
  verifyAccountSchema,
  resendVerificationCodeSchema,
  refreshTokenSchema,
  logoutSchema,
  createUserSchema,
  changePasswordSchema,
  inviteUserSchema,
  acceptInviteSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userIdParamSchema,
  sessionIdParamSchema,
  companyUsersQuerySchema,
} from "./auth.validation.js";

import { ROLES } from "../../config/constants.js";

const router = express.Router();

/**
 * Public auth routes
 */
router.post(
  "/register-company",
  validate(registerCompanySchema),
  authController.registerCompany,
);

router.post("/login", validate(loginSchema), authController.login);

router.post(
  "/verify-account",
  validate(verifyAccountSchema),
  authController.verifyAccount,
);

router.post(
  "/resend-verification-code",
  validate(resendVerificationCodeSchema),
  authController.resendVerificationCode,
);

router.post(
  "/refresh-token",
  validate(refreshTokenSchema),
  authController.refreshToken,
);

router.post("/logout", validate(logoutSchema), authController.logout);

/**
 * Invite onboarding
 */
router.post(
  "/accept-invite",
  validate(acceptInviteSchema),
  authController.acceptInvite,
);

/**
 * Protected routes
 */
router.use(authenticate);

/**
 * Current authenticated user
 */
router.get("/me", authController.getCurrentUser);

router.patch(
  "/change-password",
  validate(changePasswordSchema),
  authController.changePassword,
);

/**
 * Session management for current user
 */
router.get("/me/sessions", authController.getUserSessions);

router.delete(
  "/me/sessions/:sessionId",
  validate(sessionIdParamSchema, "params"),
  authController.revokeMySession,
);

router.post("/me/logout-all", authController.logoutAllMySessions);

/**
 * Company user management
 * Accessible to company admins and platform admins
 */
router.post(
  "/users",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PLATFORM_ADMIN),
  validate(createUserSchema),
  authController.createStaffUser,
);

router.post(
  "/users/invite",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PLATFORM_ADMIN),
  validate(inviteUserSchema),
  authController.inviteUser,
);

router.get(
  "/users",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PLATFORM_ADMIN),
  validate(companyUsersQuerySchema, "query"),
  authController.listCompanyUsers,
);

router.get(
  "/users/:userId",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PLATFORM_ADMIN),
  validate(userIdParamSchema, "params"),
  authController.getUserById,
);

router.patch(
  "/users/:userId/role",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PLATFORM_ADMIN),
  validate(userIdParamSchema, "params"),
  validate(updateUserRoleSchema),
  authController.changeUserRole,
);

router.patch(
  "/users/:userId/status",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PLATFORM_ADMIN),
  validate(userIdParamSchema, "params"),
  validate(updateUserStatusSchema),
  authController.updateUserStatus,
);

router.patch(
  "/users/:userId/deactivate",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PLATFORM_ADMIN),
  validate(userIdParamSchema, "params"),
  authController.deactivateUser,
);

router.patch(
  "/users/:userId/activate",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PLATFORM_ADMIN),
  validate(userIdParamSchema, "params"),
  authController.activateUser,
);

router.patch(
  "/users/:userId/suspend",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PLATFORM_ADMIN),
  validate(userIdParamSchema, "params"),
  authController.suspendUser,
);

export default router;
