import React from 'react';
import PropTypes from 'prop-types';
import { sdkConnect } from '@deskpro/apps-sdk-react';
import { Loader } from '@deskpro/react-components';

import { getReadUserInfo } from '../salesforce/api';
import { fetch } from '../salesforce/http';

class PageHome extends React.Component
{
  /**
   * Constructor
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);

    this.state = {
      user: null
    };
  }

  /**
   * Invoked immediately after a component is mounted
   */
  componentDidMount() {
    const { dpapp, ui } = this.props;

    fetch(dpapp, getReadUserInfo)
      .then(user => {
        this.setState({ user })
      })
      .catch(ui.error);
  }

  render() {

    const { user } = this.state;
    if (user) {
      return (
        <div className="dp-text-center">Hello {user.name}</div>
      );
    }

    return(
      <div className="dp-text-center">
        <Loader />
      </div>
    )
  }
}

export default sdkConnect(PageHome);

