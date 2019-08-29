import React from 'react';
import {
  Platform,
  StyleSheet,
} from 'react-native';

import { storiesOf } from '@storybook/react-native';
import { View } from 'native-base';
import colors from '../constants/Colors';
import CenterView from '../storybook/stories/CenterView';
import TextFieldMultiple from './TextFieldMultiple';

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

storiesOf('Text Field Multiple', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)

  .add('Basic', () => (
    <TextFieldMultiple
      placeholder="Agent name"
      textInputValue={[{
        key: 999,
        value: 'my sample value',
      }, {
        key: 998,
        value: 'you should not see this',
        delete: true,
      }]}
    />
  ))
  .add('Styled', () => (
    <TextFieldMultiple
      label="Assigned to"
      // placeholder="Enter a value"
      iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
      containerStyle={{ backgroundColor: '#fff', padding: 20 }}
      iconStyle={{ color: 'red' }}
      placeholder="Agent name"
      textInputValue={[{
        key: 999,
        value: 'my sample value',
      }, {
        key: 998,
        value: 'you should see this',
      }]}
      labelStyle={{ color: 'red' }}
      textInputStyle={{ color: 'green' }}
    />
  ))
  .add('ًWith deleted items', () => (
    <TextFieldMultiple
      label="Assigned to"
      // placeholder="Enter a value"
      iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
      containerStyle={{ backgroundColor: '#fff', padding: 20 }}
      iconStyle={{ color: 'red' }}
      placeholder="Agent name"
      textInputValue={[{
        key: 999,
        value: 'my sample value',
        delete: true,
      }, {
        key: 998,
        value: 'you should see this',
      }]}
      labelStyle={{ color: 'red' }}
      textInputStyle={{ color: 'green' }}
    />
  ))
  .add('ًMultiple items', () => (
    <View>
      <TextFieldMultiple
        label="Assigned to"
      // placeholder="Enter a value"
        iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
        containerStyle={styles.customContainer}
        iconStyle={styles.customIcon}
        placeholder="Agent name"
        textInputValue={[{
          key: 999,
          value: 'my sample value',
        }, {
          key: 998,
          value: 'you should not see this',
          delete: true,
        }]}
      />
      <TextFieldMultiple
        label="Assigned to"
      // placeholder="Enter a value"
        iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
        containerStyle={styles.customContainer}
        iconStyle={styles.customIcon}
        placeholder="Agent name"
        textInputValue={[{
          key: 999,
          value: 'my sample value',
        }, {
          key: 998,
          value: 'you should not see this',
          delete: true,
        }]}
      />
    </View>
  ));
