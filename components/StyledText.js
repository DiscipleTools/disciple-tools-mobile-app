import React from 'react';
import PropTypes from 'prop-types';
import { Text, StyleSheet } from 'react-native';

function MonoText(props) {
  return <Text {...props} style={[props.style, { fontFamily: 'space-mono' }]} />;
}

MonoText.propTypes = {
  style: PropTypes.instanceOf(StyleSheet),
};
MonoText.defaultProps = {
  style: StyleSheet.create({}),
};
export default MonoText;
