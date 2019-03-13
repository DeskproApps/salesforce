import React from 'react';
import PropTypes from 'prop-types';

import { SFObjectField, SFObject, RelatedObject } from '../../salesforce/apiObjects';
import {ContextMapping, ObjectView} from '../../mapping';
import { DefaultUI } from './DefaultUI';

import {
  persistMappings,
  addMappings,
  loadObjects,
  loadDescription,
  loadContexts,
  loadContextProperties,
  startEditObjectView
} from "../../app/actions";

import {reduxConnector} from "../../app/connectors";
import {contextMappings, objectViews} from "../../app/state";

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

    ui           : PropTypes.func,

    loadContexts : PropTypes.func.isRequired,

    loadContextProperties : PropTypes.func.isRequired,

    loadObjects     : PropTypes.func.isRequired,

    loadDescription : PropTypes.func.isRequired,

    addMappings     : PropTypes.func.isRequired,

    persistMappings : PropTypes.func.isRequired,

    startEditObjectView : PropTypes.func.isRequired,

    contextMappings   : PropTypes.arrayOf(ContextMapping),

    objectViews       : PropTypes.arrayOf(ObjectView),

    history   : PropTypes.object.isRequired,
  };

  state = {

    object: null,

    objectFields: [],

    objectRelations: [],

    fields: [],

    relatedObjects: [],

    mappings: [],

    objectHasBeenMapped: false
  };

  reset = () => {
    this.setState({

      object: null,

      objectHasBeenMapped: false,

      objectFields: [],

      objectRelations: [],

      fields: [],

      relatedObjects: [],

      mappings: []
    });
  };

  startEditObjectView = () => {
    const {object} = this.state;
    if (! object) {
      return;
    }

    let index = 0;
    this.props.objectViews.map((objectView, idx) => {
      if (objectView.object.name === object.name ) {
        index = idx;
      }
      return objectView
    });

    this.props.startEditObjectView(index).then(() => {
      console.log("navigating to view objects");
      this.props.history.push("viewObjects");
      this.props.history.goForward();
    });
  };

  /**
   * @param {SFObject} object
   * @param {Array<SFObjectField>} fields
   * @param {Array<RelatedObject>} relatedObjects
   * @param {Array<ContextMapping>} mappings
   */
  onChange = ({ object, fields, relatedObjects, mappings }) =>
  {
    this.setState({ object, fields, relatedObjects, mappings })
  };

  /**
   * @return {Promise}
   */
  addMappings = () =>
  {
    const {object, fields, relatedObjects, mappings} = this.state;

    if (object && fields && fields.length && mappings && mappings.length) {
      const objectView = new ObjectView({object, fields, relatedObjects});
      return this.props.addMappings(object, objectView, mappings).then(() => this.props.persistMappings());
    }

    return Promise.resolve();
  };

  /**
   * @param {SFObject} object
   * @return {Promise<Array<SFObjectField>, Error>} object
   */
  showObjectFields = (object) =>
  {
    if (!object) {
      throw new Error('showObjectFields object is null')
    }

    const objectHasBeenMapped = this.props.contextMappings.filter(mapping => object.name === mapping.object.name).length > 0;

    return this.props.loadDescription(object).then(description => {
      this.setState({
        object,
        objectHasBeenMapped,
        objectFields: description.fields,
        objectRelations: description.relations
      });
      return description.fields;
    });
  };

  /**
   * @returns {Promise<Array<SFObject>, Error>}
   */
  loadObjects = () =>
  {
    return this.props.loadObjects().catch(e => {
      console.error(e);
      return [];
    });
  };

  render()
  {
    const { /** @type {SFObject} */ object, objectHasBeenMapped, objectFields, objectRelations, fields, relatedObjects, mappings } = this.state;

    const UI = chooseUI(this.props);

    return (<UI
      object                = { object }
      objectHasBeenMapped   = { objectHasBeenMapped }
      objectFields          = { objectFields || [] }
      objectRelations       = { objectRelations || [] }
      objectFieldsViewable  = { fields }
      objectRelatedObjects  = { relatedObjects }
      contextMappings       = { mappings }

      loadObjects       = { this.loadObjects }
      onObjectSelected  = { this.showObjectFields }

      loadContexts          = { this.props.loadContexts }
      loadContextProperties = { this.props.loadContextProperties }
      onChange = { this.onChange }
      onAdd = { this.addMappings }
      reset = { this.reset }
      editObjectView = { this.startEditObjectView }
    />);
  }
}

export { Component }

export default reduxConnector(
  Component,
  {
    persistMappings,
    addMappings,
    loadObjects,
    loadDescription,
    loadContexts,
    loadContextProperties,
    startEditObjectView
  },
  {
    objectViews,
    contextMappings
  }
);
