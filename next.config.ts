import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      // Migrace ze starého WordPress webu arcatering.cz — zachování SEO.
      { source: "/dodavka-obcerstveni", destination: "/#menu", permanent: true },
      { source: "/dodavka-obcerstveni/", destination: "/#menu", permanent: true },
      { source: "/kontakt", destination: "/#footer", permanent: true },
      { source: "/kontakt/", destination: "/#footer", permanent: true },
      { source: "/o-nas", destination: "/", permanent: true },
      { source: "/o-nas/", destination: "/", permanent: true },
      { source: "/reference", destination: "/#refs", permanent: true },
      { source: "/reference/", destination: "/#refs", permanent: true },
      { source: "/reference/:slug", destination: "/#refs", permanent: true },
      { source: "/reference/:slug/", destination: "/#refs", permanent: true },
      { source: "/fotogalerie", destination: "/#menu", permanent: true },
      { source: "/fotogalerie/", destination: "/#menu", permanent: true },
      { source: "/kanapky", destination: "/#menu", permanent: true },
      { source: "/kanapky/", destination: "/#menu", permanent: true },
      { source: "/kariera", destination: "/", permanent: true },
      { source: "/kariera/", destination: "/", permanent: true },
      // ~230 jednotlivých stránek pokrmů (WP custom post type "catering")
      { source: "/catering/:slug", destination: "/#menu", permanent: true },
      { source: "/catering/:slug/", destination: "/#menu", permanent: true },
    ];
  },
};

export default nextConfig;
