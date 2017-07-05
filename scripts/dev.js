const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const nodemon = require('nodemon');

const [serverConfig, clientConfig] = require('../config/dev.config.js');

const clientCompiler = Webpack(clientConfig);
const devConfig = clientConfig.devServer;
const devserver = new WebpackDevServer(clientCompiler, devConfig);

devserver.listen(devConfig.port, '0.0.0.0', () => {
  console.log(`frontend server listening on http://localhost:${devConfig.port}`);
});

const serverCompiler = Webpack(serverConfig);
let server = null;
let watcher = null;

serverCompiler.run((err, stats) => {
  server = nodemon({
    exec: 'cd ./dist && node',
    script: 'server.js',
    ext: 'js',
    watch: false,
  }).on('start', () => {
    console.log(`backend server started`);
  }).on('restart', () => {
    console.log(`backend server restarted`);
  });
  watcher = serverCompiler.watch({
    aggregateTimeout: 300,
    ignored: /node_modules/,
  }, (err, stats) => {
    server.emit('restart', 0.5);
  });
});

process.on('SIGINT', () => {
  devserver.close();
  if (watcher)
    watcher.close();
  process.exit();
});
