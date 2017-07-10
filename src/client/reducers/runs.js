import Imm from 'immutable';

const initialState = Imm.Map({
  names: Imm.List(),
  data: Imm.Map(),
});

const defaultVals = {
  'SCALAR': Imm.Map({ type: 'SCALAR', step: Imm.List(), value: Imm.List(), }),
  'STATS': Imm.Map({ type: 'STATS', step: Imm.List(), value: Imm.List(), }),
}

const updatePath = (state, action) => {
  let { runName, path, data } = action;
  switch (data.type) {
    case 'SCALAR':
    case 'STATS':
      return state.updateIn(
        ['data', runName, path],
        (s) => {
          if (!s || s.get('type') != data.type) {
            s = defaultVals[data.type];
          }
          return s.withMutations(ts => {
            ts.update('step', arr => arr.push(data.step))
              .update('value', arr => arr.push(Imm.fromJS(data.value)));
          });
        }
      );
    case 'IMAGE':
    case 'EPISODE':
      return state.setIn(['data', runName, path], Imm.fromJS(data));
    default:
      return state;
  }
};

export default function runs(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_RUNS':
      return state.set('names', Imm.List(action.names));
    case 'GET_RUN':
      return state.setIn(['data', action.runName], Imm.fromJS(action.data));
    case 'UPDATE_PATH':
      return updatePath(state, action);
    default:
      return state;
  }
}
