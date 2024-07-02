import crypto from "crypto";
export default function generateVerificationCode(length = 6) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}
