import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Panel, Button, Tabs, TabMenu } from '@deskpro/apps-components';

import { authenticate } from '../app/actions'
import { reduxConnector } from '../app/connectors'
import { logAndReject} from '../common/logging'

/**
 * Renders the authentication page.
 */
class PageAuthenticate extends React.Component
{
  static propTypes = {

    /**
     * The history object of the MemoryRouter
     */
    history: PropTypes.object.isRequired,

    /**
     * Instance of sdk ui.
     * @see https://deskpro.gitbooks.io/deskpro-apps/content/api/props/ui.html
     */
    ui:      PropTypes.object,

    /**
     * Authenticate the current user with Salesforce
     */
    authenticate: PropTypes.func.isRequired,
  };

  handleClick = () => {
    const { ui, dpapp } = this.props;

  this.props.authenticate()
      .then(() => {
        this.props.history.push('home');
        this.props.history.goForward();
      })
      .catch(logAndReject)
      .catch(ui.error)
    ;
  };

  /**
   * @returns {XML}
   */
  render() {
    return (
      <Panel title={"Authenticate"} border={"none"}>
        <p>
          You must authenticate with Salesforce before you continue.
        </p>

        <Button onClick={this.handleClick} className={"dp-Button--wide"}>
          Authenticate
        </Button>
      </Panel>
    );
  }
}

export { PageAuthenticate };
export default reduxConnector(PageAuthenticate, { authenticate });



