import io from 'socket.io-client';

const socket = io.connect({ path : '/clientws' });

export default function handle(store) {
  socket.on('action', (action, runName, data) => {
    store.dispatch({
      type: action,
      runName,
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

