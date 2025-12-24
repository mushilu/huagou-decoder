/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 水墨配色系统
        ink: {
          black: '#1a1a2e',      // 墨黑 - 主背景、主文字
          deep: '#16213e',       // 深墨
          gray: '#7e7e7e',       // 松烟灰 - 二级文字
        },
        paper: {
          white: '#f5f0e8',      // 宣纸白 - 背景、卡片
          cream: '#faf7f2',      // 米白
        },
        vermilion: {
          DEFAULT: '#c73e3e',    // 朱砂红 - 按钮、强调
          light: '#e05555',
          dark: '#a82e2e',
        },
        glaze: {
          blue: '#2d5a7b',       // 琉璃蓝 - 3D环境光
          light: '#4a7a9b',
        },
        gold: {
          DEFAULT: '#d4a84b',    // 鎏金 - 仅装饰
          light: '#e8c36d',
        },
      },
      fontFamily: {
        serif: ['"Source Han Serif SC"', '"Noto Serif SC"', 'serif'],
        sans: ['"Source Han Sans SC"', '"Noto Sans SC"', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      animation: {
        'ink-spread': 'inkSpread 0.8s ease-out forwards',
        'ink-fade': 'inkFade 0.6s ease-in-out',
        'brush-stroke': 'brushStroke 1.5s ease-in-out infinite',
      },
      keyframes: {
        inkSpread: {
          '0%': { transform: 'scale(0)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        inkFade: {
          '0%': { opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        brushStroke: {
          '0%': { strokeDashoffset: '1000' },
          '50%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-1000' },
        },
      },
      backgroundImage: {
        'ink-gradient': 'radial-gradient(circle, rgba(26,26,46,0.8) 0%, rgba(26,26,46,0) 70%)',
        'paper-texture': "url('/images/paper-texture.png')",
      },
    },
  },
  plugins: [],
}
