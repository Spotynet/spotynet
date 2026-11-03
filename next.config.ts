import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: [
    "spotynet.com",
    "www.spotynet.com",
    "dev.spotynet.com",
  ],
};

export default nextConfig;
