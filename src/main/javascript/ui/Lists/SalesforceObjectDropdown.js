import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import { SFObject } from '../../salesforce/models';

/**
 * @param {SFObject} SFObject
 */
function toOption(SFObject)
{
  return { value : SFObject.name, label: SFObject.label, object: SFObject }
}

export default class SalesforceObjectDropdown extends React.PureComponent
{
  static propTypes = {
    object: PropTypes.instanceOf(SFObject),
    loadObjects: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired
  };

  /**
   * @returns {Promise<Array<Object>, Error>}
   */
  loadOptions = () => this.props.loadObjects()
    .then(objects => objects.map(toOption))
    .then(options => ({ options }))
  ;

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
    console.log('SalesforceObjectDropdown render', this.props);

    const { loadObjects, options, onChange, object, ...rest } = this.props;

    const props = {
      ...rest,
      searchable  : true,
      loadOptions : this.loadOptions,
      onChange    : this.fireOnChange,
      value       : object ? toOption(object) : null
    };

    return (
      <div className="dp-select">
        <Select.Async {...props} />
      </div>
    );
  }
}
