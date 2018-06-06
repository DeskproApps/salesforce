import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { addMappings  } from "../../mapping/dux";
import { loadObjects, loadFields  } from "../../salesforce/dux";
import { loadContexts, loadContextProperties } from "../../deskpro/dux";

import {ContextDetails, ContextPropertyList} from "../../deskpro";
import { Component } from './Component'

function mapDispatchToProps(dispatch, ownProps)
{
  if (ownProps.addMappings) {
    return null;
  }

  const props = { addMappings, loadObjects, loadFields, loadContexts, loadContextProperties };
  return bindActionCreators(props, dispatch)
}

/**
 * @param {{}} state
 * @param {{}} ownProps
 * @return {{contexts: *, contextProperties: *}}
 */
function mapPropsToState(state, ownProps)
{
  console.log('wtf wtf ', state, ownProps);
  const { contextList, propertyList } = state.deskpro;

  const mappedProps = {

    contexts: contextList.map(o => JSON.stringify(o)).map(ContextDetails.instance),

    contextProperties: propertyList.map(o => JSON.stringify(o)).map(ContextPropertyList.instance),

  };

  console.log('mapped props ', mappedProps);
  return mappedProps;
}

export default connect(
  (state, ownProps) => mapPropsToState(state, ownProps),
  (dispatch, ownProps) => mapDispatchToProps(dispatch, ownProps)
)(Component);
