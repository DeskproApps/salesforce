import { sdkConnect } from '@deskpro/apps-sdk-react';
import { bindActionCreators } from 'redux';


function noPropsToState(state, ownProps)
{
  return {};
}


function mapActionCreatorsToProps(dispatch, ownProps, actionCreators)
{
  if (! ownProps) {
    return bindActionCreators(actionCreators, dispatch);
  }

  const missing = Object.keys(actionCreators).filter(key => !ownProps[key]);
  if (missing.length) {
    const creators = missing.reduce((acc, key) => {
      acc[key] = actionCreators[key];
      return acc
    }, {});
    return bindActionCreators(creators, dispatch);
  }

  return {}
}

/**
 * @param {function} Component
 * @param {Object} [actionCreators]
 * @return {*}
 */
export default function connector(Component, actionCreators)
{
  if (! actionCreators) {
    return sdkConnect(Component, noPropsToState);
  }

  const mapDispatchToProps = (dispatch, ownProps) => mapActionCreatorsToProps(dispatch, ownProps, actionCreators);
  return sdkConnect(Component, noPropsToState, mapDispatchToProps);
}
