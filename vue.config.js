const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    port: 8080,
  },
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'assets',
  filenameHashing: true,
  runtimeCompiler: false,
  productionSourceMap: true,
  transpileDependencies: true
})
