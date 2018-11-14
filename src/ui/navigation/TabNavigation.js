import React from 'react';
import PropTypes from 'prop-types';
import RouteDefinition from './RouteDefinition';

import { Tabs, TabMenu } from '@deskpro/apps-components';

export default class TabNavigation extends React.PureComponent
{
  static propTypes = {
    history   : PropTypes.object.isRequired,
    location  : PropTypes.object.isRequired,
    match     : PropTypes.object.isRequired,
    items     : PropTypes.arrayOf(PropTypes.instanceOf(RouteDefinition))
  };

  onTabChange = (tab) =>
  {
    this.props.history.push(tab);
    this.props.history.goForward();
  };

  render()
  {
    const { location } = this.props;

    return (
      <Tabs active={location.pathname} onChange={ this.onTabChange }>
        {this.props.items.map(this.renderTabLink)}
      </Tabs>
    );
  }

  /**
   * @param {Route} route
   * @return {*}
   */
  renderTabLink = (route) =>
  {
    return (
      <TabMenu name={route.path}>
        {route.label}
      </TabMenu>
    );
  }
}
