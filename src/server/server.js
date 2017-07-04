import path from 'path';
import http from 'http';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';

import logger from './logger';

const PORT = process.env.PORT || 3000;
const app = new Koa();
const server = http.createServer(app.callback());

server.listen(PORT, () => {
  logger.info(`Server started at: http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  logger.info('exiting...');
  server.close(() => {
    logger.info('done.');
    process.exit();
  });
});
