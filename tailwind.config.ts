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
      // צבעים מותאמים למערכת רכש
      colors: {
        procurement: {
          background: {
            primary: '#1e293b',    // slate-800
            card: '#334155',       // slate-700
            hover: '#475569',      // slate-600
          },
          primary: {
            blue: '#3b82f6',       // blue-500
            'blue-hover': '#2563eb', // blue-600
            'blue-light': '#60a5fa', // blue-400
          },
          secondary: {
            pink: '#ec4899',       // pink-500
            'pink-hover': '#db2777', // pink-600
            'pink-light': '#f472b6', // pink-400
          },
          success: {
            green: '#10b981',      // emerald-500
            'green-hover': '#059669', // emerald-600
            'green-light': '#34d399', // emerald-400
          },
          warning: {
            amber: '#f59e0b',      // amber-500
            'amber-hover': '#d97706', // amber-600
            'amber-light': '#fbbf24', // amber-400
          },
          text: {
            primary: '#ffffff',    // white
            secondary: '#cbd5e1',  // slate-300
            muted: '#94a3b8',      // slate-400
            'muted-improved': '#cbd5e1', // slate-300 - שיפור נגישות
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
      // גדלי טקסט עקביים
      fontSize: {
        'procurement-xs': ['0.75rem', { lineHeight: '1rem' }],
        'procurement-sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'procurement-base': ['1rem', { lineHeight: '1.5rem' }],
        'procurement-lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'procurement-xl': ['1.25rem', { lineHeight: '1.75rem' }],
        'procurement-2xl': ['1.5rem', { lineHeight: '2rem' }],
        'procurement-3xl': ['1.875rem', { lineHeight: '2.25rem' }],
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
      // רדיוסים
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        'procurement-sm': '0.375rem',
        'procurement-md': '0.5rem',
        'procurement-lg': '0.75rem',
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
