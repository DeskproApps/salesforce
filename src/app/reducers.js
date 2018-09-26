import {  combineReducers } from 'redux';

import { default as mapping } from '../mapping/dux'
import { default as salesforce } from '../salesforce/dux'
import { default as deskpro } from '../deskpro/dux'

/**
 * @return {{mapping: reducer, salesforce: reducer, deskpro: reducer}}
 */
export function getReducers()
{
  return  { mapping, salesforce, deskpro }
}

const reducer = combineReducers({ mapping, salesforce, deskpro });
export default reducer;
