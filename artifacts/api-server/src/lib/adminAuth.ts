import { createHmac } from "crypto";

const SECRET = process.env["SESSION_SECRET"] ?? "dev-secret-change-me";
const TOKEN_PAYLOAD = "catecos-admin-v1";

export function createAdminToken(): string {
  return createHmac("sha256", SECRET).update(TOKEN_PAYLOAD).digest("hex");
}

export function validateAdminToken(token: string): boolean {
  const expected = createAdminToken();
  return token === expected;
}
