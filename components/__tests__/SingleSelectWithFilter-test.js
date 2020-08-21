/* @jest-environment jsdom */

import React from 'react';
import { shallow } from 'enzyme';
import { Text } from 'react-native';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import SingleSelectWithFilter from '../SingleSelectWithFilter';

it('sets items', () => {
  const wrapper = shallow(
    <SingleSelectWithFilter
      items={[
        { key: 4, label: 'First test' },
        { key: 3, label: 'Second test' },
        { key: 2, label: 'Third text' },
      ]}
      selectedItem="4"
    />,
  );

  expect(wrapper.find(ModalFilterPicker).first().prop('options')).toEqual([
    { key: 4, label: 'First test' },
    { key: 3, label: 'Second test' },
    { key: 2, label: 'Third text' },
  ]);
});

it('sets selected item', () => {
  const wrapper = shallow(
    <SingleSelectWithFilter
      items={[
        { key: 4, label: 'First test' },
        { key: 3, label: 'Second test' },
        { key: 2, label: 'Third text' },
      ]}
      selectedItem="4"
    />,
  );

  expect(wrapper.find(Text).first().prop('children')).toEqual('First test');
});

it('Open & close selection modal', () => {
  const wrapper = shallow(
    <SingleSelectWithFilter
      items={[
        { key: 4, label: 'First test' },
        { key: 3, label: 'Second test' },
        { key: 2, label: 'Third text' },
      ]}
    />,
  );
  const instance = wrapper.instance();

  instance.updateShowSelectedItemModal(true);

  expect(instance.state.showSelectedItemModal).toBeTruthy();

  instance.onCancelSelectedItem();

  expect(instance.state.showSelectedItemModal).toBeFalsy();
});
