import prisma from "../config/prisma.js";
import { verifyAccessToken } from "../utils/auth/generateToken.js";

const getBearerToken = (authorizationHeader) => {
  if (!authorizationHeader || typeof authorizationHeader !== "string") {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token.trim();
};

const createAuthError = (message, statusCode = 401) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const authenticate = async (req, res, next) => {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      return next(
        createAuthError("Authentication token is missing or invalid.", 401),
      );
    }

    const decoded = verifyAccessToken(token);

    const userId = Number(decoded.userId ?? decoded.id ?? decoded.sub);

    if (!userId) {
      return next(
        createAuthError("Invalid authentication token payload.", 401),
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        company: true,
      },
    });

    if (!user) {
      return next(createAuthError("Authenticated user no longer exists.", 401));
    }

    if (!user.isVerified) {
      return next(createAuthError("User account is not verified.", 401));
    }

    if (user.status && user.status !== "ACTIVE") {
      return next(createAuthError("User account is not active.", 401));
    }

    req.user = {
      id: user.id,
      companyId: user.companyId ?? null,
      role: user.role,
      email: user.email ?? null,
      phone: user.phone ?? null,
      firstName: user.firstName,
      lastName: user.lastName,
      isVerified: user.isVerified,
      status: user.status,
      company: user.company ?? null,
      tokenPayload: decoded,
    };

    next();
  } catch (error) {
    const authError = createAuthError(
      error.message || "Authentication failed.",
      401,
    );

    return next(authError);
  }
};

export default authenticate;
