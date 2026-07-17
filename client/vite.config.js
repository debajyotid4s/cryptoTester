import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

function basePathRedirectPlugin() {
  const fromPath = "/cryptoTester";
  const toPath = "/cryptoTester/";

  const redirectMiddleware = (req, res, next) => {
    const requestUrl = new URL(req.url || "/", "http://localhost");

    if (requestUrl.pathname === fromPath) {
      const target = `${toPath}${requestUrl.search}${requestUrl.hash}`;
      res.statusCode = 302;
      res.setHeader("Location", target);
      res.end();
      return;
    }

    next();
  };

  return {
    name: "base-path-redirect",
    configureServer(server) {
      server.middlewares.use(redirectMiddleware);
    },
    configurePreviewServer(server) {
      server.middlewares.use(redirectMiddleware);
    },
  };
}

export default defineConfig({
  plugins: [react(), basePathRedirectPlugin()],
  base: "/cryptoTester/",
  build: {
    manifest: true,
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
      },
    },
  },
});
