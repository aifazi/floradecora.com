"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLogout() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button onClick={logout} disabled={loading} className="rounded-full border border-black/10 dark:border-white/10 px-5 py-2 text-sm hover:bg-black/5">
      {loading ? "..." : "Logout"}
    </button>
  );
}
