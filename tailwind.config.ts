import type { Config } from 'tailwindcss';

// 🔧 tailwind.config.ts
// Purpose: Tells Tailwind which utility classes to generate.

// You're doing: Defining your core palette and font families here 
// so you can use classes like bg-fern, text-clay, font-serif across JSX.

// These are used when you write utility class names inside className=""
// —they're compiled into CSS at build time.

const config: Config = {
  content: [
  './src/**/*.{ts,tsx,js,jsx,mdx}',
  './public/index.html'
],
  darkMode: 'class',
  theme: {
    extend: {
      // 🎨 Core Brand Colors
      colors: {
        canvas: '#F7F3E8', // Soft parchment background – warm and comfortable
        woodland: '#2E3C2F', // Deep green-brown – rich main text color
        clay: '#C46D5E', // Earthy red – used for accents and highlights
        moss: '#6DA87B', // Muted green – success color for positive feedback
        wheat: '#F4C96A', // Golden yellow – gentle warning tone
        ember: '#C84E3C', // Burnt red – refined error tone, more distinct than accent
        parchmentDeep: '#E9DFC8', // Darker take on canvas, foreground1
        sandstone: '#DFD5BA', // Slightly darker sandstone, foreground2
        sepiaGlow: '#CBB89D', //Slightly darker than sandstone, foreground3
        goldenHusk: '#ECD7A4', //Brightesr foreground, forground4
        
        // 🌈 Habit & Chart Gradients
        hibiscus: '#D13E78', // Bright floral pink – vibrant, energetic
        ochre: '#D9A72D', // Sunlit yellow – optimistic and clear
        terracotta: '#B54E37', // Warm clay – creative and bold
        sky: '#4D87C2', // Fresh blue – clarity and momentum
        fern: '#4A8C4D', // Leafy green – growth and grounding
        plum: '#874C78', // Reflective purple – depth and introspection

        // 🪄 Optional desaturated bases for gradients (can be used in streak visuals)
        hibiscusLight: '#F2CBD5',
        ochreLight: '#F4E3B4',
        terracottaLight: '#D6A198',
        skyLight: '#C6DDF0',
        fernLight: '#B8D3B1',
        plumLight: '#D8C4D3',
      },

      // ✍️ Typography
      fontFamily: {
        sans: ['Geist Sans', 'Helvetica', 'Arial', 'sans-serif'], // Clean, modern, slightly rounded
        serif: ['Cormorant Garamond', 'Georgia', 'serif'], // Organic elegance for headings
        mono: ['Geist Mono', 'monospace'], // For dashboards and time tracking
      },
    },
  },
  plugins: [],
};

export default config;