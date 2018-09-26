import { loadContextProperties } from '../../../src/deskpro/dux';
import {ContextDetails, MappablePathProperty} from "../../../src/deskpro";

test('test loadContextProperties returns empty list when there are no properties', () => {

  const dispatch = jest.fn();
  const getState = () => ({
    deskpro: {
      propertyList: []
    }
  });
  const dpapp = {};

  const context = ContextDetails.instance({ name: "ticket", label: "Ticket" });
  const thunk = loadContextProperties(context);


  return thunk(dispatch, getState, dpapp)
    .then(
      properties => expect(properties).toEqual([])
    );
});

test('test loadContextProperties returns empty list when context has no property', () => {

  const dispatch = jest.fn();
  const getState = () => ({
    deskpro: {
      propertyList: []
    }
  });
  const dpapp = {};

  const context = ContextDetails.instance({ name: "ticket", label: "Ticket" });
  const thunk = loadContextProperties(context);

  return thunk(dispatch, getState, dpapp)
    .then(
      properties => expect(properties).toEqual([])
    );
});
