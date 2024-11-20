import react from "@vitejs/plugin-react-swc"
import fs from "fs"
import path from "path"
import { defineConfig, Plugin } from "vite"

const loadSettingFiles = (): Plugin => {
  return {
    name: "load-setting-files-plugin",
    config(config) {
      config.define = config.define || {};
      [
        "SIO_SERV_UI_TABLE_FILE",
        "SIO_SERV_WF_PARAMS_SCHEMA_FILE",
        "SIO_SERV_RUN_REQUEST_FILE",
      ].forEach((key) => {
        const file = process.env[key]
        if (file === undefined) {
          throw new Error(`The environment variable ${key} is not set.`)
        }
        if (fs.existsSync(file) === false) {
          throw new Error(`The file ${file} does not exist.`)
        }
        const fileContent = fs.readFileSync(file, "utf-8")
        const defineKey = `${key.replace("SIO_SERV_", "")}_CONTENT`
        config.define![defineKey] = JSON.stringify(fileContent)
      })
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    loadSettingFiles(),
  ],
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
  preview: {
    host: process.env.SIO_SERV_HOST || "0.0.0.0",
    port: parseInt(process.env.SIO_SERV_PORT || "3000"),
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    KEYCLOAK_REALM_URL: JSON.stringify(process.env.SIO_SERV_KEYCLOAK_REALM_URL || "http://localhost:8080/auth/realms/sio-serv"),
    KEYCLOAK_CLIENT_ID: JSON.stringify(process.env.SIO_SERV_KEYCLOAK_CLIENT_ID || "sio-serv-spa"),
    MINIO_ENDPOINT: JSON.stringify(process.env.SIO_SERV_MINIO_ENDPOINT || "http://localhost:9000"),
    SAPPORO_ENDPOINT: JSON.stringify(process.env.SIO_SERV_SAPPORO_ENDPOINT || "http://localhost:1122"),
  },
  base: process.env.SIO_SERV_BASE_PATH || "/",
})
