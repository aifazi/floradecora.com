"use client";
export default function WhatsAppWidget() {
  const phone = "97137344243";
  const msg = encodeURIComponent("Hi Flora Decora, I have a project to discuss.");
  return (
    <a
      href={`https://wa.me/${phone}?text=${msg}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-[0_8px_32px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.5 14.1c-.3.9-1.7 1.7-2.4 1.8-.6.1-1.2.1-1.9-.1-.5-.2-1.1-.5-1.9-.9-1.4-.8-2.6-1.9-3.6-3.3-.3-.4-.6-.9-.8-1.4-.2-.5-.3-1-.3-1.5 0-.5.1-1 .4-1.4.2-.3.5-.6.8-.8l.4-.3c.3-.2.6-.3.9-.3h.6c.3 0 .6.1.8.5l1 2.4c.1.3.1.6 0 .9-.1.3-.3.5-.5.7l-.5.5c-.1.1-.2.3-.2.4 0 .1.1.3.2.4.5.7 1.1 1.3 1.8 1.8.2.1.3.2.5.2.1 0 .3 0 .4-.2l.5-.5c.2-.2.4-.3.7-.4.3-.1.6 0 .9.1l2.4 1c.4.2.5.5.5.8v.6c0 .3-.1.6-.3.9l-.3.4c-.2.3-.5.5-.8.7z" /></svg>
    </a>
  );
}
