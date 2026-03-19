import { z } from "zod";
import { AUTH_LIMITS, ROLES, USER_STATUSES } from "../../config/constants.js";

const MIN_PASSWORD_LENGTH = AUTH_LIMITS.MIN_PASSWORD_LENGTH || 8;
const MAX_NAME_LENGTH = AUTH_LIMITS.MAX_NAME_LENGTH || 100;
const MAX_COMPANY_NAME_LENGTH = AUTH_LIMITS.MAX_COMPANY_NAME_LENGTH || 150;

const emailSchema = z
  .string()
  .trim()
  .email("Please provide a valid email address.")
  .transform((value) => value.toLowerCase());

const phoneSchema = z
  .string()
  .trim()
  .min(8, "Phone number must be at least 8 characters.")
  .max(20, "Phone number must not exceed 20 characters.")
  .regex(/^[+0-9()\-\s]+$/, "Please provide a valid phone number.");

const passwordSchema = z
  .string()
  .min(
    MIN_PASSWORD_LENGTH,
    `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  )
  .max(128, "Password must not exceed 128 characters.");

const nameSchema = z
  .string()
  .trim()
  .min(2, "This field must be at least 2 characters.")
  .max(
    MAX_NAME_LENGTH,
    `This field must not exceed ${MAX_NAME_LENGTH} characters.`,
  );

const companyNameSchema = z
  .string()
  .trim()
  .min(2, "Company name must be at least 2 characters.")
  .max(
    MAX_COMPANY_NAME_LENGTH,
    `Company name must not exceed ${MAX_COMPANY_NAME_LENGTH} characters.`,
  );

const verificationCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{4,8}$/, "Verification code must be 4 to 8 digits.");

const positiveIntIdSchema = z.coerce
  .number()
  .int("Id must be an integer.")
  .positive("Id must be a positive number.");

const optionalEmailSchema = z
  .union([emailSchema, z.literal("")])
  .optional()
  .transform((value) => (value === "" ? undefined : value));

const optionalPhoneSchema = z
  .union([phoneSchema, z.literal("")])
  .optional()
  .transform((value) => (value === "" ? undefined : value));

const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => {
    if (typeof value !== "string") return undefined;
    return value === "" ? undefined : value;
  });

const staffRoleSchema = z.enum([
  ROLES.PROJECT_MANAGER,
  ROLES.SITE_ENGINEER,
  ROLES.SITE_SUPERVISOR,
]);

const managedUserRoleSchema = z.enum([
  ROLES.COMPANY_ADMIN,
  ROLES.PROJECT_MANAGER,
  ROLES.SITE_ENGINEER,
  ROLES.SITE_SUPERVISOR,
]);

const userStatusSchema = z.enum([
  USER_STATUSES.PENDING_VERIFICATION,
  USER_STATUSES.ACTIVE,
  USER_STATUSES.INACTIVE,
  USER_STATUSES.SUSPENDED,
]);

const ensureEmailOrPhone = (data, ctx) => {
  if (!data.email && !data.phone) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["email"],
      message: "Provide at least an email or phone number.",
    });
  }
};

const ensurePasswordsMatch = (data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["confirmPassword"],
      message: "Passwords do not match.",
    });
  }
};

export const registerCompanySchema = z
  .object({
    companyName: companyNameSchema,
    companyEmail: optionalEmailSchema,
    companyPhone: optionalPhoneSchema,
    companyAddress: optionalTrimmedString,

    firstName: nameSchema,
    lastName: nameSchema,
    email: optionalEmailSchema,
    phone: optionalPhoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .superRefine((data, ctx) => {
    if (!data.companyEmail && !data.companyPhone) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["companyEmail"],
        message: "Provide at least a company email or company phone number.",
      });
    }

    ensureEmailOrPhone(data, ctx);
    ensurePasswordsMatch(data, ctx);
  });

export const createUserSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: optionalEmailSchema,
    phone: optionalPhoneSchema,
    password: passwordSchema.optional(),
    role: managedUserRoleSchema,
  })
  .superRefine((data, ctx) => {
    ensureEmailOrPhone(data, ctx);
  });

export const inviteUserSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: optionalEmailSchema,
    phone: optionalPhoneSchema,
    role: staffRoleSchema,
  })
  .superRefine((data, ctx) => {
    ensureEmailOrPhone(data, ctx);
  });

export const acceptInviteSchema = z
  .object({
    identifier: z.string().trim().min(1, "Email or phone number is required."),
    code: verificationCodeSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .superRefine((data, ctx) => {
    ensurePasswordsMatch(data, ctx);
  });

export const updateUserRoleSchema = z.object({
  role: managedUserRoleSchema,
});

export const updateUserStatusSchema = z.object({
  status: userStatusSchema,
});

export const userIdParamSchema = z.object({
  userId: positiveIntIdSchema,
});

export const sessionIdParamSchema = z.object({
  sessionId: positiveIntIdSchema,
});

export const companyUsersQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(10),
  role: managedUserRoleSchema.optional(),
  status: userStatusSchema.optional(),
  search: optionalTrimmedString,
});

export const loginSchema = z.object({
  email: z.string().trim().min(1, "Email or phone number is required."),
  password: z.string().min(1, "Password is required."),
});

export const verifyAccountSchema = z.object({
  identifier: z.string().trim().min(1, "Email or phone number is required."),
  code: verificationCodeSchema,
});

export const resendVerificationCodeSchema = z.object({
  identifier: z.string().trim().min(1, "Email or phone number is required."),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().trim().min(1, "Refresh token is required."),
});

export const logoutSchema = z.object({
  refreshToken: z.string().trim().min(1, "Refresh token is required."),
});

export const forgotPasswordSchema = z.object({
  identifier: z.string().trim().min(1, "Email or phone number is required."),
});

export const resetPasswordSchema = z
  .object({
    identifier: z.string().trim().min(1, "Email or phone number is required."),
    code: verificationCodeSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .superRefine((data, ctx) => {
    ensurePasswordsMatch(data, ctx);
  });

export default {
  registerCompanySchema,
  createUserSchema,
  inviteUserSchema,
  acceptInviteSchema,
  updateUserRoleSchema,
  updateUserStatusSchema,
  userIdParamSchema,
  sessionIdParamSchema,
  companyUsersQuerySchema,
  loginSchema,
  verifyAccountSchema,
  resendVerificationCodeSchema,
  refreshTokenSchema,
  logoutSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
};
