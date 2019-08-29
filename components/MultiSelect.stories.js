import React from 'react';

import { storiesOf } from '@storybook/react-native';
import CenterView from '../storybook/stories/CenterView';
import MultiSelect from './MultiSelect';

storiesOf('Multi Select', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)

  .add('ًBasic', () => (
    <MultiSelect
      selectedItems={[{ value: 'item1', label: 'Item 1' }]}
      items={[{ value: 'item1', label: 'Item 1' }, { value: 'item2', label: 'Item 2' }]}
      placeholder="testy"
    />
  ));
