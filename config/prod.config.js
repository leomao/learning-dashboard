const path = require('path');
const webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const [serverConfig, clientConfig] = require('./base.config.js');

const rootPath = path.resolve(__dirname, '../');

clientConfig.devtool = 'source-map';

// update loaders for css
clientConfig.module.rules[1].use = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [
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
});

clientConfig.plugins.push(
  new BabiliPlugin({}, {
    comments: false,
  }),
  new ExtractTextPlugin('styles.min.css'),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production'),
  }),
);

serverConfig.devtool = 'inline-source-map';

module.exports = [serverConfig, clientConfig];
