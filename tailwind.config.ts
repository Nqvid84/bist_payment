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
        1: '#06141B',
        2: '#11212D',
        3: '#253745',
        4: '#4A5C6A',
        5: '#9BA8AB',
        6: '#CCD0CF'
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
