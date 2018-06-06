import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Component } from './Component'
import { ObjectView, ContextMapping } from "../../mapping";

import {ContextDetails, ContextPropertyList} from "../../deskpro";
import {loadFields } from "../../salesforce/dux";
import { removeMappings, replaceMappings } from "../../mapping/dux";
import { loadContexts, loadContextProperties } from "../../deskpro/dux";
/**
 * @param {Function} dispatch
 * @param {{replaceMappings: *}} ownProps
 * @return {{}|null}
 */
function mapDispatchToProps(dispatch, ownProps)
{
  if (ownProps.replaceMappings) {
    return null;
  }

  const props = { loadFields, removeMappings, replaceMappings, loadContexts, loadContextProperties }
  return bindActionCreators(props, dispatch);

}

function mapStateToProps(state, ownProps)
{
  const { objectViews, contextMappings } = state.mappings;

  const salesforceProps = {
    objectViews: objectViews.map(o => JSON.stringify(o)).map(ObjectView.instance),
    contextMappings: contextMappings.map(o => JSON.stringify(o)).map(ContextMapping.instance)
  };

  const { contextList, propertyList } = state.deskpro;
  const deskproProps = {
      contexts: contextList.map(o => JSON.stringify(o)).map(ContextDetails.instance),
      contextProperties: propertyList.map(o => JSON.stringify(o)).map(ContextPropertyList.instance),
  };

  const props = { ...salesforceProps, ...deskproProps };
  console.log('afanasie ', props);
  return props;
}

export default connect(
  (state, ownProps) => mapStateToProps(state, ownProps),
  (dispatch, ownProps) => mapDispatchToProps(dispatch, ownProps)
)(Component);
