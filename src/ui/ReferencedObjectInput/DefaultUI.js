import React from 'react';
import PropTypes from 'prop-types';

import { ReferencedObjectDropdown, SalesforceFieldList } from "../Lists";
import { SFObjectField, ReferencedObject, SFObject } from "../../salesforce/apiObjects";

export class DefaultUI extends React.Component
{
  static propTypes = {
    object                : PropTypes.instanceOf(SFObject),
    references            : PropTypes.arrayOf(SFObjectField),
    referencedObjects     : PropTypes.arrayOf(ReferencedObject),
    selectedObject        : PropTypes.instanceOf(ReferencedObject),
    selectedObjectFields  : PropTypes.arrayOf(SFObjectField),
    onObjectSelected      : PropTypes.func.isRequired,
    changeViewableStatus  : PropTypes.func.isRequired,
  };

  setViewableState = (item) =>
  {
    const { selectedObject } = this.props;
    this.props.changeViewableStatus(item, selectedObject, "viewable");
  };

  unsetViewableState = (item, object) =>
  {
    this.props.changeViewableStatus(item, object, "not-viewable");
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
          <ReferencedObjectDropdown
            name     = "referenced_objects"
            value    = {this.props.selectedObject}
            options  = {this.props.references}
            onChange = {this.props.onObjectSelected}
          />
          <SalesforceFieldList items={this.props.selectedObjectFields} onSelect={this.setViewableState} />
        </div>
        <div style={styleFieldList} className="dp-column">
          {this.props.referencedObjects.map(object => (
              <div>
                <h4>{object.props.relationshipName}</h4>
                <SalesforceFieldList items={object.fields} onSelect={(field) => this.unsetViewableState(field, object)} />
              </div>
          ))}
        </div>
      </div>
    );
  }
}
