import React from 'react';
import { mount, shallow } from 'enzyme';
import { createMockDpapp } from '../../mocks';

import { createStore } from '../../../main/javascript/app/store';
import { default as Component } from '../../../main/javascript/ui/ContextMappingInput';

test('connected component is exported as default', () => {

  expect(typeof Component).toEqual("function")

});