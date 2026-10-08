"use client";

import { useState, FormEvent, useEffect, useRef } from "react";
import Button from "@/components/Button";
import { PAGE_CONTACT } from "@/lib/content-defaults";

type Status = "idle" | "sending" | "sent" | "error";
type FormCopy = typeof PAGE_CONTACT.form;

declare global {
  interface Window {
    turnstile?: { render: (el: string | HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void; getResponse: (id?: string) => string };
  }
}

export default function ContactForm({ copy = PAGE_CONTACT.form, email = "info@floradecora.com" }: { copy?: FormCopy; email?: string }) {
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
    const emailValue = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    if (name.length < 2) { setStatus("error"); setErrorMsg(copy.validationName); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue)) { setStatus("error"); setErrorMsg(copy.validationEmail); return; }
    if (message.length < 10) { setStatus("error"); setErrorMsg(copy.validationMessage); return; }

    // Turnstile token if present
    const turnstileToken = (document.querySelector('input[name="cf-turnstile-response"]') as HTMLInputElement)?.value || (window.turnstile?.getResponse() ?? "");

    const payload: Record<string, string> = {
      name,
      email: emailValue,
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
      {/* Honeypot — text field off-screen, not checkbox; bots fill it, humans don't */}
      <div className="absolute left-[-9999px] top-auto w-px h-px overflow-hidden" aria-hidden="true">
        <label htmlFor="botcheck" className="sr-only">Leave this field empty</label>
        <input type="text" id="botcheck" name="botcheck" tabIndex={-1} autoComplete="off" className="h-px w-px" />
      </div>
      {siteKey && <div ref={turnstileRef} className="cf-turnstile" data-sitekey={siteKey} data-theme="auto" data-size="normal" />}

      <div className="grid md:grid-cols-2 gap-6">
        <Field label={copy.name} name="name" required />
        <Field label={copy.email} name="email" type="email" required />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Field label={copy.phone} name="phone" type="tel" />
        <Field label={copy.projectType} name="project_type" placeholder={copy.projectTypePlaceholder} />
      </div>

      <div>
        <label className="eyebrow text-ink/50 dark:text-white/60 block mb-2" htmlFor="message">
          {copy.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          required
          className="w-full bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 focus:border-ochre focus:ring-4 focus:ring-ochre/10 rounded-2xl px-4 py-3 text-ink dark:text-white placeholder:text-ink/40 dark:placeholder:text-white/40 outline-none transition-all"
          placeholder={copy.messagePlaceholder}
        />
      </div>

      <input type="hidden" name="subject" value={`New inquiry from floradecora.com`} />

      <Button
        type="submit"
        variant="secondary"
        size="md"
        disabled={status === "sending"}
        className="group"
      >
        {status === "sending" ? copy.sending : copy.submit}
        <span className="w-7 h-7 rounded-full bg-ochre grid place-items-center group-hover:translate-x-0.5 transition-transform">→</span>
      </Button>

      {status === "sent" && (
        <p className="text-sage-dark">
          {copy.success}
        </p>
      )}
      {status === "error" && (
        <p className="text-ochre-dark">
          {errorMsg || copy.errorFallback.replace("info@floradecora.com", email)}
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
