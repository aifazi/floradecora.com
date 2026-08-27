import { cookies } from "next/headers";
import UsersManager from "@/components/admin/UsersManager";

async function getMe() {
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend}/api/auth/me`, { headers: { cookie: cookies().toString() }, cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function AdminUsers() {
  const me = await getMe();
  return <UsersManager me={me} />;
}
