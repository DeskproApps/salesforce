import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { persistMappings, addMappings, loadObjects, loadFields, loadContexts, loadContextProperties } from "../../app/actions";

import {ContextDetails, ContextPropertyList} from "../../deskpro";
import { Component } from './Component'

function mapDispatchToProps(dispatch, ownProps)
{
  if (ownProps.addMappings) {
    return null;
  }

  const props = { persistMappings, addMappings, loadObjects, loadFields, loadContexts, loadContextProperties };
  return bindActionCreators(props, dispatch)
}

/**
 * @param {{}} state
 * @param {{}} ownProps
 * @return {{contexts: *, contextProperties: *}}
 */
function mapPropsToState(state, ownProps)
{
  const { contextList, propertyList } = state.deskpro;

  const mappedProps = {

    contexts: contextList.map(o => JSON.stringify(o)).map(ContextDetails.instance),

    contextProperties: propertyList.map(o => JSON.stringify(o)).map(ContextPropertyList.instance),
  };

  return mappedProps;
}

export default connect(
  (state, ownProps) => mapPropsToState(state, ownProps),
  (dispatch, ownProps) => mapDispatchToProps(dispatch, ownProps)
)(Component);
