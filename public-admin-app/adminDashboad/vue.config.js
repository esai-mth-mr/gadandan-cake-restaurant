const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: 'admin',
  publicPath:
    process.env.NODE_ENV === 'production' ? '/adminDashboad/admin' : '',
  pages: {
    index: {
      entry: './src/main.ts',
      title: 'タイトル',
    },
  },
})
