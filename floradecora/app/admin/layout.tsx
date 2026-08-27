import { cookies } from "next/headers";
import AdminShell from "@/components/admin/AdminShell";

async function getUser() {
  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();
  if (!cookieHeader.includes("access_token") && !cookieHeader.includes("refresh_token")) return null;
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  try {
    const res = await fetch(`${backend.replace(/\/$/, "")}/api/auth/me`, {
      headers: { cookie: cookieHeader },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  return <AdminShell user={user}>{children}</AdminShell>;
}
