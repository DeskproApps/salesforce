import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux'

import { default as Admin } from '@app/main/javascript/Admin'
import { FormConnectionSettings } from '@app/main/javascript/ui'
import { default as configureStore } from '@app/main/javascript/store'


let store = null;

function createStore(dpApp) {
  if (store) {
    return store;
  }

  store = configureStore(dpApp);
  return store;
}


class App extends React.Component
{
  static propTypes = {
    finishInstall: PropTypes.func.isRequired,
    settings:      PropTypes.array.isRequired,
    values:        PropTypes.array.isRequired,
    settingsForm:  PropTypes.func.isRequired,
    dpapp:         PropTypes.object.isRequired
  };

  state = {
    oauthSettings: null,
    error:         null
  };

  renderSettingsForm = () =>
  {
    return (<FormConnectionSettings {...this.props} />);
  };

  render()
  {
    const store = createStore(this.props.dpapp);

    return (
      <Provider store={store}>
        <Admin dpapp={this.props.dpapp} renderSettingsForm={this.renderSettingsForm}/>
      </Provider>
    );
  }
}

export default App;