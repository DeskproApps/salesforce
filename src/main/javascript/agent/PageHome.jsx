import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@deskpro/react-components';

import { readUserInfo } from '../app/actions'
import { default as connector} from '../app/connectors'

class PageHome extends React.Component
{
  static propTypes = {

    /**
     * Reads the salesforce user's info
     */
    readUserInfo: PropTypes.func.isRequired,
  };

  state = {
    user: null
  };

  /**
   * Invoked immediately after a component is mounted
   */
  componentDidMount() {
    const { ui } = this.props;

    this.props.readUserInfo()
      .then(user => this.setState({ user }))
      .catch(ui.error)
    ;

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

export { PageHome };
export default connector(PageHome, { readUserInfo });
