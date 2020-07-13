/* @jest-environment jsdom */

import React from 'react';
import { shallow } from 'enzyme';
import { Selectize } from 'react-native-material-selectize';
import MultiSelect from '../MultiSelect';

it('sets placeholder', () => {
  const wrapper = shallow(<MultiSelect placeholder="Select an item" />);

  expect(wrapper.find(Selectize).first().prop('textInputProps')).toEqual({
    placeholder: 'Select an item',
  });
});

it('sets items', () => {
  const wrapper = shallow(
    <MultiSelect
      items={[
        { value: 'item1', label: 'Item 1' },
        { value: 'item2', label: 'Item 2' },
      ]}
    />,
  );

  expect(wrapper.find(Selectize).first().prop('items')).toEqual([
    { value: 'item1', label: 'Item 1' },
    { value: 'item2', label: 'Item 2' },
  ]);
});

it('sets selectedItems', () => {
  const wrapper = shallow(
    <MultiSelect
      items={[
        { value: 'item1', label: 'Item 1' },
        { value: 'item2', label: 'Item 2' },
      ]}
      selectedItems={[{ value: 'item1', label: 'Item 1' }]}
    />,
  );

  expect(wrapper.find(Selectize).first().prop('selectedItems')).toEqual([
    { value: 'item1', label: 'Item 1' },
  ]);
});
