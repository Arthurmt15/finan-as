/** TailwindCSS — Tema inspirado no PlayStation 1 (PS1)
 *  Cores primárias, fontes pixeladas (Press Start 2P) e
 *  monoespaçada (VT323), sombra dura sem blur. */
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        mono: ['"VT323"', 'monospace'],
      },
      colors: {
        ps1: {
          blue: '#0000a0',
          'blue-light': '#3030c0',
          white: '#c0c0c0',
          black: '#101010',
          red: '#c00000',
          green: '#00a000',
          yellow: '#c0c000',
        },
      },
      boxShadow: {
        'ps1': '4px 4px 0px #000',
      },
    },
  },
  plugins: [],
}

export default config
