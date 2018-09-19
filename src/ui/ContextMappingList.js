import React from 'react';
import PropTypes from 'prop-types';

import { ListItem, List } from '@deskpro/apps-components';

import { ContextDetails } from '../deskpro';
import { ContextMapping } from '../mapping';

/**
 * @param {ContextMapping} item
 * @param {DomEventTarget} dom
 */
function matchDom(item, dom)
{
  return toUnique(item) === dom.getAttribute("name");
}

/**
 * @param {ContextMapping} mapping
 * @return {string}
 */
function toUnique(mapping)
{
  return [mapping.object.name, mapping.field.name, mapping.context.name, mapping.property.hashCode() ].join('-');
}

/**
 * @param {ContextMapping} mapping
 * @param {ContextDetails} context
 * @return {boolean}
 */
function isSameContext(mapping, context)
{
  return mapping.context.name === context.name;
}

export default class ContextMappingList extends React.PureComponent
{
  static propTypes = {
    context   : PropTypes.instanceOf(ContextDetails).isRequired,
    items     : PropTypes.arrayOf(ContextMapping).isRequired,
    onRemove  : PropTypes.func
  };

  fireOnRemove = (event) =>
  {
    if (this.props.onRemove) {
       const item = this.props.items.filter(field => matchDom(field, event.currentTarget)).pop();
      if (item) {
        this.props.onRemove(item);
      }
    }
  };

  render()
  {
    return (
          <List >
            {this.props.items.filter(mapping => isSameContext(mapping, this.props.context)).map(this.renderListItem)}
          </List>
    );
  }

  /**
   * @param {ContextMapping}  mapping
   * @returns {*}
   */
  renderListItem = (mapping) =>
  {
    return (
      <ListItem name={ toUnique(mapping) } onDoubleClick={this.fireOnRemove}>
        <b>{ mapping.field.label }</b> ---> <b>{mapping.property.label}</b>
      </ListItem>
    );
  }

}
