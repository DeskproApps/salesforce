import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {ContextDetails} from "../../deskpro/ContextDetails";

/**
 * @param {ContextDetails} contextDetails
 */
function toOption(contextDetails)
{
  return { value : contextDetails.name, label: contextDetails.label, object: contextDetails }
}

export default class DeskproContextDropdown extends React.PureComponent
{
  static propTypes = {
    options: PropTypes.arrayOf(PropTypes.instanceOf(ContextDetails)),
    selected: PropTypes.instanceOf(ContextDetails),
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
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
    console.log('DeskproContextDropdown render', this.props);

    const { loadOptions, options, onChange, selected, ...rest } = this.props;

    const props = {
      ...rest,
      searchable  : true,
      options     : this.props.options.map(toOption),
      onChange    : this.fireOnChange,
      value       : selected ? toOption(selected) : null
    };

    return (
      <div className="dp-select">
        <Select {...props} />
      </div>
    );
  }
}
