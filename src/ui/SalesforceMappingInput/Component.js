import React from 'react';
import PropTypes from 'prop-types';
import { ContextMapping } from "../../mapping";

import {
  diff,
  equalFields,
  indexOf,
  ReferencedObject,
  RelatedObject,
  SFObject,
  SFObjectField,
  SFObjectRelation
} from "../../salesforce/apiObjects";
import { ContextDetails } from "../../deskpro";
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
    relations         : PropTypes.arrayOf(SFObjectRelation),
    relatedObjects    : PropTypes.arrayOf(RelatedObject),
    referencedObjects : PropTypes.arrayOf(ReferencedObject),
    mappings          : PropTypes.arrayOf(ContextMapping),

    loadContexts          : PropTypes.func,
    loadContextProperties : PropTypes.func,

    onChange              : PropTypes.func
  };

  state = {
    context           : null,
    contexts          : [],
    contextProperties : []
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
    if (status === 'viewable') {
      this.addFieldViewable(item);
    }

    if (status === 'not-viewable') {
      this.removeFieldViewable(item);
    }
  };

  getObjectValues = () => {
    const { object, fieldsViewable, relatedObjects, referencedObjects, mappings } = this.props;

    return { object, fields: fieldsViewable, relatedObjects, referencedObjects, mappings };
  };

  /**
   * @param {SFObjectField} item
   */
  addFieldViewable = (item) =>
  {
    const fieldsViewable = addListItem(item, this.props.fieldsViewable, equalFields);
    if (fieldsViewable) {
      this.props.onChange({ ...this.getObjectValues(), fields: fieldsViewable });
    }
  };

  /**
   * @param {SFObjectField} item
   */
  removeFieldViewable = (item) =>
  {
    const fieldsViewable = removeListItem(item, this.props.fieldsViewable, equalFields);
    if (fieldsViewable) {
      this.props.onChange({ ...this.getObjectValues(), fields: fieldsViewable });
    }
  };


  /**
   * @param {ContextMapping} item
   */
  addContextMapping = (item) =>
  {
    const mappings = addListItem(item, this.props.mappings, equalMappings);
    if (mappings) {
      this.props.onChange({ ...this.getObjectValues(), mappings });
    }
  };

  /**
   * @param {ContextMapping} item
   */
  removeContextMapping = (item) =>
  {
    const mappings = removeListItem(item, this.props.mappings, equalMappings);
    if (mappings) {
      this.props.onChange({ ...this.getObjectValues(), mappings });
    }
  };

  onRelationChange = (relatedObjects) =>
  {
    if (relatedObjects) {
      this.props.onChange({ ...this.getObjectValues(), relatedObjects });
    }
  };

  onReferenceChange = (referencedObjects) =>
  {
    if (referencedObjects) {
      this.props.onChange({ ...this.getObjectValues(), referencedObjects });
    }
  };

  render()
  {
    const UI = chooseUI(this.props);
    return (<UI
      object                  = {this.props.object}
      fields                  = {this.props.fields}
      fieldsViewable          = {this.props.fieldsViewable}
      relations               = {this.props.relations}
      referencedObjects       = {this.props.referencedObjects}
      relatedObjects          = {this.props.relatedObjects}
      changeViewableStatus    = {this.changeViewableStatus}

      context           = { this.state.context }
      contextProperties = { this.state.contextProperties}
      contexts          = { this.state.contexts}
      onContextChanged  = {this.showContextProperties}

      mappings          = { this.props.mappings }
      onMappingAdd      = {this.addContextMapping}
      onMappingRemove   = {this.removeContextMapping}
      onRelationChange  = {this.onRelationChange}
      onReferenceChange = {this.onReferenceChange}
    />);
  }
}
