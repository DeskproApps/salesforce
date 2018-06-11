import React from 'react';
import PropTypes from 'prop-types';

import { Container, Heading, Button } from '@deskpro/react-components';
import {SFObjectField} from "../../salesforce/apiObjects";
import {MappableProperty} from "../../deskpro";
import { FieldDropDown, PropertyDropdown } from '../Lists'

export class DefaultUI extends React.PureComponent
{
  static propTypes = {
    field               : PropTypes.instanceOf(SFObjectField),
    fields              : PropTypes.arrayOf(SFObjectField),

    property            : PropTypes.instanceOf(MappableProperty),
    properties         : PropTypes.arrayOf(MappableProperty),

    onChangeField     : PropTypes.func,
    onChangeProperty  : PropTypes.func,

    onCreate          : PropTypes.func
  };

  render()
  {
    const containerStyleFields = {
      display: "flex",
      justifyContent: "flex-start",
      flexDirection: "column"
    };

    const styleFieldList = {
      margin: "1em",
      flexGrow: 1
    };

    return (
      <div style={containerStyleFields}>

        <div style={styleFieldList} className="dp-column">
          <FieldDropDown items={this.props.fields} value={this.props.field} onChange={this.props.onChangeField} />
        </div>

        <div style={styleFieldList} className="dp-column">
          <PropertyDropdown items={this.props.properties} value={this.props.property} onChange={this.props.onChangeProperty} />
        </div>

        <Button onClick={this.props.onCreate}>Create field mapping</Button>

      </div>
    );
  }
}