import React from 'react';
import PropTypes from 'prop-types';
import { Loader, Panel, Button, Tabs, TabMenu } from '@deskpro/apps-components';

import {SalesforceObjectDropdown} from '../Lists'
import { SFObjectField, SFObject, SFObjectRelation, RelatedObject } from '../../salesforce/apiObjects';
import {default as SalesforceMappingInput} from '../SalesforceMappingInput';
import {ContextMapping} from "../../mapping";
import {LoadingButton} from "../LoadingButton";

export class DefaultUI extends React.PureComponent
{
  static propTypes = {
    object                : PropTypes.instanceOf(SFObject),
    objectFields          : PropTypes.arrayOf(SFObjectField),
    objectFieldsViewable  : PropTypes.arrayOf(SFObjectField),
    objectRelations       : PropTypes.arrayOf(SFObjectRelation),
    objectRelatedObjects  : PropTypes.arrayOf(RelatedObject),
    contextMappings       : PropTypes.arrayOf(ContextMapping),

    loadObjects           : PropTypes.func,
    onObjectSelected      : PropTypes.func,

    loadContextProperties : PropTypes.func.isRequired,
    loadContexts          : PropTypes.func.isRequired,
    onChange              : PropTypes.func.isRequired,
    onAdd                 : PropTypes.func.isRequired,
    reset                 : PropTypes.func.isRequired
  };

  render()
  {
    return (
      <Panel title={"Select a Salesforce object to display"} border={"none"}>
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
            relations           = {this.props.objectRelations}
            relatedObjects      = {this.props.objectRelatedObjects}
            mappings            = {this.props.contextMappings}

            loadContexts            = {this.props.loadContexts}
            loadContextProperties   = {this.props.loadContextProperties}
            onChange            = {this.props.onChange}
          />
        }

        { this.props.object && <LoadingButton onClick={this.props.onAdd} label={"Add Object"} labelSuccess={"Object added. Click again to add another"} onClickSuccess={this.props.reset}/> }
      </Panel>
    )
  }
}
