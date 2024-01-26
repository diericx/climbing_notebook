import { sveltekit } from '@sveltejs/kit/vite';

const config = {
  plugins: [sveltekit()],
  test: {
    include: ['./src/**/*.{test,spec}.{js,ts}'],
  },
  resolve: {
    alias: {
      '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
    },
  },
};

export default config;
