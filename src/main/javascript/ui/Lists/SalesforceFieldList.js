import React from 'react';
import PropTypes from 'prop-types';

import { Scrollbar, SelectableList, QueryableList, ListElement, Container } from '@deskpro/react-components';
import { SFObjectField } from '../../salesforce/models';

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
    console.log('fire on change')
    if (this.props.onSelect) {
      const item = this.props.items.filter(field => matchDom(field, event.currentTarget)).pop();
      if (item) {
        console.log('fire on change', item)
        this.props.onSelect(item);
      }
    }
  };

  render()
  {
    console.log('ListSalesforceField render', this.props);

    return (
      <Scrollbar>
        <QueryableList >
          {this.props.items.map(this.renderField)}
        </QueryableList>
      </Scrollbar>
    );
  }

  /**
   * @param {SFObjectField} field
   */
  renderField = (field) =>
  {
    return (
      <ListElement name={field.name} onDoubleClick={this.fireOnChange}>
        <b>{field.label}</b>
      </ListElement>
    );
  }

}