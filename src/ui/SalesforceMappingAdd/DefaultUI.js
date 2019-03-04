import React from 'react';
import PropTypes from 'prop-types';
import {Panel, Notification, Button} from '@deskpro/apps-components';

import {SalesforceObjectDropdown} from '../Lists'
import { SFObjectField, SFObject, SFObjectRelation, RelatedObject } from '../../salesforce/apiObjects';
import {default as SalesforceMappingInput} from '../SalesforceMappingInput';
import {ContextMapping} from "../../mapping";
import {LoadingButton} from "../LoadingButton";

export class DefaultUI extends React.PureComponent
{
  static propTypes = {
    object                : PropTypes.instanceOf(SFObject),
    objectHasBeenMapped   : PropTypes.bool.isRequired,
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
    reset                 : PropTypes.func.isRequired,
    editObjectView        : PropTypes.func.isRequired,
  };

  render()
  {


    return (
      <Panel title={"Select a Salesforce object to display"} border={"none"} style={{ minHeight: '300px' }}>

          <SalesforceObjectDropdown
            name        = "objects"
            value      = {this.props.object}
            loadOptions = {this.props.loadObjects}
            onChange    = {this.props.onObjectSelected}
          />

        {this.props.object && this.props.objectHasBeenMapped &&
          <p>
            This Salesforce Object has already been mapped. Would you like to <Button onClick={this.props.editObjectView}>edit</Button> the mapping instead?.
          </p>
        }

        {this.props.object && !this.props.objectHasBeenMapped &&
          <Panel border={"none"}>
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

            <LoadingButton onClick={this.props.onAdd} label={"Add Object"} labelSuccess={"Object added. Click again to add another"} onClickSuccess={this.props.reset}/>
          </Panel>
        }
      </Panel>
    )
  }
}
