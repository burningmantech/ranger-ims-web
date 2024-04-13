/* istanbul ignore file */
// .. because this is development-only

const { createProxyMiddleware } = require("http-proxy-middleware");

const backendUrl = process.env.BACKEND_URL || "http://127.0.0.1:8080";

module.exports = function (app) {
  app.use(
    "/ims/api",
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
    }),
  );

  // Remove after removing the built-in web client from the server
  app.use(
    "/ims/auth",
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
    }),
  );
  app.use(
    "/ims/ext",
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
    }),
  );
  app.use(
    "/ims/static",
    createProxyMiddleware({
      target: backendUrl,
      changeOrigin: true,
    }),
  );
};
