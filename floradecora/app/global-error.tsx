"use client";
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-screen grid place-items-center p-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">Application error</h2>
            <button onClick={() => reset()} className="mt-4 rounded-full bg-ochre text-white px-6 py-2">Try again</button>
          </div>
        </div>
      </body>
    </html>
  );
}
