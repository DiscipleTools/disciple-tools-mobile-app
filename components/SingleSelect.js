import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';
import { Picker } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({

  formRow: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#fff',

  },
  containerStyle: {
    padding: 5,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});


class SingleSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedValue: this.props.selectedItem,
    };
  }

  setValue = (value) => {
    this.setState(prevState => ({
      ...prevState.selectedValue,
      selectedValue: value,
    }));

    this.props.onChange(value);
  };

    render = () => {
      const {
        containerStyle,
        formStyle,
        items,
      } = this.props;

      const values = items.map(item => (
        <Picker.Item
          key={item.value}
          label={item.label}
          value={item.value}
        />
      ));

      return (
        <View style={[styles.containerStyle, containerStyle]}>
          <Row style={[styles.formRow, formStyle]}>
            <Col style={{ alignSelf: 'center' }}>
              <Picker
                mode="dropdown"
                selectedValue={this.state.selectedValue}
                onValueChange={this.setValue}
              >
                {values}
              </Picker>
            </Col>
          </Row>
        </View>
      );
    }
}

SingleSelect.propTypes = {
  // Styles
  containerStyle: ViewPropTypes.style,
  formStyle: Text.propTypes.style,
  // Config
  selectedItem: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ),
  onChange: PropTypes.func.isRequired,
};

SingleSelect.defaultProps = {
  containerStyle: null,
  formStyle: null,
  items: [],
  selectedItem: null,

};
export default SingleSelect;
