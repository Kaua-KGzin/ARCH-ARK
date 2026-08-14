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
        'neon-cyan': '#00ffff',
        'neon-magenta': '#ff00ff',
        'neon-green': '#00ff00',
        'neon-blue': '#00d4ff',
        'neon-purple': '#8b5cf6',
        'neon-gold': '#fbbf24',
        'black-bg': '#0a0a0a',
        'dark-bg': '#050508',
        'dark-card': '#0d0d1a',
        'dark-border': '#1a1a2e',
        'dark-hover': '#16213e',
      },
      fontFamily: {
        sans: ['var(--font-jetbrains-mono)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
        heading: ['var(--font-archivo-black)', 'sans-serif'],
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
        'scanline': 'scanline 8s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out',
        'xp-bounce': 'xpBounce 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'marquee': 'marquee 22s linear infinite',
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
          '0%, 100%': { boxShadow: '0 0 10px rgba(0, 255, 255, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 255, 255, 0.8), 0 0 60px rgba(0, 255, 255, 0.3)' },
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
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        glitch: {
          '0%': { clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' },
          '50%': { clipPath: 'polygon(0 52%, 100% 52%, 100% 100%, 0 100%)' },
          '100%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
        },
        xpBounce: {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-100px) scale(0)', opacity: '0' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px rgba(0, 255, 255, 0.5)',
        'neon-magenta': '0 0 20px rgba(255, 0, 255, 0.5)',
        'neon-green': '0 0 20px rgba(0, 255, 0, 0.5)',
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.4)',
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.4)',
        'neon-gold': '0 0 20px rgba(251, 191, 36, 0.4)',
        'card': '0 0 0 1px rgba(0, 255, 255, 0.3), 0 10px 30px rgba(0, 0, 0, 0.8)',
        'card-hover': '0 0 0 2px rgba(0, 255, 255, 0.5), 0 10px 40px rgba(0, 255, 255, 0.2)',
        'glow-hard': '0 0 10px rgba(0, 255, 255, 0.6)',
      },
    },
  },
  plugins: [],
}

export default config
