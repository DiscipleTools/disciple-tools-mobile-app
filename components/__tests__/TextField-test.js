/* @jest-environment jsdom */

import { TextInput, Text } from 'react-native';
import React from 'react';

import { Icon } from 'expo';
import { shallow, mount } from 'enzyme';
import TextField from '../TextField';

describe('label', () => {
  it('sets label', () => {
    const wrapper = mount(<TextField
      label="Basic Form Field"
    />);
    expect(wrapper.find(Text).text()).toEqual('Basic Form Field');
  });
});

describe('icon', () => {
  it('sets icon name', () => {
    const wrapper = shallow(<TextField
      label="Basic Form Field"
      iconName="ios-contact"
    />);
    expect(wrapper
      .find(Icon.Ionicons)
      .prop('name')).toEqual('ios-contact');
  });
});

describe('text input', () => {
  it('sets value', () => {
    const wrapper = shallow(<TextField
      label="Basic Form Field"
      value="My test value"
    />);

    expect(wrapper
      .find(TextInput)
      .prop('value')).toEqual('My test value');
  });
  it('sets placeholder', () => {
    const wrapper = shallow(<TextField
      label="Basic Form Field"
      placeholder="Enter a value"
    />);

    expect(wrapper
      .find(TextInput)
      .prop('placeholder')).toEqual('Enter a value');
  });
});
