import React from 'react';
import { connect } from 'react-redux';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-native-easy-grid';
import { getAll, getNotificationsCount } from '../store/actions/notifications.actions';
import Colors from '../constants/Colors';
import i18n from '../languages';

const styles = StyleSheet.create({
  notificationContainer: {
    padding: 20,
  },
  prettyTime: {
    color: '#8A8A8A',
    fontSize: 10,
  },
  loadMoreFooterText: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3f729b',
  },
  buttoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
  },
  notificationUnreadButton: {
    borderRadius: 100,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3f729b',
  },
  notificationReadButton: {
    borderRadius: 100,
    width: 25,
    height: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3f729b',
  },
  newHeader: {
    fontWeight: 'bold',
    marginBottom: 'auto',
    fontSize: 12,
  },
  newHeaderNumber: {
    marginRight: 5,
    fontSize: 12,
    padding: 2,
    backgroundColor: 'red',
    borderRadius: 100,
    color: 'white',
    marginBottom: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markAllHeader: {
    color: '#3f729b',
    fontSize: 12,
    marginLeft: 'auto',
    marginBottom: 'auto',
  },
  marketButton: {
    borderRadius: 5,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: '#3f729b',
  },
  marketButtonText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: 14,
  },
  unmarketButton: {
    borderRadius: 5,
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3f729b',
  },
  unmarketButtonText: {
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3f729b',
    fontSize: 14,
  },
});

class NotificationsScreen extends React.Component {
  state = {
    notificationsSourceData: [],
    isAll: false,
    loading: false,
    notificationsCount: 0,
  };

  componentDidMount() {
    this.onRefresh();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { loading, notifications, notificationsCount } = nextProps;
    const newState = {
      ...prevState,
      loading,
      notificationsSourceData: notifications,
      notificationsCount,
    };
    return newState;
  }

  onRefresh = () => {
    this.props.getAllNotifications(
      this.props.userData.domain,
      this.props.userData.token,
      this.state.isAll,
      0,
      30,
    );
    this.props.getNotificationsCount(this.props.userData.domain, this.props.userData.token);
  };

  getAll = () => {
    this.setState(
      {
        isAll: true,
      },
      () => {
        this.onRefresh();
      },
    );
  };

  getUnread = () => {
    this.setState(
      {
        isAll: false,
      },
      () => {
        this.onRefresh();
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
      <View
        style={
          notification.is_new === '1'
            ? { backgroundColor: 'rgba(63, 114, 155, 0.19)' }
            : { backgroundColor: 'white' }
        }>
        <View style={[styles.notificationContainer, { flex: 1, flexDirection: 'row' }]}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text>
              {newNotificationNoteA} {newNotificationBoteC}
            </Text>
            <Text style={styles.prettyTime}>{notification.pretty_time}</Text>
          </View>
          <View style={styles.buttoContainer}>
            <View
              style={
                notification.is_new === '1'
                  ? styles.notificationUnreadButton
                  : styles.notificationReadButton
              }
            />
          </View>
        </View>
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

  renderFooter = () => {
    // it will show indicator at the bottom of the list when data is loading otherwise it returns null
    return (
      <View>
        <Text style={styles.loadMoreFooterText}>{i18n.t('notificationsScreen.loadMore')}</Text>
      </View>
    );
  };

  static navigationOptions = {
    title: i18n.t('notificationsScreen.notifications'),
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
      <Container>
        <View style={{ flex: 1 }}>
          <Row style={{ height: 50, margin: 15 }}>
            <Col size={2}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={styles.newHeaderNumber}> {this.state.notificationsCount} </Text>
                <Text style={styles.newHeader}>{i18n.t('notificationsScreen.new')}</Text>
              </View>
            </Col>
            <Col size={3}>
              <TouchableOpacity onPress={this.getAll}>
                <View
                  style={[
                    this.state.isAll ? styles.marketButton : styles.unmarketButton,
                    { marginRight: 1 },
                  ]}>
                  <Text
                    style={this.state.isAll ? styles.marketButtonText : styles.unmarketButtonText}>
                    {i18n.t('notificationsScreen.all')}
                  </Text>
                </View>
              </TouchableOpacity>
            </Col>
            <Col size={3}>
              <TouchableOpacity onPress={this.getUnread}>
                <View
                  style={[
                    this.state.isAll ? styles.unmarketButton : styles.marketButton,
                    { marginLeft: 1 },
                  ]}>
                  <Text
                    style={this.state.isAll ? styles.unmarketButtonText : styles.marketButtonText}>
                    {i18n.t('notificationsScreen.unRead')}
                  </Text>
                </View>
              </TouchableOpacity>
            </Col>
            <Col size={2}>
              <View>
                <Text style={[styles.markAllHeader, { marginRight: 1 }]}>
                  {i18n.t('notificationsScreen.markAll')}
                </Text>
              </View>
            </Col>
          </Row>
          <FlatList
            data={this.state.notificationsSourceData}
            extraData={this.state.loading}
            renderItem={(item) => this.renderRow(item.item)}
            ItemSeparatorComponent={this.flatListItemSeparator}
            refreshControl={
              <RefreshControl refreshing={this.props.loading} onRefresh={this.onRefresh} />
            }
            ListFooterComponent={this.renderFooter}
          />
        </View>
      </Container>
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
  notificationsCount: state.notificationsReducer.notificationsCount,
});
const mapDispatchToProps = (dispatch) => ({
  getAllNotifications: (domain, token, all, offset, limit) => {
    dispatch(getAll(domain, token, all, offset, limit));
  },
  getNotificationsCount: (domain, token) => {
    dispatch(getNotificationsCount(domain, token));
  },
});

NotificationsScreen.propTypes = {
  getAllNotifications: PropTypes.func.isRequired,
  getNotificationsCount: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
  /* eslint-disable */
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.id,
    }),
  ),
  /* eslint-enable */
  loading: PropTypes.bool,
  error: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.string,
  }),
};

NotificationsScreen.defaultProps = {
  error: null,
  loading: false,
  notifications: [],
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen);
