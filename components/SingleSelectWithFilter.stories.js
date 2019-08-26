import React from 'react';
import {
  StyleSheet,
} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import colors from '../constants/Colors';
import CenterView from '../storybook/stories/CenterView';
import SingleSelectWithFilter from './SingleSelectWithFilter';
import FormField from './FormField';

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

storiesOf('Single Select With Filter', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
   .add('ًBasic', () => (
    <SingleSelectWithFilter
    items={[{ key: 4, label: 'Shady Rashad Hakim' }, { key: 3, label: 'Heidi John' }, { key: 2, label: 'Jon Wynveen' }]}
    selectedItem={`item-4`}
    /> ))

