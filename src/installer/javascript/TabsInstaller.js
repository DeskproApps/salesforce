import React from 'react';
import PropTypes from 'prop-types';
import {Routes} from "./Routes";
import { Tabs, TabLink, Container } from '@deskpro/react-components';

export class TabsInstaller extends React.PureComponent
{
  onTabChange = (tab) =>
  {
    this.props.history.push(tab);
    this.props.history.goForward();
  };

  render()
  {
    return (
      <Tabs active={location.pathname} onChange={ this.onTabChange }>
        <TabLink name={Routes.connection}>
          Connection Settings
        </TabLink>
        <TabLink name={Routes.mapping}>
          Add Salesforce Object
        </TabLink>
      </Tabs>
    );
  }
}