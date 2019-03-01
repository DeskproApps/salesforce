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
  loadContextProperties
} from "../../app/actions";

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

    ui           : PropTypes.func,

    loadContexts : PropTypes.func.isRequired,

    loadContextProperties : PropTypes.func.isRequired,

    loadObjects     : PropTypes.func.isRequired,

    loadDescription : PropTypes.func.isRequired,

    addMappings     : PropTypes.func.isRequired,

    persistMappings : PropTypes.func.isRequired
  };

  state = {

    object: null,

    objectFields: [],

    objectRelations: [],

    fields: [],

    relatedObjects: [],

    mappings: [],
  };

  reset = () => {
    this.setState({

      object: null,

      objectFields: [],

      objectRelations: [],

      fields: [],

      relatedObjects: [],

      mappings: [],
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

    return this.props.loadDescription(object).then(description => {
      this.setState({
        object,
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
    const { /** @type {SFObject} */ object, objectFields, objectRelations, fields, relatedObjects, mappings } = this.state;

    const UI = chooseUI(this.props);

    return (<UI
      object                = { object }
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
    loadContextProperties
  }
);
