import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { Scrollbar, SelectableList, QueryableList, ListElement, Container } from '@deskpro/react-components';
import { SFObjectField } from '../../salesforce/apiObjects';

/**
 * @param {SFObjectField} field
 * @return {{value: string, label: string, object: SFObjectField}}
 */
function toOption(field)
{
  return { value : field.name, label: field.label, object: field }
}

export default class FieldDropDown extends React.PureComponent
{
  static propTypes = {
    items: PropTypes.arrayOf(PropTypes.instanceOf(SFObjectField)).isRequired,
    value: PropTypes.instanceOf(SFObjectField),
    onSelect: PropTypes.func
  };

  /**
   * @param {{object: SFObject}} option
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