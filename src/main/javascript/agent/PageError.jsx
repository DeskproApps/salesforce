import React from 'react';
import PropTypes from 'prop-types';
import { default as connector} from '../app/connectors'

class PageError extends React.PureComponent
{

  static propTypes = {

    /**
     * The history object of the MemoryRouter
     */
    history: PropTypes.object.isRequired,

    /**
     * The location object of the MemoryRouter
     */
    location: PropTypes.object.isRequired,

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


  render()
  {
    return (
      <div>App encountered an error</div>
    );
  }
}

export { PageError };
export default connector(PageError);