import Imm from 'immutable';

const initialState = Imm.Map({
  names: Imm.List(),
  data: Imm.Map(),
});

const defaultScalar = Imm.Map({
  type: 'SCALAR_PLOT',
  x: Imm.List(),
  y: Imm.List(),
});

const defaultStats = Imm.Map({
  type: 'STATS_PLOT',
  x: Imm.List(),
  y: Imm.List(),
});

const defaultImage = Imm.Map({
  type: 'IMAGE',
  image: '',
  step: 0,
});

const defaultEpisode = Imm.Map({
  type: 'EPISODE',
  episode: '',
  steps: 0,
  width: 0,
  hieght: 0,
});

export default function runs(state = initialState, action) {
  switch (action.type) {
    case 'UPDATE_RUNS':
      return state.set('names', Imm.List(action.names));
    case 'GET_RUN':
      return state.setIn(['data', action.runName], Imm.fromJS(action.data));
    case 'ADD_SCALAR':
      return state.updateIn(
        ['data', action.runName, action.data.path],
        (s = defaultScalar) => {
          return s.withMutations(ts => {
            ts.update('x', arr => arr.push(action.data.step))
              .update('y', arr => arr.push(action.data.scalar));
          });
        }
      );
    case 'ADD_STATS':
      return state.updateIn(
        ['data', action.runName, action.data.path],
        (s = defaultStats) => {
          return s.withMutations(ts => {
            ts.update('x', arr => arr.push(action.data.step))
              .update(
                'y',
                arr => arr.push(Imm.List.of(action.data.value,
                                            action.data.std))
              );
          });
        }
      );
    case 'ADD_IMAGE':
      return state.updateIn(
        ['data', action.runName, action.data.path],
        (s = defaultImage) => {
          return s.withMutations(ts => {
            ts.set('image', action.data.image).set('step', action.data.step);
          });
        }
      );
    case 'ADD_EPISODE':
      return state.updateIn(
        ['data', action.runName, action.data.path],
        (s = defaultEpisode) => {
          return s.withMutations(ts => {
            ts.set('episode', action.data.episode)
              .set('steps', action.data.steps)
              .set('width', action.data.width)
              .set('height', action.data.height);
          });
        }
      );
    default:
      return state;
  }
}
