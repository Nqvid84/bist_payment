import type { Config } from 'tailwindcss';
const { nextui } = require('@nextui-org/react');
const { default: flattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0197f6',
        'primary-dark': '#9D4EDD',
        background: '#FFFFFF',
        'background-alt': '#CED4DA',
        surface: '#F8F9FA',
        text: '#  0B2545',
        muted: '#134074',
        accent: '#F8EBFF',
        dark: {
          background: '#121417',
          'background-alt': '#090A0B',
          accent: "#e0aaff",
          surface: '#1C1F22',
          text: '#E0FBFC',
          muted: 'rgba(224, 251, 252, 0.6)',
        },
      },
      animation: {
        aurora: 'aurora 60s linear infinite'
      },
      keyframes: {
        aurora: {
          from: {
            backgroundPosition: '50% 50%, 50% 50%'
          },
          to: {
            backgroundPosition: '350% 50%, 350% 50%'
          }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
      },
      fontFamily: {
        josefin: ['var(--font-josefin)'],
        vazirMatn: ['var(--font-vazirmatn)'],
        comfortaa: ['var(--font-comfortaa)']
      }
    }
  },
  darkMode: 'class',
  plugins: [nextui(), addVariablesForColors]
};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme('colors'));
  let newVars = Object.fromEntries(Object.entries(allColors).map(([key, val]) => [`--${key}`, val]));

  addBase({
    ':root': newVars
  });
}

export default config;
