import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

// scrypt is slow on purpose, so guessing passwords from a stolen copy of the database is slow too.
function derive(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) =>
    scrypt(password, salt, 64, (error, key) => (error ? reject(error) : resolve(key))),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt);
  return `scrypt:${salt.toString("hex")}:${key.toString("hex")}`;
}

export async function checkPassword(password: string, stored: string): Promise<boolean> {
  const [kind, saltHex, keyHex] = stored.split(":");
  if (kind !== "scrypt" || !saltHex || !keyHex) throw new Error("Stored password hash is not in scrypt:salt:key form.");
  const key = await derive(password, Buffer.from(saltHex, "hex"));
  return timingSafeEqual(key, Buffer.from(keyHex, "hex"));
}

// The password rules, checked on sign-up and reset. The upper limit stops someone making scrypt chew on megabytes.
// Shown under new-password boxes. Keep it in step with checkNewPassword below.
export const PASSWORD_HINT = "8 to 128 characters. A short sentence is easy to remember and hard to guess.";

export function checkNewPassword(password: unknown): string | null {
  if (typeof password !== "string" || password.length < 8) return "Use a password of at least 8 characters.";
  if (password.length > 128) return "Use a password of at most 128 characters.";
  return null;
}
