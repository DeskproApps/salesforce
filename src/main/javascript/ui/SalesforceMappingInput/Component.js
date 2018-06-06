import React from 'react';
import PropTypes from 'prop-types';
import { ContextMapping } from "../../mapping";

import { SFObject, SFObjectField } from "../../salesforce/models";
import { ContextDetails, ContextPropertyList } from "../../deskpro";
import { DefaultUI } from "./DefaultUI";

/**
 * @param {Object} props
 * @return {function}
 */
function chooseUI(props)
{
  const { ui } = props;
  if (typeof ui === 'function') {
    return ui;
  }

  return DefaultUI;
}

/**
 * @param {ContextMapping} left
 * @param {ContextMapping} right
 */
const equalMappings = (left, right) => left.equals(right);

/**
 * @param {SFObjectField} left
 * @param {SFObjectField} right
 */
const equalFields = (left, right) => left.name === right.name;

function indexOf(item, list, equals)
{
  let index = -1;
  for (const listItem of list) {
    if (equals(item, listItem)) {
      return index + 1
    }
  }

  return index;
}

/**
 * @param {Array} left
 * @param {Array} right
 * @param {Function} equals
 * @return {Array}
 */
function diff(left, right, equals)
{
  const diff = [];

  for (const leftItem of left) {
    for (const rightItem of right) {
      if (!equals(leftItem, rightItem)) {
        diff.push(leftItem);
        break;
      }
    }
  }

  return diff;
}

/**
 *
 * @param {*} item
 * @param {Array<*>} list
 * @param {Function} itemEqualityCheck
 * @return {Array<*>|null}
 */
function addListItem (item, list, itemEqualityCheck)
{
  const wasAdded = indexOf(item, list, itemEqualityCheck) !== -1;
  if (wasAdded) {
    return null;
  }

  return list.concat([item])
}

/**
 *
 * @param {*} item
 * @param {Array<*>} list
 * @param {Function} itemEqualityCheck
 * @return {Array<*>|null}
 */
function removeListItem (item, list, itemEqualityCheck)
{
  const wasAdded = indexOf(item, list, itemEqualityCheck) !== -1;
  if (wasAdded) {
    return diff(list, [item], itemEqualityCheck)
  }
  return null;
}


export class Component extends React.Component
{
  static propTypes = {

    ui                : PropTypes.func,

    object            : PropTypes.arrayOf(SFObject),
    fields            : PropTypes.arrayOf(SFObjectField),
    fieldsViewable    : PropTypes.arrayOf(SFObjectField),
    mappings          : PropTypes.arrayOf(ContextMapping),

    loadContexts          : PropTypes.func,
    loadContextProperties : PropTypes.func,

    onChange              : PropTypes.func
  };

  state = {

    context: null,

    contexts: [],

    contextProperties: []

  };

  componentDidMount()
  {
    const {loadContexts, loadContextProperties} = this.props;

    loadContexts().then(contexts => {

      if (contexts.length === 0) {
        return Promise.resolve({})
      }

      return loadContextProperties(contexts[0])
        .then(contextProperties => ({ context: contexts[0], contexts, contextProperties }))
        .then(state => {
          this.setState(state);
          return state;
        })

    })
  }

  /**
   * @param {ContextDetails}  context
   */
  showContextProperties = (context) =>
  {
    this.props.loadContextProperties(context)
      .then(contextProperties => ({ context, contextProperties }))
      .then(state => {
        this.setState(state);
        return state;
      })
  };

  /**
   * @param {SFObjectField} item
   * @param {string} status
   */
  changeViewableStatus = (item, status) =>
  {
    console.log('changing viewable stateus', item, status)

    if (status === 'viewable') {
      this.addFieldViewable(item);
    }

    if (status === 'not-viewable') {
      this.removeFieldViewable(item);
    }
  };

  /**
   * @param {SFObjectField} item
   */
  addFieldViewable = (item) =>
  {
    const fieldsViewable = addListItem(item, this.props.fieldsViewable, equalFields);
    if (fieldsViewable) {
      this.props.onChange({ object: this.props.object, fields: fieldsViewable, mappings: this.props.mappings });
    }
  };

  /**
   * @param {SFObjectField} item
   */
  removeFieldViewable = (item) =>
  {
    const fieldsViewable = removeListItem(item, this.props.fieldsViewable, equalFields);
    if (fieldsViewable) {
      this.props.onChange({ object: this.props.object, fields: fieldsViewable, mappings: this.props.mappings });
    }
  };


  /**
   * @param {ContextMapping} item
   */
  addContextMapping = (item) =>
  {
    const mappings = addListItem(item, this.props.mappings, equalMappings);
    if (mappings) {
      this.props.onChange({ object: this.props.object, fields: this.props.fieldsViewable, mappings });
    }
  };

  /**
   * @param {ContextMapping} item
   */
  removeContextMapping = (item) =>
  {
    const mappings = removeListItem(item, this.props.mappings, equalMappings);
    if (mappings) {
      this.props.onChange({ object: this.props.object, fields: this.props.fieldsViewable, mappings });
    }
  };

  render()
  {
    console.log('these are my props SalesforceMappingInput ', this.props);

    const UI = chooseUI(this.props);
    return (<UI
      object                  = {this.props.object}
      fields                  = {this.props.fields}
      fieldsViewable          = {this.props.fieldsViewable}
      changeViewableStatus    = {this.changeViewableStatus}

      context           = { this.state.context }
      contextProperties = { this.state.contextProperties}
      contexts          = { this.state.contexts}
      onContextChanged  = {this.showContextProperties}

      mappings        = { this.props.mappings }
      onMappingAdd    = {this.addContextMapping}
      onMappingRemove = {this.removeContextMapping}
    />);
  }
}