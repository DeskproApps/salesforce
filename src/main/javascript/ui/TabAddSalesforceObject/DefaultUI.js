import React from 'react';
import PropTypes from 'prop-types';


import {DeskproContextDropdown, SalesforceObjectDropdown, SalesforceFieldList} from '../Lists'
import { default as InputMapping } from '../MappingInput'
import { SFObjectField, SFObject } from '../../salesforce/models';
import {ContextMapping, ContextProperty, ContextDetails} from '../../deskpro';

import { TabsContext } from '../TabsContext';
import { default as MappingList } from '../MappingList';


export class DefaultUI extends React.PureComponent
{
  static propTypes = {
    object            : PropTypes.instanceOf(SFObject),
    objectFields      : PropTypes.arrayOf(SFObjectField),
    objectFieldsDisplayable : PropTypes.arrayOf(SFObjectField),

    loadObjects       : PropTypes.func.isRequired,
    onObjectSelected  : PropTypes.func.isRequired,
    onFieldAction     : PropTypes.func.isRequired,

    changeViewableStatus: PropTypes.func.isRequired,

    context           : PropTypes.instanceOf(ContextDetails),
    contextProperties : PropTypes.arrayOf(PropTypes.instanceOf(ContextProperty)),
    contexts          : PropTypes.arrayOf(PropTypes.instanceOf(ContextDetails)),
    onContextSelected : PropTypes.func.isRequired,

    mappings   : PropTypes.arrayOf(PropTypes.instanceOf(ContextMapping)).isRequired,

    onMappingAdd : PropTypes.func.isRequired,
    onMappingRemove : PropTypes.func.isRequired
  };


  setViewableState = (item) =>
  {
    this.props.changeViewableStatus(item, "viewable");
  };

  unsetViewableState = (item) =>
  {
    this.props.changeViewableStatus(item, "not-viewable");
  };

  render()
  {
    console.log('DefaultUI render', this.props);

    const containerStyleFields = {
      display: "flex",
      justifyContent: "flex-start"
    };

    const styleFieldList = {
      margin: "1em",
      flexGrow: 1
    };

    return (
      <div>

        <h2>Select a Salesforce object to display</h2>

        <SalesforceObjectDropdown
          name="objects"
          object={this.props.object}
          loadObjects={this.props.loadObjects}
          onChange={this.props.onObjectSelected}
        />

        <h2>Select the object's fields to display</h2>

        <div style={containerStyleFields}>
          <div style={styleFieldList} className="dp-column">
            <SalesforceFieldList items={this.props.objectFields} onSelect={this.setViewableState} />
          </div>
          <div style={styleFieldList} className="dp-column">
            <SalesforceFieldList items={this.props.objectFieldsDisplayable} onSelect={this.unsetViewableState}/>
          </div>
        </div>

        <h2>Select a Deskpro Context for mapping</h2>

        <DeskproContextDropdown onChange={this.props.onContextSelected} name={"contexts"} options={this.props.contexts} selected={this.props.context}/>

        <div style={containerStyleFields}>

          <div style={styleFieldList}>
            <InputMapping
              object={this.props.object}
              objectFields={this.props.objectFields}
              context={this.props.context}
              contextProperties={this.props.contextProperties}
              onChange={this.props.onMappingAdd}
            />
          </div>

          <div style={styleFieldList} className="dp-column">
            <TabsContext items={this.props.contexts} active={this.props.context} onChange={this.props.onContextSelected}/>
            <MappingList items={this.props.mappings} context={this.props.context} onRemove={this.props.onMappingRemove} />
          </div>

        </div>


      </div>
    )
  }z

}