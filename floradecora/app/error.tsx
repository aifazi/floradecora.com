"use client";
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-[50vh] grid place-items-center px-6 py-16">
      <div className="max-w-lg text-center">
        <h2 className="font-display text-2xl">Something went wrong</h2>
        <p className="mt-2 text-sm text-ink/60 dark:text-white/60">An unexpected error occurred. Try again.</p>
        <button onClick={() => reset()} className="mt-6 rounded-full bg-ochre text-white px-6 py-2 text-sm font-semibold">Try again</button>
      </div>
    </div>
  );
}
