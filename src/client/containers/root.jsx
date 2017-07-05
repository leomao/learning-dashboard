import React from 'react';

import 'dygraphs/dist/dygraph.min.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '../css/root.css';

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

export default Root;
