const { defineConfig } = require("@vue/cli-service");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  outputDir: "../digita-media-cordova/www",
  publicPath: "./",
  assetsDir: "static",
  configureWebpack: {
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
});
