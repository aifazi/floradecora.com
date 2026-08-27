import { cookies } from "next/headers";
import ServicesManager from "@/components/admin/ServicesManager";
async function getServices() {
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend}/api/services?all=true`, { headers: { cookie: cookies().toString() }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}
export default async function AdminServices() {
  const services = await getServices();
  return <ServicesManager initial={services} />;
}
