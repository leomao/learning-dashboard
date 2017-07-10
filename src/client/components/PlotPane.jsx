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
    this.updateSize();
  }

  createGraph(data) {
    const opts = {
      legend: 'always',
      labels: ['step', 'value'],
      labelsDiv: this.labelsDiv,
      showRoller: true,
      rollPeriod: 1,
      errorBars: this.props.statStyle == 'STD',
      customBars: this.props.statStyle == 'LMH',
      axes: {
        y: { axisLabelWidth: 20 },
      }
    };
    
    this.graph = new Dygraph(this.plot, data, opts);
    //if (opts.errorBars) {
      //opts.valueFormatter = (data) => {
        //console.log(data);

        //return 
      //}
    //}
  }

  transformData() {
    let { step, value } = this.props.data;
    // immutablejs
    value = value.toJS();
    let data = step.zip(value).toArray();
    return data;
  }

  updateSize() {
    // a dirty hack to wait the div resized
    setTimeout(() => this.graph.resize(), 200);
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
