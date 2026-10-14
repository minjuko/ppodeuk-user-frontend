import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { copyFileSync, createReadStream } from "node:fs";
import { resolve } from "node:path";

const demoWorkerPath = resolve("src/mocks/mockServiceWorker.js");

const demoServiceWorker = (enabled) => ({
  name: "demo-service-worker",
  apply: enabled ? undefined : () => false,
  configureServer(server) {
    server.middlewares.use("/mockServiceWorker.js", (_, response) => {
      response.setHeader("Content-Type", "application/javascript");
      createReadStream(demoWorkerPath).pipe(response);
    });
  },
  writeBundle({ dir }) {
    copyFileSync(demoWorkerPath, resolve(dir, "mockServiceWorker.js"));
  },
});

export default defineConfig(({ mode }) => ({
  define: {
    __DEMO_BUILD__: JSON.stringify(mode === "demo"),
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
  },
  plugins: [
    demoServiceWorker(mode === "demo"),
    VitePWA({
      disable: mode === "demo",
      includeAssets: ["/favicon.ico", "/apple-touch-icon.png"],
      registerType: "autoUpdate",
      injectRegister: "auto",
      devOptions: {
        enabled: true,
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg}"],
      },
      manifest: {
        name: "뽀득뽀득",
        short_name: "뽀득뽀득",
        description: "여유롭게 즐기는 셀프세차, 뽀득뽀득",
        theme_color: "#FFFFFF",
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
    react(),
  ],
}));
