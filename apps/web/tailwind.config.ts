import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-blue': '#00d4ff',
        'neon-purple': '#8b5cf6',
        'neon-gold': '#fbbf24',
        'dark-bg': '#050508',
        'dark-card': '#0d0d1a',
        'dark-border': '#1a1a2e',
        'dark-hover': '#16213e',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-neon': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0f 0%, #0d0d1a 100%)',
        'gradient-gold': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
        'gradient-rank-s': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #dc2626 100%)',
      },
      animation: {
        'xp-fill': 'xpFill 1s ease-out',
        'level-up': 'levelUp 0.8s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'particle': 'particle 1s ease-out forwards',
      },
      keyframes: {
        xpFill: {
          '0%': { width: '0%' },
          '100%': { width: 'var(--xp-width)' },
        },
        levelUp: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 212, 255, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 212, 255, 0.8), 0 0 60px rgba(0, 212, 255, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        particle: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) scale(0)', opacity: '0' },
        },
      },
      boxShadow: {
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.4)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.4)',
        'neon-gold': '0 0 20px rgba(251, 191, 36, 0.4)',
        'card': '0 4px 30px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 8px 40px rgba(0, 212, 255, 0.15)',
      },
    },
  },
  plugins: [],
}

export default config
