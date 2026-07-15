/** @type {import('tailwindcss').Config} */
// design.md 토큰만 사용 — raw hex 추가 금지. 색·크기·여백은 전부 CSS 변수 참조.
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "bg-base": "var(--color-bg-base)",
        surface: "var(--color-surface-base)",
        "surface-muted": "var(--color-surface-muted)",
        "text-primary": "var(--color-text-primary)",
        "text-muted": "var(--color-text-muted)",
        "border-base": "var(--color-border-base)",
        primary: "var(--color-brand-primary)",
        secondary: "var(--color-brand-secondary)",
        accent: "var(--color-brand-accent)",
        error: "var(--color-error)",
        success: "var(--color-success)",
      },
      fontFamily: {
        sans: "var(--font-family-sans)",
        display: "var(--font-family-display)",
      },
      fontSize: {
        xs: "var(--font-size-xs)",
        sm: "var(--font-size-sm)",
        base: "var(--font-size-base)",
        md: "var(--font-size-md)",
        lg: "var(--font-size-lg)",
        xl: "var(--font-size-xl)",
        "2xl": "var(--font-size-2xl)",
        display: "var(--font-size-display)",
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        7: "var(--space-7)",
        8: "var(--space-8)",
        9: "var(--space-9)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        pill: "var(--radius-pill)",
      },
      boxShadow: {
        1: "var(--shadow-1)",
        2: "var(--shadow-2)",
      },
      transitionDuration: {
        fast: "200ms",
        base: "400ms",
      },
    },
  },
  plugins: [],
};
