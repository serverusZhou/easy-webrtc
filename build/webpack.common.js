// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

const typingsForCssModulesLoaderConf = {
  loader: 'typings-for-css-modules-loader',
  options: {
      modules: true,
      namedExport: true,
      camelCase: true,
      sass: true
  }
}

const config = {
  plugins: [
    // new ExtractTextPlugin("style.css")
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0']// jsx和ES6语法编译
        }
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.css$/,
        // loader: ExtractTextPlugin.extract("style-loader", 'css-loader')
        // use: [
        //   'style-loader',
        //   { loader: 'css-loader', options: { importLoaders: 2, modules: true }}
        //   // 'css-loader'
        // ]
        loader: 'typings-for-css-modules-loader?modules'
      },
      {
        test: /\.scss$/,
        // use: [
        //   'style-loader',
        //   'typings-for-css-modules-loader?modules&sass&namedExport&camelCase',
        //   'sass-loader'
        // ]
        // loader: ExtractTextPlugin.extract(
        //   'style-loader','css-loader','sass-loader'
        // ),
        use: [
          'style-loader',
          //'to-string-loader',
          { loader: 'css-loader', options: { importLoaders: 2, modules: true, camelCase: true, }},
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-flexbugs-fixes'),
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9', // React doesn't support IE8 anyway
                  ],
                  flexbox: 'no-2009',
                }),
              ],
            }
          },
          'sass-loader'
          //typingsForCssModulesLoaderConf
        ]
      },
      {
        test: /\.tsx?$/,
        // loader: 'ts-loader'
        loader: [
          'react-hot-loader/webpack',
          'awesome-typescript-loader',
        ]
      }
    ]
  },
}
module.exports = config
