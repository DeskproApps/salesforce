import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { MappableProperty } from '../../deskpro';

/**
 * @param {MappableProperty} field
 * @return {{value: MappableProperty, label: string, object: MappableProperty}}
 */
function toOption(field, index)
{
  return { value : field, label: field.label, object: field }
}

export default class PropertyDropdown extends React.PureComponent
{
  static propTypes = {
    items: PropTypes.arrayOf(MappableProperty).isRequired,
    value: PropTypes.instanceOf(MappableProperty),
    onChange: PropTypes.func
  };

  /**
   * @param {{object: MappableProperty}} option
   */
  fireOnChange = (option) =>
  {
    if (option.object) {
      this.props.onChange(option.object)
    }
  };

  render()
  {
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