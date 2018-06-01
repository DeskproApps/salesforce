import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { ContextProperty } from '../../deskpro';
import {SFObjectField} from "../../salesforce/models";


/**
 * @param {ContextProperty} field
 * @return {{value: string, label: string, object: ContextProperty}}
 */
function toOption(field)
{
  return { value : field.name, label: field.label, object: field }
}

export default class PropertyDropdown extends React.PureComponent
{
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.instanceOf(ContextProperty)).isRequired,
    value: PropTypes.instanceOf(ContextProperty),
    onChange: PropTypes.func
  };

  /**
   * @param {{object: ContextProperty}} option
   */
  fireOnChange = (option) =>
  {
    if (option.object) {
      this.props.onChange(option.object)
    }
  };

  render()
  {
    console.log('PropertyDropdown render', this.props);
    const { items, value, onChange, ...rest } = this.props;

    const props = {
      ...rest,
      searchable  : true,
      options     : this.props.items.map(toOption),
      onChange    : this.fireOnChange,
      value       : value ? toOption(value) : null
    };

    return (
      <div className="dp-select">
        <Select {...props} />
      </div>
    );
  }

}