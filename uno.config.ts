import { defineConfig } from 'unocss'

const breakpoints = { sm: 200, md: 300, lg: 400, xl: 500 }

export default defineConfig({
  theme: {
    colors: {
      theme: {
        blue: '#0080FF',
        orange: '#FF6B4A',
        yellow: '#FFD700',
        green: '#00D68F',
        cyan: '#00D4FF',
        pink: '#FF4DB8',
      },
    },
  },
  variants: Object.entries(breakpoints).map(([name, size]) => {
    return (matcher) => {
      if (!matcher.startsWith(`cq-${name}:`)) return
      return {
        matcher: matcher.slice(name.length + 4),
        parent: `@container (min-width: ${size}px)`,
      }
    }
  }),
  shortcuts: {
    'container-query': '[container-type:inline-size]',
    'bg-pattern': 'bg-gradient-radial from-white/10 to-transparent',
  },
})