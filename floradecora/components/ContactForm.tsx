"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const form = e.currentTarget;
    const formData = new FormData(form);

    // Web3Forms free endpoint — routes submissions straight to your inbox.
    // Get a free access key at https://web3forms.com and set it as
    // NEXT_PUBLIC_WEB3FORMS_KEY in your Vercel project's environment variables.
    formData.append(
      "access_key",
      process.env.NEXT_PUBLIC_WEB3FORMS_KEY || ""
    );

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();

      if (result.success) {
        setStatus("sent");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Honeypot field to deter simple bots */}
      <input type="checkbox" name="botcheck" className="hidden" style={{ display: "none" }} />

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
          Thank you — your inquiry has been sent. Our team will be in touch shortly.
        </p>
      )}
      {status === "error" && (
        <p className="text-ochre-dark">
          Something went wrong sending your message. Please try again, or email
          us directly at info@floradecora.com.
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
