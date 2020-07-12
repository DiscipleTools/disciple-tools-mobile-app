/* @jest-environment jsdom */

import { TextInput } from 'react-native';
import React from 'react';

import { shallow } from 'enzyme';
import TextField from '../TextField';

it('sets value', () => {
  const wrapper = shallow(<TextField label="Basic Form Field" value="My test value" />);

  expect(wrapper.find(TextInput).prop('value')).toEqual('My test value');
});
it('sets placeholder', () => {
  const wrapper = shallow(<TextField label="Basic Form Field" placeholder="Enter a value" />);

  expect(wrapper.find(TextInput).prop('placeholder')).toEqual('Enter a value');
});
