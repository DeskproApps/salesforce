import React from 'react';
import PropTypes from 'prop-types';

import {SalesforceFieldList} from './Lists'
import {SFObjectField, SFObject} from "../salesforce/apiObjects";

export class ViewableStatusToggle extends React.PureComponent
{
  static propTypes = {
    object                : PropTypes.instanceOf(SFObject),
    fields                : PropTypes.arrayOf(SFObjectField),
    fieldsViewable        : PropTypes.arrayOf(SFObjectField),
    changeViewableStatus  : PropTypes.func.isRequired
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
          <SalesforceFieldList items={this.props.fields} onSelect={this.setViewableState} />
        </div>
        <div style={styleFieldList} className="dp-column">
          <SalesforceFieldList items={this.props.fieldsViewable} onSelect={this.unsetViewableState}/>
        </div>
      </div>
    );
  }
}
