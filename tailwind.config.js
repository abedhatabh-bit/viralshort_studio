/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  safelist: [
    'text-foreground','text-muted-foreground','text-muted','text-primary','text-destructive',
    'text-warning','text-secondary','text-accent','bg-background','bg-muted','bg-card',
    'bg-primary','bg-destructive','bg-accent','bg-secondary','border-border','border-primary',
    'border-muted','border-destructive','hover:bg-accent','hover:bg-primary','hover:border-primary',
    'hover:text-accent','hover:text-primary','focus:bg-accent','focus:border-primary','focus:text-primary',
    'neon-glow-primary','neon-glow-secondary','neon-glow-accent','neon-glow-intense','pulse-cta',
    'glitch-effect','transition-neon','transition-smooth','surface-elevation','bg-muted/20',
    'bg-primary/10','border-primary/50'
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        border: "var(--color-border)",
        input: "var(--color-input)",
        ring: "var(--color-ring)",
        background: "var(--color-background)",
        foreground: "var(--color-foreground)",
        primary: { DEFAULT: "var(--color-primary)", foreground: "var(--color-primary-foreground)" },
        secondary: { DEFAULT: "var(--color-secondary)", foreground: "var(--color-secondary-foreground)" },
        destructive: { DEFAULT: "var(--color-destructive)", foreground: "var(--color-destructive-foreground)" },
        muted: { DEFAULT: "var(--color-muted)", foreground: "var(--color-muted-foreground)" },
        accent: { DEFAULT: "var(--color-accent)", foreground: "var(--color-accent-foreground)" },
        popover: { DEFAULT: "var(--color-popover)", foreground: "var(--color-popover-foreground)" },
        card: { DEFAULT: "var(--color-card)", foreground: "var(--color-card-foreground)" },
        success: { DEFAULT: "var(--color-success)", foreground: "var(--color-success-foreground)" },
        warning: { DEFAULT: "var(--color-warning)", foreground: "var(--color-warning-foreground)" },
        error: { DEFAULT: "var(--color-error)", foreground: "var(--color-error-foreground)" },
      },
      fontFamily: {
        heading: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        caption: ['Rajdhani', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: { lg: "8px", md: "6px", sm: "4px" },
      keyframes: {
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
        "pulse-neon": {
          "0%, 100%": { boxShadow: "0 0 8px rgba(57, 255, 20, 0.4)" },
          "50%": { boxShadow: "0 0 16px rgba(57, 255, 20, 0.6)" },
        },
        glitch: {
          "0%, 98%": { transform: "translateX(0)" },
          "99%": { transform: "translateX(2px)" },
          "100%": { transform: "translateX(-2px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-neon": "pulse-neon 857ms infinite",
        glitch: "glitch 3000ms infinite",
      },
      spacing: { 18: "4.5rem", 88: "22rem" },
      zIndex: { 60: "60", 70: "70", 80: "80", 90: "90", 100: "100" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
