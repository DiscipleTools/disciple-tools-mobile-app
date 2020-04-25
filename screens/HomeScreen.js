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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 120,
    height: 100,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
    tintColor: Colors.tintColor,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {
          height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});

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
