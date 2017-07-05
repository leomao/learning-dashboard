import { combineReducers } from 'redux-immutable';

import view from './view';
import runs from './runs';

const rootReducer = combineReducers({
  view,
  runs,
});

export default rootReducer;
