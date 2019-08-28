/* @jest-environment jsdom */

import React from 'react';
import { shallow } from 'enzyme';
import { Picker } from 'native-base';
import SingleSelect from '../SingleSelect';

describe('single select', () => {
  it('sets values', () => {
    const wrapper = shallow(<SingleSelect
      items={[
        { label: '', value: 'not-set' },
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
      ]}   
      selectedItem="male" 
      />);

    expect(wrapper
      .find(Picker.Item).first()
      .prop('value')).toEqual('not-set');
    expect(wrapper
      .find(Picker.Item).first()
      .prop('label')).toEqual('');

    expect(wrapper
      .find(Picker.Item).last()
      .prop('value')).toEqual('female');
    expect(wrapper
      .find(Picker.Item).last()
      .prop('label')).toEqual('Female');

    expect(wrapper
      .find(Picker)
      .prop('selectedValue')).toEqual('male');
  });
  
});