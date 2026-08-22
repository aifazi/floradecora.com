import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { writeFile, readFile, mkdir } from "fs/promises";
import { join } from "path";

const schema = z.object({ email: z.string().email() });
const nlRate = new Map<string, { c: number; r: number }>();
function nlLimit(ip: string) {
  const now = Date.now();
  const rec = nlRate.get(ip);
  if (!rec || now > rec.r) { nlRate.set(ip, { c: 1, r: now + 60000 }); return true; }
  if (rec.c >= 3) return false;
  rec.c++; return true;
}

async function loadEmails(): Promise<string[]> {
  try {
    const data = await readFile(join(process.cwd(), "data", "newsletter.json"), "utf-8");
    return JSON.parse(data);
  } catch { return []; }
}

async function saveEmails(emails: string[]) {
  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await writeFile(join(process.cwd(), "data", "newsletter.json"), JSON.stringify(emails, null, 2));
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip")?.trim() || "unknown");
  if (!nlLimit(ip)) return NextResponse.json({ success: false, error: "Too many requests" }, { status: 429 });
  const body = await req.json().catch(() => ({}));
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  const emails = await loadEmails();
  if (!emails.includes(email)) {
    emails.push(email);
    await saveEmails(emails);
  }
  return NextResponse.json({ success: true });
}
