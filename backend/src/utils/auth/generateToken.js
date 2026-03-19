import jwt from "jsonwebtoken";

const DEFAULT_ACCESS_TOKEN_EXPIRES_IN = "15m";
const DEFAULT_REFRESH_TOKEN_EXPIRES_IN = "7d";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return secret;
}

function getRefreshSecret() {
  return process.env.JWT_REFRESH_SECRET || getJwtSecret();
}

export function generateAccessToken(
  payload,
  expiresIn = process.env.JWT_EXPIRES_IN || DEFAULT_ACCESS_TOKEN_EXPIRES_IN,
) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn,
  });
}

export function generateRefreshToken(
  payload,
  expiresIn = process.env.JWT_REFRESH_EXPIRES_IN ||
    DEFAULT_REFRESH_TOKEN_EXPIRES_IN,
) {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn,
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, getJwtSecret());
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, getRefreshSecret());
}

export function decodeToken(token) {
  const decoded = jwt.decode(token);

  if (!decoded) {
    throw new Error("Invalid token format.");
  }

  return decoded;
}

export function getTokenExpiryDate(expiresIn) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const token = jwt.sign({ temp: true, iat: issuedAt }, getJwtSecret(), {
    expiresIn,
    noTimestamp: true,
  });

  const decoded = jwt.decode(token);

  if (!decoded?.exp) {
    throw new Error("Unable to calculate token expiry date.");
  }

  return new Date(decoded.exp * 1000);
}

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  getTokenExpiryDate,
};
