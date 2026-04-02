import prisma from "../../config/prisma.js";
import env from "../../config/env.js";
import {
  AUTH_MESSAGES,
  COMPANY_STATUSES,
  DASHBOARD_BY_ROLE,
  ROLES,
  USER_STATUSES,
  VERIFICATION_TYPES,
} from "../../config/constants.js";
import {
  generateAccessToken,
  generateRefreshToken,
  getTokenExpiryDate,
  verifyRefreshToken,
} from "../../utils/auth/generateToken.js";
import {
  generateNumericCode,
  hashPassword,
  hashToken,
  verifyPassword,
} from "../../utils/auth/hash.js";
import roleService from "./role.service.js";
import {
  sendStaffInviteEmail,
  sendVerificationEmail,
} from "../../utils/email/sendEmail.js";

const AUTH_SELECT = {
  id: true,
  companyId: true,
  role: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  isVerified: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
  company: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};

const USER_LIST_SELECT = {
  id: true,
  companyId: true,
  role: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  isVerified: true,
  status: true,
  lastLoginAt: true,
  createdAt: true,
  updatedAt: true,
};

const normalizeEmail = (value) =>
  value ? String(value).trim().toLowerCase() : null;

const normalizePhone = (value) => {
  if (!value) return null;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : null;
};

const createError = (message, statusCode = 400, errors = null) => {
  const error = new Error(message);
  error.statusCode = statusCode;

  if (errors) {
    error.errors = errors;
  }

  return error;
};

const getDashboardPath = (role) => DASHBOARD_BY_ROLE[role] || "/dashboard";

const sanitizeUser = (user) => {
  if (!user) return null;

  return {
    id: user.id,
    companyId: user.companyId ?? null,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    fullName: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email ?? null,
    phone: user.phone ?? null,
    bio: user.bio ?? null,
    isVerified: user.isVerified,
    status: user.status,
    lastLoginAt: user.lastLoginAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    company: user.company
      ? {
          id: user.company.id,
          name: user.company.name,
          email: user.company.email ?? null,
          phone: user.company.phone ?? null,
          address: user.company.address ?? null,
          status: user.company.status,
          createdAt: user.company.createdAt,
          updatedAt: user.company.updatedAt,
        }
      : null,
  };
};

const sanitizeUserListItem = (user) => ({
  id: user.id,
  companyId: user.companyId ?? null,
  role: user.role,
  firstName: user.firstName,
  lastName: user.lastName,
  fullName: `${user.firstName} ${user.lastName}`.trim(),
  email: user.email ?? null,
  phone: user.phone ?? null,
  isVerified: user.isVerified,
  status: user.status,
  lastLoginAt: user.lastLoginAt ?? null,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const buildAuthPayload = (user) => ({
  userId: user.id,
  companyId: user.companyId ?? null,
  role: user.role,
});

const generateVerificationCodeValue = () => {
  const codeLength = env?.verification?.codeLength || 6;
  return generateNumericCode(codeLength);
};

const getVerificationExpiryDate = () => {
  const minutes = env?.verification?.expiresInMinutes || 10;
  return new Date(Date.now() + minutes * 60 * 1000);
};

const parseIdentifier = (identifier) => {
  const value = String(identifier || "").trim();

  if (!value) {
    return { raw: null, email: null, phone: null };
  }

  const looksLikeEmail = value.includes("@");

  return {
    raw: value,
    email: looksLikeEmail ? normalizeEmail(value) : null,
    phone: looksLikeEmail ? null : normalizePhone(value),
  };
};

const resolveIdentifierPayload = (payload = {}) => {
  if (payload.identifier) {
    return parseIdentifier(payload.identifier);
  }

  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);

  return {
    raw: email || phone,
    email,
    phone,
  };
};

const buildIdentifierConditions = ({ email, phone }) => {
  const conditions = [];

  if (email) {
    conditions.push({ email });
  }

  if (phone) {
    conditions.push({ phone });
  }

  return conditions;
};

const ensureCompanyScopedActor = (actor) => {
  if (!actor?.id) {
    throw createError(AUTH_MESSAGES.UNAUTHORIZED, 401);
  }

  if (
    actor.role !== ROLES.COMPANY_ADMIN &&
    actor.role !== ROLES.PLATFORM_ADMIN
  ) {
    throw createError(AUTH_MESSAGES.FORBIDDEN, 403);
  }

  if (actor.role === ROLES.COMPANY_ADMIN && !actor.companyId) {
    throw createError("Company admin must belong to a company.", 400);
  }
};

const buildCompanyScopeWhere = (actor) => {
  if (actor.role === ROLES.PLATFORM_ADMIN) {
    return {};
  }

  return {
    companyId: actor.companyId,
  };
};

const ensureActorCanManageRole = (actorRole, targetRole) => {
  if (!roleService.canAssignRole(actorRole, targetRole)) {
    throw createError("You are not allowed to assign this role.", 403);
  }
};

const ensureActorCanChangeRole = (actorRole, currentRole, nextRole) => {
  if (!roleService.canChangeRole(actorRole, currentRole, nextRole)) {
    throw createError("You are not allowed to change this user's role.", 403);
  }
};

const ensureActorCanViewUser = (actorRole, targetRole) => {
  if (!roleService.canViewUser(actorRole, targetRole)) {
    throw createError("You are not allowed to view this user.", 403);
  }
};

const ensureActorCanChangeStatus = (actorRole, targetRole) => {
  if (!roleService.canDeactivateUser(actorRole, targetRole)) {
    throw createError("You are not allowed to change this user's status.", 403);
  }
};

const issueTokens = async (user, meta = {}) => {
  const payload = buildAuthPayload(user);
  const accessToken = generateAccessToken(payload, env.jwt.expiresIn);
  const refreshToken = generateRefreshToken(payload, env.jwt.refreshExpiresIn);
  const refreshTokenHash = hashToken(refreshToken);
  const expiresAt = getTokenExpiryDate(env.jwt.refreshExpiresIn);

  await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      deviceInfo: meta.deviceInfo || null,
      ipAddress: meta.ipAddress || null,
      userAgent: meta.userAgent || null,
      expiresAt,
    },
  });

  return {
    accessToken,
    refreshToken,
    expiresAt,
  };
};

const createVerificationCode = async (
  userId,
  type = VERIFICATION_TYPES.EMAIL_VERIFICATION,
) => {
  const code = generateVerificationCodeValue();
  const expiresAt = getVerificationExpiryDate();

  await prisma.verificationCode.updateMany({
    where: {
      userId,
      type,
      usedAt: null,
    },
    data: {
      usedAt: new Date(),
    },
  });

  const verification = await prisma.verificationCode.create({
    data: {
      userId,
      code,
      type,
      expiresAt,
    },
  });

  return verification;
};

const ensureUniqueCompany = async ({ companyEmail, companyPhone }) => {
  const conditions = [];

  if (companyEmail) {
    conditions.push({ email: companyEmail });
  }

  if (companyPhone) {
    conditions.push({ phone: companyPhone });
  }

  if (!conditions.length) return;

  const existingCompany = await prisma.company.findFirst({
    where: {
      OR: conditions,
    },
  });

  if (existingCompany) {
    throw createError(AUTH_MESSAGES.COMPANY_ALREADY_EXISTS, 409);
  }
};

const ensureUniqueUser = async ({ email, phone }) => {
  const conditions = [];

  if (email) {
    conditions.push({ email });
  }

  if (phone) {
    conditions.push({ phone });
  }

  if (!conditions.length) {
    throw createError("Email or phone number is required.", 400);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: conditions,
    },
  });

  if (existingUser) {
    throw createError(AUTH_MESSAGES.USER_ALREADY_EXISTS, 409);
  }
};

const findUserByIdentifier = async (identifier) => {
  const parsed = parseIdentifier(identifier);

  if (!parsed.raw) {
    throw createError("Email or phone number is required.", 400);
  }

  const conditions = buildIdentifierConditions(parsed);

  return prisma.user.findFirst({
    where: {
      OR: conditions,
    },
    select: {
      ...AUTH_SELECT,
      passwordHash: true,
    },
  });
};

const findUserByIdentifierForCompany = async (identifier, companyId = null) => {
  const parsed = parseIdentifier(identifier);

  if (!parsed.raw) {
    throw createError("Email or phone number is required.", 400);
  }

  const conditions = buildIdentifierConditions(parsed);

  const where = {
    OR: conditions,
  };

  if (companyId) {
    where.companyId = companyId;
  }

  return prisma.user.findFirst({
    where,
    include: {
      company: true,
    },
  });
};

const ensureLoginAllowed = (user) => {
  if (!user) {
    throw createError(AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  if (!user.isVerified) {
    throw createError(AUTH_MESSAGES.ACCOUNT_NOT_VERIFIED, 403);
  }

  if (user.status === USER_STATUSES.SUSPENDED) {
    throw createError(AUTH_MESSAGES.ACCOUNT_SUSPENDED, 403);
  }

  if (user.status !== USER_STATUSES.ACTIVE) {
    throw createError(AUTH_MESSAGES.ACCOUNT_INACTIVE, 403);
  }

  if (
    user.company &&
    user.company.status &&
    user.company.status !== COMPANY_STATUSES.ACTIVE
  ) {
    throw createError("Your company account is not active.", 403);
  }
};

const getManagedUserOrThrow = async (actor, userId) => {
  ensureCompanyScopedActor(actor);

  const where = {
    id: Number(userId),
    ...buildCompanyScopeWhere(actor),
  };

  const user = await prisma.user.findFirst({
    where,
    include: {
      company: true,
    },
  });

  if (!user) {
    throw createError("User not found.", 404);
  }

  if (actor.role === ROLES.COMPANY_ADMIN && user.id === actor.id) {
    return user;
  }

  ensureActorCanViewUser(actor.role, user.role);

  return user;
};

const buildCompanyUsersWhere = (actor, filters = {}) => {
  const where = {
    ...buildCompanyScopeWhere(actor),
  };

  if (filters.role) {
    where.role = filters.role;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  if (filters.search) {
    const search = String(filters.search).trim();
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }
  }

  return where;
};

export const registerCompany = async (payload, meta = {}) => {
  const companyName = String(payload.companyName || "").trim();
  const companyEmail = normalizeEmail(payload.companyEmail);
  const companyPhone = normalizePhone(payload.companyPhone);
  const companyAddress = payload.companyAddress
    ? String(payload.companyAddress).trim()
    : null;

  const firstName = String(payload.firstName || "").trim();
  const lastName = String(payload.lastName || "").trim();
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);
  const password = String(payload.password || "");

  await ensureUniqueCompany({ companyEmail, companyPhone });
  await ensureUniqueUser({ email, phone });

  const { value: passwordHash } = await hashPassword(password);
  const verificationType = email
    ? VERIFICATION_TYPES.EMAIL_VERIFICATION
    : VERIFICATION_TYPES.PHONE_VERIFICATION;

  const created = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        name: companyName,
        email: companyEmail,
        phone: companyPhone,
        address: companyAddress,
        status: COMPANY_STATUSES.PENDING,
      },
    });

    const user = await tx.user.create({
      data: {
        companyId: company.id,
        role: ROLES.COMPANY_ADMIN,
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        isVerified: false,
        status: USER_STATUSES.PENDING_VERIFICATION,
      },
      include: {
        company: true,
      },
    });

    const code = generateVerificationCodeValue();
    const expiresAt = getVerificationExpiryDate();

    const verification = await tx.verificationCode.create({
      data: {
        userId: user.id,
        code,
        type: verificationType,
        expiresAt,
      },
    });

    return {
      user,
      company,
      verification,
    };
  });

  console.log("This is verification code", created.verification.code);

  try {
    if (created.user.email) {
      await sendVerificationEmail(
        created.user.email,
        created.verification.code,
      );
    }
  } catch (error) {
    console.error("Failed to send verification email:", error);
  }

  return {
    message: AUTH_MESSAGES.REGISTRATION_SUCCESS,
    user: sanitizeUser(created.user),
    company: {
      id: created.company.id,
      name: created.company.name,
      email: created.company.email,
      phone: created.company.phone,
      address: created.company.address,
      status: created.company.status,
      createdAt: created.company.createdAt,
      updatedAt: created.company.updatedAt,
    },
    verification: {
      verificationId: created.verification.id,
      type: created.verification.type,
      expiresAt: created.verification.expiresAt,
      code:
        meta.includeVerificationCode === true
          ? created.verification.code
          : undefined,
      destination: email || phone,
    },
  };
};

export const verifyAccount = async (payload) => {
  const identifier = resolveIdentifierPayload(payload);
  const code = String(payload.code || "").trim();
  const conditions = buildIdentifierConditions(identifier);

  if (!conditions.length) {
    throw createError("Email or phone number is required.", 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: conditions,
    },
    include: {
      company: true,
    },
  });

  if (!user) {
    throw createError(AUTH_MESSAGES.INVALID_VERIFICATION_CODE, 404);
  }

  const verification = await prisma.verificationCode.findFirst({
    where: {
      userId: user.id,
      code,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
      type: identifier.email
        ? VERIFICATION_TYPES.EMAIL_VERIFICATION
        : VERIFICATION_TYPES.PHONE_VERIFICATION,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!verification) {
    throw createError(AUTH_MESSAGES.INVALID_VERIFICATION_CODE, 400);
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.verificationCode.update({
      where: {
        id: verification.id,
      },
      data: {
        usedAt: new Date(),
      },
    });

    const updatedUser = await tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        isVerified: true,
        status: USER_STATUSES.ACTIVE,
      },
      include: {
        company: true,
      },
    });

    if (updatedUser.companyId) {
      await tx.company.update({
        where: {
          id: updatedUser.companyId,
        },
        data: {
          status: COMPANY_STATUSES.ACTIVE,
        },
      });
    }

    return updatedUser;
  });

  return {
    message: AUTH_MESSAGES.VERIFICATION_SUCCESS,
    user: sanitizeUser(updated),
    redirectTo: "/login",
  };
};

export const resendVerificationCode = async (payload, meta = {}) => {
  const identifier = resolveIdentifierPayload(payload);
  const conditions = buildIdentifierConditions(identifier);

  if (!conditions.length) {
    throw createError("Email or phone number is required.", 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: conditions,
    },
    include: {
      company: true,
    },
  });

  if (!user) {
    throw createError("User not found.", 404);
  }

  if (user.isVerified) {
    throw createError("This account is already verified.", 400);
  }

  const verification = await createVerificationCode(
    user.id,
    identifier.email
      ? VERIFICATION_TYPES.EMAIL_VERIFICATION
      : VERIFICATION_TYPES.PHONE_VERIFICATION,
  );

  if (identifier.email) {
    await sendVerificationEmail(identifier.email, verification.code);
  }

  return {
    message: "A new verification code has been generated.",
    verification: {
      verificationId: verification.id,
      type: verification.type,
      expiresAt: verification.expiresAt,
      code:
        meta.includeVerificationCode === true ? verification.code : undefined,
      destination: identifier.email || identifier.phone,
    },
  };
};

export const loginUser = async (payload, meta = {}) => {
  const identifier =
    payload.identifier ||
    payload.emailOrPhone ||
    payload.email ||
    payload.phone;
  const password = String(payload.password || "");

  const user = await findUserByIdentifier(identifier);

  if (!user) {
    throw createError(AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  const isPasswordValid = await verifyPassword(password, user.passwordHash);

  if (!isPasswordValid) {
    throw createError(AUTH_MESSAGES.INVALID_CREDENTIALS, 401);
  }

  ensureLoginAllowed(user);

  const lastLoginAt = new Date();

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      lastLoginAt,
    },
  });

  const tokens = await issueTokens(user, meta);

  return {
    message: AUTH_MESSAGES.LOGIN_SUCCESS,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    refreshTokenExpiresAt: tokens.expiresAt,
    user: sanitizeUser({
      ...user,
      lastLoginAt,
    }),
    redirectTo: getDashboardPath(user.role),
  };
};

export const refreshUserToken = async (payload, meta = {}) => {
  const refreshToken = String(payload.refreshToken || "").trim();

  if (!refreshToken) {
    throw createError("Refresh token is required.", 400);
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw createError(AUTH_MESSAGES.SESSION_EXPIRED, 401);
  }

  const userId = Number(decoded.userId ?? decoded.id ?? decoded.sub);
  const tokenHash = hashToken(refreshToken);

  const session = await prisma.session.findFirst({
    where: {
      userId,
      refreshTokenHash: tokenHash,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      user: {
        include: {
          company: true,
        },
      },
    },
  });

  if (!session || !session.user) {
    throw createError(AUTH_MESSAGES.SESSION_EXPIRED, 401);
  }

  ensureLoginAllowed(session.user);

  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  const tokens = await issueTokens(session.user, meta);

  return {
    message: "Token refreshed successfully.",
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    refreshTokenExpiresAt: tokens.expiresAt,
    user: sanitizeUser(session.user),
    redirectTo: getDashboardPath(session.user.role),
  };
};

export const logoutUser = async (payload = {}) => {
  const refreshToken = payload.refreshToken
    ? String(payload.refreshToken).trim()
    : null;

  if (!refreshToken) {
    return {
      message: AUTH_MESSAGES.LOGOUT_SUCCESS,
    };
  }

  const refreshTokenHash = hashToken(refreshToken);

  await prisma.session.updateMany({
    where: {
      refreshTokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  return {
    message: AUTH_MESSAGES.LOGOUT_SUCCESS,
  };
};

export const logoutAllSessions = async (userId) => {
  await prisma.session.updateMany({
    where: {
      userId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  return {
    message: "All sessions have been logged out successfully.",
  };
};

export const getMyProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      company: true,
    },
  });

  if (!user) {
    throw createError("User not found.", 404);
  }

  return {
    user: sanitizeUser(user),
  };
};

export const createStaffUser = async (actor, payload, meta = {}) => {
  ensureCompanyScopedActor(actor);

  const firstName = String(payload.firstName || "").trim();
  const lastName = String(payload.lastName || "").trim();
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);
  const password = payload.password ? String(payload.password) : null;
  const role = payload.role;

  ensureActorCanManageRole(actor.role, role);
  await ensureUniqueUser({ email, phone });

  let temporaryPassword = null;
  let passwordHash = null;

  if (password) {
    passwordHash = (await hashPassword(password)).value;
  } else {
    temporaryPassword = generateVerificationCodeValue();
    passwordHash = (await hashPassword(temporaryPassword)).value;
  }

  const createdUser = await prisma.user.create({
    data: {
      companyId:
        actor.role === ROLES.PLATFORM_ADMIN
          ? (payload.companyId ?? null)
          : actor.companyId,
      role,
      firstName,
      lastName,
      email,
      phone,
      passwordHash,
      isVerified: true,
      status: USER_STATUSES.ACTIVE,
    },
    include: {
      company: true,
    },
  });

  // let verification = null;
  //
  // console.log("Created User Email", createdUser.email);

  if (!password && createdUser.email) {
    try {
      await sendStaffInviteEmail(createdUser.email, temporaryPassword);
    } catch (error) {
      console.error("Staff invite email failed to send:", error);
      }
  }

  return {
    message: password
      ? "User created successfully."
      : "User created successfully. A temporary password has been sent to their email.",
    user: sanitizeUser(createdUser),
    tempPassword: meta.includeVerificationCode ? temporaryPassword : undefined,
  };
};

export const changePassword = async (userId, newPassword) => {
  const { value: hashedPassword } = await hashPassword(newPassword);

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      passwordHash: hashedPassword,
      isVerified: true,
      status: USER_STATUSES.ACTIVE,
    },
  });

  return sanitizeUser(updatedUser);
};

export const inviteUser = async (actor, payload, meta = {}) => {
  ensureCompanyScopedActor(actor);

  const firstName = String(payload.firstName || "").trim();
  const lastName = String(payload.lastName || "").trim();
  const email = normalizeEmail(payload.email);
  const phone = normalizePhone(payload.phone);
  const role = payload.role;

  ensureActorCanManageRole(actor.role, role);
  await ensureUniqueUser({ email, phone });

  const temporaryPasswordHash = (
    await hashPassword(generateVerificationCodeValue())
  ).value;

  const created = await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        companyId:
          actor.role === ROLES.PLATFORM_ADMIN
            ? (payload.companyId ?? null)
            : actor.companyId,
        role,
        firstName,
        lastName,
        email,
        phone,
        passwordHash: temporaryPasswordHash,
        isVerified: false,
        status: USER_STATUSES.PENDING_VERIFICATION,
      },
      include: {
        company: true,
      },
    });

    const code = generateVerificationCodeValue();
    const expiresAt = getVerificationExpiryDate();

    const verification = await tx.verificationCode.create({
      data: {
        userId: user.id,
        code,
        type: VERIFICATION_TYPES.INVITE,
        expiresAt,
      },
    });

    return { user, verification };
  });

  return {
    message: "User invited successfully.",
    user: sanitizeUser(created.user),
    invite: {
      verificationId: created.verification.id,
      type: created.verification.type,
      expiresAt: created.verification.expiresAt,
      code:
        meta.includeVerificationCode === true
          ? created.verification.code
          : undefined,
      destination: email || phone,
    },
  };
};

export const acceptInvite = async (payload) => {
  const identifier = resolveIdentifierPayload(payload);
  const code = String(payload.code || "").trim();
  const password = String(payload.password || "");
  const conditions = buildIdentifierConditions(identifier);

  if (!conditions.length) {
    throw createError("Email or phone number is required.", 400);
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: conditions,
    },
    include: {
      company: true,
    },
  });

  if (!user) {
    throw createError("Invited user not found.", 404);
  }

  const invite = await prisma.verificationCode.findFirst({
    where: {
      userId: user.id,
      code,
      type: VERIFICATION_TYPES.INVITE,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!invite) {
    throw createError(AUTH_MESSAGES.INVALID_VERIFICATION_CODE, 400);
  }

  const { value: passwordHash } = await hashPassword(password);

  const updatedUser = await prisma.$transaction(async (tx) => {
    await tx.verificationCode.update({
      where: {
        id: invite.id,
      },
      data: {
        usedAt: new Date(),
      },
    });

    return tx.user.update({
      where: {
        id: user.id,
      },
      data: {
        passwordHash,
        isVerified: true,
        status: USER_STATUSES.ACTIVE,
      },
      include: {
        company: true,
      },
    });
  });

  return {
    message: "Invite accepted successfully.",
    user: sanitizeUser(updatedUser),
    redirectTo: getDashboardPath(updatedUser.role),
  };
};

export const listCompanyUsers = async (actor, query = {}) => {
  ensureCompanyScopedActor(actor);

  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(query.limit) || 10));
  const skip = (page - 1) * limit;

  const where = buildCompanyUsersWhere(actor, query);

  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ createdAt: "desc" }],
      select: USER_LIST_SELECT,
    }),
  ]);

  return {
    users: users.map(sanitizeUserListItem),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
};

export const getUserById = async (actor, userId) => {
  const targetId = Number(userId);

  const isOwner = actor.id === targetId;
  const isAdmin = [ROLES.COMPANY_ADMIN, ROLES.PLATFORM_ADMIN].includes(
    actor.role,
  );

  if (!isOwner && !isAdmin) {
    throw createError(
      "Forbidden: You do not have permission to view this profile.",
      403,
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: targetId },
    include: {
      company: true,
      // You can include other relations here if the Admin needs more data
    },
  });

  if (!user) {
    throw createError("User not found", 404);
  }

  return sanitizeUser(user);
};

// user update his/her profile
export const updateProfile = async (actor, userId, payload) => {
  if (actor.id !== Number(userId)) {
    throw createError("Forbidden: You can only update your own profile.", 403);
  }

  const { firstName, lastName, email, phone, bio } = payload;

  const updated = await prisma.user.update({
    where: {
      id: actor.id,
    },
    data: {
      ...payload,
    },
    include: {
      company: true,
    },
  });

  return {
    message: "User profile updated successfully.",
    user: sanitizeUser(updated),
  };
};

export const changeUserRole = async (actor, userId, payload) => {
  const targetUser = await getManagedUserOrThrow(actor, userId);
  const nextRole = payload.role;

  if (targetUser.id === actor.id) {
    throw createError("You cannot change your own role.", 400);
  }

  ensureActorCanChangeRole(actor.role, targetUser.role, nextRole);

  const updated = await prisma.user.update({
    where: {
      id: targetUser.id,
    },
    data: {
      role: nextRole,
    },
    include: {
      company: true,
    },
  });

  return {
    message: "User role updated successfully.",
    user: sanitizeUser(updated),
  };
};

export const updateUserStatus = async (actor, userId, payload) => {
  const targetUser = await getManagedUserOrThrow(actor, userId);
  const nextStatus = payload.status;

  if (targetUser.id === actor.id) {
    throw createError("You cannot change your own status.", 400);
  }

  ensureActorCanChangeStatus(actor.role, targetUser.role);

  const updated = await prisma.user.update({
    where: {
      id: targetUser.id,
    },
    data: {
      status: nextStatus,
    },
    include: {
      company: true,
    },
  });

  if (nextStatus !== USER_STATUSES.ACTIVE) {
    await prisma.session.updateMany({
      where: {
        userId: targetUser.id,
        revokedAt: null,
      },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  return {
    message: "User status updated successfully.",
    user: sanitizeUser(updated),
  };
};

export const deactivateUser = async (actor, userId) => {
  return updateUserStatus(actor, userId, {
    status: USER_STATUSES.INACTIVE,
  });
};

export const activateUser = async (actor, userId) => {
  return updateUserStatus(actor, userId, {
    status: USER_STATUSES.ACTIVE,
  });
};

export const suspendUser = async (actor, userId) => {
  return updateUserStatus(actor, userId, {
    status: USER_STATUSES.SUSPENDED,
  });
};

export const getUserSessions = async (userId) => {
  const sessions = await prisma.session.findMany({
    where: {
      userId,
      revokedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      deviceInfo: true,
      ipAddress: true,
      userAgent: true,
      expiresAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return {
    sessions,
  };
};

export const revokeSession = async (userId, sessionId) => {
  const session = await prisma.session.findFirst({
    where: {
      id: Number(sessionId),
      userId,
      revokedAt: null,
    },
  });

  if (!session) {
    throw createError("Session not found.", 404);
  }

  await prisma.session.update({
    where: {
      id: session.id,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  return {
    message: "Session revoked successfully.",
  };
};
const authService = {
  registerCompany,
  verifyAccount,
  changePassword,
  resendVerificationCode,
  loginUser,
  refreshUserToken,
  logoutUser,
  logoutAllSessions,
  getMyProfile,
  createStaffUser,
  inviteUser,
  acceptInvite,
  listCompanyUsers,
  getUserById,
  updateProfile,
  changeUserRole,
  updateUserStatus,
  deactivateUser,
  activateUser,
  suspendUser,
  getUserSessions,
  revokeSession,
};

export default authService;
