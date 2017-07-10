import React from 'react';

import 'dygraphs/dist/dygraph.min.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../css/root.css';

//import ReactTooltip from 'react-tooltip';
import Sidebar from './sidebar';
import Grid from './grid';

const Root = () => (
  <div id='outer'>
    <Sidebar />
    <div id='panel'>
      <Grid />
    </div>
  </div>
);
    //<ReactTooltip id='legend-container'>
      //<div id='plot-legend'>
      //</div>
    //</ReactTooltip>

export default Root;
