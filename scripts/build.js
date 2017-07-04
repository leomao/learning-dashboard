const Webpack = require('webpack');
const [serverConfig, clientConfig] = require('../config/prod.config.js');

const clientCompiler = Webpack(clientConfig);
const serverCompiler = Webpack(serverConfig);

const handler = (err, stats) => {
  if (err)
    console.log(err);
  else {
    console.log(stats.toString({
      children: false,
      chunks: false,
      colors: true,
      modules: false,
    }));
  }
};

clientCompiler.run(handler);
serverCompiler.run(handler);
