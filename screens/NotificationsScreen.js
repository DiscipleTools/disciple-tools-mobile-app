import React from 'react';
import { View, Text } from 'react-native';

class NotificationsScreen extends React.Component {
  state = {
    initial: 'hola',
  };

  render() {
    return (
      <View>
        <Text>Notifications View -{this.state.initial}</Text>
      </View>
    );
  }
}
export default NotificationsScreen;
