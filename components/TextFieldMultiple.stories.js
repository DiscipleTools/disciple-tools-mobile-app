import React from 'react';
import {
  Platform,
  StyleSheet,
} from 'react-native';
import FormField from './FormField';
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
      items={[{
        key: 999,
        value: 'Sample value 1',
      }, {
        key: 998,
        value: 'Sample value 2',
      }, {
        key: 998,
        value: 'Sample value 3',
      }, {
        key: 998,
        value: 'Sample value 4',
      }]}
      onChange={()=>{}}
    />
  ))

  .add('Custom Styles', () => (
    <TextFieldMultiple
      label="Assigned to"
      iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
      containerStyle={{ backgroundColor: '#fff', padding: 20 }}
      iconStyle={{ color: 'red' }}
      placeholder="Agent name"
      items={[{
        key: 999,
        value: 'my sample value',
      }, {
        key: 998,
        value: 'you should see this',
      }]}
      labelStyle={{ color: 'red' }}
      textInputStyle={{ color: 'green' }}
      onChange={()=>{}}

    />
  ))
  .add('ًWith deleted items', () => (
    <TextFieldMultiple
      label="Assigned to"
      iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
      containerStyle={{ backgroundColor: '#fff', padding: 20 }}
      iconStyle={{ color: 'red' }}
      placeholder="Agent name"
      items={[{
        key: 999,
        value: 'my sample value',
        delete: true,
      }, {
        key: 998,
        value: 'you should see this',
      }]}
      labelStyle={{ color: 'red' }}
      textInputStyle={{ color: 'green' }}
      onChange={()=>{}}

    />
  ))

  .add('With form field', () => (
    <FormField
      label="Phone"
      iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
    >
      <TextFieldMultiple
        placeholder="Agent name"
        items={[{
          key: 999,
          value: 'Sample value 1',
        }, {
          key: 998,
          value: 'Sample value 2',
        }, {
          key: 998,
          value: 'Sample value 3',
        }, {
          key: 998,
          value: 'Sample value 4',
        }]}
        onChange={()=>{}}
      />
    </FormField>
  ))

  .add('ًMultiple items', () => (
    <View>
      <TextFieldMultiple
        label="Assigned to"
        iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
        containerStyle={styles.customContainer}
        iconStyle={styles.customIcon}
        placeholder="Agent name"
        items={[{
          key: 999,
          value: 'my sample value',
        }, {
          key: 998,
          value: 'you should not see this',
          delete: true,
        }]}
        onChange={()=>{}}

      />
      <TextFieldMultiple
        label="Assigned to"
        iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
        containerStyle={styles.customContainer}
        iconStyle={styles.customIcon}
        placeholder="Agent name"
        items={[{
          key: 999,
          value: 'my sample value',
        }, {
          key: 998,
          value: 'you should not see this',
          delete: true,
        }]}
        onChange={()=>{}}

      />
    </View>
  ));
