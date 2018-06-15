import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux'

import { default as AppAdmin, PageConnectionSettings } from '@app/main/javascript/admin'
import { default as configureStore } from '@app/main/javascript/app/store'


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
    error:         null,
    store:         null
  };

  componentDidMount()
  {
    configureStore(this.props.dpapp).then(store => this.setState({ store }));
  }

  renderSettingsForm = () =>
  {
    return (<PageConnectionSettings {...this.props} />);
  };

  render()
  {
    if (this.state.store) {
      return (
        <Provider store={this.state.store}>
          <AppAdmin dpapp={this.props.dpapp} renderSettingsForm={this.renderSettingsForm}/>
        </Provider>
      );
    }

    return (<div/>)

  }
}

export default App;