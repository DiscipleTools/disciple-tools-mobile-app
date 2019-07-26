import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  TouchableHighlight,
  RefreshControl,
  StyleSheet,
  Text,
} from 'react-native';
import { Fab, Container } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast';

import PropTypes from 'prop-types';
import Colors from '../../constants/Colors';
import { getAll } from '../../store/actions/groups.actions';

const styles = StyleSheet.create({
  flatListItem: {
    height: 90,
    backgroundColor: 'white',
    padding: 20,
  },
  groupSubtitle: {
    paddingTop: 6,
    fontWeight: '200',
    color: 'rgba(0,0,0,0.6)',
  },
  errorText: {
    textAlign: 'center',
    height: 100,
    padding: 20,
    color: 'rgba(0,0,0,0.4)',
  },
});

let toastError;

class GroupsScreen extends React.Component {
  static navigationOptions = {
    title: 'Groups',
    headerLeft: null,
  };

  state = {
    groups: [],
  };

  componentDidMount() {
    this.onRefresh();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const newState = {
      ...prevState,
      loading: nextProps.loading,
      groups: nextProps.groups,
    };
    return newState;
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (prevProps.error !== error && error) {
      toastError.show(
        <View>
          <Text style={{ fontWeight: 'bold' }}>Code: </Text>
          <Text>{error.code}</Text>
          <Text style={{ fontWeight: 'bold' }}>Message: </Text>
          <Text>{error.message}</Text>
        </View>,
        3000,
      );
    }
  }

  renderRow = item => (
    <TouchableHighlight
      onPress={() => this.goToGroupDetailScreen(item)}
      style={styles.flatListItem}
      key={item.toString()}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={{ fontWeight: 'bold' }}>{item.post_title}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={styles.groupSubtitle}>
            {item.group_status}
          </Text>
          <Text style={styles.groupSubtitle}>
            {' • '}
          </Text>
          <Text style={styles.groupSubtitle}>
            {item.group_type}
          </Text>
          <Text style={styles.groupSubtitle}>
            {' • '}
          </Text>
          <Text style={styles.groupSubtitle}>
            {item.member_count}
          </Text>
        </View>
      </View>
    </TouchableHighlight>
  );

  flatListItemSeparator = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#dddddd',
      }}
    />
  );

  onRefresh = () => {
    this.props.getAllGroups(this.props.user.domain, this.props.user.token);
  };

  goToGroupDetailScreen = (groupData = null) => {
    if (groupData) {
      // Detail
      this.props.navigation.push('GroupDetail', {
        groupId: groupData.ID,
        onlyView: true,
        groupName: groupData.post_title,
      });
    } else {
      // Create
      this.props.navigation.push('GroupDetail');
    }
  };

  render() {
    return (
      <Container>
        <View style={{ flex: 1 }}>
          <FlatList
            data={this.state.groups}
            renderItem={item => this.renderRow(item.item)}
            ItemSeparatorComponent={this.flatListItemSeparator}
            refreshControl={(
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={this.onRefresh}
              />
            )}
            keyExtractor={item => item.ID.toString()}
          />
          <Fab
            style={{ backgroundColor: Colors.tintColor }}
            position="bottomRight"
            onPress={() => this.goToGroupDetailScreen()}
          >
            <Icon name="md-add" />
          </Fab>
          <Toast
            ref={(toast) => {
              toastError = toast;
            }}
            style={{ backgroundColor: Colors.errorBackground }}
            position="center"
          />
        </View>
      </Container>
    );
  }
}

GroupsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  user: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  getAllGroups: PropTypes.func.isRequired,
  /* eslint-disable */
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number
    })
  ).isRequired,
  /* eslint-enable */
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
};
GroupsScreen.defaultProps = {
  error: null,
};

const mapStateToProps = state => ({
  user: state.userReducer,
  groups: state.groupsReducer.groups,
  loading: state.groupsReducer.loading,
  error: state.groupsReducer.error,
});
const mapDispatchToProps = dispatch => ({
  getAllGroups: (domain, token) => {
    dispatch(getAll(domain, token));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupsScreen);
