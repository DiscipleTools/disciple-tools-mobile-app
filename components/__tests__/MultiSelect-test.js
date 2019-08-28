/* @jest-environment jsdom */

import React from 'react';
import { shallow } from 'enzyme';
import { Chip, Selectize } from 'react-native-material-selectize';
import MultiSelect from '../MultiSelect';

describe('Multi Select', () => {
  it('Placeholder', () => {
    const wrapper = shallow(<MultiSelect
      placeholder= "Select an item"
      />);

    expect(wrapper
      .find(Selectize).first()
      .prop('textInputProps')).toEqual({placeholder: "Select an item"});
  });
  
  it('sets items', () => {
    const wrapper = shallow(<MultiSelect
      items={[
        { value: 'item1', label: 'Item 1' }, 
        { value: 'item2', label: 'Item 2' }
      ]}
      />);

    expect(wrapper
      .find(Selectize).first()
      .prop('items')).toEqual([
        { value: 'item1', label: 'Item 1' }, 
        { value: 'item2', label: 'Item 2' }
      ]);
  });

  it('select item', () => {
    const wrapper = shallow(<MultiSelect
      items={[
        { value: 'item1', label: 'Item 1' }, 
        { value: 'item2', label: 'Item 2' }
      ]}
      selectedItems={[{ value: 'item1', label: 'Item 1' }]}
      />);

    expect(wrapper
      .find(Selectize).first()
      .prop('selectedItems')).toEqual([
        { value: 'item1', label: 'Item 1' }
      ]);
  });

  it('selects item 1 of 3', () => {
    const wrapper = shallow(<MultiSelect
      items={[
        { value: 'item1', label: 'Item 1' }, 
        { value: 'item2', label: 'Item 2' },
        { value: 'item3', label: 'Item 3' }
      ]}
      selectedItems={[{ value: 'item1', label: 'Item 1' }]}

      />);

      const instance = wrapper.instance();
    expect(instance.state.selectedItems[0].value).toBe("item1");

    Selectize.TouchableOpacity.onPress;

    expect(instance.state.selectedItems.value).toBe("[{ value: 'item1', label: 'Item 1' }]");
  });
});
