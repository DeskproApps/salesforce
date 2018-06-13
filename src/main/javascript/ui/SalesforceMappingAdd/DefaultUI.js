import React from 'react';
import PropTypes from 'prop-types';
import { Container, Heading, Button } from '@deskpro/react-components';

import {SalesforceObjectDropdown} from '../Lists'
import { SFObjectField, SFObject } from '../../salesforce/apiObjects';
import {default as SalesforceMappingInput} from '../SalesforceMappingInput';
import {ContextMapping} from "../../mapping";

export class DefaultUI extends React.PureComponent
{
  static propTypes = {
    object                : PropTypes.instanceOf(SFObject),
    objectFields          : PropTypes.arrayOf(SFObjectField),
    objectFieldsViewable  : PropTypes.arrayOf(SFObjectField),
    contextMappings   : PropTypes.arrayOf(ContextMapping),

    loadObjects           : PropTypes.func,
    onObjectSelected      : PropTypes.func,

    loadContextProperties : PropTypes.func.isRequired,
    loadContexts          : PropTypes.func.isRequired,
    onChange              : PropTypes.func.isRequired,
    onAdd                 : PropTypes.func.isRequired,
  };

  render()
  {
    return (
      <div>

        <Heading size={2}>Select a Salesforce object to display</Heading>

        <SalesforceObjectDropdown
          name        = "objects"
          value      = {this.props.object}
          loadOptions = {this.props.loadObjects}
          onChange    = {this.props.onObjectSelected}
        />

        {this.props.object &&
          <SalesforceMappingInput
            object              = {this.props.object}
            fields              = {this.props.objectFields}
            fieldsViewable      = {this.props.objectFieldsViewable}
            mappings            = {this.props.contextMappings}

            loadContexts            = {this.props.loadContexts}
            loadContextProperties   = {this.props.loadContextProperties}
            onChange            = {this.props.onChange}

          />
        }

        {this.props.object &&
          <Button onClick={this.props.onAdd}>Add Object</Button>
        }

      </div>
    )
  }
}