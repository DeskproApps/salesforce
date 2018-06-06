import { configureStore as dpConfigureStore} from '@deskpro/apps-sdk-react'

import { default as mappings } from './mapping/dux'
import { default as salesforce } from './salesforce/dux'
import { default as deskpro } from './deskpro/dux'

import {ContextDetails, MappableProperty} from "./deskpro";
import {ContextPropertyList} from "./deskpro/ContextPropertyList";

/**
 * @param {AppClient} dpapp
 */
export default function configureStore (dpapp)
{
  const reducers = { mappings, salesforce, deskpro };
  return dpConfigureStore(dpapp, [], reducers, {

    mappings: {
      objectViews: [],
      contextMappings: []
    },

    salesforce: {

      objectsLoaded: false,

      objects: [],

      fields: {}
    },

    deskpro : {
      contextList: [
        new ContextDetails({ name: "ticket", label: "Ticket" }),
        new ContextDetails({ name: "person", label: "Person" }),
        new ContextDetails({ name: "organization", label: "Organization" })
      ],

      propertyList: [
        new ContextPropertyList({
          context: new ContextDetails({ name: "ticket", label: "Ticket" }),
          properties: [
            new MappableProperty({ name: "email", label: "Email" })
          ]
        }) ,
        new ContextPropertyList({
          context: new ContextDetails({ name: "person", label: "Person" }),
          properties: [
            new MappableProperty({ name: "email", label: "Email" })
          ]
        }),
        new ContextPropertyList({
          context: new ContextDetails({ name: "organization", label: "Organization" }),
          properties: [
            new MappableProperty({ name: "email", label: "Email" })
          ]
        })
      ]
    }


  });
}