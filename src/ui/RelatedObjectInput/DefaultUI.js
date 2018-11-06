import React from 'react';
import PropTypes from 'prop-types';

import { RelatedObjectDropdown, SalesforceFieldList } from "../Lists";
import { SFObjectField, RelatedObject, SFObject, SFObjectRelation } from "../../salesforce/apiObjects";

export class DefaultUI extends React.Component
{
  static propTypes = {
    object                : PropTypes.instanceOf(SFObject),
    relations             : PropTypes.arrayOf(SFObjectRelation),
    relatedObjects        : PropTypes.arrayOf(RelatedObject),
    selectedObject        : PropTypes.instanceOf(RelatedObject),
    selectedObjectFields  : PropTypes.arrayOf(SFObjectField),
    onObjectSelected      : PropTypes.func.isRequired,
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
    const containerStyleFields = {
      display: "flex",
      justifyContent: "flex-start"
    };

    const styleFieldList = {
      margin: "1em",
      flexGrow: 1
    };

    return (
      <div style={containerStyleFields}>
        <div style={styleFieldList} className="dp-column">
          <RelatedObjectDropdown
            name     = "related_objects"
            value    = {this.props.selectedObject}
            options  = {this.props.relations}
            onChange = {this.props.onObjectSelected}
          />
          <SalesforceFieldList items={this.props.selectedObjectFields} onSelect={this.setViewableState} />
        </div>
        <div style={styleFieldList} className="dp-column">
          {this.props.relatedObjects.map(relation => <div>{relation.childSObject}</div>)}
        </div>
      </div>
    );
  }
}
