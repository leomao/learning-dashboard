import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ReactGridLayout from 'react-grid-layout';
//import { Responsive, WidthProvider } from 'react-grid-layout';
//const ReactGridLayout = WidthProvider(Responsive);

import PlotPane from '../components/PlotPane';
import ImagePane from '../components/ImagePane';
import EpisodePane from '../components/EpisodePane';

const resizing = (...args) => {
  console.log(args);
}

const STORAGE_KEY = 'all_layouts';

class Grid extends React.Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this._panes = new Map();
    let savedLayout = JSON.parse(localStorage.getItem(STORAGE_KEY));
    this._layouts = new Map(savedLayout);
  }

  saveLayout() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...this._layouts]));
  }

  generateLayout(map) {
    let out = [];
    let cnt = 0;
    for (let [path, data] of map.entries()) {
      out.push({
        i: path,
        x: Math.floor(cnt / 4) * 2,
        y: Infinity,
        w: 2,
        h: 2,
      });
      cnt += 1;
    }
    return out;
  }

  updateLayout(current, map) {
    // do not need to generate layout if there is nothing to display
    if (map.size == 0)
      return;
    if (!this._layouts.has(current)) {
      this._layouts.set(current, []);
    }
    let layout = this._layouts.get(current);
    let contained = new Set();
    for (let item of layout) {
      contained.add(item.i);
    }
    let cnt = 0;
    for (let [path, data] of map.entries()) {
      if (!contained.has(path)) {
        layout.push({
          i: path,
          x: Math.floor(cnt / 3) * 2,
          y: Infinity,
          w: 1,
          h: 3,
        });
        cnt += 1;
      }
    }
    this.saveLayout();
  }

  generateDOM(map) {
    this._panes.clear();
    let out = [];
    for (let [path, data] of map.entries()) {
      // immutablejs
      data = data.toObject();
      if (data.type == 'SCALAR' || data.type == 'STATS') {
        let statStyle = '';
        if (data.type == 'STATS')
          statStyle = 'STD';
        out.push(
          <div key={path}>
            <div className='draghandle'>{path}</div>
            <PlotPane path={path} data={data} statStyle={statStyle}
              ref={(node) => { this._panes.set(path, node); }}/>
          </div>
        );
      }
      else if (data.type == 'IMAGE') {
        out.push(
          <div key={path}>
            <div className='draghandle'>
              {path}
              <span style={ { marginLeft: '20px' } }>step: {data.step}</span>
            </div>
            <ImagePane path={path} data={data}
              ref={(node) => { this._panes.set(path, node); }}/>
          </div>
        );
      }
      else if (data.type == 'EPISODE') {
        out.push(
          <div key={path}>
            <div className='draghandle'>{path}</div>
            <EpisodePane path={path} data={data}
              ref={(node) => { this._panes.set(path, node); }}/>
          </div>
        );
      }
    }
    return out;
  }

  onLayoutChange = (layout) => {
    this._layouts.set(this.props.current, layout);
    this.saveLayout();
  }

  onResizeStop = (layout, olditem, item) => {
    let pane = this._panes.get(item.i);
    if (pane && pane.updateSize)
      pane.updateSize();
  }

  render() {
    let { current, map } = this.props;
    this.updateLayout(current, map);
    let layout = this._layouts.get(current);
    return (
      <ReactGridLayout
        layout={layout} cols={4} rowHeight={48} width={1000}
        autoSize={false}
        draggableHandle={'.draghandle'}
        onLayoutChange={this.onLayoutChange}
        onResizeStop={this.onResizeStop}
      >
        {this.generateDOM(map)}
      </ReactGridLayout>
    )
  }
}


const mapStateToProps = (state) => {
  // immutablejs
  let current = state.getIn(['view', 'showList', 0]);
  let map = state.getIn(['runs', 'data', current]);
  if (!map)
    map = new Map();
  return {
    current,
    map,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Grid);
