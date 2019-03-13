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
  persistMappings,
  stopEditObjectView,
  startEditObjectView
} from "../../app/actions";

import { propertyList,contextList, objectViews, contextMappings, editObjectView } from "../../app/state";

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

const getInitialState = () => ({

  object: null,

  objectFields: [],

  objectRelations: [],

  objectViewableFields: [],

  objectsRelated: [],

  objectMappings: []

});

class Component extends React.Component
{
  static propTypes = {

    editObjectView: PropTypes.number,

    objectViews       : PropTypes.arrayOf(ObjectView),

    contextMappings   : PropTypes.arrayOf(ContextMapping),

    loadContexts          : PropTypes.func.isRequired,

    loadContextProperties : PropTypes.func.isRequired,

    replaceMappings: PropTypes.func.isRequired,

    removeMappings: PropTypes.func.isRequired,

    persistMappings : PropTypes.func.isRequired,

    loadDescription: PropTypes.func.isRequired,

    startEditObjectView: PropTypes.func.isRequired,

    stopEditObjectView: PropTypes.func.isRequired,

  };

  state = getInitialState();

  updateEditState()
  {
    const { editObjectView } = this.props;
    /** @type {ObjectView} **/
    const objectView = this.props.objectViews[editObjectView];
    const {object} = objectView;
    const objectViewableFields = objectView.fields;
    const objectsRelated = objectView.relatedObjects;
    const objectMappings = this.props.contextMappings.filter(mapping => hasMapping(object, mapping));

    this.props.loadDescription(object).then(description => {
      const state = {
        object,
        objectViewableFields,
        objectsRelated,
        objectMappings,

        objectFields: description.fields,
        objectRelations: description.relations
      };
      this.setState(state);
    });
  }

  componentDidMount() {
    const { editObjectView } = this.props;

    if (typeof editObjectView === "number") {
      this.updateEditState()
    }
  }

  componentDidUpdate(prevProps) {
    const { editObjectView } = this.props;

    if (typeof editObjectView === "number" && prevProps.editObjectView !== editObjectView) {
      this.updateEditState()
    }
  }

  /**
   * @param {SFObject} object
   * @param {Array<SFObjectField>} fields
   * @param {Array<RelatedObject>} relatedObjects
   * @param {Array<ContextMapping>} mappings
   */
  onChange = ({ object, fields, relatedObjects, mappings }) =>
  {
    this.setState({ object, objectViewableFields: fields, objectMappings: mappings, objectsRelated: relatedObjects })
  };

  onRemove = (object) =>
  {
    this.props.removeMappings(object).then(() => this.props.persistMappings());
  };

  onCancelEdit = (object) =>
  {
    this.props.stopEditObjectView().then(() => {
      this.setState(getInitialState())
    });
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
      objectRelations       = {this.state.objectRelations}
      objectViewableFields  = {this.state.objectViewableFields}
      objectsRelated        = {this.state.objectsRelated}
      objectMappings        = {this.state.objectMappings}

      loadContexts          = { this.props.loadContexts }
      loadContextProperties = { this.props.loadContextProperties }

      onChange      = { this.onChange }
      onRemove      = { this.onRemove }
      onEdit        = { this.props.startEditObjectView }
      onCancelEdit  = { this.onCancelEdit }
      onSave        = { this.onSave }
    />);
  }
}

export { Component }

export default reduxConnector(
  Component,
  {
    loadDescription, persistMappings, removeMappings, replaceMappings, loadContexts, loadContextProperties, stopEditObjectView, startEditObjectView
  },
  {
    contexts: contextList,
    contextProperties: propertyList,
    objectViews,
    contextMappings,
    editObjectView
  }
);
