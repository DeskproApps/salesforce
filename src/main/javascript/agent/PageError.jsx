import React from 'react';
import PropTypes from 'prop-types';
import { default as connector} from '../app/connectors'

class PageError extends React.PureComponent
{

  static propTypes = {
    /**
     * Instance of sdk storage.
     * @see https://deskpro.gitbooks.io/deskpro-apps/content/api/props/storage.html
     */
    error: PropTypes.object,
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
    console.log('the error', this.props.route.params.error);

    return (
      <div>App encountered an error</div>
    );
  }
}

export { PageError };
export default connector(PageError);