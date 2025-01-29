import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "mind-forge-bucket.s3.ap-south-1.amazonaws.com",
				port: "",
				pathname: "/**",
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	typescript: {
		ignoreBuildErrors: true, // Ignore TypeScript errors during builds
	},
};

export default nextConfig;
