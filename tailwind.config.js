/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1208',
        cream: '#faf6ef',
        warm: '#f0e8d8',
        amber: '#d4780a',
        'amber-light': '#f5a623',
        'amber-pale': '#fdf1dc',
        rust: '#b84c1a',
        green: '#2d6a4f',
        'green-light': '#e8f5ee',
        danger: '#c0392b',
        'danger-light': '#fdecea',
        muted: '#7a6e60',
        border: '#e5ddd0'
      },
      fontFamily: {
        heading: ['Poppins', 'sans-serif'],
        body: ['Poppins', 'sans-serif']
      },
      boxShadow: {
        soft: '0 18px 40px rgba(26, 18, 8, 0.08)'
      },
      backgroundImage: {
        'dashboard-wash': 'radial-gradient(circle at top right, rgba(245, 166, 35, 0.18), transparent 30%), radial-gradient(circle at bottom left, rgba(184, 76, 26, 0.08), transparent 30%)'
      }
    }
  },
  plugins: []
};
