const BabiliPlugin = require('babili-webpack-plugin');
const [serverConfig, clientConfig] = require('./base.config.js');

clientConfig.devtool = 'source-map';
clientConfig.plugins.push(
  new BabiliPlugin({}, {
    comments: false,
  })
);

serverConfig.devtool = 'inline-source-map';

module.exports = [serverConfig, clientConfig];
