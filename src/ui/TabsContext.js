import React from 'react';
import PropTypes from 'prop-types';
import { Tabs, TabMenu } from '@deskpro/apps-components';
import { ContextDetails } from "../deskpro";

export class TabsContext extends React.PureComponent
{
  static propTypes = {
    onChange: PropTypes.func,
    active  : PropTypes.instanceOf(ContextDetails),
    items   : PropTypes.arrayOf(ContextDetails)
  };

  /**
   * @param {String} tab
   */
  onTabChange = (tab) =>
  {
    const context = this.props.items.filter(ctx => ctx.name === tab).pop();

    if (context) {
      this.props.onChange(context);
    } else {
      throw new Error('unknown tab: ' + tab)
    }
  };

  render()
  {
    const active = this.props.active ? this.props.active : this.props.items[0];
    const activeTab = active ? active.name : "";

    return (
      <Tabs active={activeTab} onChange={ this.onTabChange }>
        {this.props.items.map(this.renderTablink)}
      </Tabs>
    );
  }

  /**
   * @param {ContextDetails} ctx
   */
  renderTablink = (ctx) =>
  {
    return (
      <TabMenu name={ctx.name}>{ctx.label}</TabMenu>
    );
  }
}
