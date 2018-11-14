import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux'
import  '../../setup';
import { createMockStore } from '../../mocks';

import { default as getInitialState } from '../../../src/salesforce/dux.state';
import { default as Component } from '../../../src/ui/SalesforceMappingAdd';

test('connected component is mounted', () => {

  const dpapp = {
    restApi: {
      fetchProxy: () => Promise.resolve(null)
    }
  };
  const store = createMockStore({
      dpapp,
      additionalState: {
        salesforce: {  ...getInitialState(), apiVersion: "v37.0", instanceUrl: "https://eu8.salesforce.com" }
      }
    }
  );
  const wrapper = mount(<Provider store={store}><Component /></Provider>);

  expect(wrapper.isEmptyRender()).toBe(false);

  const loadObjects = wrapper.find('Component').prop('loadObjects');
  expect(typeof loadObjects).toBe('function');
  // expect(wrapper.find('Component').prop('loadObjects')).toBe('Loading...');
  // expect(wrapper.state('error')).toBeNull();

  wrapper.unmount();

});
