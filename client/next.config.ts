import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	// images: {
	//   remotePatterns: [
	//     {
	//       protocol: "https",
	//       hostname: "images.pexels.com" || "localhost",
	//       port: "",
	//       pathname: "/**",
	//     },
	//   ],
	// },
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true, // Ignore TypeScript errors during builds
	},
};

export default nextConfig;
