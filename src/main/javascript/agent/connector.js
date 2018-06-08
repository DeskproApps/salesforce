import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { readUserInfo, loadMappings } from '../app/actions'

function mapPropsToState(state, ownProps)
{
  return {};
}

function mapDispatchToProps(dispatch, ownProps)
{
  if (ownProps.readUserInfo) {
    return {}
  }

  return bindActionCreators({ readUserInfo, loadMappings }, dispatch);
}

export default function connector(App)
{
  return connect(
    (state, ownProps) => mapPropsToState(state, ownProps),
    (dispatch, ownProps) => mapDispatchToProps(dispatch, ownProps)
  )(App);

}