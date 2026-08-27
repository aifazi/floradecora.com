import Link from "next/link";
export default function NotFound() {
  return (
    <div className="min-h-[60vh] grid place-items-center px-6 py-16">
      <div className="text-center">
        <h2 className="font-display text-3xl">Page not found</h2>
        <p className="mt-2 text-ink/60 dark:text-white/60">The page you requested does not exist.</p>
        <Link href="/" className="mt-6 inline-block rounded-full bg-ochre text-white px-6 py-2 text-sm font-semibold">Go home</Link>
      </div>
    </div>
  );
}
