import React from 'react';
import PropTypes from 'prop-types';

import { DefaultUI } from './DefaultUI';

import {
  loadDescription
} from '../../app/actions';

import {reduxConnector} from "../../app/connectors";
import { RelatedObject, SFObject, SFObjectRelation } from "../../salesforce/apiObjects";

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

class Component extends React.Component
{
  static propTypes = {
    object          : PropTypes.instanceOf(SFObject),
    relations       : PropTypes.arrayOf(SFObjectRelation),
    relatedObjects  : PropTypes.arrayOf(RelatedObject),
    loadDescription : PropTypes.func.isRequired,
  };

  state = {
    object: null,
    fields: [],
  };

  onObjectSelected = (object) => {
    this.setState({
      object
    });

    const sfObject = new SFObject({name: object.childSObject, label: object.childSObject});
    console.warn(sfObject);
    this.props.loadDescription(sfObject).then(description => {
      this.setState({fields: description.fields});
    });
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
