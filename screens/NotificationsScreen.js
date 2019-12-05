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
});
class NotificationsScreen extends React.Component {
  componentDidMount() {
    this.onRefresh();
  }

  onRefresh = () => {
    this.props.getAllNotifications(this.props.userData.domain, this.props.userData.token, 0, 5);
    this.setState(
      {
        refresh: true,
      },
      () => {
        // console.log(this.props.notifications)
        this.setState({
          notificationsSourceData: this.props.notifications,
          refresh: false,
        });
      },
    );
  };

  renderRow = (notificaiton) => {
    // console.log(notificaiton)
    return (
      <View style={styles.notificationContainer}>
        <Text>{notificaiton.notification_note}</Text>
        <Text style={styles.prettyTime}>{notificaiton.pretty_time}</Text>
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
  loading: PropTypes.bool,
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.id,
    }),
  ).isRequired,
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
