import bcrypt from "bcrypt";
import crypto from "crypto";

const DEFAULT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const HASH_ENCODING = "hex";

export async function hashPassword(password, saltRounds = DEFAULT_SALT_ROUNDS) {
  const normalizedPassword = String(password ?? "");
  const hash = await bcrypt.hash(normalizedPassword, saltRounds);

  return {
    hash,
    value: hash,
  };
}

export async function verifyPassword(password, storedValue) {
  if (!storedValue || typeof storedValue !== "string") {
    return false;
  }

  return bcrypt.compare(String(password ?? ""), storedValue);
}

export function hashToken(token) {
  return crypto
    .createHash("sha256")
    .update(String(token ?? ""))
    .digest(HASH_ENCODING);
}

export function generateNumericCode(length = 6) {
  const size = Math.max(4, Number(length) || 6);
  const min = 10 ** (size - 1);
  const max = 10 ** size;

  return String(crypto.randomInt(min, max));
}

export function generateRandomToken(size = 32) {
  return crypto.randomBytes(size).toString(HASH_ENCODING);
}

export default {
  hashPassword,
  verifyPassword,
  hashToken,
  generateNumericCode,
  generateRandomToken,
};
