const path = require('path')
const merge = require('webpack-merge')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const commonConfig = require('./webpack.common.js');

const devConfig = merge(commonConfig, {
    mode: 'production',
    entry: path.resolve(__dirname, '../src/index.ts'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, '../dist'),
    },
    plugins: [
        new ProgressBarPlugin({
            format: '  构建 [:bar] :percent (:elapsed seconds)',
            clear: false,
            width: 60
        }),
    ],
})

module.exports = devConfig