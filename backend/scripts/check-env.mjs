#!/usr/bin/env node
// Fail fast if required secrets are weak/missing in production
// Allows local Coolify preview via ALLOW_LOCAL_CORS / ALLOW_INSECURE_COOKIE
const required = ["DATABASE_URL", "JWT_SECRET"];
const warnings = [];
for (const k of required) {
  const v = process.env[k];
  if (!v) {
    console.error(`[check-env] Missing required env: ${k}`);
    process.exit(1);
  }
  if (k === "JWT_SECRET" && v.length < 32) {
    console.error(`[check-env] JWT_SECRET must be >=32 chars (got ${v.length})`);
    process.exit(1);
  }
  if (v.includes("change-me") || v.includes("YOUR_")) {
    warnings.push(`${k} looks like a placeholder`);
  }
}
if (process.env.NODE_ENV === "production") {
  const allowInsecureCookie = process.env.ALLOW_INSECURE_COOKIE === "true";
  const allowLocalCors = process.env.ALLOW_LOCAL_CORS === "true";
  if (process.env.COOKIE_SECURE !== "true" && !allowInsecureCookie) warnings.push("COOKIE_SECURE should be true in production (set ALLOW_INSECURE_COOKIE=true for local http)");
  if ((process.env.CORS_ORIGIN || "").includes("localhost") && !allowLocalCors) warnings.push("CORS_ORIGIN includes localhost in production (set ALLOW_LOCAL_CORS=true for local Coolify)");
}
if (warnings.length) {
  console.warn("[check-env] warnings:\n - " + warnings.join("\n - "));
  if (process.env.NODE_ENV === "production") {
    console.error("[check-env] failing due to warnings in production");
    process.exit(1);
  }
}
console.log("[check-env] ok");