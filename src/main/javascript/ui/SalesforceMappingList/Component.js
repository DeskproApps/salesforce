import React from 'react';
import PropTypes from 'prop-types';
import {ObjectView, ContextMapping} from "../../mapping";
import { hasMapping, hasView } from "../../mapping/predicates"

import { DefaultUI } from './DefaultUI';
import {SFObject, SFObjectField} from "../../salesforce/apiObjects";

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

    objectViews       : PropTypes.arrayOf(ObjectView),

    contextMappings   : PropTypes.arrayOf(ContextMapping),

    loadContexts          : PropTypes.func.isRequired,

    loadContextProperties : PropTypes.func.isRequired,

    replaceMappings: PropTypes.func.isRequired,

    removeMappings: PropTypes.func.isRequired,

    persistMappings : PropTypes.func.isRequired,

    loadFields : PropTypes.func.isRequired

  };

  state = {

    object: null,

    objectFields: [],

    objectViewableFields: [],

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

    this.props.loadFields(object).then(fields => {
      this.setState({object, objectFields: fields, objectViewableFields,  objectMappings})
    });
  };

  onCancelEdit = (object) =>
  {
    this.setState({ object : null, objectViewableFields: [], objectMappings: [] })
  };

  onSave = () =>
  {
    const { object, objectViewableFields: fields, objectMappings: mappings} = this.state;

    if (object && fields && fields.length && mappings && mappings.length) {
      this.props.replaceMappings(object, new ObjectView({object, fields}), mappings)
        .then(() => this.props.persistMappings())
      ;
    }
  };

  render()
  {
    console.log('render SalesforceMappingList', this.props, this.state)

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