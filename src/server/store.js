import logger from './logger';

const actions = new Map();

actions.set('ADD_SCALAR', (m, data) => {
  let {path, ...d} = data;
  if (!m.has(path)) {
    m.set(path, { type: 'SCALAR_PLOT', x: [], y: [] });
  }
  m.get(path).x.push(d.step);
  m.get(path).y.push(d.scalar);
});

actions.set('ADD_STATS', (m, data) => {
  let {path, ...d} = data;
  if (!m.has(path)) {
    m.set(path, { type: 'STATS_PLOT', x: [], y: [] });
  }
  m.get(path).x.push(d.step);
  m.get(path).y.push([d.value, d.std]);
});

actions.set('ADD_IMAGE', (m, data) => {
  let {path, ...d} = data;
  if (!m.has(path)) {
    m.set(path, { type: 'IMAGE', image: '', step: 0, });
  }
  m.get(path).image = d.image;
  m.get(path).step = d.step;
});

actions.set('ADD_EPISODE', (m, data) => {
  let {path, ...d} = data;
  if (!m.has(path)) {
    m.set(path, { type: 'EPISODE', episode: '', steps: 0, width:0, height: 0 });
  }
  m.get(path).episode = d.episode;
  m.get(path).steps = d.steps;
  m.get(path).width = d.width;
  m.get(path).height = d.height;
});

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

  addEvent(runName, action, data) {
    const m = this.get(runName);
    if (actions.has(action)) {
      actions.get(action)(m, data);
    }

    if (this._broadcast)
      this._broadcast(runName, action, data);
  }

}

const store = new Store();

export default store;
