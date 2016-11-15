const webpack = require('webpack');

var config = {
  dev: {
    entry: './src/js/main.js',
    module: {
      loaders: [
        {
          test: /\.vue$/,
          loader: 'vue'
        },

      ]
    },
    output: {
        filename: 'bundle.js'
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.js'
      }
    }
  }
}

module.exports = config;
