import React from 'react';
import PropTypes from 'prop-types';

import { SFObjectField, SFObject } from '../../salesforce/models';

import {ContextMapping, ObjectView} from '../../mapping';

import { DefaultUI } from './DefaultUI';

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

export class Component extends React.Component
{
  static propTypes = {

    ui           : PropTypes.func,

    loadContexts : PropTypes.func.isRequired,

    loadContextProperties : PropTypes.func.isRequired,

    loadObjects     : PropTypes.func.isRequired,

    loadFields      : PropTypes.func.isRequired,

    addMappings     : PropTypes.func.isRequired,

    persistMappings : PropTypes.func.isRequired
  };

  state = {

    object: null,

    objectFields: [],

    fields: [],

    mappings: [],
  };

  /**
   * @param {SFObject} object
   * @param {Array<SFObjectField>} fields
   * @param {Array<ContextMapping>} mappings
   */
  onChange = ({ object, fields, mappings }) =>
  {
    this.setState({ object, fields, mappings })
  };

  addMappings = () =>
  {
    const {object, fields, mappings} = this.state;

    if (object && fields && fields.length && mappings && mappings.length) {
      this.props.addMappings(object, new ObjectView({object, fields}), mappings)
        .then(() => this.props.persistMappings())
      ;
    }
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

    return this.props.loadFields(object).then(fields => {
      this.setState({ object, objectFields: fields });
      return fields;
    });
  };

  /**
   * @returns {Promise<Array<SFObject>, Error>}
   */
  loadObjects = () =>
  {
    console.log('SalesforceMappingAdd loadObjects', this.props)

    return this.props.loadObjects();
  };

  render()
  {
    console.log("SalesforceMappingAdd component render ", this.props, this.state)
    const { /** @type {SFObject} */ object, objectFields, fields, mappings } = this.state;

    const UI = chooseUI(this.props);

    return (<UI
      object                = { object }
      objectFields          = { objectFields || [] }
      objectFieldsViewable  = { fields }
      contextMappings       = { mappings }

      loadObjects       = { this.loadObjects }
      onObjectSelected  = { this.showObjectFields }

      loadContexts          = { this.props.loadContexts }
      loadContextProperties = { this.props.loadContextProperties }
      onChange = { this.onChange }
      onAdd = { this.addMappings }
    />);
  }

}