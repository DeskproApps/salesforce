import React from 'react';
import PropTypes from 'prop-types';
import { Container, Heading, Button } from '@deskpro/react-components';

import { authenticate } from '../app/actions'
import { default as connector} from '../app/connectors'

/**
 * Renders the authentication page.
 */
class PageAuthenticate extends React.Component
{
  static propTypes = {
    /**
     * Instance of sdk storage.
     * @see https://deskpro.gitbooks.io/deskpro-apps/content/api/props/storage.html
     */
    storage: PropTypes.object,
    /**
     * Instance of sdk oauth.
     * @see https://deskpro.gitbooks.io/deskpro-apps/content/api/props/oauth.html
     */
    oauth:   PropTypes.object,
    /**
     * Instance of sdk route.
     * @see https://deskpro.gitbooks.io/deskpro-apps/content/api/props/route.html
     */
    route:   PropTypes.object,
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
    const { route, ui, dpapp } = this.props;

  this.props.authenticate()
      .then(() => route.to('home'))
      .catch(ui.error)
    ;

  };

  /**
   * @returns {XML}
   */
  render() {
    return (
      <Container className="dp-github-container">
        <Heading size={3}>
          Authenticate
        </Heading>
        <p>
          You must authenticate with Salesforce before you continue.
        </p>
        <Button onClick={this.handleClick}>
          Authenticate
        </Button>
      </Container>
    );
  }
}

export { PageAuthenticate };
export default connector(PageAuthenticate, { authenticate });



