// Owner: Om / Dominic
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // TODO: add proxy for local API dev if needed
  //   server: { proxy: { '/api': 'http://localhost:3001' } }
});
