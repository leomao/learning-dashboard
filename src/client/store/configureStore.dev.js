import { applyMiddleware, createStore } from 'redux';
import rootReducer from '../reducers';

export function configureStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
  );

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers').default);
    });
  }

  return store;
}
