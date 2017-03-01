const path = require('path');

var config = {
  dev: {
    entry: './src/js/main.js',
    output: {
      path: 'public/js',
      filename: 'bundle.js'
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.common.js',
        Components: path.join(__dirname, 'src/js/Components'),
        Dialogs: path.join(__dirname, 'src/js/Dialogs'),
        Mixins: path.join(__dirname, 'src/js/Mixins'),
        Pages: path.join(__dirname, 'src/js/Pages'),
        WebSocket: path.join(__dirname, 'src/js/WebSocket')
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    }
  }
}

module.exports = config;
