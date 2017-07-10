import io from 'socket.io-client';

const socket = io.connect({ path : '/clientws' });

export default function handle(store) {
  socket.on('/server/update', (runName, path, data) => {
    store.dispatch({
      type: 'UPDATE_PATH',
      runName,
      path,
      data,
    });
  });
  socket.on('/runs', (runNames) => {
    store.dispatch({
      type: 'UPDATE_RUNS',
      names: runNames,
    });
  });
}

export const getRun = (runName) => {
  return new Promise((resolve, reject) => {
    socket.emit('/get_run', runName, (ret) => {
      resolve(ret);
      socket.emit('/join', runName);
    });
  });
};

