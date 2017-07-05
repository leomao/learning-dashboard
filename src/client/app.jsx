import { AppContainer } from 'react-hot-loader';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore';
import socketHandle from './socket';

import initRoot from './containers/root';

const store = configureStore();
socketHandle(store);

const render = (Root) => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Root />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(initRoot);

if (module.hot) {
  module.hot.accept('./containers/root', () => {
    render(require('./containers/root').default);
  });
}
