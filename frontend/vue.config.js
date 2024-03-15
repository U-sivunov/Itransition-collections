const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
module.exports = {
  devServer: {
    proxy: {
      "/api/": {
        target: "https://itransition-collections-back2-git-main-u-sivunovs-projects.vercel.app:3000",
        changeOrigin: true,
      },
    },
  },
};
