const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
module.exports = {
  devServer: {
    proxy: {
      "/api/": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
};
