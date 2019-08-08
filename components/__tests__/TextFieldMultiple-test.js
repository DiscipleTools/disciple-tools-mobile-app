import { Text } from 'react-native';
import { Icon, Input } from 'native-base';
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import renderer from 'react-test-renderer';
import TextFieldMultiple from '../TextFieldMultiple';

configure({ adapter: new Adapter() });

describe('Initialization', () => {
  it('sets label text', () => {
    const wrapper = shallow(<TextFieldMultiple
      label="Basic Form Field" />);

      const textElement = wrapper.find(Text);
      expect(textElement).not.toBeNull();
      expect(textElement.length).toEqual(1);
      console.log(textElement.text());
      expect(textElement.text()).toEqual("Basic Form Field");

      // expect(textElements[0])
    // const textFieldMultiple = renderer.create(<TextFieldMultiple
    //   label="Basic Form Field"
    // />).root;

    // expect(textFieldMultiple).not.toBeNull();
    // const label = textFieldMultiple.findByType(Text);
    // expect(label).not.toBeNull();
    // expect(label.props.children).toEqual('Basic Form Field');
  });

  it.skip('sets label icon name', () => {
    const textFieldMultiple = renderer.create(<TextFieldMultiple
      label="Basic Form Field"
      iconName="ios-contact"
    />).root;

    expect(textFieldMultiple).not.toBeNull();
    const icon = textFieldMultiple.findByType(Icon);
    expect(icon).not.toBeNull();
    expect(icon.props.name).toEqual('ios-contact');
  });

  it.skip('sets value', () => {
    const textFieldMultiple = renderer.create(<TextFieldMultiple
      label="Basic Form Field"
      value="My test value"
      textInputValue={[{value:""}]}
    />).root;

    expect(textFieldMultiple).not.toBeNull();
    const textInput = textFieldMultiple.findByType(Input);
    expect(textInput).not.toBeNull();
    expect(textInput.props.value).toEqual('My test value');
  });

  it.skip('sets placeholder', () => {
    const textFieldMultiple = renderer.create(<TextFieldMultiple
      label="Basic Form Field"
      placeholder="Enter a value"
    />).root;

    expect(textFieldMultiple).not.toBeNull();
    const textInput = textFieldMultiple.findByType(Input);
    expect(textInput).not.toBeNull();
    expect(textInput.props.placeholder).toEqual('Enter a value');
  });

  it.skip('sets remove icon name', () => {
    const textFieldMultiple = renderer.create(<TextFieldMultiple
      label="Basic Form Field"
      iconName="ios-remove"
    />).root;

    expect(textFieldMultiple).not.toBeNull();
    const icon = textFieldMultiple.findByType(Icon);
    expect(icon).not.toBeNull();
    expect(icon.props.name).toEqual('ios-remove');
  });

  it.skip('sets default state', () => {
    const wrapper = shallow(<TextFieldMultiple/>);
    //Accessing component state
    expect(wrapper.state.values.length).toBe(1);
    expect(wrapper.state.values[0].value).toBe("");
  });
  it.skip('sets edit state', () => {
    const wrapper = shallow(<TextFieldMultiple/>);
    //Accessing component state
    expect(wrapper.state.values.length).toBe(2);
    expect(wrapper.state.values[1].value).toBe("");
  });
});