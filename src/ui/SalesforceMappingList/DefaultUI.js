import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@deskpro/apps-components';
import { SFObjectField, SFObject, SFObjectRelation, RelatedObject } from '../../salesforce/apiObjects';

import {default as SalesforceMappingInput} from '../SalesforceMappingInput';
import {ContextMapping, ObjectView} from "../../mapping";
import {default as DefaultListUI} from "./DefaultListUI";

export class DefaultUI extends React.PureComponent
{
  static propTypes = {
    objectViews       : PropTypes.arrayOf(ObjectView),
    contextMappings   : PropTypes.arrayOf(ContextMapping),

    object                : PropTypes.instanceOf(SFObject),
    objectFields          : PropTypes.arrayOf(SFObjectField),
    objectViewableFields  : PropTypes.arrayOf(SFObjectField),
    objectRelations       : PropTypes.arrayOf(SFObjectRelation),
    objectRelatedObjects  : PropTypes.arrayOf(RelatedObject),
    objectMappings        : PropTypes.arrayOf(ContextMapping),


    loadContextProperties : PropTypes.func.isRequired,
    loadContexts          : PropTypes.func.isRequired,

    onChange: PropTypes.func.isRequired,
    onCancelEdit: PropTypes.func.isRequired,

    onRemove: PropTypes.func.isRequired,
    onEdit: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
  };


  render()
  {
    return (
      <div>
        {this.props.object &&
          <SalesforceMappingInput
            object            = {this.props.object}
            fields            = {this.props.objectFields}
            fieldsViewable    = {this.props.objectViewableFields}
            relations         = {this.props.objectRelations}
            relatedObjects    = {this.props.objectRelatedObjects}
            mappings          = {this.props.objectMappings}
            loadContexts            = {this.props.loadContexts}
            loadContextProperties   = {this.props.loadContextProperties}
            onChange          = {this.props.onChange}
          />
        }

        {this.props.object &&
          <div>
            <Button onClick={this.props.onSave}>Save</Button>
            <Button onClick={this.props.onCancelEdit}>Cancel</Button>
          </div>
        }

        <DefaultListUI
          visible         = { !this.props.object }
          onRemove        = { this.props.onRemove }
          onEdit          = { this.props.onEdit }
          contextMappings = { this.props.contextMappings }
          objectViews     = { this.props.objectViews }
        />

      </div>
    );

  }
}
