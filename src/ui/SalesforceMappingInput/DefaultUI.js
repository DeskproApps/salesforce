import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from '@deskpro/apps-components';

import { DeskproContextDropdown } from '../Lists'
import { default as ContextMappingInput } from '../ContextMappingInput'
import { SFObjectField, SFObject, SFObjectRelation, RelatedObject } from '../../salesforce/apiObjects';
import { ContextDetails, ContextPropertyList } from '../../deskpro';
import { ContextMapping } from '../../mapping'

import { TabsContext } from '../TabsContext';
import { default as ContextMappingList } from '../ContextMappingList';
import { ViewableStatusToggle } from '../ViewableStatusToggle';
import RelatedObjectInput from '../RelatedObjectInput';

export class DefaultUI extends React.PureComponent
{
  static propTypes = {
    object                  : PropTypes.instanceOf(SFObject),
    fields                  : PropTypes.arrayOf(SFObjectField),
    fieldsViewable          : PropTypes.arrayOf(SFObjectField),
    relations               : PropTypes.arrayOf(SFObjectRelation),
    relatedObjects          : PropTypes.arrayOf(RelatedObject),
    changeViewableStatus    : PropTypes.func.isRequired,

    context           : PropTypes.instanceOf(ContextDetails),
    contextProperties : PropTypes.arrayOf(ContextPropertyList),
    contexts          : PropTypes.arrayOf(ContextDetails),
    onContextChanged  : PropTypes.func.isRequired,

    mappings          : PropTypes.arrayOf(ContextMapping).isRequired,
    onMappingAdd      : PropTypes.func.isRequired,
    onMappingRemove   : PropTypes.func.isRequired,
    onRelationChange  : PropTypes.func.isRequired,
  };

  render()
  {
    const containerStyleFields = {
      display: "flex",
      justifyContent: "flex-start"
    };

    const styleFieldList = {
      margin: "1em",
      flexGrow: 1
    };

    return (
      <Panel title={"Select the object's fields to display"} border={"none"}>
        <ViewableStatusToggle
          changeViewableStatus    = {this.props.changeViewableStatus}
          fields                  = {this.props.fields}
          fieldsViewable          = {this.props.fieldsViewable}
          object                  = {this.props.object}
        />


        {this.props.relations.length > 0 &&
          <div>
            Select the related objects to display

            <RelatedObjectInput
              object    = {this.props.object}
              relations = {this.props.relations}
              relatedObjects = {this.props.relatedObjects}
              onRelationChange = {this.props.onRelationChange}
            />
          </div>
        }

        <DeskproContextDropdown
          onChange  = {this.props.onContextChanged}
          name      = {"contexts"}
          options   = {this.props.contexts}
          value     = {this.props.context}
        />

        <div style={containerStyleFields}>

          <div style={styleFieldList}>
            <ContextMappingInput
              object            = {this.props.object}
              fields            = {this.props.fields}
              context           = {this.props.context}
              contextProperties = {this.props.contextProperties}
              onChange          = {this.props.onMappingAdd}
            />
          </div>

          <div style={styleFieldList} className="dp-column">
            <TabsContext
              items     = {this.props.contexts}
              active    = {this.props.context}
              onChange  = {this.props.onContextChanged}
            />
            <ContextMappingList
              items     = {this.props.context ? this.props.mappings : []}
              context   = {this.props.context}
              onRemove  = {this.props.onMappingRemove}
            />
          </div>

        </div>

      </Panel>
    );
  }

}
