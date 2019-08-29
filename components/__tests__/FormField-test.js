import React from 'react';
import { Text } from 'react-native';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Icon } from 'native-base';
import FormField from '../FormField';

configure({ adapter: new Adapter() });

describe('Initialization', () => {
  it('sets label text', () => {
    const wrapper = mount(<FormField
      label="Basic Form Field">
        <Text> Test </Text>
        </FormField>)
    expect(wrapper
      .find(Text).first()
      .text()).toEqual("Basic Form Field");
  });

  it('sets label icon name', () => {
    const wrapper = shallow(<FormField
      label="Basic Form Field"
      iconName="ios-contact">
        <Text> Test </Text>
        </FormField>)
    expect(wrapper
      .find(Icon).first()
      .prop('name')).toEqual('ios-contact');
  });
});