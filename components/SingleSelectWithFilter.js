import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewPropTypes,
  TouchableOpacity,
} from 'react-native';
import { Col, Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types';
import ModalFilterPicker from 'react-native-modal-filter-picker';

import i18n from '../languages';

const styles = StyleSheet.create({
  formRow: {
    paddingLeft: 10, 
    paddingRight: 10,
    alignItems: 'flex-start',
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
      selectedItems: this.props.items,
      items: this.props.selectedItems,
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
    console.log(foundItem.label)
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
          <View style={styles.container}>
            <TouchableOpacity
            style={{alignSelf: 'stretch', height: 30}}
              onPress={() => {
                this.updateShowSelectedItemModal(true);
              }}
            >
              <Row style={styles.formRow}>
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
      key: PropTypes.string,       
    })
  ),
  selectedItem: PropTypes.string
};

SingleSelectWithFilter.defaultProps = {
  containerStyle: null,
  inputContainerStyle: null,
  items: [],
  selectedItem: [],

};
export default SingleSelectWithFilter;
