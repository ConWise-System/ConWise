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
  updateProfileSchema,
  userIdParamSchema,
  sessionIdParamSchema,
  companyUsersQuerySchema,
} from "./auth.validation.js";

import { ROLES } from "../../config/constants.js";

const router = express.Router();

/**
 * Public auth routes
 */
/**
 * @swagger
 * /api/auth/register-company:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new Company & Admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterCompanyRequest'
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterCompanyResponse'
 */
router.post(
  "/register-company",
  validate(registerCompanySchema),
  authController.registerCompany,
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@conwise.et
 *               password:
 *                 type: string
 *                 example: P@ssword123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 */
router.post("/login", validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/verify-account:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify user account with code
 *     description: Verifies the account using the code sent to email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyAccountRequest'
 *     responses:
 *       200:
 *         description: Account verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerifyAccountResponse'
 */
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

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - User Management
 *     summary: Get currently logged-in user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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

/**
 * @swagger
 * /api/auth/users:
 *   post:
 *     summary: Create a new staff user (Admin only)
 *     tags:
 *       - User Management
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, role]
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               role:
 *                 $ref: '#/components/schemas/User/properties/role'
 *     responses:
 *       201:
 *         description: Staff user created
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

/**
 * @swagger
 * /api/auth/users:
 *   get:
 *     tags:
 *       - User Management
 *     summary: List company users
 *     description: Retrieve all users in the current user's company with pagination and filtering
 *     security:
 *       - bearerAuth: []          # This must be present on every protected route
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [COMPANY_ADMIN, PROJECT_MANAGER, SITE_ENGINEER, SITE_SUPERVISOR]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION]
 *     responses:
 *       200:
 *         description: List of company users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListCompanyUsersResponse'
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - Only Company Admin or Platform Admin can access
 */
router.get(
  "/users",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PLATFORM_ADMIN),
  validate(companyUsersQuerySchema, "query"),
  authController.listCompanyUsers,
);

router.get(
  "/users/:userId",
  validate(userIdParamSchema, "params"),
  authController.getUserById,
);

/**
 * @swagger
 * /api/auth/users/{userId}/profile:
 *   patch:
 *     tags:
 *       - User Management
 *     summary: Update User Profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               bio:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       403:
 *         description: Forbidden - You don't have permission to update this profile
 */
router.patch(
  "/users/:userId/profile",
  validate(userIdParamSchema, "params"),
  validate(updateProfileSchema),
  authController.updateProfile,
);

/**
 * @swagger
 * /api/auth/users/{userId}/role:
 *   patch:
 *     tags:
 *       - User Management
 *     summary: Change user role
 *     description: Update the role of a user (Only accessible by Company Admin or Platform Admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose role needs to be changed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRoleRequest'
 *     responses:
 *       200:
 *         description: User role updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserRoleResponse'
 *       403:
 *         description: Forbidden - You don't have permission to change roles
 *       404:
 *         description: User not found
 */
router.patch(
  "/users/:userId/role",
  authorizeRoles(ROLES.COMPANY_ADMIN, ROLES.PLATFORM_ADMIN),
  validate(userIdParamSchema, "params"),
  validate(updateUserRoleSchema),
  authController.changeUserRole,
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
