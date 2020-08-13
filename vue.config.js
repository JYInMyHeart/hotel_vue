module.exports = {
  devServer: {
    disableHostCheck: true,
    host: '0.0.0.0',
    port: 8089,
    open: false,
    https: false,
    proxy: {
      '/hotel': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/hotel': ''
        }
      }
    },
    hotOnly: false
  }
}
