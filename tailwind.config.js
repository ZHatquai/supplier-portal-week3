/** @type {import('tailwindcss').Config} */
// Brand tokens are the ONLY colours. No Tailwind gray defaults anywhere.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Replace the default palette so stray gray/blue utilities are unavailable.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      ink: '#000000',
      stone: '#B6B09F',
      linen: '#EAE4D5',
      chalk: '#F2F2F2',
      white: '#FFFFFF',
      lime: '#C8F135',
    },
    borderRadius: {
      none: '0',
      DEFAULT: '0', // square corners everywhere
    },
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        none: 'none',
      },
    },
  },
  plugins: [],
}
