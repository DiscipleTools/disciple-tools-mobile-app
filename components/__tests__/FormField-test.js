import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Icon } from 'native-base';
import FormField from '../FormField';

configure({ adapter: new Adapter() });

describe('Initialization', () => {
  it('sets label text', () => {
    const wrapper = shallow(<FormField
      label="Basic Form Field"
    />)
    await eventually(() => expect(wrapper
      .find(Text).first()
      .text()).toEqual('Basic Form Field'));
  });

  it('sets label icon name', () => {
    const wrapper = shallow(<FormField
      iconName="ios-contact"
    />)
    expect(wrapper
      .find(Icon).first()
      .prop('name')).toEqual('ios-contact');
  });
});