import { TextInput, Text } from 'react-native';
import React from 'react';

import { Icon } from 'expo';
import renderer from 'react-test-renderer';
import TextField from '../TextField';

describe('label', () => {
  it('sets label', () => {
    const textField = renderer.create(<TextField
      label="Basic Form Field"
    />).root;

    expect(textField).not.toBeNull();
    const label = textField.findByType(Text);
    expect(label).not.toBeNull();
    expect(label.props.children).toEqual('Basic Form Field');
  });
});

describe('icon', () => {
  it('sets icon name', () => {
    const textField = renderer.create(<TextField
      label="Basic Form Field"
      iconName="ios-contact"
    />).root;

    expect(textField).not.toBeNull();
    const icon = textField.findByType(Icon.Ionicons);
    expect(icon).not.toBeNull();
    expect(icon.props.name).toEqual('ios-contact');
  });
});

describe('text input', () => {
  it('sets value', () => {
    const textField = renderer.create(<TextField
      label="Basic Form Field"
      value="My test value"
    />).root;

    expect(textField).not.toBeNull();
    const textInput = textField.findByType(TextInput);
    expect(textInput).not.toBeNull();
    expect(textInput.props.value).toEqual('My test value');
  });
  it('sets placeholder', () => {
    const textField = renderer.create(<TextField
      label="Basic Form Field"
      placeholder="Enter a value"
    />).root;

    expect(textField).not.toBeNull();
    const textInput = textField.findByType(TextInput);
    expect(textInput).not.toBeNull();
    expect(textInput.props.placeholder).toEqual('Enter a value');
  });
});
