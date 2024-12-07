import { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable source maps in production
  productionBrowserSourceMaps: false, // Disable in production; set to true if debugging is needed

  // Modify Webpack configuration to handle CSS source maps
  webpack: (config) => {
    // Iterate over rules to find CSS-related rules
    config.module.rules.forEach((rule: any) => {
      if (rule.test && rule.test.toString().includes('css')) {
        rule.use?.forEach((loader: any) => {
          if (loader.loader && loader.loader.includes('css-loader')) {
            loader.options.sourceMap = false; // Disable CSS source maps
          }
        });
      }
    });
    return config; // Return the updated config
  },
};

export default nextConfig;
