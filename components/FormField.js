import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewPropTypes,
} from 'react-native';

import { Icon } from 'native-base';
import { Col, Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({

  formIcon: {
    color: Colors.tintColor,
    fontSize: 25,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: 10,
  },
  containerStyle: {
    alignSelf: 'stretch',
    marginVertical: 10,
    padding: 5,
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  formRow: {
    paddingTop: 10,
    marginBottom: 20,
  },
  formLabel: {
    color: Colors.tintColor,
    fontSize: 12,
    marginTop: 'auto',
    marginBottom: 'auto',
    textAlign: 'right',
    paddingRight: 10,
  },
  formText: {
    marginLeft: 10,
    marginRight: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  formIconLabel: {
    width: 'auto',
  },
});


class FormField extends PureComponent {
    render = () => {
      const {
        containerStyle,
        iconStyle,
        labelStyle,
        iconName,
        inline,
        label,
        iconType,
      } = this.props;
      let inlineContent = null;
      let blockContent = null;

      const icon = iconName ? (
        <Icon name={iconName} type={iconType} size={25} style={[styles.formIcon, iconStyle]} />
      ) : null;
      if (inline) {
        inlineContent = this.props.children;
      } else {
        blockContent = this.props.children;
      }
      return (
        <View style={[styles.containerStyle, containerStyle]}>
          <Row style={styles.formRow}>
            <Col style={styles.formIconLabel}>
              {icon}
            </Col>
            <Col>
              <Col style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
                <View style={styles.formText}>
                  {inlineContent}
                </View>
              </Col>
            </Col>
            <Col style={{ width: 'auto' }}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.formLabel, labelStyle]}>
                  {label}
                </Text>
              </View>
            </Col>
          </Row>
          {blockContent}
          <View style={styles.formDivider} />
        </View>
      );
    }
}

FormField.propTypes = {
  // Styles
  containerStyle: ViewPropTypes.style,
  labelStyle: Text.propTypes.style,
  iconStyle: Text.propTypes.style,
  // Config
  inline: PropTypes.bool,
  iconName: PropTypes.string,
  iconType: PropTypes.string,
  label: PropTypes.string.isRequired,
};

FormField.defaultProps = {
  containerStyle: null,
  iconStyle: null,
  labelStyle: null,
  iconName: null,
  iconType: null,
  inline: null,
};
export default FormField;
