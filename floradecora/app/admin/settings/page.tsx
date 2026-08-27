import { cookies } from "next/headers";
import SettingsManager from "@/components/admin/SettingsManager";

async function getSettings() {
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend}/api/settings`, { headers: { cookie: cookies().toString() }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminSettings() {
  const settings = await getSettings();
  return <SettingsManager initial={settings} />;
}
