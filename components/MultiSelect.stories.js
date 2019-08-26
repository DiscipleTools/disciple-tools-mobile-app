import React from 'react';
import {
  StyleSheet,
} from 'react-native';

import { storiesOf } from '@storybook/react-native';
import colors from '../constants/Colors';
import CenterView from '../storybook/stories/CenterView';
import MultiSelect from './MultiSelect';


const styles = StyleSheet.create({
  basicContainer: {
    margin: 10,
    borderBottomWidth: 1,
    borderColor: '#7a7a7a',
    marginLeft: 40,
    marginRight: 40,
  },
  customContainer: {
    margin: 20,
  },
  customIcon: {
    color: colors.tintColor,
  },
  customLabel: {

  },
  customInput: {
    color: '#ffffff',
  },
});

storiesOf('Multi Select', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)

  .add('ًBasic', () => (
      <MultiSelect
      selectedItems= {[{value: "item1", label: "Item 1"}]}
      items= {[{value: "item1", label: "Item 1"}, {value: "item2", label: "Item 2"}]}
      />
  ))
