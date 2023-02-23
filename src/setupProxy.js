/* istanbul ignore file */
// .. because this is development-only

const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/ims/api",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
    }),
  );

  // Remove after removing the built-in web client from the server
  app.use(
    "/ims/auth",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
    }),
  );
  app.use(
    "/ims/ext",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
    }),
  );
  app.use(
    "/ims/static",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
    }),
  );
};
