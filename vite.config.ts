import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "./src",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    outDir: "../dist",
  },
  server: {
    host: process.env.SIO_SERV_HOST || "0.0.0.0",
    port: parseInt(process.env.SIO_SERV_PORT || "3000"),
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    KEYCLOAK_REALM_URL: JSON.stringify(process.env.SIO_SERV_KEYCLOAK_REALM_URL || "http://localhost:8080/auth/realms/sio-serv"),
    KEYCLOAK_CLIENT_ID: JSON.stringify(process.env.SIO_SERV_KEYCLOAK_CLIENT_ID || "sio-serv-spa"),
  },
})
