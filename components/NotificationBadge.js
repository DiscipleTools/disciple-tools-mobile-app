import React from 'react';
import { View, Text } from 'native-base';
import { connect } from 'react-redux';

class NotificationBadge extends React.Component {
  render() {
    if (this.props.notificationsCount > 0) {
      return (
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            right: -10,
            bottom: 0,
            height: 16,
            width: 16,
            borderRadius: 16 / 2,
            backgroundColor: '#d9534f',
          }}>
          <Text
            style={{
              fontSize: 8,
              color: '#ffffff',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 'auto',
              marginBottom: 'auto',
            }}>
            {this.props.notificationsCount}
          </Text>
        </View>
      );
    } else {
      return null;
    }
  }
}

NotificationBadge.propTypes = {};

NotificationBadge.defaultProps = {};

const mapStateToProps = (state) => ({
  notificationsCount: state.notificationsReducer.notificationsCount,
});

export default connect(mapStateToProps)(NotificationBadge);
