import React from 'react';
import PropTypes from 'prop-types';

import { Scrollbar, SelectableList, QueryableList, ListElement, Container } from '@deskpro/react-components';

import { fetch } from '../../salesforce/http';
import { getDescribeGlobal, getSObjectDescribe } from '../../salesforce/api';
import { SFObjectField, SFObject, SObjectDescription } from '../../salesforce/models';

import {ContextDetails, ContextProperty} from '../../deskpro';
import {ContextMapping} from '../../mapping';

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
    dpapp: PropTypes.object.isRequired,
    ui: PropTypes.func,
    addMapping: PropTypes.func
  };

  state = {
    object: null,
    fields: [],

    objects: null,
    objectDescriptions: {},

    context: null,
    contextProperties: [],
    contexts: [
      new ContextDetails({ name: "ticket", label: "Ticket" }),
      new ContextDetails({ name: "person", label: "Person" }),
      new ContextDetails({ name: "organization", label: "Organization" })
    ],
    mappings: []
  };

  addMapping = () =>
  {
    const {object, fields, mappings} = this.state;
    if (object && fields.length && mappings.length) {
      this.props.addMapping(object, fields, mappings);
    }
  };

  /**
   * @param {ContextMapping} mapping
   */
  addContextMapping = (mapping) =>
  {
    const { /** @type {Array<ContextMapping>} */ mappings } = this.state;
    const isNew = (mappings.filter(existing => mapping.equals(existing)).length === 0);

    if (isNew) {
      this.setState({ mappings: mappings.concat([mapping]) });
    }
  };

  /**
   * @param {ContextMapping} mapping
   */
  removeMapping = (mapping) => {
    const mappings = this.state.mappings.filter(existing => ! mapping.equals(existing));
    if (mappings.length !== this.state.mappings.length) {
      this.setState({ mappings });
    }
  };

  /**
   * @param {ContextDetails}  context
   */
  showContextProperties = (context) =>
  {
    this.setState({
      context,
      contextProperties: [new ContextProperty({ name: "email", label: "Email" })]
    })
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

    if (this.state.objectDescriptions[object.name]) {
      this.setState({ object });
      const info = this.state.objectDescriptions[object.name];
      return Promise.resolve(info.fields);
    }

    return fetch(this.props.dpapp, (client) => getSObjectDescribe(client, object))
      .then(info => {
        this.state.objectDescriptions[object.name] = info;
        this.setState({ object });
        return info.fields
      })
    ;
  };

  /**
   * @param {SFObjectField} item
   * @param {string} status
   */
  changeViewableStatus = (item, status) =>
  {
    console.log('changeViewableStatus', item, status);

    if (status === 'viewable') {
      const { fields } = this.state;
      const isViewable = fields.filter(field => field.name === item.name).length === 0;
      if (isViewable) {
        this.setState({ fields: fields.concat(item) });
        return;
      }
      return;
    }

    if (status === 'not-viewable') {
      const fields = this.state.fields.filter(field => field.name !== item.name);
      if (fields.length !== this.state.fields.length) {
        this.setState({ fields });
      }
    }


  };

  /**
   * @returns {Promise<Array<SFObject>, Error>}
   */
  loadObjects = () =>
  {
    const { dpapp } = this.props;

    if (this.state.objects) {
      return Promise.resolve(this.state.objects);
    }

    /**
     * @param {DescribeGlobal} resp
     * @return {Array<SFObject>}
     */
    const sobjects = (resp) => resp.sobjects;

    return fetch(dpapp, getDescribeGlobal).then(sobjects)
      .then(objects => {
        this.setState({ objects });
        return objects
      })
    ;
  };

  render()
  {
    const { object, fields, objectDescriptions, context, contextProperties, contexts, mappings } = this.state;
    /**
     * @param {SFObject} resp
     * @param {Object} cache
     * @return {SObjectDescription|null}
     */
    function objectDescription(resp, cache) { return cache[resp.name]; }
    const objectFields = object ? objectDescription(object, objectDescriptions).fields : [];

    const UI = chooseUI(this.props);
    return (<UI
      object={object}
      objectFields={objectFields}
      objectFieldsDisplayable={fields}

      loadObjects={this.loadObjects}
      onObjectSelected={this.showObjectFields}

      context = {context}
      contextProperties = {contextProperties}
      contexts = {contexts}
      onContextSelected = {this.showContextProperties}

      mappings = {mappings}
      onMappingAdd = {this.addContextMapping}
      onMappingRemove = {this.removeMapping}

      changeViewableStatus = {this.changeViewableStatus}
      onChange = { this.addMapping }
    />);
  }

}