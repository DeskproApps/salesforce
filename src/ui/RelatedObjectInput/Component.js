import React from 'react';
import PropTypes from 'prop-types';

import { DefaultUI } from './DefaultUI';

import {
  loadDescription
} from '../../app/actions';

import {reduxConnector} from "../../app/connectors";
import { diff, equalFields, indexOf, RelatedObject, SFObject, SFObjectRelation } from "../../salesforce/apiObjects";

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
 * @param {*} relatedObject
 * @param {Array<*>} list
 * @return {Array<*>|null}
 */
function addListItem (item, relatedObject, list)
{
  let objectIndex = indexOf(relatedObject, list, equalObject);
  if (objectIndex === -1) {
    relatedObject.addField(item);
    return list.concat([relatedObject]);
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
 * @param {*} relatedObject
 * @param {Array<*>} list
 * @return {Array<*>|null}
 */
function removeListItem (item, relatedObject, list)
{
  let objectIndex = indexOf(relatedObject, list, equalObject);
  if (objectIndex === -1) {
    return null;
  }

  const wasAdded = indexOf(item, list[objectIndex].fields, equalFields) !== -1;
  if (wasAdded) {
    list[objectIndex].fields = diff(list[objectIndex].fields, [item], equalFields);
    if (list[objectIndex].fields.length === 0) {
      return diff(list, [relatedObject], equalObject);
    }
    return list.concat([]);
  }
  return null;
}

class Component extends React.Component
{
  static propTypes = {
    object           : PropTypes.instanceOf(SFObject),
    relations        : PropTypes.arrayOf(SFObjectRelation),
    relatedObjects   : PropTypes.arrayOf(RelatedObject),
    loadDescription  : PropTypes.func.isRequired,
    onRelationChange : PropTypes.func.isRequired,
  };

  state = {
    object: null,
    fields: [],
  };

  onObjectSelected = (object) => {
    this.setState({
      object
    });

    if (object) {
      const sfObject = new SFObject({name: object.childSObject, label: object.childSObject});
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
    const relatedObject = RelatedObject.instance(relation.props);
    const relatedObjects = addListItem(item, relatedObject, this.props.relatedObjects);
    if (relatedObjects) {
      this.props.onRelationChange(relatedObjects);
    }
  };

  /**
   * @param {SFObjectField} item
   * @param {SFObjectRelation} relation
   */
  removeFieldViewable = (item, relation) =>
  {
    const relatedObject = RelatedObject.instance(relation.props);
    const relatedObjects = removeListItem(item, relatedObject, this.props.relatedObjects);
    if (relatedObjects) {
      this.props.onRelationChange(relatedObjects);
    }
  };

  /**
   * @param {SFObjectField} item
   * @param {SFObjectRelation} relatedObject
   * @param {string} status
   */
  changeViewableStatus = (item, relatedObject, status) =>
  {
    if (status === 'viewable') {
      this.addFieldViewable(item, relatedObject);
    }

    if (status === 'not-viewable') {
      this.removeFieldViewable(item, relatedObject);
    }
  };

  render() {
    const UI = chooseUI(this.props);
    return (<UI
      object={this.props.object}
      relations={this.props.relations}
      relatedObjects={this.props.relatedObjects}
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
