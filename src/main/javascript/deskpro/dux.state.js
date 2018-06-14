import {ContextDetails} from "./ContextDetails";
import {MappablePathProperty} from "./MappablePathProperty";
import {ContextPropertyList} from "./ContextPropertyList";

/**
 * @return {{contextList: Array<ContextDetails>, propertyList: Array<ContextPropertyList>}}
 */
export default function initialState(additionalState)
{
  /**
   * @see {ContextFactory.contextObjectTypes} from @deskpro/apps-sdk-core
   * @type {Array}
   */
  const contextList = [
    new ContextDetails({ name: "ticket", label: "Ticket" }),
    new ContextDetails({ name: "person", label: "Person" }),
    new ContextDetails({ name: "organization", label: "Organization" })
  ];

  const propertyList = [
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
  ];

  return additionalState && typeof additionalState === 'object' ? { contextList, propertyList, ...additionalState } : { contextList, propertyList };
}

/**
 * @param {Object} state
 * @return {Array<ContextDetails>}
 */
export function contextList(state)
{
  const { contextList } = state.deskpro;
  return contextList.map(o => JSON.stringify(o)).map(ContextDetails.instance)
}

/**
 * @param {Object} state
 * @return {Array<ContextPropertyList>}
 */
export function propertyList(state)
{
  const { propertyList } = state.deskpro;
  return propertyList.map(o => JSON.stringify(o)).map(ContextPropertyList.instance)
}