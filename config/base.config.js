const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const rootPath = path.resolve(__dirname, '../');

const babelPlugins = [
  [ 'transform-object-rest-spread', { 'useBuiltIns': true }],
  [ 'transform-class-properties', { 'spec': true }],
];

const serverConfig = {
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: [nodeExternals()],
  entry: path.join(rootPath, 'src/server/server.js'),

  output: {
    filename: 'server.js',
    path: path.join(rootPath, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['env', { 'targets': { 'node': true } }],
                'react',
              ],
              plugins: babelPlugins,
            }
          }
        ],
        exclude: /node_modules/,
      },
    ],
  },
};

const clientConfig = {
  entry: [
    path.join(rootPath, 'src/client/app.jsx'),
  ],

  output: {
    // the output bundle
    filename: '[name].js',
    path: path.join(rootPath, 'dist/static'),
    // necessary for HMR to know where to load the hot update chunks
    publicPath: '/'
  },

  resolve: {
    extensions: [ '.js', '.jsx', '.json' ]
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['env', { 'targets': { 'chrome': 58 } }],
                'react',
              ],
              plugins: babelPlugins,
            }
          }
        ],
        exclude: /(node_modules|bower_components)/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: {importLoaders: 1} },
          {
            loader: 'postcss-loader',
            options: {
              config: {
                path: path.join(rootPath, 'config/postcss.config.js'),
              },
            }
          }
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Dashboard',
      template: path.join(rootPath, 'src/client/index.ejs'),
    }),
  ],
};

module.exports = [serverConfig, clientConfig];
