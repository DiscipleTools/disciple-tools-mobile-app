import React from 'react';
import { Text } from 'react-native';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Icon } from 'native-base';
import FormField from '../FormField';

configure({ adapter: new Adapter() });

it('sets label text', () => {
  const wrapper = shallow(
    <FormField label="Basic Form Field">
      <Text> Test </Text>
    </FormField>,
  );
  expect(wrapper.find(Text).first().prop('children')).toEqual('Basic Form Field');
});

it('sets label icon name', () => {
  const wrapper = shallow(
    <FormField label="Basic Form Field" iconName="ios-contact">
      <Text> Test </Text>
    </FormField>,
  );
  expect(wrapper.find(Icon).first().prop('name')).toEqual('ios-contact');
});
