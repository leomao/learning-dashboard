const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const rootPath = path.resolve(__dirname, '../');

const serverConfig = {
  target: 'node',
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
              ]
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
              ]
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
              parser: 'sugarss',
              plugins: {
                'postcss-import': {},
                'cssnano': {},
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
