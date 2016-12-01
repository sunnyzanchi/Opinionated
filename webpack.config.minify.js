const webpack = require('webpack');
const path = require('path');

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

config.prod = Object.create(config.dev);
config.prod.output.filename = 'bundle.min.js';
config.prod.module.loaders.push({
  test: /\.js$/,
  exclude: /(node_modules)/,
  include: path.resolve(__dirname),
  loader: 'babel',
  query: {
    presets: [require.resolve('babel-preset-es2015')]
  }
});
config.prod.plugins = [new webpack.optimize.UglifyJsPlugin()];

module.exports = config;
