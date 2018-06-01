import React from 'react';
import PropTypes from 'prop-types';
import { UI } from './UI';

class App extends React.Component
{
  static propTypes = {
    finishInstall: PropTypes.func.isRequired,
    settings:      PropTypes.array.isRequired,
    values:        PropTypes.array.isRequired,
    settingsForm:  PropTypes.func.isRequired,
    dpapp:         PropTypes.object.isRequired
  };

  constructor() {
    super();
    this.state = {
      oauthSettings: null,
      error:         null
    };
  }
  render()
  {
    return (<UI {...this.props}/>)
  }
}

export default App;