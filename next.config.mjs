/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { hostname: "assets.aceternity.com" },
      { hostname: "files.edgestore.dev" },
      { hostname: "utfs.io" },
      { hostname: "api.microlink.io" },
      { hostname: "images.unsplash.com" },
      { hostname: "picsum.photos" },
      // School logos & backgrounds
      { hostname: "ciccc.ca" },
      { hostname: "metropolitancollege.ca" },
      { hostname: "sprottshaw.com" },
      { hostname: "www.ucanwest.ca" },
      { hostname: "www.ufv.ca" },
      // Avatar placeholder
      { hostname: "i.pravatar.cc" },
      // Any other external images
      { hostname: "**.googleusercontent.com" },
      { hostname: "lh3.googleusercontent.com" },
    ],
  },
};

export default nextConfig;
