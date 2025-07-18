import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
  './src/**/*.{ts,tsx,js,jsx,mdx}',
  './public/index.html'
],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;