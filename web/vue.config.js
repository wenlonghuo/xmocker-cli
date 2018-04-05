const webpack = require('webpack')
const path = require('path')
const CompressionWebpackPlugin = require('compression-webpack-plugin')

function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '~components': resolve('./src/components'),
        '~layout': resolve('./src/layout'),
        '~assets': resolve('./src/assets'),
        '~pages': resolve('./src/pages'),
        '@': resolve('src')
      }
    },
    module: {
      rules: [
        {
          test: /\.md$/,
          use: [
            {
              loader: 'html-loader'
            }
          ]
        },
      ]
    },
    plugins: [
      new CompressionWebpackPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          ['js', 'css'].join('|') +
          ')$'
        ),
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  },
  devServer: {
    proxy: {
      '/mock': {
        target: 'http://localhost:6001'
      }
    }
  }
}
