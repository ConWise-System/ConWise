import prisma from "../../config/prisma.js";
import { hashToken } from "../../utils/hash.js";
import {
  generateRefreshToken,
  getTokenExpiryDate,
  verifyRefreshToken,
} from "../../utils/generateToken.js";

const DEFAULT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

const buildSessionPayload = (user) => ({
  userId: user.id,
  companyId: user.companyId ?? null,
  role: user.role,
  type: "refresh",
});

const buildSessionResponse = (session) => ({
  id: session.id,
  userId: session.userId,
  expiresAt: session.expiresAt,
  revokedAt: session.revokedAt,
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
});

export async function createSession(user, metadata = {}) {
  if (!user?.id) {
    throw new Error("A valid user is required to create a session.");
  }

  const refreshToken = generateRefreshToken(
    buildSessionPayload(user),
    DEFAULT_REFRESH_EXPIRES_IN,
  );

  const refreshTokenHash = hashToken(refreshToken);
  const expiresAt = getTokenExpiryDate(DEFAULT_REFRESH_EXPIRES_IN);

  const session = await prisma.session.create({
    data: {
      userId: user.id,
      refreshTokenHash,
      expiresAt,
      deviceInfo: metadata.deviceInfo || null,
      ipAddress: metadata.ipAddress || null,
      userAgent: metadata.userAgent || null,
    },
  });

  return {
    refreshToken,
    session,
    sessionInfo: buildSessionResponse(session),
  };
}

export async function findActiveSessionByRefreshToken(refreshToken) {
  if (!refreshToken) {
    return null;
  }

  const refreshTokenHash = hashToken(refreshToken);

  const session = await prisma.session.findFirst({
    where: {
      refreshTokenHash,
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

  return session;
}

export async function verifySessionRefreshToken(refreshToken) {
  if (!refreshToken) {
    const error = new Error("Refresh token is required.");
    error.statusCode = 401;
    throw error;
  }

  let decoded;

  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    error.statusCode = 401;
    throw error;
  }

  const session = await findActiveSessionByRefreshToken(refreshToken);

  if (!session) {
    const error = new Error("Refresh session is invalid or expired.");
    error.statusCode = 401;
    throw error;
  }

  if (!session.user) {
    const error = new Error("Session user no longer exists.");
    error.statusCode = 401;
    throw error;
  }

  if (Number(decoded.userId) !== session.userId) {
    const error = new Error("Refresh token does not match the session user.");
    error.statusCode = 401;
    throw error;
  }

  return {
    decoded,
    session,
    user: session.user,
  };
}

export async function revokeSessionById(sessionId) {
  if (!sessionId) {
    throw new Error("Session id is required.");
  }

  return prisma.session.updateMany({
    where: {
      id: Number(sessionId),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function revokeSessionByRefreshToken(refreshToken) {
  if (!refreshToken) {
    return { count: 0 };
  }

  const refreshTokenHash = hashToken(refreshToken);

  return prisma.session.updateMany({
    where: {
      refreshTokenHash,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function revokeAllUserSessions(userId) {
  if (!userId) {
    throw new Error("User id is required.");
  }

  return prisma.session.updateMany({
    where: {
      userId: Number(userId),
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
}

export async function rotateSession(user, oldRefreshToken, metadata = {}) {
  const existing = await verifySessionRefreshToken(oldRefreshToken);

  await revokeSessionById(existing.session.id);

  return createSession(user ?? existing.user, metadata);
}

export async function listUserSessions(userId) {
  if (!userId) {
    throw new Error("User id is required.");
  }

  const sessions = await prisma.session.findMany({
    where: {
      userId: Number(userId),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return sessions.map(buildSessionResponse);
}

export async function deleteExpiredSessions() {
  return prisma.session.deleteMany({
    where: {
      OR: [
        {
          expiresAt: {
            lt: new Date(),
          },
        },
        {
          revokedAt: {
            not: null,
          },
        },
      ],
    },
  });
}

export default {
  createSession,
  findActiveSessionByRefreshToken,
  verifySessionRefreshToken,
  revokeSessionById,
  revokeSessionByRefreshToken,
  revokeAllUserSessions,
  rotateSession,
  listUserSessions,
  deleteExpiredSessions,
};
