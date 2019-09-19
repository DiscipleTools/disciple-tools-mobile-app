import React from 'react';
import { Platform } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import CenterView from '../storybook/stories/CenterView';
import SingleSelectWithFilter from './SingleSelectWithFilter';
import FormField from './FormField';


storiesOf('Single Select With Filter', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('ًBasic selected', () => (
    <SingleSelectWithFilter
      containerStyle={{ backgroundColor: '#fff' }}
      items={[
        { key: 4, label: 'First person name' }, 
        { key: 3, label: 'Second person name' }, 
        { key: 2, label: 'Third person name' }
      ]}
      selectedItem="4"
    />
  ))

  .add('ًBasic Unselected', () => (
    <SingleSelectWithFilter
      containerStyle={{ backgroundColor: '#fff' }}
      items={[
        { key: 4, label: 'First person name' }, 
        { key: 3, label: 'Second person name' }, 
        { key: 2, label: 'Third person name' }
      ]}
    />
  ))

  .add('Custom Styles', () => (
    <SingleSelectWithFilter
      containerStyle={{ backgroundColor: 'blue' }}
      selectedItemStyle={{ color:'#fff' }}
      items={[
        { key: 4, label: 'First person name' }, 
        { key: 3, label: 'Second person name' }, 
        { key: 2, label: 'Third person name' }
      ]}
    />
  ))

  .add('With form field', () => (
    <FormField
    label="Gender"
    iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
    inline
  >
    <SingleSelectWithFilter
      items={[
        { key: 4, label: 'First person name' }, 
        { key: 3, label: 'Second person name' }, 
        { key: 2, label: 'Third person name' }
      ]}
    />
    </FormField>
  ));
