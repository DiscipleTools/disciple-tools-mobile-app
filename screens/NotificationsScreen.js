import React from 'react';
import { connect } from 'react-redux';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { getAll } from '../store/actions/notifications.actions';
import Colors from '../constants/Colors';
import i18n from '../languages';

const styles = StyleSheet.create({
  notificationContainer: {
    margin: 10,
    flex: 1,
  },
  prettyTime: {
    color: '#0A0A0A',
    fontSize: 10,
  },
  notificationReadButton: {},
  notificationUnreadButton: {},
});

class NotificationsScreen extends React.Component {
  state = {
    notificationsSourceData: [],
  };

  componentDidMount() {
    this.onRefresh();
  }

  onRefresh = () => {
    this.props.getAllNotifications(this.props.userData.domain, this.props.userData.token, 0, 20);
    this.setState(
      {
        refresh: true,
      },
      () => {
        this.setState({
          notificationsSourceData: this.props.notifications,
          refresh: false,
        });
      },
    );
  };

  handleLoadMore = () => {
    console.log('load More');
  };

  renderRow = (notification) => {
    const str1 = notification.notification_note.search('<');
    const str2 = notification.notification_note.search('>');
    const str3 = notification.notification_note.length - 4;
    const newNotificationNoteA = notification.notification_note.substr(0, str1);
    const newNotificationNoteB = notification.notification_note.substr(str2, str3);
    const str4 = newNotificationNoteB.search('<') - 1;
    const newNotificationBoteC = newNotificationNoteB.substr(1, str4);

    return (
      <View style={styles.notificationContainer}>
        <Text>
          {newNotificationNoteA} {newNotificationBoteC}{' '}
        </Text>
        <Text style={styles.prettyTime}>{notification.pretty_time}</Text>
      </View>
    );
  };

  flatListItemSeparator = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#dddddd',
      }}
    />
  );

  static navigationOptions = {
    title: i18n.t('contactsScreen.notifications'),
    headerLeft: null,
    headerStyle: {
      backgroundColor: Colors.tintColor,
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.state.notificationsSourceData}
          extraData={this.state.refresh}
          renderItem={(item) => this.renderRow(item.item)}
          ItemSeparatorComponent={this.flatListItemSeparator}
          refreshControl={
            <RefreshControl refreshing={this.props.loading} onRefresh={this.onRefresh} />
          }
          onEndReached={this.handleLoadMore}
          // keyExtractor={(item) => item.ID.toString()}
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  userData: state.userReducer.userData,
  notifications: state.notificationsReducer.notifications,
  loading: state.notificationsReducer.loading,
  error: state.notificationsReducer.error,
  contactSettings: state.contactsReducer.settings,
  isConnected: state.networkConnectivityReducer.isConnected,
});
const mapDispatchToProps = (dispatch) => ({
  getAllNotifications: (domain, token, offset, limit) => {
    dispatch(getAll(domain, token, offset, limit));
  },
});

NotificationsScreen.propTypes = {
  getAllNotifications: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.id,
    }),
  ).isRequired,
  loading: PropTypes.bool,
  error: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.string,
  }),
};

NotificationsScreen.defaultProps = {
  error: null,
  loading: false,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen);
