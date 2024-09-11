/** @type {import('tailwindcss').Config} */

import pluginDaisy from 'daisyui'

export default {
  content: ['./src/**/*.{html,js}', 'index.html'],
  theme: {
    extend: {}
  },
  plugins: [
    pluginDaisy
  ],
  daisyui: {
    logs: false
  }
}
