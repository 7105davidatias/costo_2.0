import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      // צבעים מותאמים למערכת רכש עם glassmorphism
      colors: {
        procurement: {
          background: {
            primary: 'hsl(220, 50%, 6%)',
            card: 'rgba(15, 23, 42, 0.7)',
            hover: 'rgba(15, 23, 42, 0.8)',
            glass: 'rgba(15, 23, 42, 0.7)',
          },
          primary: {
            neon: '#00ffff',
            'neon-hover': '#00e6e6',
            'neon-light': '#33ffff',
            blue: '#3b82f6',
            'blue-hover': '#2563eb',
            'blue-light': '#60a5fa',
          },
          secondary: {
            neon: '#00ff88',
            'neon-hover': '#00e673',
            'neon-light': '#33ff99',
            pink: '#ff0080',
            'pink-hover': '#e6006b',
            'pink-light': '#ff3399',
          },
          accent: {
            yellow: '#ffaa00',
            'yellow-hover': '#e69900',
            'yellow-light': '#ffbb33',
          },
          success: {
            green: '#10b981',
            'green-hover': '#059669',
            'green-light': '#34d399',
            neon: '#00ff88',
          },
          warning: {
            amber: '#f59e0b',
            'amber-hover': '#d97706',
            'amber-light': '#fbbf24',
            neon: '#ffaa00',
          },
          text: {
            primary: '#e2e8f0',
            secondary: '#cbd5e1',
            muted: '#8892b0',
            'neon-cyan': '#00ffff',
            'neon-green': '#00ff88',
            'neon-pink': '#ff0080',
            'neon-yellow': '#ffaa00',
          },
          border: {
            glass: 'rgba(59, 130, 246, 0.3)',
            'glass-hover': 'rgba(0, 255, 255, 0.6)',
            neon: '#00ffff',
          },
          glass: {
            'ultra-light': 'rgba(15, 23, 42, 0.3)',
            'light': 'rgba(15, 23, 42, 0.5)',
            'medium': 'rgba(15, 23, 42, 0.7)',
            'heavy': 'rgba(15, 23, 42, 0.9)',
          },
          glow: {
            'cyan-sm': '0 0 10px rgba(0, 255, 255, 0.3)',
            'cyan-md': '0 0 20px rgba(0, 255, 255, 0.4)',
            'cyan-lg': '0 0 30px rgba(0, 255, 255, 0.5)',
            'green-sm': '0 0 10px rgba(0, 255, 136, 0.3)',
            'pink-sm': '0 0 10px rgba(255, 0, 128, 0.3)',
          }
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar-background)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      /* Glass Variants */
      --glass-bg: rgba(15, 23, 42, 0.7);
      --glass-border: rgba(59, 130, 246, 0.3);
      --glass-ultra-light: rgba(15, 23, 42, 0.4);
      --glass-light: rgba(15, 23, 42, 0.6);
      --glass-heavy: rgba(15, 23, 42, 0.9);
      --neon-cyan: #00ffff;
      --neon-green: #00ff88;
      --neon-pink: #ff0080;
      --neon-yellow: #ffaa00;

      /* Glow Effects */
      --glow-cyan-sm: 0 0 10px rgba(0, 255, 255, 0.2);
      --glow-cyan-md: 0 0 20px rgba(0, 255, 255, 0.3);
      --glow-cyan-lg: 0 0 30px rgba(0, 255, 255, 0.4);
      --glow-green-sm: 0 0 10px rgba(0, 255, 136, 0.2);
      --glow-green-md: 0 0 20px rgba(0, 255, 136, 0.3);
      --glow-green-lg: 0 0 30px rgba(0, 255, 136, 0.4);
      --glow-pink-sm: 0 0 10px rgba(255, 0, 128, 0.2);
      --glow-pink-md: 0 0 20px rgba(255, 0, 128, 0.3);
      --glow-pink-lg: 0 0 30px rgba(255, 0, 128, 0.4);


      // גדלי טקסט עקביים עם נגישות משופרת
      fontSize: {
        'procurement-xs': ['0.75rem', { lineHeight: '1.2rem' }],
        'procurement-sm': ['0.875rem', { lineHeight: '1.35rem' }],
        'procurement-base': ['1rem', { lineHeight: '1.6rem' }],
        'procurement-lg': ['1.125rem', { lineHeight: '1.8rem' }],
        'procurement-xl': ['1.25rem', { lineHeight: '1.9rem' }],
        'procurement-2xl': ['1.5rem', { lineHeight: '2.2rem' }],
        'procurement-3xl': ['1.875rem', { lineHeight: '2.5rem' }],
      },
      // מרווחים עקביים
      spacing: {
        'procurement-xs': '0.25rem',
        'procurement-sm': '0.5rem',
        'procurement-md': '1rem',
        'procurement-lg': '1.5rem',
        'procurement-xl': '2rem',
        'procurement-2xl': '3rem',
      },
      // רדיוסים לגלאסומורפיזם
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'procurement-sm': '0.5rem',
        'procurement-md': '0.75rem',
        'procurement-lg': '1rem',
        'glass': '16px',
      },
      // אפקטי זכוכית
      backdropBlur: {
        'glass': '20px',
        'glass-heavy': '25px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(15, 23, 42, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-hover': '0 12px 40px rgba(15, 23, 42, 0.6), 0 0 20px rgba(0, 255, 255, 0.3)',
        'neon': '0 0 20px rgba(0, 255, 255, 0.3)',
        'neon-strong': '0 0 30px rgba(0, 255, 255, 0.5)',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "glass-float": {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-5px)",
          },
        },
        "neon-glow": {
          "0%, 100%": {
            textShadow: "0 0 5px #00ffff, 0 0 10px #00ffff, 0 0 15px #00ffff",
          },
          "50%": {
            textShadow: "0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff",
          },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "1",
            boxShadow: "0 0 20px rgba(0, 255, 255, 0.3)",
          },
          "50%": {
            opacity: "0.8",
            boxShadow: "0 0 30px rgba(0, 255, 255, 0.5)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "glass-float": "glass-float 6s ease-in-out infinite",
        "neon-glow": "neon-glow 3s ease-in-out infinite alternate",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;