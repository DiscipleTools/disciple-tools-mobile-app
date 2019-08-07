import { TextInput, Text } from 'react-native';
import React from 'react';

import { Icon } from 'expo';
import renderer from 'react-test-renderer';
import TextFieldMultiple from '../TextFieldMultiple';

describe('Initialization', () => {
  it('sets label text', () => {
    const textFieldMultiple = renderer.create(<TextFieldMultiple
      label="Basic Form Field"
    />).root;

    expect(textFieldMultiple).not.toBeNull();
    const label = textFieldMultiple.findByType(Text);
    expect(label).not.toBeNull();
    expect(label.props.children).toEqual('Basic Form Field');
  });

  it('sets label icon name', () => {
    const textFieldMultiple = renderer.create(<TextFieldMultiple
      label="Basic Form Field"
      iconName="ios-contact"
    />).root;

    expect(textFieldMultiple).not.toBeNull();
    const icon = textFieldMultiple.findByType(Icon.Ionicons);
    expect(icon).not.toBeNull();
    expect(icon.props.name).toEqual('ios-contact');
  });

  it('sets value', () => {
    const textFieldMultiple = renderer.create(<TextFieldMultiple
      label="Basic Form Field"
      value="My test value"
    />).root;

    expect(textFieldMultiple).not.toBeNull();
    const textInput = textFieldMultiple.findByType(TextInput);
    expect(textInput).not.toBeNull();
    expect(textInput.props.value).toEqual('My test value');
  });

  it('sets placeholder', () => {
    const textFieldMultiple = renderer.create(<TextFieldMultiple
      label="Basic Form Field"
      placeholder="Enter a value"
    />).root;

    expect(textFieldMultiple).not.toBeNull();
    const textInput = textFieldMultiple.findByType(TextInput);
    expect(textInput).not.toBeNull();
    expect(textInput.props.placeholder).toEqual('Enter a value');
  });

  it('sets remove icon name', () => {
    const textFieldMultiple = renderer.create(<TextFieldMultiple
      label="Basic Form Field"
      iconName="ios-remove"
    />).root;

    expect(textFieldMultiple).not.toBeNull();
    const icon = textFieldMultiple.findByType(Icon.Ionicons);
    expect(icon).not.toBeNull();
    expect(icon.props.name).toEqual('ios-remove');
  });
});