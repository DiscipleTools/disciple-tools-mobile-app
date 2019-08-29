/* @jest-environment jsdom */

import React from 'react';
import { shallow, mount } from 'enzyme';
import { Text } from 'react-native';
import SingleSelectWithFilter from '../SingleSelectWithFilter';
import ModalFilterPicker from 'react-native-modal-filter-picker';

describe('single select with filter', () => {

  it('sets items', () => {
    const wrapper = shallow(<SingleSelectWithFilter
      items= {[
        { key: 4, label: 'First test' }, 
        { key: 3, label: 'Second test' }, 
        { key: 2, label: 'Third text' }
      ]}
      selectedItem= {`item-4`}
      />);

  expect(wrapper
    .find(ModalFilterPicker).first()
    .prop('options')).toEqual([
      { key: 4, label: 'First test' }, 
      { key: 3, label: 'Second test' }, 
      { key: 2, label: 'Third text' }]);
  });
  
  it('sets selected item', () => {
    const wrapper = shallow(<SingleSelectWithFilter
      items= {[
        { key: 4, label: 'First test' }, 
        { key: 3, label: 'Second test' }, 
        { key: 2, label: 'Third text' }
      ]}
      selectedItem= {`item-4`}
      />);
     
  expect(wrapper
    .find(Text).first()
    .prop('children')).toEqual('First test');
  });

  it('Unselect', () => {
    const wrapper = shallow(<SingleSelectWithFilter
      items= {[
        { key: 4, label: 'First test' }, 
        { key: 3, label: 'Second test' }, 
        { key: 2, label: 'Third text' }
      ]}
      />);
      const instance = wrapper.instance();

      instance.updateShowSelectedItemModal(true);

      expect(instance.state.showSelectedItemModal).toBeTruthy();

      instance.onCancelSelectedItem();

      expect(instance.state.showSelectedItemModal).toBeFalsy();

  });
});