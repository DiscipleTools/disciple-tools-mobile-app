import React from 'react';
import { storiesOf } from '@storybook/react-native';
import CenterView from '../storybook/stories/CenterView';
import SingleSelectWithFilter from './SingleSelectWithFilter';


storiesOf('Single Select With Filter', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
  .add('ًBasic selected', () => (
    <SingleSelectWithFilter
      containerStyle={{ backgroundColor: '#fff' }}
      items={[{ key: 4, label: 'Shady Rashad Hakim' }, { key: 3, label: 'Heidi John' }, { key: 2, label: 'Jon Wynveen' }]}
      selectedItem="item-4"
    />
  ))

  .add('ًBasic Unselected', () => (
    <SingleSelectWithFilter
      containerStyle={{ backgroundColor: '#fff' }}
      items={[{ key: 4, label: 'Shady Rashad Hakim' }, { key: 3, label: 'Heidi John' }, { key: 2, label: 'Jon Wynveen' }]}
    />
  ))

  .add('ًStyled', () => (
    <SingleSelectWithFilter
      containerStyle={{ backgroundColor: 'blue' }}
      selectedItemStyle={{ color:'#fff' }}
      items={[{ key: 4, label: 'Shady Rashad Hakim' }, { key: 3, label: 'Heidi John' }, { key: 2, label: 'Jon Wynveen' }]}
    />
  ));
