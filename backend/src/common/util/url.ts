/**
 * Reject URLs that point at private/loopback/link-local addresses to prevent
 * SSRF when provider endpoints (R2/S3, SMTP host) are admin-configurable.
 */
const BLOCKED_HOST =
  /^(localhost|.*\.localhost|127\.\d{1,3}\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|169\.254\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2[0-9]|3[01])\.\d{1,3}\.\d{1,3}|0\.0\.0\.0)$/i;

export function assertSafeUrl(url: string): URL {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    throw new Error('Invalid URL');
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') {
    throw new Error('Only http(s) endpoints allowed');
  }
  if (BLOCKED_HOST.test(u.hostname)) {
    throw new Error('Blocked endpoint (private/loopback address)');
  }
  return u;
}
