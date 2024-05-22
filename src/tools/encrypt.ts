import bcrypt from "bcrypt";

const saltRounds = 10;

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(password, salt);
}

export function verifyPassword(
  plainTextPassword: string,
  hashedPassword: string
) {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}
