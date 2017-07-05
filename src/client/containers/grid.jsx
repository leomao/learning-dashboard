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

class Grid extends React.Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this._panes = new Map();
    this._layouts = new Map();
  }

  generateLayout(map) {
    let out = [];
    let cnt = 0;
    for (let [path, data] of map.entries()) {
      out.push({
        i: path,
        x: Math.floor(cnt / 4) * 2,
        y: (cnt % 4) * 2,
        w: 2,
        h: 2,
      });
      cnt += 1;
    }
    return out;
  }

  generateDOM(map) {
    this._panes.clear();
    let out = [];
    for (let [path, data] of map.entries()) {
      // immutablejs
      data = data.toObject();
      if (data.type == 'SCALAR_PLOT') {
        out.push(
          <div key={path}>
            <div className='draghandle'>{path}</div>
            <PlotPane path={path} data={data}
              ref={(node) => { this._panes.set(path, node); }}/>
          </div>
        );
      }
      else if (data.type == 'STATS_PLOT') {
        out.push(
          <div key={path}>
            <div className='draghandle'>{path}</div>
            <PlotPane path={path} data={data} statStyle={'STD'}
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
  }

  onResizeStop = (layout, olditem, item) => {
    let pane = this._panes.get(item.i);
    if (pane && pane.updateSize)
      pane.updateSize();
  }

  render() {
    let { current, map } = this.props;
    if (!this._layouts.has(current)) {
      this._layouts.set(current, this.generateLayout(map));
    }
    let layout = this._layouts.get(current);
    return (
      <ReactGridLayout
        layout={layout} cols={12} rowHeight={80} width={1200}
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
