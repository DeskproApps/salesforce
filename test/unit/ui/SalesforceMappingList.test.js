import React from 'react';
import { mount, shallow } from 'enzyme';
import  '../../setup';
import { Provider } from 'react-redux'

import { createStore } from '../../../src/app/store';
import { default as Component } from '../../../src/ui/SalesforceMappingList';

test('connected component is exported as default', () => {

  const dpapp = {};
  const store = createStore(dpapp);
  const wrapper = mount(<Provider store={store}><Component /></Provider>);

  expect(wrapper.isEmptyRender()).toBe(false);

  // check a property to be sure
  const loadFields = wrapper.find('Component').prop('loadFields');
  expect(typeof loadFields).toBe('function');
});
