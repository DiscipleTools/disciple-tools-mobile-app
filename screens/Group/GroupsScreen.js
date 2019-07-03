import React from "react";
import { connect } from "react-redux";
import {
  View,
  FlatList,
  TouchableHighlight,
  RefreshControl,
  StyleSheet,
  Text
} from "react-native";
import { Fab, Container } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-easy-toast";

import PropTypes from "prop-types";
import Colors from "../../constants/Colors";
import {
  getAll,
  GROUPS_GETALL_START,
  GROUPS_GETALL_FAILURE,
  GROUPS_GETALL_SUCCESS
} from "../../store/actions/groups.actions";

const styles = StyleSheet.create({
  flatListItem: {
    height: 90,
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20
  },
  groupSubtitle: {
    paddingTop: 6,
    fontWeight: "200",
    color: "rgba(0,0,0,0.6)"
  },
  errorText: {
    textAlign: "center",
    height: 100,
    padding: 20,
    color: "rgba(0,0,0,0.4)"
  }
});

let toastError;

class GroupsScreen extends React.Component {
  static navigationOptions = {
    title: "Groups",
    headerLeft: null
  };

  state = {
    responseMessage: "",
    refreshing: false,
    groups: []
  };

  componentDidMount() {
    this.onRefresh();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { type, groups } = nextProps;
    const { responseMessage } = prevState;
    let newState = {
      ...prevState
    };

    // Detect new message incomming
    if (type !== responseMessage) {
      const newResponseMessage = type;
      newState = {
        ...newState,
        responseMessage
      };
      if (newResponseMessage === GROUPS_GETALL_START) {
        newState = {
          ...newState,
          refreshing: true
        };
      } else if (newResponseMessage === GROUPS_GETALL_SUCCESS) {
        newState = {
          ...newState,
          groups,
          refreshing: false
        };
      } else if (newResponseMessage === GROUPS_GETALL_FAILURE) {
        newState = {
          ...newState,
          refreshing: false
        };
        toastError.show(
          <View>
            <Text style={{ fontWeight: "bold" }}>Code: </Text>
            <Text>{nextProps.error.code}</Text>
            <Text style={{ fontWeight: "bold" }}>Message: </Text>
            <Text>{nextProps.error.message}</Text>
          </View>,
          3000
        );
      }
    }

    return newState;
  }

  renderRow = item => (
    <TouchableHighlight
      onPress={() => this.goToGroupDetailScreen(item)}
      style={styles.flatListItem}
      activeOpacity={0.5}
      key={item.toString()}
    >
      <View>
        <Text style={{ fontWeight: "bold" }}>{item.post_title}</Text>
        <Text style={styles.groupSubtitle}>
          {`${item.group_status} • ${item.group_type} • ${item.member_count}`}
        </Text>
      </View>
    </TouchableHighlight>
  );

  flatListItemSeparator = () => (
    <View
      style={{
        height: 1,
        width: "100%",
        backgroundColor: "#dddddd"
      }}
    />
  );

  onRefresh = () => {
    this.props.getAllGroups(this.props.user.domain, this.props.user.token);
  };

  goToGroupDetailScreen = (groupData = null) => {
    if (groupData) {
      // Detail
      this.props.navigation.push("GroupDetail", {
        groupId: groupData.ID,
        onlyView: true,
        groupName: groupData.post_title
      });
    } else {
      // Create
      this.props.navigation.push("GroupDetail");
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
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.onRefresh}
              />
            }
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
            ref={toast => {
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
    push: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string
  }).isRequired,
  /* eslint-disable */
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number
    })
  ).isRequired,
  /* eslint-enable */
  error: PropTypes.shape({
    message: PropTypes.string
  }),
  getAllGroups: PropTypes.func.isRequired,
  /* eslint-disable */
  type: PropTypes.string
  /* eslint-enable */
};
GroupsScreen.defaultProps = {
  error: null,
  type: null
};

const mapStateToProps = state => ({
  groups: state.groupsReducer.groups,
  error: state.groupsReducer.error,
  user: state.userReducer,
  type: state.groupsReducer.type
});
const mapDispatchToProps = dispatch => ({
  getAllGroups: (domain, token) => {
    dispatch(getAll(domain, token));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsScreen);
