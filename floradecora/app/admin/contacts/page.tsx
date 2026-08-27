import { cookies } from "next/headers";
import ContactsManager from "@/components/admin/ContactsManager";

async function getContacts() {
  const backend = process.env.BACKEND_URL || "http://localhost:3002";
  const res = await fetch(`${backend}/api/contact`, { headers: { cookie: cookies().toString() }, cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminContacts() {
  const contacts = await getContacts();
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl">Inquiries</h1>
        <p className="text-sm text-ink/60 dark:text-white/60">All contact form submissions — update status to won/lost, delete spam</p>
      </div>
      <ContactsManager initial={contacts} />
    </div>
  );
}
