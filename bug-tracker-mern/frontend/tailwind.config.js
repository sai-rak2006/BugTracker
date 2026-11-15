/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        openProject: {
          header: '#1a5b9c',
          sidebar: '#f8f9fa',
          sidebarDark: '#333333',
          activeBg: '#095db1',
          border: '#e1e5eb',
          textMain: '#333333',
          textMuted: '#666666',
          bgBody: '#ffffff',
          bgCard: '#f7f7f7',
        },
        issue: {
          bug: '#d32f2f',
          feature: '#1976d2',
          epic: '#7b1fa2'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
