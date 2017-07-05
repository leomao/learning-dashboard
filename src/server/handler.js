import store from './store';
import logger from './logger';
import { mapToObject } from './utils';

const viewers = new Set();

const addViewer = (socket) => {
  viewers.add(socket.id);

  socket.on('/get_run', (runName, cb) => {
    const m = store.get(runName);
    cb(mapToObject(m));
  });
  socket.on('/join', (runName) => {
    logger.info(`join ${runName}`);
    socket.join(runName);
  });
  socket.on('/leave', (runName) => {
    logger.info(`leave ${runName}`);
    socket.leave(runName);
  });

  socket.on('disconnect', () => {
    viewers.delete(socket.id);
  });

  socket.emit('/runs', store.getRuns());
};

const handler = (io) => {
  io.on('connection', addViewer);

  store.register({
    updateRuns: (runNames) => {
      io.emit('/runs', runNames);
    },
    broadcast: (runName, action, data) => {
      io.to(runName).emit('action', action, runName, data);
    },
  });
};

export default handler;
