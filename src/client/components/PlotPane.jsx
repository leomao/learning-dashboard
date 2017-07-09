import React from 'react';
import Dygraph from 'dygraphs';

class PlotPane extends React.Component {
  componentDidMount() {
    let data = this.transformData();
    this.createGraph(data);
    this.updateSize();
  }

  componentDidUpdate(prevProps, prevState) {
    let data = this.transformData();
    if (this.graph)
        this.graph.updateOptions({ 'file': data });
    else
      this.createGraph(data);
  }

  createGraph(data) {
    const opts = {
      legend: 'always',
      labels: ['X', 'Y'],
      labelsDiv: this.labelsDiv,
      showRoller: true,
      rollPeriod: 1,
      errorBars: this.props.statStyle == 'STD',
      customBars: this.props.statStyle == 'LMH',
    };
    
    //if (opts.errorBars) {
      //opts.valueFormatter = (data) => {
        //console.log(data);

        //return 
      //}
    //}

    this.graph = new Dygraph(this.plot, data, opts);
  }

  transformData() {
    let { x, y } = this.props.data;
    // immutablejs
    y = y.toJS();
    let data = x.zip(y).toArray();
    return data;
  }

  updateSize() {
    // a dirty hack to wait the div resized
    setTimeout(() => this.graph.resize(), 100);
  }

  render() {
    return (
      <div className='pane plot'>
        <div ref={(node) => { this.labelsDiv = node; }} />
        <div className='plot-container' ref={(node) => { this.plot = node; }} />
      </div>
    )
  }
}

export default PlotPane;
