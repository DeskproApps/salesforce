import React from 'react';
import { mount, shallow } from 'enzyme';
import { Provider } from 'react-redux'
import { createMockDpapp, createMockStore } from '../../mocks';

import { default as getInitialState } from '../../../main/javascript/salesforce/dux.state';
import { default as Component } from '../../../main/javascript/ui/SalesforceMappingAdd';

test('connected component is mounted', () => {

  const dpapp = createMockDpapp();
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