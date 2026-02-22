/**
 * Environment variable validation
 * Import this at the top of your app to ensure all required env vars are set.
 */

function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}. Check your .env.local file.`
    );
  }
  return value;
}

export const env = {
  get DATABASE_URL() {
    return getRequiredEnv("DATABASE_URL");
  },
  get NEXTAUTH_URL() {
    return getRequiredEnv("NEXTAUTH_URL");
  },
  get NEXTAUTH_SECRET() {
    const secret = getRequiredEnv("NEXTAUTH_SECRET");
    if (secret.length < 32) {
      throw new Error(
        "NEXTAUTH_SECRET must be at least 32 characters. Generate one with: openssl rand -base64 32"
      );
    }
    return secret;
  },
  get GOOGLE_CLIENT_ID() {
    return getRequiredEnv("GOOGLE_CLIENT_ID");
  },
  get GOOGLE_CLIENT_SECRET() {
    return getRequiredEnv("GOOGLE_CLIENT_SECRET");
  },
  get NODE_ENV() {
    return process.env.NODE_ENV || "development";
  },
  get IS_PRODUCTION() {
    return process.env.NODE_ENV === "production";
  },
};
