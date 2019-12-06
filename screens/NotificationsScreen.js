import React from 'react';
import { connect } from 'react-redux';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import { Container } from 'native-base';
import PropTypes from 'prop-types';
import { Col, Row } from 'react-native-easy-grid';
import { getAll } from '../store/actions/notifications.actions';
import Colors from '../constants/Colors';
import i18n from '../languages';

const styles = StyleSheet.create({
  notificationContainer: {
    backgroundColor: 'white',
    padding: 20,
  },
  prettyTime: {
    color: '#8A8A8A',
    fontSize: 10,
  },
  loadMoreFooterText: {
    padding: 10,
    color: '#3f729b',
  },
  buttoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
  },
  notificationReadButton: {
    borderRadius: 100,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3f729b',
  },
  notificationUnreadButton: {
    borderRadius: 100,
    width: 25,
    height: 25,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#3f729b',
  },
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
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text>
              {newNotificationNoteA} {newNotificationBoteC}
            </Text>
            <Text style={styles.prettyTime}>{notification.pretty_time}</Text>
          </View>
          <View style={styles.buttoContainer}>
            <View style={styles.notificationReadButton} />
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
          <Row style={{ height: 60 }}>
            <Col size={1}>
              <Text>{i18n.t('notificationsScreen.new')}</Text>
            </Col>
            <Col size={2}>
              <View>
                <Text>{i18n.t('notificationsScreen.all')}</Text>
              </View>
            </Col>
            <Col size={2}>
              <View>
                <Text>{i18n.t('notificationsScreen.unread')}</Text>
              </View>
            </Col>
            <Col size={1}>
              <View>
                <Text>{i18n.t('notificationsScreen.markAll')}</Text>
              </View>
            </Col>
          </Row>
          <FlatList
            data={this.state.notificationsSourceData}
            extraData={this.state.refresh}
            renderItem={(item) => this.renderRow(item.item)}
            ItemSeparatorComponent={this.flatListItemSeparator}
            refreshControl={
              <RefreshControl refreshing={this.props.loading} onRefresh={this.onRefresh} />
            }
            ListFooterComponent={this.renderFooter}
            onEndReached={this.handleLoadMore}
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
