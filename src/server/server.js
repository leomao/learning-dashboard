import path from 'path';
import http from 'http';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import Router from 'koa-router';
import koaStatic from 'koa-static';

import socketio from 'socket.io';

import logger from './logger';
import handler from './handler';
import apiRouter from './api';

const PORT = process.env.PORT || 3000;
const app = new Koa();
const server = http.createServer(app.callback());

const io = socketio(server, {path: '/clientws'});
handler(io);

app.use(bodyParser());
apiRouter.prefix('/api');
app.use(apiRouter.routes());
app.use(koaStatic(path.join(__dirname, 'static')));

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
