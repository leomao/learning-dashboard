import logger from './logger';

const actions = new Map();

const appendAction = (m, path, data) => {
  let {type, ...d} = data;
  let obj = m.get(path);
  if (!obj || obj.type != type) {
    obj = { type: type };
    for (let k of Object.keys(d)) {
      obj[k] = [ data[k] ];
    }
    m.set(path, obj);
  }
  else {
    for (let k of Object.keys(d)) {
      obj[k].push(data[k]);
    }
  }
}

const updateAction = (m, path, data) => {
  m.set(path, data);
}

actions.set('SCALAR', appendAction);
actions.set('STATS', appendAction);
actions.set('IMAGE', updateAction);
actions.set('EPISODE', updateAction);

class Store {
  constructor() {
    this.runs = new Map();
    this._updateRuns = null;
    this._broadcast = null;
  }

  register({ updateRuns, broadcast }) {
    this._updateRuns = updateRuns;
    this._broadcast = broadcast;
  }

  newRun(runName) {
    this.runs.set(runName, new Map());
    if (this._updateRuns)
      this._updateRuns(this.getRuns());
  }

  getRuns() {
    return [...this.runs.keys()];
  }

  get(runName) {
    if (!this.runs.has(runName)) {
      this.newRun(runName);
    }
    return this.runs.get(runName);
  }

  addEvent(runName, path, data) {
    const m = this.get(runName);
    if (actions.has(data.type)) {
      actions.get(data.type)(m, path, data);
      if (this._broadcast)
        this._broadcast(runName, path, data);
    }
  }

}

const store = new Store();

export default store;
