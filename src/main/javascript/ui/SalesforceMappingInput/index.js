import { connect } from 'react-redux';
import { addMapping as actionAddMapping } from "../../mapping/dux";
import { Component } from './Component'


function mapDispatchToProps(dispatch)
{
  /**
   * @param {ObjectView} view
   * @param {Array<ContextMapping>}  contextMappings
   * @return {Promise}
   */
  const addMapping = (view, contextMappings) => dispatch(actionAddMapping(view, contextMappings));

  return ({ addMapping });
}

export default connect(
  state => ({}),
  dispatch => mapDispatchToProps(dispatch)
)(Component)

;
