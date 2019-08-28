import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewPropTypes,
  TouchableOpacity,
} from 'react-native';
import { Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types';
import ModalFilterPicker from 'react-native-modal-filter-picker';

const styles = StyleSheet.create({
  formRow: {
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
  },
  container: {
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    height: 30,
  },
});


class SingleSelectWithFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showSelectedItemModal: false,
      items: this.props.items,
      selectedItem: this.props.selectedItem,
    };
  }

  updateShowSelectedItemModal = (value) => {
    this.setState({
      showSelectedItemModal: value,
    });
  };

  onSelectItem = (key) => {
    this.setState(prevState => ({
      ...prevState.selectedItem,
      selectedItem: `item-${key}`,
      showSelectedItemModal: false,
    }));
  };

  showSelectedItem = () => {
    const foundItem = this.state.items.find(
      item => `item-${item.key}` === this.state.selectedItem,
    );
    return <Text>{foundItem ? foundItem.label : 'none'}</Text>;
  };

  onCancelSelectedItem = () => {
    this.setState({
      showSelectedItemModal: false,
    });
  };

    render = () => {
      const {
        containerStyle,
        inputContainerStyle,

      } = this.props;

      return (
        <View style={[styles.container, containerStyle]}>
          <TouchableOpacity
            style={{ alignSelf: 'stretch', height: 30 }}
            onPress={() => {
              this.updateShowSelectedItemModal(true);
            }}
          >
            <Row style={[styles.formRow, inputContainerStyle]}>
              {this.showSelectedItem()}
              <ModalFilterPicker
                visible={this.state.showSelectedItemModal}
                onSelect={this.onSelectItem}
                onCancel={this.onCancelSelectedItem}
                options={this.state.items}
              />
            </Row>
          </TouchableOpacity>
        </View>
      );
    }
}

SingleSelectWithFilter.propTypes = {
  // Styles
  containerStyle: ViewPropTypes.style,
  inputContainerStyle: Text.propTypes.style,
  // Config
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      key: PropTypes.number,
    }),
  ),
  selectedItem: PropTypes.string,
};

SingleSelectWithFilter.defaultProps = {
  containerStyle: null,
  inputContainerStyle: null,
  items: [],
  selectedItem: [],

};
export default SingleSelectWithFilter;
