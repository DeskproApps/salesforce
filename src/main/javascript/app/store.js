import { configureStore as dpConfigureStore} from '@deskpro/apps-sdk-react'

import { default as mappings } from '../mapping/dux'
import { default as salesforce } from '../salesforce/dux'
import { default as deskpro } from '../deskpro/dux'

import {ContextDetails, MappablePathProperty, ContextPropertyList} from "../deskpro";
import { loadMappings } from "./actions";

/**
 * @see {ContextFactory.contextObjectTypes} from @deskpro/apps-sdk-core
 * @type {Array}
 */
const contextList = [
  new ContextDetails({ name: "ticket", label: "Ticket" }),
  new ContextDetails({ name: "person", label: "Person" }),
  new ContextDetails({ name: "organization", label: "Organization" })
];

/**
 * @param {AppClient} dpapp
 */
function createStore (dpapp)
{
  const reducers = { mappings, salesforce, deskpro };
  return dpConfigureStore(dpapp, [], reducers,
    {
      mappings: {
        loaded: false,
        objectViews: [],
        contextMappings: []
      },

      salesforce: {
        userInfo: null,
        objectsLoaded: false,
        objects: [],
        fields: {}
      },

      deskpro : {
        contextList,

        propertyList: [
          new ContextPropertyList({
            context: new ContextDetails({ name: "ticket", label: "Ticket" }),
            properties: [
              new MappablePathProperty({ label: "Ticket Owner Email", path: "person_email.email" })
            ]
          }) ,
          new ContextPropertyList({
            context: new ContextDetails({ name: "person", label: "Person" }),
            properties: [
              new MappablePathProperty({ label: "Person primary email", path: "primary_email.email" })
            ]
          }),
          new ContextPropertyList({
            context: new ContextDetails({ name: "organization", label: "Organization" }),
            properties: [
              new MappablePathProperty({ label: "Organization  Name", path: "name" })
            ]
          })
        ]
      }
    }
  );
}

/**
 * @param {AppClient} dpapp
 * @return {Promise<store, Error>}
 */
export default function configureStore (dpapp)
{
  const store = createStore(dpapp);
  return store.dispatch(loadMappings()).then(() => store);
}