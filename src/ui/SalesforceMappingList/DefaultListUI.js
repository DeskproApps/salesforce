import React from 'react';
import PropTypes from 'prop-types';

import {ObjectView, ContextMapping} from "../../mapping";
import {SFObject} from "../../salesforce/apiObjects";
import { ListItem, List, Button } from '@deskpro/apps-components';

function uniqueList (arrArg) {
  return arrArg.filter(
    function(elem, pos,arr) {
      return arr.indexOf(elem) === pos;
  });
}

/**
 * @param {ContextMapping}  mapping
 * @param {SFObject} object
 * @return {boolean}
 */
function isContextMappingForObject(mapping, object)
{
  return mapping.object.name === object.name;
}

const flex = {
  display: "flex",
  justifyContent: "flex-start"
};

const flexColumn = {
  margin: "1em",
  flexGrow: 1
};

class MappingListItem extends React.PureComponent
{
  static propTypes = {

    object: PropTypes.instanceOf(SFObject),

    viewableFieldsCount: PropTypes.arrayOf(ObjectView),

    contextMappings: PropTypes.array,

    onRemove: PropTypes.func.isRequired,

    onEdit: PropTypes.func.isRequired,
  };

  onRemove = () => this.props.onRemove(this.props.object);

  onEdit = () => this.props.onEdit(this.props.object);

  render()
  {
    return (
      <ListItem name={this.props.object.name} onDoubleClick={this.fireOnChange}>
        <div style={flex}>
          <div style={flexColumn}>{this.props.object.label}</div>
          <div style={flexColumn}>{this.props.viewableFieldsCount} fields</div>
          <div style={flexColumn}>{ this.props.contextMappings.join(', ') }</div>
          <div style={flexColumn}>
            <Button onClick={this.onEdit}>Edit</Button>
          </div>
          <div style={flexColumn}>
            <Button onClick={this.onRemove}>Delete</Button>
          </div>
        </div>
      </ListItem>
    );
  }
}

export default class DefaultListUI extends React.PureComponent
{
  static propTypes = {

    visible: PropTypes.bool,

    objectViews: PropTypes.arrayOf(ObjectView),

    contextMappings: PropTypes.arrayOf(ContextMapping),

    onRemove: PropTypes.func.isRequired,

    onEdit: PropTypes.func.isRequired,
  };

  static defaultProps = {
    visible: true
  };

  render()
  {
    const display = { display: this.props.visible ? 'block' : 'none' };

    return (
      <div style={display}>
        <div style={flex}>
          <div style={flexColumn}>Object Name</div>
          <div style={flexColumn}>Visible Fields</div>
          <div style={flexColumn}>Available In</div>
          <div style={flexColumn}/>
          <div style={flexColumn}/>

        </div>

        <List >
          {this.props.objectViews.map(this.renderListItem)}
        </List>
      </div>

    );
  }

  /**
   * @param {ObjectView}  objectView
   */
  renderListItem = (objectView) =>
  {
    const contextMappings = this.props.contextMappings.filter(mapping => isContextMappingForObject(mapping, objectView.object));
    const contextMappingLabels = uniqueList(contextMappings.map(mapping => mapping.context.label));

    return (<MappingListItem
      object              = {objectView.object}
      contextMappings     = {contextMappingLabels}
      viewableFieldsCount = {objectView.fields.length}
      onEdit              = {this.props.onEdit}
      onRemove            = {this.props.onRemove}
    />);

  }
}
