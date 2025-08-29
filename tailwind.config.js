/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        border: 'var(--color-border)',
        destructive: 'var(--color-danger)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        muted: 'var(--color-neutral-light)',
        'neutral-dark': 'var(--color-neutral-dark)',
        'neutral-light': 'var(--color-neutral-light)',
        'faded-gray': 'var(--color-faded-gray)',

      },
      fontFamily: {
        sans: 'var(--font-sans)',
      },
    },
  },
};
