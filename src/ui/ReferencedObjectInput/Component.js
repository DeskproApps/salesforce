import React from 'react';
import PropTypes from 'prop-types';

import { DefaultUI } from './DefaultUI';

import {
  loadDescription
} from '../../app/actions';

import {reduxConnector} from "../../app/connectors";
import {
  diff,
  equalFields,
  indexOf,
  ReferencedObject,
  SFObject,
  SFObjectField,
} from "../../salesforce/apiObjects";

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

const equalObject = (left, right) => left.props.childSObject === right.props.childSObject;

/**
 *
 * @param {*} item
 * @param {*} referencedObject
 * @param {Array<*>} list
 * @return {Array<*>|null}
 */
function addListItem (item, referencedObject, list)
{
  let objectIndex = indexOf(referencedObject, list, equalObject);
  if (objectIndex === -1) {
    referencedObject.addField(item);
    return list.concat([referencedObject]);
  }

  const fieldPresent = indexOf(item, list[objectIndex].props.fields, equalFields) !== -1;
  if (fieldPresent) {
    return null;
  }

  list[objectIndex].addField(item);
  return list.concat([]);
}

/**
 *
 * @param {*} item
 * @param {*} referencedObject
 * @param {Array<*>} list
 * @return {Array<*>|null}
 */
function removeListItem (item, referencedObject, list)
{
  let objectIndex = indexOf(referencedObject, list, equalObject);
  if (objectIndex === -1) {
    return null;
  }

  const wasAdded = indexOf(item, list[objectIndex].fields, equalFields) !== -1;
  if (wasAdded) {
    list[objectIndex].fields = diff(list[objectIndex].fields, [item], equalFields);
    if (list[objectIndex].fields.length === 0) {
      return diff(list, [referencedObject], equalObject);
    }
    return list.concat([]);
  }
  return null;
}

class Component extends React.Component
{
  static propTypes = {
    object            : PropTypes.instanceOf(SFObject),
    references        : PropTypes.arrayOf(SFObjectField),
    referencedObjects : PropTypes.arrayOf(ReferencedObject),
    loadDescription   : PropTypes.func.isRequired,
    onReferenceChange : PropTypes.func.isRequired,
  };

  state = {
    object: null,
    fields: [],
  };

  onObjectSelected = (object) => {
    this.setState({
      object
    });

    if (object && object.props && object.props.referenceTo) {
      const sfObject = new SFObject({name: object.props.referenceTo[0], label: object.props.referenceTo[0]});
      this.props.loadDescription(sfObject).then(description => {
        this.setState({fields: description.fields});
      });
    } else {
      this.setState({fields: []});
    }
  };

  /**
   * @param {SFObjectField} item
   * @param {SFObjectRelation} relation
   */
  addFieldViewable = (item, relation) =>
  {
    const referencedObject = ReferencedObject.instance(relation.props);
    const referencedObjects = addListItem(item, referencedObject, this.props.referencedObjects);
    if (referencedObjects) {
      this.props.onReferenceChange(referencedObjects);
    }
  };

  /**
   * @param {SFObjectField} item
   * @param {SFObjectRelation} relation
   */
  removeFieldViewable = (item, relation) =>
  {
    const referencedObject = ReferencedObject.instance(relation.props);
    const referencedObjects = removeListItem(item, referencedObject, this.props.referencedObjects);
    if (referencedObjects) {
      this.props.onReferenceChange(referencedObjects);
    }
  };

  /**
   * @param {SFObjectField} item
   * @param {SFObjectRelation} referencedObject
   * @param {string} status
   */
  changeViewableStatus = (item, referencedObject, status) =>
  {
    if (status === 'viewable') {
      this.addFieldViewable(item, referencedObject);
    }

    if (status === 'not-viewable') {
      this.removeFieldViewable(item, referencedObject);
    }
  };

  render() {
    const UI = chooseUI(this.props);
    return (<UI
      object={this.props.object}
      references={this.props.references}
      referencedObjects={this.props.referencedObjects}
      selectedObject={this.state.object}
      selectedObjectFields={this.state.fields}

      onObjectSelected={this.onObjectSelected}
      changeViewableStatus={this.changeViewableStatus}
    />);
  }
}

export { Component }

export default reduxConnector(
  Component,
  {
    loadDescription
  }
);
