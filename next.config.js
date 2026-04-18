/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      // Supabase Storage
      "*.supabase.co",
      // Unsplash placeholder images used in seed data
      "images.unsplash.com",
      // Legacy / any other image hosts
      "via.placeholder.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

module.exports = nextConfig;
