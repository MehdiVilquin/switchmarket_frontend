/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.openbeautyfacts.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
