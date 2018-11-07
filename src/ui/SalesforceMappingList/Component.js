import React from 'react';
import PropTypes from 'prop-types';
import {ObjectView, ContextMapping} from "../../mapping";
import { hasMapping, hasView } from "../../mapping/predicates"

import { DefaultUI } from './DefaultUI';
import {SFObject, SFObjectField} from "../../salesforce/apiObjects";

import {
  loadDescription,
  removeMappings,
  replaceMappings,
  loadContexts,
  loadContextProperties,
  persistMappings
} from "../../app/actions";

import { propertyList,contextList, objectViews, contextMappings } from "../../app/state";

import {reduxConnector} from "../../app/connectors";

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

    objectViews       : PropTypes.arrayOf(ObjectView),

    contextMappings   : PropTypes.arrayOf(ContextMapping),

    loadContexts          : PropTypes.func.isRequired,

    loadContextProperties : PropTypes.func.isRequired,

    replaceMappings: PropTypes.func.isRequired,

    removeMappings: PropTypes.func.isRequired,

    persistMappings : PropTypes.func.isRequired,

    loadDescription: PropTypes.func.isRequired

  };

  state = {

    object: null,

    objectFields: [],

    objectViewableFields: [],

    objectsRelated: [],

    objectMappings: []

  };

  /**
   * @param {SFObject} object
   * @param {Array<SFObjectField>} fields
   * @param {Array<ContextMapping>} mappings
   */
  onChange = ({ object, fields, mappings }) =>
  {
    this.setState({ object, objectViewableFields: fields, objectMappings: mappings })
  };

  onRemove = (object) =>
  {
    this.props.removeMappings(object).then(() => this.props.persistMappings());
  };

  onEdit = (object) =>
  {
    /** @type {ObjectView} **/
    const objectView = this.props.objectViews.filter(view => hasView(object, view)).pop();
    const objectViewableFields = objectView ? objectView.fields : [];
    const objectMappings = this.props.contextMappings.filter(mapping => hasMapping(object, mapping));

    this.props.loadDescription(object).then(description => {
      this.setState({object, objectFields: description.fields, objectViewableFields,  objectMappings})
    });
  };

  onCancelEdit = (object) =>
  {
    this.setState({ object : null, objectViewableFields: [], objectMappings: [] })
  };

  onSave = () =>
  {
    const { object, objectViewableFields: fields, objectsRelated: relatedObjects, objectMappings: mappings} = this.state;

    if (object && fields && fields.length && mappings && mappings.length) {
      this.props.replaceMappings(object, new ObjectView({object, fields, relatedObjects}), mappings)
        .then(() => this.props.persistMappings())
      ;
    }
  };

  render()
  {
    const UI = chooseUI(this.props);
    return (<UI
      objectViews           = {this.props.objectViews}
      contextMappings       = {this.props.contextMappings}

      object                = {this.state.object}
      objectFields          = {this.state.objectFields}
      objectViewableFields  = {this.state.objectViewableFields}
      objectMappings        = {this.state.objectMappings}

      loadContexts          = { this.props.loadContexts }
      loadContextProperties = { this.props.loadContextProperties }

      onChange      = { this.onChange }
      onRemove      = { this.onRemove }
      onEdit        = { this.onEdit }
      onCancelEdit  = { this.onCancelEdit }
      onSave        = { this.onSave }
    />);
  }
}

export { Component }

export default reduxConnector(
  Component,
  {
    loadDescription, persistMappings, removeMappings, replaceMappings, loadContexts, loadContextProperties
  },
  {
    contexts: contextList,
    contextProperties: propertyList,
    objectViews,
    contextMappings
  }
);
