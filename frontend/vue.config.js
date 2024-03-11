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
  chainWebpack: (config) => {
    config.plugin("fork-ts-checker").tap((args) => {
      let allowUseMem = 300;
      // in vue-cli shuld args[0]['typescript'].memoryLimit
      args[0]["typescript"].memoryLimit = allowUseMem;
      return args;
    });
  },
};
