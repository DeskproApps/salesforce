import { configureStore as dpConfigureStore} from '@deskpro/apps-sdk-react'

import { default as mappings } from './mapping/dux'


/**
 * @param {AppClient} dpapp
 */
export default function configureStore (dpapp)
{
  const reducers = { mappings };
  return dpConfigureStore(dpapp, [], reducers, {
    mappings: {
      objectViews: [],
      contextMappings: []
    }
  });
}