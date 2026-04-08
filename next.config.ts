import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

let nextConfig: NextConfig = {
  output: isDev ? undefined : 'export',
  turbopack: {},
};

// Only apply serwist in production build (uses webpack)
if (!isDev) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const withSerwistInit = require('@serwist/next').default;
  const withSerwist = withSerwistInit({
    swSrc: 'src/app/sw.ts',
    swDest: 'public/sw.js',
  });
  nextConfig = withSerwist(nextConfig);
}

export default nextConfig;
