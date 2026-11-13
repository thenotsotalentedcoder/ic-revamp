import "server-only";

/** Read a required env var at call time, with a clear error instead of a cryptic downstream failure. */
export function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable ${name}`);
  return v;
}
