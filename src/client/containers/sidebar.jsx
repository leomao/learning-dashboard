import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getRun } from '../socket';

const generateRunList = (runNames, current, show, filter) => {
  let re = new RegExp(filter);
  let testfunc = (name) => re.test(name);
  return runNames.filter(testfunc).map((runName, index) => {
    const klass = classNames({
      active: (runName == current),
    });
    return (
      <div key={index} onClick={() => show(runName)} className={klass}>
        {runName}
      </div>
    );
  });
}

class Sidebar extends React.Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
    };

    this.updateFilter = () => {
      let text = this.input.value;
      this.setState({ filterText: text });
    }
  }

  render() {
    let { runNames, current, show } = this.props;
    return (
      <div id='sidebar'>
        <input type='text' ref={ node => { this.input = node; } }
          onChange={ () => this.updateFilter() } />
          {generateRunList(runNames, current, show, this.state.filterText)}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  let current = state.getIn(['view', 'showList', 0]);
  let runNames = state.getIn(['runs', 'names']);
  return {
    runNames,
    current,
  };
};

const mapDispatchToProps = (dispatch) => {
  const show = (runName) => {
    getRun(runName).then((data) => {
      dispatch({ type: 'GET_RUN', runName, data });
      dispatch({ type: 'SHOW', runName });
    });
  };
  return {
    show,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Sidebar);
