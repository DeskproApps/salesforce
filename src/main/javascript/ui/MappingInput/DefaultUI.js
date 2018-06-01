import React from 'react';
import PropTypes from 'prop-types';

import { Container, Heading, Button } from '@deskpro/react-components';
import {SFObjectField} from "../../salesforce/models";
import {ContextProperty} from "../../deskpro";
import { FieldDropDown, PropertyDropdown } from '../Lists'

export class DefaultUI extends React.PureComponent
{
  static propTypes = {
    field            : PropTypes.instanceOf(SFObjectField),
    objectFields      : PropTypes.arrayOf(SFObjectField),

    property           : PropTypes.instanceOf(ContextProperty),
    contextProperties : PropTypes.arrayOf(PropTypes.instanceOf(ContextProperty)),

    onChangeField     : PropTypes.func,
    onChangeProperty  : PropTypes.func,

    onCreate          : PropTypes.func
  };

  render()
  {
    console.log('DefaultUI render', this.props);

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
          <FieldDropDown items={this.props.objectFields} value={this.props.field} onChange={this.props.onChangeField} />
        </div>

        <div style={styleFieldList} className="dp-column">
          <PropertyDropdown items={this.props.contextProperties} value={this.props.property} onChange={this.props.onChangeProperty} />
        </div>

        <Button onClick={this.props.onCreate}>Create mapping</Button>

      </div>
    );
  }
}