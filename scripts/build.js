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

let serverflag = true;
let clientflag = true;
if (process.argv.length > 2) {
  if (process.argv[2] == '--server')
    clientflag = false;
  else if (process.argv[2] == '--client')
    serverflag = false;
}

if (clientflag)
  clientCompiler.run(handler);

if (serverflag)
  serverCompiler.run(handler);
