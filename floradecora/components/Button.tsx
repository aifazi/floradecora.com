"use client";
import Link from "next/link";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
  disabled?: boolean;
  onClick?: () => void;
};

const variants = {
  primary: "bg-ochre text-white hover:bg-ochre-light shadow-glow",
  secondary: "bg-ink text-white hover:bg-forest dark:bg-white dark:text-ink dark:hover:bg-cream",
  ghost: "bg-white/10 backdrop-blur border border-white/15 text-white hover:bg-white/15",
  outline: "bg-transparent border border-black/10 dark:border-white/15 text-ink dark:text-white hover:bg-ink hover:text-white dark:hover:bg-white dark:hover:text-ink",
};

const sizes = {
  sm: "px-6 py-3 text-xs",
  md: "px-8 py-4 text-[0.72rem]",
  lg: "px-10 py-5 text-sm",
};

export default function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  type,
  disabled,
  onClick,
}: ButtonProps) {
  const base = `inline-flex items-center justify-center gap-2 rounded-full tracking-[0.16em] uppercase font-medium transition-colors ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type || "button"} disabled={disabled} onClick={onClick} className={base}>
      {children}
    </button>
  );
}
