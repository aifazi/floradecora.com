import { cookies } from "next/headers";
import PagesManager from "@/components/admin/PagesManager";

async function getPages() {
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend}/api/pages?all=true`, { headers: { cookie: cookies().toString() }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminPages() {
  const pages = await getPages();
  return <PagesManager initial={pages} />;
}