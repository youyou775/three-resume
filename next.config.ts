const isProd = process.env.NODE_ENV === 'production';
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  assetPrefix: isProd ? '/three-resume/' : '',
  basePath: isProd ? '/three-resume' : '',
  output: 'export',
  trailingSlash: true,
};

export default nextConfig;