import React from 'react';
import PropTypes from 'prop-types';
import { sdkConnect } from '@deskpro/apps-sdk-react';

class PageError extends React.PureComponent {

  /**
   * Constructor
   *
   * @param {*} props
   */
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>App encountered an error</div>
    );
  }
}

export default sdkConnect(PageError);