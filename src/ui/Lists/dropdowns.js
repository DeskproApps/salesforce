import React from "react";
import PropTypes from "prop-types";
import Select from 'react-select';
import Async from 'react-select/lib/Async';

import {ContextDetails} from "../../deskpro/ContextDetails";
import {SFObjectField} from "../../salesforce/apiObjects";
import {MappableProperty} from "../../deskpro";

class ObjectDropdown extends React.PureComponent
{
  static propTypes = {
    options       : PropTypes.array,
    optionMapper  : PropTypes.func.isRequired,
    value         : PropTypes.object,
    onChange      : PropTypes.func.isRequired,
    name          : PropTypes.string.isRequired
  };

  /**
   * @param {{}} object
   */
  toOption = (object) =>
  {
    const option = this.props.optionMapper(object);
    return { ...option, object }
  };

  /**
   * @param {{object: SFObject}} option
   */
  fireOnChange = (option, ...rest) =>
  {
    if (option.object) {
      this.props.onChange(option.object)
    }
  };

  render()
  {
    const { options, onChange, value, ...rest } = this.props;

    const mappedOptions = options.map(this.toOption);
    const mappedSelected = value ? this.toOption(value) : null;

    const props = {
      ...rest,
      isSearchable  : true,
      options     : mappedOptions,
      onChange    : this.fireOnChange,
      value       : mappedSelected
    };

    return (
      <div className="dp-select">
        <Select {...props} />
      </div>
    );
  }
}

class ObjectAsyncDropdown extends React.PureComponent
{
  static propTypes = {
    optionMapper  : PropTypes.func.isRequired,
    value         : PropTypes.object,
    onChange      : PropTypes.func.isRequired,
    loadOptions   : PropTypes.func.isRequired
  };

  /**
   * @returns {Promise<Array<Object>, Error>}
   */
  loadOptions = () => this.props.loadOptions()
    .then(objects => objects.map(this.toOption))

  ;

  /**
   * @param {*} object
   */
  toOption = (object) =>
  {
    const option = this.props.optionMapper(object);
    return { ...option, object }
  };

  /**
   * @param {{object: *}} option
   */
  fireOnChange = (option) =>
  {
    if (option.object) {
      this.props.onChange(option.object)
    }
  };

  render()
  {
    const { value, ...rest } = this.props;

    const props = {
      ...rest,
      isSearchable  : true,
      cacheOptions:true,
      defaultOptions: true,
      loadOptions : this.loadOptions,
      onChange    : this.fireOnChange,
      value       : value ? this.toOption(value) : null
    };

    return (
      <div className="dp-select">
        <Async {...props} />
      </div>
    );
  }
}


export class DeskproContextDropdown extends React.PureComponent
{
  static propTypes = {
    options       : PropTypes.arrayOf(ContextDetails),
    value         : PropTypes.instanceOf(ContextDetails),
    onChange      : PropTypes.func.isRequired,
    name          : PropTypes.string.isRequired
  };

  /**
   * @param {ContextDetails} object
   */
  static toOption(object)
  {
    return { value : object.name, label: object.label }
  }

  render()
  {
    return <ObjectDropdown  {...this.props} optionMapper={DeskproContextDropdown.toOption} />
  }
}

export class FieldDropDown extends React.PureComponent
{
  static propTypes = {
    options       :  PropTypes.arrayOf(SFObjectField),
    value         : PropTypes.instanceOf(SFObjectField),
    onChange      : PropTypes.func.isRequired,
  };

  /**
   * @param {SFObjectField} object
   * @return {{value: string, label: string}}
   */
  static toOption(object)
  {
    return { value : object.name, label: object.label }
  }

  render()
  {
    return <ObjectDropdown  {...this.props} optionMapper={FieldDropDown.toOption} />
  }
}

export class PropertyDropdown extends React.PureComponent
{
  static propTypes = {
    options: PropTypes.arrayOf(MappableProperty),
    value         : PropTypes.instanceOf(MappableProperty),
    onChange      : PropTypes.func.isRequired,
    name          : PropTypes.string.isRequired
  };

  /**
   * @param {MappableProperty} object
   * @return {{value: string, label: string}}
   */
  static toOption(object)
  {
    return { value : object.name, label: object.label }
  }

  render()
  {
    return <ObjectDropdown  {...this.props} optionMapper={PropertyDropdown.toOption} />
  }
}

export class SalesforceObjectDropdown extends React.PureComponent
{
  /**
   * @param {SFObject} object
   * @return {{value: string, label: string}}
   */
  static toOption(object)
  {
    return { value : object.name, label: object.label }
  }

  render()
  {
    return <ObjectAsyncDropdown  {...this.props} optionMapper={SalesforceObjectDropdown.toOption} />
  }
}

export class RelatedObjectDropdown extends React.PureComponent
{
  static toOption(object)
  {
    if (object) {
      return { value: object.childSObject, label: object.childSObject}
    }
    return {value: '', label: ''};
  }

  render()
  {
    return <ObjectDropdown  {...this.props} optionMapper={RelatedObjectDropdown.toOption} />
  }
}
