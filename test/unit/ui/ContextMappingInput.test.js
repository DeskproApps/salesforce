import React from 'react';
import { mount, shallow } from 'enzyme';

import { createStore } from '../../../src/app/store';
import { default as Component } from '../../../src/ui/ContextMappingInput';

test('connected component is exported as default', () => {

  expect(typeof Component).toEqual("function")

});
