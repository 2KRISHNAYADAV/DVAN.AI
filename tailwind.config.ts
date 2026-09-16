import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))'
        },
        // ── Textile Direct Palette ──
        navy:      '#0E2931',
        'dark-teal': '#12484C',
        teal:      '#2B7574',
        'deep-red': '#861211',
        offwhite:  '#E2E2E0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'bounce': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        'fadeUp': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fadeLeft': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        'jump-3d': {
          '0%, 100%': { transform: 'translateY(0) scale(1)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
          '50%': { transform: 'translateY(-8px) scale(1.02)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }
        },
        'swap-3d': {
          '0%': { transform: 'perspective(1000px) rotateY(0deg) scale(1)', opacity: '1' },
          '50%': { transform: 'perspective(1000px) rotateY(-90deg) scale(0.9) translateZ(-60px)', opacity: '0.5' },
          '100%': { transform: 'perspective(1000px) rotateY(0deg) scale(1)', opacity: '1' }
        },
        'fabric-ripple': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.04)', opacity: '0.85' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'section-reveal': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'bounce': 'bounce 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'pulse': 'pulse 2s ease-in-out infinite',
        'jump-3d': 'jump-3d 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'swap-3d': 'swap-3d 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
        'fabric-ripple': 'fabric-ripple 0.4s ease-out',
        'section-reveal': 'section-reveal 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'float': 'float 3.8s ease-in-out infinite',
        'float-slow': 'float-slow 5.5s ease-in-out infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
