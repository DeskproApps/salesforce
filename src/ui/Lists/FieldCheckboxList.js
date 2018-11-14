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
  return field.name === dom.name;
}

export default class FieldCheckboxList extends React.PureComponent
{
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.instanceOf(SFObjectField)).isRequired,
    value: PropTypes.instanceOf(SFObjectField),
    onSelect: PropTypes.func
  };

  fireOnChange = (event) =>
  {
    if (this.props.onSelect) {
      const item = this.props.items.filter(field => matchDom(field, event)).pop();
      this.props.onSelect(item);
    }
  };

  render()
  {
    return (
        <List >
          {this.props.items.map(this.renderField)}
        </List>
    );
  }

  /**
   * @param {SFObjectField} item
   */
  renderField = (item) =>
  {
    const checked = this.props.value && item.name === this.props.value.name;

    return (
      <ListItem name={item.name} onDoubleClick={this.fireOnChange}>
        <input type={"checkbox"} checked={checked} id={`checkbox-${item.name}`}/>
        <label for={`checkbox-${item.name}`}><b>{item.label}</b></label>
      </ListItem>
    );
  }

}
