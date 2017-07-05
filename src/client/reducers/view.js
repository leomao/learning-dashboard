import Imm from 'immutable';

const initialState = Imm.Map({
  showList: Imm.List(),
});

export default function view(state = initialState, action) {
  switch (action.type) {
    case 'SHOW':
      return state.set('showList', Imm.List.of(action.runName));
    default:
      return state;
  }
}
