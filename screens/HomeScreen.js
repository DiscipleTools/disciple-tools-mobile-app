import React from 'react';
import { connect } from 'react-redux';
import { Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import * as WebBrowser from 'expo-web-browser';

import Colors from '../constants/Colors';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  userData: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

import { styles } from './HomeScreen.styles';

class HomeScreen extends React.Component {
  handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  static navigationOptions = {
    headerShown: false,
  };

  maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this.handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      const debugInfo = <Text>{JSON.stringify(this.props.userData)}</Text>;

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools.
          {learnMoreButton}
          {debugInfo}
        </Text>
      );
    }

    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode, your app will run at full speed.
      </Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image source={require('../assets/images/dt-icon.png')} style={styles.welcomeImage} />
          </View>

          <View style={styles.getStartedContainer}>{this.maybeRenderDevelopmentModeWarning()}</View>
        </ScrollView>
      </View>
    );
  }
}

HomeScreen.propTypes = propTypes;
// export default HomeScreen;
const mapStateToProps = (state) => ({
  userData: state.userReducer.userData,
});

export default connect(mapStateToProps, null)(HomeScreen);
