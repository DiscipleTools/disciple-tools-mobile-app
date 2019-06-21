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
import { Fab } from "native-base";
import Icon from "react-native-vector-icons/Ionicons";
import Toast from "react-native-easy-toast";

import PropTypes from "prop-types";
import Colors from "../constants/Colors";
import {
  getAll,
  CONTACTS_GETALL_START,
  CONTACTS_GETALL_SUCCESS
} from "../store/actions/contacts.actions";

const styles = StyleSheet.create({
  flatListItem: {
    height: 90,
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20
  },
  contactSubtitle: {
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

class ContactsScreen extends React.Component {
  static navigationOptions = {
    title: "Contacts",
    headerLeft: null
  };

  state = {
    contactsReducerResponse: "",
    refreshing: false,
    contacts: []
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.onRefresh();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { contactsReducerResponse, error } = nextProps;
    const {} = prevState;
    let newState = {
      ...prevState,
      contactsReducerResponse
    };

    // Detect new message incomming
    switch (contactsReducerResponse) {
      case CONTACTS_GETALL_START:
        newState = {
          ...newState,
          refreshing: true
        };
        break;
      case CONTACTS_GETALL_SUCCESS:
        const { contacts } = nextProps;
        newState = {
          ...newState,
          contacts,
          refreshing: false
        };
        break;
      default:
        if (error) {
          if (toastError) {
            toastError.show(
              <View>
                <Text style={{ fontWeight: "bold" }}>Code: </Text>
                <Text>{error.code}</Text>
                <Text style={{ fontWeight: "bold" }}>Message: </Text>
                <Text>{error.message}</Text>
              </View>,
              3000
            );
          }
        }
        break;
    }

    return newState;
  }

  renderRow = item => (
    <TouchableHighlight
      onPress={() => this.goToContactDetailScreen(item)}
      style={styles.flatListItem}
      activeOpacity={0.5}
      key={item.toString()}
    >
      <View>
        <Text style={{ fontWeight: "bold" }}>{item.post_title}</Text>
        <Text style={styles.contactSubtitle}>
          {`${item.overall_status.label} • ${item.seeker_path.label}`}
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
    this.props.getAllContacts(this.props.user.domain, this.props.user.token);
  };

  goToContactDetailScreen = (contactData = null) => {
    if (contactData) {
      // Detail
      this.props.navigation.push("ContactDetail", {
        contactId: contactData.ID,
        onlyView: true,
        contactName: contactData.title
      });
    } else {
      // Create
      this.props.navigation.push("ContactDetail");
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View>
          <FlatList
            data={this.state.contacts}
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
            onPress={() => this.goToContactDetailScreen()}
          >
            <Icon name="md-add" />
          </Fab>
        </View>
        <Toast
          ref={toast => {
            toastError = toast;
          }}
          style={{ backgroundColor: "red" }}
          position="center"
        />
      </View>
    );
  }
}

ContactsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired
  }).isRequired,
  user: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string
  }).isRequired,
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number
    })
  ).isRequired,
  error: PropTypes.shape({
    message: PropTypes.string
  }),
  getAllContacts: PropTypes.func.isRequired,
  contactsReducerResponse: PropTypes.string
};
ContactsScreen.defaultProps = {
  error: null,
  contactsReducerResponse: null
};

const mapStateToProps = state => ({
  contacts: state.contactsReducer.contacts,
  error: state.contactsReducer.error,
  user: state.userReducer,
  contactsReducerResponse: state.contactsReducer.type
});
const mapDispatchToProps = dispatch => ({
  getAllContacts: (domain, token) => {
    dispatch(getAll(domain, token));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsScreen);
