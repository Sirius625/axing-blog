// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // ✅ 必须改为这个
    autoprefixer: {},
  },
}
