const nextConfig = {
  productionBrowserSourceMaps: false, // Keep source maps disabled for production
  // Add experimental or runtime configurations if supported
  experimental: {
    serverActionsTimeout: 30, // Example to increase server timeout to 10 seconds (if supported)
  },
  // Reduce unnecessary server-side rendering load
  reactStrictMode: true, // Enables React's strict mode to help identify issues
};

export default nextConfig;
