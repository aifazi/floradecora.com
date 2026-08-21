"use client";

import { useState, FormEvent, useEffect, useRef } from "react";

type Status = "idle" | "sending" | "sent" | "error";

declare global {
  interface Window {
    turnstile?: { render: (el: string | HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void; getResponse: (id?: string) => string };
  }
}

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const turnstileRef = useRef<HTMLDivElement>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !turnstileRef.current) return;
    const id = "cf-turnstile-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.id = id;
      s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
  }, [siteKey]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const fd = new FormData(form);
    // client-side zod-lite checks
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (name.length < 2) { setStatus("error"); setErrorMsg("Please enter your full name."); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setStatus("error"); setErrorMsg("Please enter a valid email."); return; }
    if (message.length < 10) { setStatus("error"); setErrorMsg("Message should be at least 10 characters."); return; }

    // Turnstile token if present
    const turnstileToken = (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement)?.value || (window.turnstile?.getResponse() ?? "");

    const payload: Record<string, string> = {
      name, email,
      phone: String(fd.get("phone") || ""),
      project_type: String(fd.get("project_type") || ""),
      message,
      botcheck: String(fd.get("botcheck") || ""),
      turnstile: turnstileToken,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setStatus("sent");
        form.reset();
        window.turnstile?.reset();
      } else {
        setStatus("error");
        setErrorMsg(result.error || "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error, please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Honeypot + Turnstile */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" style={{ display: "none" }} />
      {siteKey && <div ref={turnstileRef} className="cf-turnstile" data-sitekey={siteKey} data-theme="auto" />}

      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Full name" name="name" required />
        <Field label="Email address" name="email" type="email" required />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Field label="Phone (optional)" name="phone" type="tel" />
        <Field label="Project type" name="project_type" placeholder="e.g. themed garden, irrigation" />
      </div>

      <div>
        <label className="eyebrow text-ink/50 dark:text-white/60 block mb-2" htmlFor="message">
          Tell us about your project
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-ochre focus:ring-4 focus:ring-ochre/10 rounded-2xl px-4 py-3 text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-white/40 outline-none transition-all"
          placeholder="Site location, scope, and timeline..."
        />
      </div>

      <input type="hidden" name="subject" value="New inquiry from floradecora.com" />

      <button
        type="submit"
        disabled={status === "sending"}
        className="group inline-flex items-center gap-2 rounded-full bg-ink text-white px-8 py-4 text-sm font-medium disabled:opacity-60 hover:bg-forest transition-colors"
      >
        {status === "sending" ? "Sending..." : "Send inquiry"}
        <span className="w-7 h-7 rounded-full bg-ochre grid place-items-center group-hover:translate-x-0.5 transition-transform">→</span>
      </button>

      {status === "sent" && (
        <p className="text-sage-dark">
          Thank you — your inquiry has been sent. Our team will reply within 4 hours.
        </p>
      )}
      {status === "error" && (
        <p className="text-ochre-dark">
          {errorMsg || "Something went wrong sending your message. Please try again, or email us directly at info@floradecora.com."}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="eyebrow text-ink/50 dark:text-white/60 block mb-2" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-ochre focus:ring-4 focus:ring-ochre/10 rounded-2xl px-4 py-3 text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-white/40 outline-none transition-all"
      />
    </div>
  );
}
