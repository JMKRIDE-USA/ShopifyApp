import react from "@vitejs/plugin-react";
import "dotenv/config";

/**
 * @type {import('vite').UserConfig}
 */
export default {
  define: {
    "process.env.SHOPIFY_API_KEY": JSON.stringify(process.env.SHOPIFY_API_KEY),
    "process.env.AMBASSADORSITE_ENDPOINT": JSON.stringify(process.env.VITE_AMBASSADORSITE_ENDPOINT),
  },
  plugins: [react()],
};
