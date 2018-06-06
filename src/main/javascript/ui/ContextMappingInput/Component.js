import React from 'react';
import PropTypes from 'prop-types';
import {DefaultUI} from "./DefaultUI";
import {SFObject, SFObjectField} from "../../salesforce/models";
import {ContextDetails, MappableProperty} from "../../deskpro";
import {ContextMapping} from "../../mapping";

/**
 * @param {Object} props
 * @return {function}
 */
function chooseUI(props)
{
  const { ui } = props;
  return typeof ui === 'function' ? ui : DefaultUI;
}

export class Component extends React.Component
{
  static propTypes = {
    object            : PropTypes.instanceOf(SFObject),
    fields            : PropTypes.arrayOf(SFObjectField),

    context           : PropTypes.instanceOf(ContextDetails),
    contextProperties : PropTypes.arrayOf(MappableProperty),

    onChange          : PropTypes.func
  };

  state = {
    field: null,
    property: null
  };

  componentDidUpdate(prevProps)
  {
    console.log("componentDidUpdate start")
    if (
      !this.props.object && prevProps.object
      || this.props.object && !prevProps.object
      || this.props.object && prevProps.object && this.props.object.name !== prevProps.object.name
      || !this.props.context && prevProps.context
      || this.props.context && !prevProps.context
      || this.props.context && prevProps.context &&  this.props.context.name !== prevProps.context.name
    ) {
      this.setState({ field: null, property: null })
    }
    console.log("componentDidUpdate end")
  }

  /**
   * @param {SFObjectField} field
   */
  useField = (field) =>
  {
    this.setState({ field });
  };

  /**
   * @param {MappableProperty} property
   */
  useProperty = (property) =>
  {
    this.setState({ property });
  };

  createMapping = () =>
  {
    const { /** @type {SFObjectField} */ field, /** @type {MappableProperty} */ property } = this.state;
    if (field && property) {
      if (this.props.onChange) {
        const { /** @type {SFObject} */ object, /** @type {ContextDetails} */ context } = this.props;
        const mapping = new ContextMapping({field, object, context, property});
        this.props.onChange(mapping)
      }
    }
  };

  render()
  {
    console.log('Component render', this.props);

    const UI = chooseUI(this.props);
    return (<UI
      field             = {this.state.field}
      fields            = {this.props.fields}
      onChangeField     = {this.useField}

      property          = {this.state.property}
      properties        = {this.props.contextProperties}
      onChangeProperty  = {this.useProperty}

      onCreate          = {this.createMapping}
    />);
  }
}