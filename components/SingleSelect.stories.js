import React from 'react';
import {
  Platform,
  StyleSheet,
} from 'react-native';
import { storiesOf } from '@storybook/react-native';
import colors from '../constants/Colors';
import CenterView from '../storybook/stories/CenterView';
import SingleSelect from './SingleSelect';
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

storiesOf('Single Select', module)
  .addDecorator(getStory => <CenterView>{getStory()}</CenterView>)
   .add('ًBasic', () => (
    <SingleSelect
      items={[
        { label: "", value: "not-set" }, 
        { label: "Male" , value: "male"} ,
        { label: "Female", value: "female"}
      ]}
      selectedItem= "male"
      onChange= {()=>{}}
    />  ))

  .add('ًWith form', () => (
    <FormField
      label="Gender"
      iconName={Platform.OS === 'ios' ? 'ios-contact' : 'md-contact'}
      containerStyle={styles.customContainer}
      iconStyle={styles.customIcon}
      inline
    >
    <SingleSelect
      items={[
        { label: "", value: "not-set" }, 
        { label: "Male" , value: "male"} ,
        { label: "Female", value: "female"}
      ]}
      selectedItem= "male"
      onChange= {()=>{}}
    />
    </FormField>
))
