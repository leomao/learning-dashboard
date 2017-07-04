const webpack = require('webpack');
const [serverConfig, clientConfig] = require('./base.config.js');

clientConfig.entry.unshift(
  'webpack-dev-server/client',
  'webpack/hot/only-dev-server',
  'react-hot-loader/patch',
)

clientConfig.devtool = 'inline-source-map';
clientConfig.plugins.push(
  // enable HMR globally
  new webpack.HotModuleReplacementPlugin(),
  // prints more readable module names in the browser console on HMR updates
  new webpack.NamedModulesPlugin(),
  // do not emit compiled assets that include errors
  new webpack.NoEmitOnErrorsPlugin(),
);

clientConfig.devServer = {
  host: 'localhost',
  port: 3001,
  // respond to 404s with index.html
  historyApiFallback: true,
  // enable HMR on the server
  hot: true,
  proxy: {
    '/api': 'http://localhost:3000',
    '/clientws': 'http://localhost:3000',
  },
  stats: {
    children: false,
    chunks: false,
    colors: true,
    modules: false,
  }
};

serverConfig.devtool = 'inline-source-map';

module.exports = [serverConfig, clientConfig];
