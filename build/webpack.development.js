const path = require('path')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const commonConfig = require('./webpack.common.js');

const devConfig = merge(commonConfig, {
    mode: 'development',
    entry: path.resolve(__dirname, '../src/example/index.tsx'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../dist'),
        // publicPath: path.resolve(__dirname, '../assets')
    },
    devtool: 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
          filename: path.resolve(__dirname, '../dist/index.html'),
          template: path.resolve(__dirname, '../src/example/index.html'),
          inject: true,
          hash: false,
        }),
        new ProgressBarPlugin({
          format: '  构建 [:bar] :percent (:elapsed seconds)',
          clear: false,
          width: 60
        }),
      ],
    devtool: 'eval',
    devServer: {
      port: 8090,
      open: true,
      inline: true,
      hot: false,
      host: '0.0.0.0',
      compress: true,
    }
})

module.exports = devConfig