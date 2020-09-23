import React from 'react';
import { connect } from 'react-redux';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity } from 'react-native';
import { Container } from 'native-base';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-native-easy-grid';
import moment from '../languages/moment';
import { Html5Entities } from 'html-entities';

import {
  getAll,
  getNotificationsCount,
  markViewed,
  markUnread,
  markAllAsRead,
} from '../store/actions/notifications.actions';
import Colors from '../constants/Colors';
import i18n from '../languages';

const entities = new Html5Entities();

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
    width: 35,
    padding: 5,
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
  offlineBar: {
    height: 20,
    backgroundColor: '#FCAB10',
  },
  offlineBarText: {
    fontSize: 14,
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  dontHaveNotificationsText: {
    fontSize: 14,
    color: 'black',
    fontWeight: 'bold',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

class NotificationsScreen extends React.Component {
  state = {
    notificationsSourceData: [],
    isAll: false,
    loading: false,
    notificationsCount: 0,
    limit: 20,
    offset: 0,
    haveNotifications: true,
  };

  componentDidMount() {
    this.onRefresh();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { loading, notifications, notificationsCount } = nextProps;
    let newState = {
      ...prevState,
      loading,
      notificationsCount,
    };
    if (notifications) {
      if (newState.offset > 0) {
        newState = {
          ...newState,
          notificationsSourceData: prevState.notificationsSourceData.concat(notifications),
        };
      } else if (notifications.length > 0) {
        newState = {
          ...newState,
          notificationsSourceData: notifications,
          haveNotifications: true,
        };
      } else {
        newState = {
          ...newState,
          notificationsSourceData: notifications,
          haveNotifications: false,
        };
      }
    }
    return newState;
  }

  onRefresh = (pagination = false) => {
    if (pagination) {
      this.setState(
        (prevState) => ({
          offset: prevState.offset + prevState.limit,
          haveNotifications: true,
        }),
        () => {
          this.props.getAllNotifications(
            this.props.userData.domain,
            this.props.userData.token,
            this.state.isAll,
            this.state.offset,
            this.state.limit,
          );
        },
      );
    } else {
      this.setState(
        () => ({
          offset: 0,
          haveNotifications: true,
        }),
        () => {
          this.props.getAllNotifications(
            this.props.userData.domain,
            this.props.userData.token,
            this.state.isAll,
            this.state.offset,
            this.state.limit,
          );
        },
      );
    }
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

  markAll = () => {
    this.props.markAllAsRead(
      this.props.userData.domain,
      this.props.userData.token,
      this.props.userData.id,
    );
    if (this.props.isConnected) {
      this.onRefresh();
    } else {
      this.setState({
        isAll: false,
        notificationsCount: 0,
        notificationsSourceData: [],
        haveNotifications: false,
      });
    }
  };

  markAsRead = (notification) => {
    const indexArray = this.state.notificationsSourceData.findIndex(
      (notificationArray) => notificationArray.id === notification.id,
    );
    const saveMark = this.state.notificationsSourceData;
    if (notification.is_new === '1') {
      this.props.markViewed(this.props.userData.domain, this.props.userData.token, notification.id);
      saveMark[indexArray].is_new = '0';
      if (!this.state.isAll) {
        saveMark.splice(indexArray, 1);
      }
      this.setState({
        notificationsSourceData: saveMark,
      });
      this.props.getNotificationsCount(this.props.userData.domain, this.props.userData.token);
    } else {
      this.props.markUnread(this.props.userData.domain, this.props.userData.token, notification.id);
      saveMark[indexArray].is_new = '1';
      this.setState({
        notificationsSourceData: saveMark,
      });
      this.props.getNotificationsCount(this.props.userData.domain, this.props.userData.token);
    }
  };

  redirectToDetailView = (viewName, entityId, entityTitle) => {
    let view, prop;
    switch (viewName) {
      case 'contacts':
        view = 'ContactDetail';
        prop = 'contact';
        break;
      case 'groups':
        view = 'GroupDetail';
        prop = 'group';
        break;
      default:
    }
    this.props.navigation.push(view, {
      [`${prop}Id`]: entityId,
      onlyView: true,
      [`${prop}Name`]: entityTitle,
      fromNotificationView: true,
    });
  };

  renderRow = (notification) => {
    const str1 = notification.notification_note.search('<');
    const str2 = notification.notification_note.search('>');
    const str3 = notification.notification_note.length - 4;
    const newNotificationNoteA = notification.notification_note.substr(0, str1);
    const newNotificationNoteB = notification.notification_note.substr(str2, str3);
    const str4 = newNotificationNoteB.search('<') - 1;
    const newNotificationNoteC = newNotificationNoteB.substr(1, str4);
    let entityLink = notification.notification_note.substring(
      notification.notification_note.lastIndexOf('href="') + 6,
      notification.notification_note.lastIndexOf('">'),
    );
    let entityId = entityLink.split('/')[4];
    let entityName = entityLink.split('/')[3];
    return (
      <View
        style={
          notification.is_new === '1'
            ? { backgroundColor: 'rgba(63, 114, 155, 0.19)' }
            : { backgroundColor: Colors.mainBackgroundColor }
        }>
        <View style={[styles.notificationContainer, { flex: 1, flexDirection: 'row' }]}>
          <View style={{ flex: 1 }}>
            <Text style={[this.props.isRTL ? { textAlign: 'left' } : {}]}>
              <Text>{entities.decode(newNotificationNoteA)}</Text>
              <Text
                style={{ color: Colors.primary }}
                onPress={() =>
                  this.redirectToDetailView(entityName, entityId, newNotificationNoteC)
                }>
                {entities.decode(newNotificationNoteC)}
              </Text>
            </Text>
            <Text
              style={[styles.prettyTime, this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
              {moment(notification.date_notified).fromNow() +
                ' ~ ' +
                moment(notification.date_notified).format('L')}
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              this.markAsRead(notification);
            }}>
            <View style={styles.buttoContainer}>
              <View
                style={
                  notification.is_new === '1'
                    ? styles.notificationUnreadButton
                    : styles.notificationReadButton
                }
              />
            </View>
          </TouchableOpacity>
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

  offlineBarRender = () => (
    <View style={[styles.offlineBar]}>
      <Text style={[styles.offlineBarText]}>{i18n.t('global.offline')}</Text>
    </View>
  );

  dontHaveNotifications = () => (
    <View style={[styles.dontHaveNotificationsText]}>
      {this.state.isAll && (
        <Text style={[styles.dontHaveNotificationsText]}>
          {i18n.t('notificationsScreen.dontHaveNotifications')}
        </Text>
      )}
      {!this.state.isAll && (
        <Text style={[styles.dontHaveNotificationsText]}>
          {i18n.t('notificationsScreen.dontHaveNotificationsUnread')}
        </Text>
      )}
    </View>
  );

  renderFooter = () => {
    // it will show indicator at the bottom of the list when data is loading otherwise it returns null
    return (
      <View style={styles.loadMoreFooterText}>
        <TouchableOpacity
          onPress={() => {
            this.onRefresh(true);
          }}>
          <Text style={styles.loadMoreFooterText}>{i18n.t('notificationsScreen.loadMore')}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  static navigationOptions = {
    title: i18n.t('notificationsScreen.notifications'),
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
          {!this.props.isConnected && this.offlineBarRender()}
          <Row style={{ height: 60, margin: 15 }}>
            <Col size={2}>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                {this.state.notificationsCount > 0 && (
                  <Text style={styles.newHeaderNumber}> {this.state.notificationsCount} </Text>
                )}
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
              <TouchableOpacity onPress={this.markAll}>
                <View>
                  <Text style={[styles.markAllHeader, { marginRight: 1 }]}>
                    {i18n.t('notificationsScreen.markAll')}
                  </Text>
                </View>
              </TouchableOpacity>
            </Col>
          </Row>
          {!this.state.haveNotifications && this.dontHaveNotifications()}
          <FlatList
            data={this.state.notificationsSourceData}
            extraData={this.state.loading}
            renderItem={(item) => this.renderRow(item.item)}
            ItemSeparatorComponent={this.flatListItemSeparator}
            refreshControl={
              <RefreshControl refreshing={this.props.loading} onRefresh={this.onRefresh} />
            }
            ListFooterComponent={this.renderFooter}
            style={{ backgroundColor: Colors.mainBackgroundColor }}
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
  isRTL: state.i18nReducer.isRTL,
});
const mapDispatchToProps = (dispatch) => ({
  getAllNotifications: (domain, token, all, offset, limit) => {
    dispatch(getAll(domain, token, all, offset, limit));
  },
  getNotificationsCount: (domain, token) => {
    dispatch(getNotificationsCount(domain, token));
  },
  markViewed: (domain, token, notificaitonId) => {
    dispatch(markViewed(domain, token, notificaitonId));
  },
  markUnread: (domain, token, notificaitonId) => {
    dispatch(markUnread(domain, token, notificaitonId));
  },
  markAllAsRead: (domain, token, userId) => {
    dispatch(markAllAsRead(domain, token, userId));
  },
});

NotificationsScreen.propTypes = {
  isConnected: PropTypes.bool,
  getAllNotifications: PropTypes.func.isRequired,
  getNotificationsCount: PropTypes.func.isRequired,
  markViewed: PropTypes.func.isRequired,
  markUnread: PropTypes.func.isRequired,
  markAllAsRead: PropTypes.func.isRequired,
  userData: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
    username: PropTypes.string,
    id: PropTypes.number,
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
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
};

NotificationsScreen.defaultProps = {
  error: null,
  loading: false,
  notifications: [],
  isConnected: null,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen);
