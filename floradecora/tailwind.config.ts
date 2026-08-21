import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#16261C",
          light: "#1E3327",
          dim: "#0F1B14",
          soft: "#1B2E22",
        },
        limestone: "#F1ECDD",
        sand: "#DED0AC",
        ochre: {
          DEFAULT: "#C08A2E",
          light: "#D6A852",
          dark: "#93691F",
        },
        sage: {
          DEFAULT: "#7C9473",
          light: "#A3B69B",
          dark: "#586B51",
        },
        ink: "#12160F",
        cream: "#FFF9ED",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-work-sans)", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"],
      },
      letterSpacing: {
        widest2: "0.28em",
        tightDisplay: "-0.03em",
      },
      maxWidth: {
        content: "1280px",
        "content-2xl": "1440px",
      },
      screens: {
        "3xl": "1920px",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 8px 40px rgba(0,0,0,0.08)",
        card: "0 4px 24px rgba(0,0,0,0.06)",
        glow: "0 0 40px rgba(214,168,82,0.25)",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1) translate(0,0)" },
          "100%": { transform: "scale(1.12) translate(-12px,-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        bloom: {
          "0%": { transform: "scale(0) rotate(-20deg)", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        petalFloat: {
          "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-6px) rotate(2deg)" },
        },
      },
      animation: {
        kenburns: "kenburns 18s ease-in-out infinite alternate",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        bloom: "bloom 0.9s cubic-bezier(0.16,1,0.3,1) forwards",
        petalFloat: "petalFloat 3s ease-in-out infinite",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
