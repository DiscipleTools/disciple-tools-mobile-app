import { Input } from 'native-base';
import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TextFieldMultiple from '../TextFieldMultiple';

configure({ adapter: new Adapter() });

describe('Initialization', () => {
  it('sets value', () => {
    const wrapper = shallow(
      <TextFieldMultiple items={[{ value: 'My test value' }]} onChange={() => {}} />,
    );

    expect(wrapper.find(Input).first().prop('value')).toEqual('My test value');
  });

  it('sets placeholder', () => {
    const wrapper = shallow(<TextFieldMultiple placeholder="Enter a value" onChange={() => {}} />);

    expect(wrapper.find(Input).prop('placeholder')).toEqual('Enter a value');
  });

  it('sets value to empty string if value prop is undefined', () => {
    const wrapper = shallow(<TextFieldMultiple onChange={() => {}} />);
    const instance = wrapper.instance();
    expect(instance.state.values.length).toBe(1);
    expect(instance.state.values[0].value).toBe('');

    // test length
    expect(wrapper.find(Input).length).toEqual(1);

    // test first item
    expect(wrapper.find(Input).prop('value')).toEqual('');
  });
  it('sets edit state', () => {
    const wrapper = shallow(
      <TextFieldMultiple items={[{ value: 'My test value' }]} onChange={() => {}} />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values.length).toBe(2);
    expect(instance.state.values[0].value).toBe('My test value');
    expect(instance.state.values[1].value).toBe('');

    // test length
    expect(wrapper.find(Input).length).toEqual(2);

    // test first item
    expect(wrapper.find(Input).first().prop('value')).toEqual('My test value');
    // test second item
    expect(wrapper.find(Input).last().prop('value')).toEqual('');
  });
});

describe('onRemoveItem', () => {
  it('removes item 1 of 3', () => {
    const wrapper = shallow(
      <TextFieldMultiple
        items={[
          { value: '432', key: 234 },
          { value: '2345', key: 213 },
          { value: '653', key: 323 },
        ]}
        onChange={() => {}}
      />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values[0].delete).toBeFalsy();
    expect(instance.state.values[1].delete).toBeFalsy();
    expect(instance.state.values[2].delete).toBeFalsy();

    instance.onRemoveField(0);

    expect(instance.state.values[0].delete).toBeTruthy();
    expect(instance.state.values[1].delete).toBeFalsy();
    expect(instance.state.values[2].delete).toBeFalsy();
  });

  it('removes item 3 of 3', () => {
    const wrapper = shallow(
      <TextFieldMultiple
        items={[
          { value: '432', key: 234 },
          { value: '2345', key: 213 },
          { value: '653', key: 323 },
        ]}
        onChange={() => {}}
      />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values[0].delete).toBeFalsy();
    expect(instance.state.values[1].delete).toBeFalsy();
    expect(instance.state.values[2].delete).toBeFalsy();

    instance.onRemoveField(2);

    expect(instance.state.values[0].delete).toBeFalsy();
    expect(instance.state.values[1].delete).toBeFalsy();
    expect(instance.state.values[2].delete).toBeTruthy();
  });

  it('removes item 1 of 1', () => {
    const wrapper = shallow(
      <TextFieldMultiple items={[{ value: '432', key: 234 }]} onChange={() => {}} />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values[0].delete).toBeFalsy();

    instance.onRemoveField(0);

    expect(instance.state.values[0].delete).toBeTruthy();
  });

  it('removes item 1 of 3 with deleted', () => {
    const wrapper = shallow(
      <TextFieldMultiple
        items={[
          { value: '432', key: 234 },
          { value: '2345', key: 213 },
          { value: '653', key: 323, delete: true },
          { value: '653', key: 323 },
        ]}
        onChange={() => {}}
      />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values[0].delete).toBeFalsy();
    expect(instance.state.values[1].delete).toBeFalsy();
    expect(instance.state.values[2].delete).toBeTruthy();
    expect(instance.state.values[3].delete).toBeFalsy();

    instance.onRemoveField(0);

    expect(instance.state.values[0].delete).toBeTruthy();
    expect(instance.state.values[1].delete).toBeFalsy();
    expect(instance.state.values[2].delete).toBeTruthy();
    expect(instance.state.values[3].delete).toBeFalsy();
  });

  it('removes item 3 of 3 with deleted', () => {
    const wrapper = shallow(
      <TextFieldMultiple
        items={[
          { value: '432', key: 234 },
          { value: '2345', key: 213 },
          { value: '653', key: 323, delete: true },
          { value: '653', key: 323 },
        ]}
        onChange={() => {}}
      />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values[0].delete).toBeFalsy();
    expect(instance.state.values[1].delete).toBeFalsy();
    expect(instance.state.values[2].delete).toBeTruthy();
    expect(instance.state.values[3].delete).toBeFalsy();

    instance.onRemoveField(3);

    expect(instance.state.values[0].delete).toBeFalsy();
    expect(instance.state.values[1].delete).toBeFalsy();
    expect(instance.state.values[2].delete).toBeTruthy();
    expect(instance.state.values[3].delete).toBeTruthy();
  });

  it('removes item 1 of 1 with deleted', () => {
    const wrapper = shallow(
      <TextFieldMultiple items={[{ value: '653', key: 323, delete: true }]} onChange={() => {}} />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values[0].delete).toBeTruthy();

    instance.onRemoveField(0);

    expect(instance.state.values[0].delete).toBeTruthy();
  });
});

describe('onFieldChange', () => {
  it('change item 1 of 3', () => {
    const wrapper = shallow(
      <TextFieldMultiple
        items={[
          { value: '432', index: 0 },
          { value: '2345', index: 1 },
          { value: '653', index: 2 },
        ]}
        onChange={() => {}}
      />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values[0].value).toBe('432');
    expect(instance.state.values[1].value).toBe('2345');
    expect(instance.state.values[2].value).toBe('653');

    instance.onFieldChange('1 of 3', 0);

    expect(instance.state.values[0].value).toBe('1 of 3');
    expect(instance.state.values[1].value).toBe('2345');
    expect(instance.state.values[2].value).toBe('653');
  });

  it('change item 2 of 3', () => {
    const wrapper = shallow(
      <TextFieldMultiple
        items={[
          { value: '432', index: 0 },
          { value: '2345', index: 1 },
          { value: '653', index: 2 },
        ]}
        onChange={() => {}}
      />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values[0].value).toBe('432');
    expect(instance.state.values[1].value).toBe('2345');
    expect(instance.state.values[2].value).toBe('653');

    instance.onFieldChange('2 of 3', 1);

    expect(instance.state.values[0].value).toBe('432');
    expect(instance.state.values[1].value).toBe('2 of 3');
    expect(instance.state.values[2].value).toBe('653');
  });

  it('change item 3 of 3', () => {
    const wrapper = shallow(
      <TextFieldMultiple
        items={[
          { value: '432', index: 0 },
          { value: '2345', index: 1 },
          { value: '653', index: 2 },
        ]}
        onChange={() => {}}
      />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values[0].value).toBe('432');
    expect(instance.state.values[1].value).toBe('2345');
    expect(instance.state.values[2].value).toBe('653');

    instance.onFieldChange('3 of 3', 2);

    expect(instance.state.values[0].value).toBe('432');
    expect(instance.state.values[1].value).toBe('2345');
    expect(instance.state.values[2].value).toBe('3 of 3');
  });

  it('changes final empty item', () => {
    const wrapper = shallow(
      <TextFieldMultiple
        items={[
          { value: '432', index: 0 },
          { value: '2345', index: 1 },
          { value: '653', index: 2 },
        ]}
        onChange={() => {}}
      />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values[0].value).toBe('432');
    expect(instance.state.values[1].value).toBe('2345');
    expect(instance.state.values[2].value).toBe('653');

    instance.onFieldChange('4 of 3', 3);

    expect(instance.state.values[0].value).toBe('432');
    expect(instance.state.values[1].value).toBe('2345');
    expect(instance.state.values[2].value).toBe('653');
    expect(instance.state.values[3].value).toBe('4 of 3');
  });

  it('adds empty item', () => {
    const wrapper = shallow(
      <TextFieldMultiple
        items={[
          { value: '432', index: 0 },
          { value: '2345', index: 1 },
          { value: '653', index: 2 },
        ]}
        onChange={() => {}}
      />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values[0].value).toBe('432');
    expect(instance.state.values[1].value).toBe('2345');
    expect(instance.state.values[2].value).toBe('653');

    instance.onFieldChange('4 of 3', 3);

    expect(instance.state.values.length).toBe(5);
    expect(instance.state.values[0].value).toBe('432');
    expect(instance.state.values[1].value).toBe('2345');
    expect(instance.state.values[2].value).toBe('653');
    expect(instance.state.values[3].value).toBe('4 of 3');
    expect(instance.state.values[4].value).toBe('');
  });

  it('adds empty item', () => {
    const wrapper = shallow(
      <TextFieldMultiple
        items={[
          { value: '432', index: 0 },
          { value: '2345', index: 1, delete: true },
          { value: '653', index: 2 },
          { value: '5322', index: 3 },
        ]}
        onChange={() => {}}
      />,
    );
    const instance = wrapper.instance();
    expect(instance.state.values[0].value).toBe('432');
    expect(instance.state.values[1].value).toBe('2345');
    expect(instance.state.values[2].value).toBe('653');

    instance.onFieldChange('4 of 3', 3);

    expect(instance.state.values.length).toBe(5);
    expect(instance.state.values[0].value).toBe('432');
    expect(instance.state.values[1].value).toBe('2345');
    expect(instance.state.values[2].value).toBe('653');
    expect(instance.state.values[3].value).toBe('4 of 3');
    expect(instance.state.values[4].value).toBe('');
  });
});
