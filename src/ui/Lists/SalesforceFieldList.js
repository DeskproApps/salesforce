import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, List } from '@deskpro/apps-components';

import { SFObjectField } from '../../salesforce/apiObjects';

/**
 * @param {SFObjectField} field
 * @param {DomEventTarget} dom
 */
function matchDom(field, dom)
{
  return field.name === dom.getAttribute("name");
}

export default class SalesforceFieldList extends React.PureComponent
{
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.instanceOf(SFObjectField)).isRequired,
    onSelect: PropTypes.func
  };

  fireOnChange = (event) =>
  {
    if (this.props.onSelect) {
      const item = this.props.items.filter(field => matchDom(field, event.currentTarget)).pop();
      if (item) {
        this.props.onSelect(item);
      }
    }
  };

  render()
  {
    const { items } = this.props;
    console.warn(items);
    if (items) {
      return (
          <List >
            {this.props.items.map(this.renderField)}
          </List>
      );
    }
    return null;
  }

  /**
   * @param {SFObjectField} field
   */
  renderField = (field) =>
  {
    return (
      <ListItem name={field.name} onDoubleClick={this.fireOnChange}>
        <b>{field.label}</b>
      </ListItem>
    );
  }

}
