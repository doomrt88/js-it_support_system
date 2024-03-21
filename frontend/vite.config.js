import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
const getBaseUrl = () => {
  //if (process.env.DOCKER === "true") {
  //  return '"http://172.17.0.1:3000"';
  //}
  // Default to localhost
  return '"http://localhost:3000"';
};

export default defineConfig({
  plugins: [react()],
  define: {
    BASE_URL: getBaseUrl() // this is the server URL
  }
});
