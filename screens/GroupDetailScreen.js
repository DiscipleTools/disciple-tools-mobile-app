import React from "react";
import {
  ScrollView,
  Keyboard,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  FlatList,
  TextInput
} from "react-native";
import {
  Label,
  Icon,
  Form,
  Input,
  Container,
  Content,
  Picker,
  Tabs,
  Tab,
  ScrollableTab,
  DatePicker,
  ListItem,
  Left,
  Right,
  Body
} from "native-base";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Toast from "react-native-easy-toast";
import { Col, Row, Grid } from "react-native-easy-grid";
import MultipleTags from "react-native-multiple-tags";
import KeyboardAccessory from "react-native-sticky-keyboard-accessory";
// import ModalFilterPicker from "react-native-modal-filter-picker";
import {
  saveGroup,
  GROUPS_SAVE_SUCCESS,
  getById,
  GROUPS_GETBYID_SUCCESS,
  getUsersAndContacts,
  GROUPS_GET_USERS_CONTACTS_SUCCESS,
  getCommentsByGroup,
  GROUPS_GET_COMMENTS_SUCCESS,
  saveComment,
  GROUPS_SAVE_COMMENT_SUCCESS,
  getLocations,
  GROUPS_GET_LOCATIONS_SUCCESS,
  getPeopleGroups,
  GROUPS_GET_PEOPLE_GROUPS_SUCCESS,
  getActivitiesByGroup,
  GROUPS_GET_ACTIVITIES_SUCCESS
} from "../store/actions/groups.actions";
import { getUsers, GET_USERS_SUCCESS } from "../store/actions/users.actions";
import Colors from "../constants/Colors";

import baptismIcon from "../assets/icons/baptism.png";
import bibleStudyIcon from "../assets/icons/word.png";
import communionIcon from "../assets/icons/communion.png";
import fellowShipIcon from "../assets/icons/fellowship.png"; // Missing icon!!!
import givingIcon from "../assets/icons/giving.png";
import prayerIcon from "../assets/icons/prayer.png";
import praiseIcon from "../assets/icons/praise.png";
import sharingTheGospelIcon from "../assets/icons/evangelism.png";
import leadersIcon from "../assets/icons/leadership.png";
import churchCommitmentIcon from "../assets/icons/covenant.png";

const styles = StyleSheet.create({
  toggleButton: {
    borderRadius: 5,
    height: "100%",
    margin: 5
  },
  inputContactAddress: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#D9D5DC",
    margin: 5
  },
  activeImage: {
    opacity: 1,
    height: "100%",
    width: "100%"
  },
  inactiveImage: {
    opacity: 0.4,
    height: "100%",
    width: "100%"
  },
  activeToggleText: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: "#000000",
    fontSize: 9
  },
  inactiveToggleText: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    color: "#D9D5DC",
    fontSize: 9
  },
  tabBarUnderlineStyle: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.tintColor
  },
  tabStyle: { backgroundColor: "#FFFFFF" },
  textStyle: { color: "gray" },
  activeTabStyle: { backgroundColor: "#FFFFFF" },
  activeTextStyle: { color: Colors.tintColor, fontWeight: "bold" },
  label: {
    color: Colors.tintColor,
    fontSize: 15
  },
  addRemoveIcons: {
    fontSize: 30,
    color: "black"
  },
  icons: {
    color: Colors.tintColor
  },
  // Comments Section
  root: {
    backgroundColor: "#ffffff",
    flex: 1,
    marginBottom: 60
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start"
  },
  image: {
    height: 16,
    marginTop: 10,
    width: 16
  },
  content: {
    backgroundColor: "#F3F3F3",
    borderRadius: 5,
    flex: 1,
    marginLeft: 16,
    padding: 10
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },
  name: {
    color: Colors.tintColor,
    fontSize: 13,
    fontWeight: "bold"
  },
  time: {
    color: Colors.tintColor,
    fontSize: 10
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC"
  },
  commentMessage: {
    paddingLeft: 10,
    paddingRight: 10
  },
  activityMessage: {
    paddingLeft: 10,
    paddingRight: 10,
    color: "#B4B4B4",
    fontStyle: "italic"
  }
});
const windowWidth = Dimensions.get("window").width;
const spacing = windowWidth * 0.025;
const sideSize = windowWidth - 2 * spacing;
let toastSuccess;
let toastError;
let commentsFlatList;

function formatDateToPickerValue(formatted) {
  const newDate = new Date(new Date(formatted).setUTCHours(0, 0, 0, 0));
  // newDate.setDate(newDate.getDate() + 1); //Increment 1 day to show correct date in DatePicker
  return newDate;
}

function formatDateToBackEnd(dateObject) {
  if (dateObject) {
    let date = dateObject;
    let month = date.getMonth();
    month = month + 1 < 10 ? `0${month + 1}` : month + 1;
    let day = date.getDate();
    day = day < 10 ? `0${day}` : day;
    date = `${date.getFullYear()}-${month}-${day}`;
    return date;
  }
  return null;
}

class GroupDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const groupId = navigation.getParam("groupId");
    const onlyView = navigation.getParam("onlyView");
    // Disable button when form its not valid
    let headerRight;

    if (onlyView) {
      headerRight = (
        <Icon
          android="md-create"
          ios="ios-create"
          onPress={navigation.getParam("onEnableEdit")}
          style={[
            {
              paddingRight: 16,
              color: "#FFFFFF"
            }
          ]}
        />
      );
    } else {
      headerRight = (
        <Icon
          android="md-checkmark"
          ios="ios-checkmark"
          onPress={navigation.getParam("onSaveGroup")}
          style={[
            {
              paddingRight: 16,
              color: "#FFFFFF"
            }
          ]}
        />
      );
    }
    return {
      title: groupId ? "Group Details" : "Add New Group",
      headerLeft: (
        <Icon
          android="md-arrow-back"
          ios="ios-arrow-back"
          onPress={() => navigation.push("Groups")}
          style={[{ paddingLeft: 16, color: "#FFFFFF" }]}
        />
      ),
      headerRight,
      headerStyle: {
        backgroundColor: Colors.tintColor
      },
      headerTintColor: "#FFFFFF",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  state = {
    group: {
      contact_address: []
    },
    onlyView: false,
    renderView: false,
    groupsReducerResponse: "",
    usersReducerResponse: "",
    comment: "",
    users: [],
    usersContacts: [],
    geonames: [],
    peopleGroups: [],
    commentsOrActivities: [],
    showAssignedToModal: false,
    currentCoaches: [],
    currentGeonames: [],
    currentPeopleGroups: []
  };

  constructor(props) {
    super(props);
    this.renderAddressRow = this.renderAddressRow.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ onSaveGroup: this.onSaveGroup });
    this.props.navigation.setParams({ onEnableEdit: this.onEnableEdit });
    const groupId = this.props.navigation.getParam("groupId");
    const onlyView = this.props.navigation.getParam("onlyView");
    // GetById
    if (groupId) {
      this.setState({
        group: {
          ID: groupId
        }
      });
      // First end-point to call
      this.getUsers();
    } else {
      this.setState({
        group: {
          ID: null
        }
      });
      this.setGroupType("pre-group");
    }

    if (onlyView) {
      this.setState(prevState => ({
        ...prevState,
        onlyView
      }));
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      groupsReducerResponse,
      usersReducerResponse,
      group,
      navigation,
      usersContacts,
      geonames,
      peopleGroups,
      comments,
      activities,
      comment,
      error,
      users
    } = nextProps;
    let newState = {
      ...prevState,
      groupsReducerResponse,
      usersReducerResponse
    };

    // Detect new message incomming

    switch (groupsReducerResponse) {
      case GROUPS_SAVE_SUCCESS:
        // Creation
        if (group.ID != null && prevState.group.ID === null) {
          navigation.setParams({ groupId: group.ID });
          newState = {
            ...newState,
            group: {
              ID: group.ID
            }
          };
        }
        toastSuccess.show("Group Saved!", 2000);
        break;
      case GROUPS_GET_USERS_CONTACTS_SUCCESS:
        newState = {
          ...newState,
          usersContacts
        };
        break;
      case GROUPS_GET_LOCATIONS_SUCCESS:
        newState = {
          ...newState,
          geonames
        };
        break;
      case GROUPS_GET_PEOPLE_GROUPS_SUCCESS:
        newState = {
          ...newState,
          peopleGroups
        };
        break;
      case GROUPS_GETBYID_SUCCESS:
        if (group.church_start_date) {
          group.church_start_date = formatDateToPickerValue(
            group.church_start_date
          );
        }
        if (group.end_date) {
          group.end_date = formatDateToPickerValue(group.end_date);
        }
        if (group.start_date) {
          group.start_date = formatDateToPickerValue(group.start_date);
        }
        newState = {
          ...newState,
          group,
          currentCoaches: group.coaches.values,
          currentGeonames: group.geonames.values,
          currentPeopleGroups: group.people_groups.values
        };
        break;
      case GROUPS_GET_COMMENTS_SUCCESS:
        newState = {
          ...newState,
          commentsOrActivities: comments
        };
        break;
      case GROUPS_GET_ACTIVITIES_SUCCESS: {
        const commentsAndActivities = newState.commentsOrActivities
          .concat(activities)
          .sort(
            (a, b) => new Date(a.date).getTime() > new Date(b.date).getTime()
          );
        newState = {
          ...newState,
          commentsOrActivities: commentsAndActivities,
          renderView: true
        };
        break;
      }
      case GROUPS_SAVE_COMMENT_SUCCESS: {
        const newCommentsOrActivities = newState.commentsOrActivities;
        newCommentsOrActivities.push(comment);
        newCommentsOrActivities.sort(
          (a, b) => new Date(a.date).getTime() > new Date(b.date).getTime()
        );
        newState = {
          ...newState,
          commentsOrActivities: newCommentsOrActivities,
          comment: ""
        };
        Keyboard.dismiss();
        break;
      }
      default:
        if (error) {
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
        break;
    }

    switch (usersReducerResponse) {
      case GET_USERS_SUCCESS:
        newState = {
          ...newState,
          users
        };
        break;
      default:
        if (error) {
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
        break;
    }

    return newState;
  }

  componentDidUpdate() {
    const { groupsReducerResponse, usersReducerResponse } = this.props;
    const { users, group } = this.state;

    if (groupsReducerResponse === this.state.groupsReducerResponse) {
      switch (groupsReducerResponse) {
        case GROUPS_SAVE_SUCCESS:
          // After creation
          if (users.length === 0) {
            this.getUsers();
          }
          break;
        case GROUPS_GET_USERS_CONTACTS_SUCCESS:
          this.getLocations();
          break;
        case GROUPS_GET_LOCATIONS_SUCCESS:
          this.getPeopleGroups();
          break;
        case GROUPS_GET_PEOPLE_GROUPS_SUCCESS:
          this.getGroupById(group.ID);
          break;
        case GROUPS_GETBYID_SUCCESS:
          this.getGroupComments(group.ID);
          break;
        case GROUPS_GET_COMMENTS_SUCCESS:
          this.getGroupActivities(group.ID);
          break;
        default:
      }
    }
    if (usersReducerResponse === this.state.usersReducerResponse) {
      switch (usersReducerResponse) {
        case GET_USERS_SUCCESS:
          this.getUsersContacts();
          break;
        default:
      }
    }
  }

  getUsers() {
    this.props.getUsers(this.props.user.domain, this.props.user.token);
  }

  getUsersContacts() {
    this.props.getUsersAndContacts(
      this.props.user.domain,
      this.props.user.token
    );
  }

  getLocations() {
    this.props.getLocations(this.props.user.domain, this.props.user.token);
  }

  getPeopleGroups() {
    this.props.getPeopleGroups(this.props.user.domain, this.props.user.token);
  }

  getGroupById(groupId) {
    this.props.getById(this.props.user.domain, this.props.user.token, groupId);
  }

  getGroupComments(groupId) {
    this.props.getComments(
      this.props.user.domain,
      this.props.user.token,
      groupId
    );
  }

  getGroupActivities(groupId) {
    this.props.getActivities(
      this.props.user.domain,
      this.props.user.token,
      groupId
    );
  }

  setGroupName = value => {
    this.setState(prevState => ({
      ...prevState,
      group: {
        ...prevState.group,
        title: value
      }
    }));
  };

  setGroupType = value => {
    this.setState(prevState => ({
      ...prevState,
      group: {
        ...prevState.group,
        group_type: value
      }
    }));
  };

  setGroupStatus = value => {
    this.setState(prevState => ({
      ...prevState,
      group: {
        ...prevState.group,
        group_status: value
      }
    }));
  };

  onEnableEdit = () => {
    this.setState(prevState => ({
      ...prevState,
      onlyView: false
    }));
    this.props.navigation.setParams({ onlyView: false });
  };

  updateShowAssignedToModal = value => {
    this.setState(prevState => ({
      ...prevState,
      showAssignedToModal: value
    }));
  };

  onSelectAssignedTo = selectedUser => {
    this.setState(prevState => ({
      ...prevState,
      group: {
        ...prevState.group,
        assigned_to: selectedUser.ID
      },
      showAssignedToModal: false
    }));
  };

  onCancelAssignedTo = () => {
    this.setState(prevState => ({
      ...prevState,
      showAssignedToModal: false
    }));
  };

  onAddAddressField = () => {
    const contactAddress = this.state.group.contact_address;
    contactAddress.push({
      value: ""
    });

    this.setState(prevState => ({
      ...prevState,
      group: {
        ...prevState.group,
        contact_address: contactAddress
      }
    }));
  };

  renderAddressRow = () => {
    this.state.group.contact_address.map((address, index) => {
      if (!address.delete) {
        return (
          <ListItem key={index.toString()} icon>
            <Body>
              <Input
                multiline
                value={address.value}
                onChangeText={value => {
                  this.onContactAddressChange(value, index, address.key, this);
                }}
                style={styles.inputContactAddress}
              />
            </Body>
            <Right>
              <Icon
                android="md-remove"
                ios="ios-remove"
                onPress={() => {
                  this.onRemoveAddressField(index, this);
                }}
                style={styles.addRemoveIcons}
              />
            </Right>
          </ListItem>
        );
      }
      return "";
    });
  };

  renderActivityOrCommentRow = commentOrActivity => (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={{ uri: commentOrActivity.gravatar }}
      />
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          {Object.prototype.hasOwnProperty.call(
            commentOrActivity,
            "content"
          ) && (
            <Grid>
              <Row>
                <Col>
                  <Text style={styles.name}>{commentOrActivity.author}</Text>
                </Col>
                <Col style={{ width: 80 }}>
                  <Text style={styles.time}>
                    {this.onFormatDateToView(commentOrActivity.date)}
                  </Text>
                </Col>
              </Row>
            </Grid>
          )}
          {Object.prototype.hasOwnProperty.call(
            commentOrActivity,
            "object_note"
          ) && (
            <Grid>
              <Row>
                <Col>
                  <Text style={styles.name}>{commentOrActivity.name}</Text>
                </Col>
                <Col style={{ width: 80 }}>
                  <Text style={styles.time}>
                    {this.onFormatDateToView(commentOrActivity.date)}
                  </Text>
                </Col>
              </Row>
            </Grid>
          )}
        </View>
        <Text
          style={
            commentOrActivity.content
              ? styles.commentMessage
              : styles.activityMessage
          }
        >
          {Object.prototype.hasOwnProperty.call(commentOrActivity, "content")
            ? commentOrActivity.content
            : commentOrActivity.object_note}
        </Text>
      </View>
    </View>
  );

  onContactAddressChange = (value, index, dbIndex, component) => {
    const contactAddressList = component.state.group.contact_address;
    const contactAddress = contactAddressList[index];
    contactAddress.value = value;
    if (dbIndex) {
      contactAddress.key = dbIndex;
    }
    component.setState(prevState => ({
      ...prevState,
      group: {
        ...prevState.group,
        contact_address: contactAddressList
      }
    }));
  };

  onRemoveAddressField = (index, component) => {
    const contactAddressList = [...component.state.group.contact_address];
    let contactAddress = contactAddressList[index];
    if (contactAddress.key) {
      contactAddress = {
        key: contactAddress.key,
        delete: true
      };
      contactAddressList[index] = contactAddress;
    } else {
      contactAddressList.splice(index, 1);
    }
    component.setState(prevState => ({
      ...prevState,
      group: {
        ...prevState.group,
        contact_address: contactAddressList
      }
    }));
  };

  onCheckExistingHealthMetric = metricName => {
    const healthMetrics = this.state.group.health_metrics.values;
    const foundhealthMetric = healthMetrics.some(
      metric => metric.value === metricName
    );
    return foundhealthMetric;
  };

  onHealthMetricChange = metricName => {
    const healthMetrics2 = this.state.group.health_metrics.values;
    const foundhealthMetric = healthMetrics2.find(
      metric => metric.value === metricName
    );
    if (foundhealthMetric) {
      const healthMetricIndex = healthMetrics2.indexOf(foundhealthMetric);
      healthMetrics2.splice(healthMetricIndex, 1);
    } else {
      healthMetrics2.push({
        value: metricName
      });
    }
    this.setState(prevState => ({
      ...prevState,
      group: {
        ...prevState.group,
        health_metrics: {
          values: healthMetrics2
        }
      }
    }));
  };

  setCoaches = () => {
    const dbCoaches = [...this.state.group.coaches.values];
    const localCoaches = [...this.state.currentCoaches];

    const coachesToSave = localCoaches.map(localCoach => ({
      value: localCoach.value
    }));

    // add coaches to delete it in db
    dbCoaches.forEach(dbCoach => {
      const foundDbCoachInLocalCoach = localCoaches.find(
        localCoach => dbCoach.value === localCoach.value
      );
      if (!foundDbCoachInLocalCoach) {
        coachesToSave.push({
          value: dbCoach.value,
          delete: true
        });
      }
    });

    return coachesToSave;
  };

  setGeonames = () => {
    const dbGeonames = [...this.state.group.geonames.values];
    const localGeonames = [...this.state.currentGeonames];

    const geonamesToSave = localGeonames.map(localGeoname => ({
      value: localGeoname.value
    }));

    // add geonames to delete it in db
    dbGeonames.forEach(dbGeoname => {
      const foundDbGeonameInLocalGeoname = localGeonames.find(
        localGeoname => dbGeoname.value === localGeoname.value
      );
      if (!foundDbGeonameInLocalGeoname) {
        geonamesToSave.push({
          value: dbGeoname.value,
          delete: true
        });
      }
    });

    return geonamesToSave;
  };

  setPeopleGroups = () => {
    const dbPeopleGroups = [...this.state.group.people_groups.values];
    const localPeopleGroups = [...this.state.currentPeopleGroups];

    const peopleGroupsToSave = localPeopleGroups.map(localPeopleGroup => ({
      value: localPeopleGroup.value
    }));

    dbPeopleGroups.forEach(dbPeopleGroup => {
      const foundDbPeopleGroupInLocalPeopleGroup = localPeopleGroups.find(
        localPeopleGroup => dbPeopleGroup.value === localPeopleGroup.value
      );
      if (!foundDbPeopleGroupInLocalPeopleGroup) {
        peopleGroupsToSave.push({
          value: dbPeopleGroup.value,
          delete: true
        });
      }
    });

    return peopleGroupsToSave;
  };

  onSaveGroup = () => {
    Keyboard.dismiss();

    const groupToSave = Object.assign({}, this.state.group);
    if (Object.prototype.hasOwnProperty.call(groupToSave, "start_date")) {
      groupToSave.start_date = formatDateToBackEnd(groupToSave.start_date);
    }
    if (Object.prototype.hasOwnProperty.call(groupToSave, "end_date")) {
      groupToSave.end_date = formatDateToBackEnd(groupToSave.end_date);
    }
    if (
      Object.prototype.hasOwnProperty.call(groupToSave, "church_start_date")
    ) {
      groupToSave.church_start_date = formatDateToBackEnd(
        groupToSave.church_start_date
      );
    }
    if (Object.prototype.hasOwnProperty.call(groupToSave, "coaches")) {
      groupToSave.coaches.values = this.setCoaches();
    }
    if (Object.prototype.hasOwnProperty.call(groupToSave, "geonames")) {
      groupToSave.geonames.values = this.setGeonames();
    }
    if (Object.prototype.hasOwnProperty.call(groupToSave, "people_groups")) {
      groupToSave.people_groups.values = this.setPeopleGroups();
    }
    this.props.saveGroup(
      this.props.user.domain,
      this.props.user.token,
      groupToSave
    );
  };

  onFormatDateToView = date => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    const newDate = new Date(date);
    let hours = newDate.getHours();
    let minutes = newDate.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    hours %= 12;
    hours = hours || 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;
    return `${monthNames[newDate.getMonth()]} ${newDate.getDate()}, ${strTime}`;
  };

  setComment = value => {
    this.setState(prevState => ({
      ...prevState,
      comment: value
    }));
  };

  onSaveComment = () => {
    const { comment } = this.state;

    if (comment.length > 0) {
      this.props.saveComment(
        this.props.user.domain,
        this.props.user.token,
        this.state.group.ID,
        {
          comment
        }
      );
    }
  };

  render() {
    // Required fields: name

    const successToast = (
      <Toast
        ref={toast => {
          toastSuccess = toast;
        }}
        style={{ backgroundColor: "green" }}
        position="center"
      />
    );
    const errorToast = (
      <Toast
        ref={toast => {
          toastError = toast;
        }}
        style={{ backgroundColor: "red" }}
        position="center"
      />
    );

    if (this.state.group.ID) {
      // Validation to render DatePickers with initial value

      /**
       * <ListItem icon>
                      <Left>
                        <Icon
                          type="MaterialIcons"
                          name="person"
                          style={styles.icons}
                        />
                      </Left>
                      <Body>
                        <TouchableOpacity
                          onPress={() => {
                            this.updateShowAssignedToModal(true);
                          }}
                        >
                          <Text>
                            {
                              this.state.users.find(user => {
                                return user.ID === this.state.group.assigned_to;
                              }).name
                            }
                          </Text>
                        </TouchableOpacity>
                        <ModalFilterPicker
                          visible={this.state.showAssignedToModal}
                          onSelect={this.onSelectAssignedTo}
                          onCancel={this.onCancelAssignedTo}
                          options={this.state.users}
                        />
                      </Body>
                      <Right>
                        <Label style={styles.label}>Assigned to</Label>
                      </Right>
                    </ListItem>
       *
       */
      return (
        <Container>
          {this.state.renderView && (
            <Tabs
              renderTabBar={() => <ScrollableTab />}
              tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
            >
              <Tab
                heading="Details"
                tabStyle={styles.tabStyle}
                textStyle={styles.textStyle}
                activeTabStyle={styles.activeTabStyle}
                activeTextStyle={styles.activeTextStyle}
              >
                <ScrollView>
                  <Form>
                    <ListItem icon>
                      <Body>
                        <Picker
                          selectedValue={this.state.group.group_status}
                          onValueChange={this.setGroupStatus}
                          enabled={!this.state.onlyView}
                        >
                          <Picker.Item label="Active" value="active" />
                          <Picker.Item label="Inactive" value="inactive" />
                        </Picker>
                      </Body>
                      <Right>
                        <Label style={styles.label}>Status</Label>
                      </Right>
                    </ListItem>

                    <ListItem icon>
                      <Left>
                        <Icon
                          type="MaterialIcons"
                          name="group"
                          style={styles.icons}
                        />
                      </Left>
                      <Body>
                        <Input
                          placeholder="e. g., John Doe's Group"
                          value={this.state.group.title}
                          onChangeText={this.setGroupName}
                          disabled={this.state.onlyView}
                        />
                      </Body>
                      <Right>
                        <Label style={styles.label}>Name</Label>
                      </Right>
                    </ListItem>
                    <ListItem>
                      <Body>
                        <MultipleTags
                          tags={this.state.usersContacts}
                          preselectedTags={this.state.currentCoaches}
                          objectKeyIdentifier="value"
                          objectValueIdentifier="name"
                          search
                          onChangeItem={coaches => {
                            this.setState(prevState => ({
                              ...prevState,
                              currentCoaches: coaches
                            }));
                          }}
                          title="Group Coach / Church Planter"
                          visibleOnOpen
                        />
                      </Body>
                    </ListItem>
                    <ListItem>
                      <Body>
                        <MultipleTags
                          tags={this.state.geonames}
                          preselectedTags={this.state.currentGeonames}
                          objectKeyIdentifier="value"
                          objectValueIdentifier="name"
                          search
                          onChangeItem={geonames => {
                            this.setState(prevState => ({
                              ...prevState,
                              currentGeonames: geonames
                            }));
                          }}
                          title="Locations"
                          visibleOnOpen
                        />
                      </Body>
                    </ListItem>
                    <ListItem>
                      <Body>
                        <MultipleTags
                          tags={this.state.peopleGroups}
                          preselectedTags={this.state.currentPeopleGroups}
                          objectKeyIdentifier="value"
                          objectValueIdentifier="name"
                          search
                          onChangeItem={peopleGroups => {
                            this.setState(prevState => ({
                              ...prevState,
                              currentPeopleGroups: peopleGroups
                            }));
                          }}
                          title="People Groups"
                          visibleOnOpen
                        />
                      </Body>
                    </ListItem>
                    <ListItem icon>
                      <Left>
                        <Icon
                          android="md-home"
                          ios="ios-home"
                          style={styles.icons}
                        />
                      </Left>
                      <Body>
                        <Text style={styles.label}>Address</Text>
                      </Body>
                      <Right>
                        <Icon
                          android="md-add"
                          ios="ios-add"
                          onPress={this.onAddAddressField}
                          style={styles.addRemoveIcons}
                        />
                      </Right>
                    </ListItem>
                    {this.renderAddressRow()}
                    <ListItem icon>
                      <Left>
                        <Icon
                          android="md-calendar"
                          ios="ios-calendar"
                          style={styles.icons}
                        />
                      </Left>
                      <Body>
                        <DatePicker
                          defaultDate={this.state.group.start_date}
                          disabled={this.state.onlyView}
                          onDateChange={value => {
                            this.setState(prevState => ({
                              ...prevState,
                              group: {
                                ...prevState.group,
                                start_date: value
                              }
                            }));
                          }}
                        />
                      </Body>
                      <Right>
                        <Label style={styles.label}>Start Date</Label>
                      </Right>
                    </ListItem>
                    <ListItem icon>
                      <Left>
                        <Icon
                          android="md-calendar"
                          ios="ios-calendar"
                          style={styles.icons}
                        />
                      </Left>
                      <Body>
                        <DatePicker
                          defaultDate={this.state.group.church_start_date}
                          disabled={this.state.onlyView}
                          onDateChange={value => {
                            this.setState(prevState => ({
                              ...prevState,
                              group: {
                                ...prevState.group,
                                church_start_date: value
                              }
                            }));
                          }}
                        />
                      </Body>
                      <Right>
                        <Label style={styles.label}>Church Start Date</Label>
                      </Right>
                    </ListItem>
                    <ListItem icon>
                      <Left>
                        <Icon
                          android="md-calendar"
                          ios="ios-calendar"
                          style={styles.icons}
                        />
                      </Left>
                      <Body>
                        <DatePicker
                          defaultDate={this.state.group.end_date}
                          disabled={this.state.onlyView}
                          onDateChange={value => {
                            this.setState(prevState => ({
                              ...prevState,
                              group: {
                                ...prevState.group,
                                end_date: value
                              }
                            }));
                          }}
                        />
                      </Body>
                      <Right>
                        <Label style={styles.label}>End Date</Label>
                      </Right>
                    </ListItem>
                  </Form>
                </ScrollView>
              </Tab>
              <Tab
                heading="Progress"
                tabStyle={styles.tabStyle}
                textStyle={styles.textStyle}
                activeTabStyle={styles.activeTabStyle}
                activeTextStyle={styles.activeTextStyle}
              >
                <ScrollView>
                  <ListItem icon>
                    <Left>
                      <Icon
                        android="md-people"
                        ios="ios-people"
                        style={styles.icons}
                      />
                    </Left>
                    <Body>
                      <Picker
                        mode="dropdown"
                        selectedValue={this.state.group.group_type}
                        onValueChange={this.setGroupType}
                      >
                        <Picker.Item label="Pre-Group" value="pre-group" />
                        <Picker.Item label="Group" value="group" />
                        <Picker.Item label="Church" value="church" />
                        <Picker.Item label="Team" value="team" />
                      </Picker>
                    </Body>
                    <Right>
                      <Label style={styles.label}>Group Type</Label>
                    </Right>
                  </ListItem>
                  <Grid>
                    <Row style={{ height: spacing }} />
                    <Row style={{ height: sideSize }}>
                      <Col style={{ width: spacing }} />
                      <Col style={{ width: sideSize }}>
                        <Image
                          source={churchCommitmentIcon}
                          style={{
                            justifyContent: "center",
                            alignItems: "center",
                            alignSelf: "center",
                            position: "absolute",
                            height: "100%",
                            width: "100%"
                          }}
                        />
                        <Row style={{ height: sideSize * 0.1 }} />
                        <Row style={{ height: sideSize * 0.8 }}>
                          <Row style={{ height: sideSize * 0.8 }}>
                            <Col style={{ width: sideSize * 0.1 }} />
                            <Col style={{ width: sideSize * 0.8 }}>
                              <Row size={5}>
                                <Col size={2} />
                                <Col size={3}>
                                  <Row size={1} />
                                  <Row size={4}>
                                    <Col>
                                      <Row size={60}>
                                        <Col>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.onHealthMetricChange(
                                                "church_giving"
                                              );
                                            }}
                                            activeOpacity={1}
                                          >
                                            <Image
                                              source={givingIcon}
                                              style={
                                                this.onCheckExistingHealthMetric(
                                                  "church_giving"
                                                )
                                                  ? styles.activeImage
                                                  : styles.inactiveImage
                                              }
                                            />
                                          </TouchableOpacity>
                                        </Col>
                                      </Row>
                                      <Row size={40}>
                                        <Text
                                          style={
                                            this.onCheckExistingHealthMetric(
                                              "church_giving"
                                            )
                                              ? styles.activeToggleText
                                              : styles.inactiveToggleText
                                          }
                                        >
                                          Giving
                                        </Text>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col size={2} />
                                <Col size={3}>
                                  <Row size={4}>
                                    <Col size={100}>
                                      <Row size={60}>
                                        <Col>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.onHealthMetricChange(
                                                "church_fellowship"
                                              );
                                            }}
                                            activeOpacity={1}
                                          >
                                            <Image
                                              source={fellowShipIcon}
                                              style={
                                                this.onCheckExistingHealthMetric(
                                                  "church_fellowship"
                                                )
                                                  ? styles.activeImage
                                                  : styles.inactiveImage
                                              }
                                            />
                                          </TouchableOpacity>
                                        </Col>
                                      </Row>
                                      <Row size={40}>
                                        <Text
                                          style={
                                            this.onCheckExistingHealthMetric(
                                              "church_fellowship"
                                            )
                                              ? styles.activeToggleText
                                              : styles.inactiveToggleText
                                          }
                                        >
                                          Fellowship
                                        </Text>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row size={1} />
                                </Col>
                                <Col size={2} />
                                <Col size={3}>
                                  <Row size={1} />
                                  <Row size={4}>
                                    <Col>
                                      <Row size={60}>
                                        <Col>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.onHealthMetricChange(
                                                "church_communion"
                                              );
                                            }}
                                            activeOpacity={1}
                                          >
                                            <Image
                                              source={communionIcon}
                                              style={
                                                this.onCheckExistingHealthMetric(
                                                  "church_communion"
                                                )
                                                  ? styles.activeImage
                                                  : styles.inactiveImage
                                              }
                                            />
                                          </TouchableOpacity>
                                        </Col>
                                      </Row>
                                      <Row size={40}>
                                        <Text
                                          style={
                                            this.onCheckExistingHealthMetric(
                                              "church_communion"
                                            )
                                              ? styles.activeToggleText
                                              : styles.inactiveToggleText
                                          }
                                        >
                                          Communion
                                        </Text>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col size={2} />
                              </Row>

                              <Row
                                size={7}
                                style={{ backgroundColor: "white" }}
                              >
                                <Col size={3}>
                                  <Row
                                    size={2}
                                    style={{ backgroundColor: "white" }}
                                  />
                                  <Row size={6}>
                                    <Col>
                                      <Row size={60}>
                                        <Col>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.onHealthMetricChange(
                                                "church_baptism"
                                              );
                                            }}
                                            activeOpacity={1}
                                          >
                                            <Image
                                              source={baptismIcon}
                                              style={
                                                this.onCheckExistingHealthMetric(
                                                  "church_baptism"
                                                )
                                                  ? styles.activeImage
                                                  : styles.inactiveImage
                                              }
                                            />
                                          </TouchableOpacity>
                                        </Col>
                                      </Row>
                                      <Row size={40}>
                                        <Text
                                          style={
                                            this.onCheckExistingHealthMetric(
                                              "church_baptism"
                                            )
                                              ? styles.activeToggleText
                                              : styles.inactiveToggleText
                                          }
                                        >
                                          Baptism
                                        </Text>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row size={2} />
                                </Col>
                                <Col size={4} />
                                <Col size={3}>
                                  <Row size={2} />
                                  <Row size={6}>
                                    <Col>
                                      <Row size={60}>
                                        <Col>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.onHealthMetricChange(
                                                "church_prayer"
                                              );
                                            }}
                                            activeOpacity={1}
                                          >
                                            <Image
                                              source={prayerIcon}
                                              style={
                                                this.onCheckExistingHealthMetric(
                                                  "church_prayer"
                                                )
                                                  ? styles.activeImage
                                                  : styles.inactiveImage
                                              }
                                            />
                                          </TouchableOpacity>
                                        </Col>
                                      </Row>
                                      <Row size={40}>
                                        <Text
                                          style={
                                            this.onCheckExistingHealthMetric(
                                              "church_prayer"
                                            )
                                              ? styles.activeToggleText
                                              : styles.inactiveToggleText
                                          }
                                        >
                                          Prayer
                                        </Text>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row size={2} />
                                </Col>
                                <Col size={4} />
                                <Col size={3}>
                                  <Row size={2} />
                                  <Row size={6}>
                                    <Col>
                                      <Row size={60}>
                                        <Col>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.onHealthMetricChange(
                                                "church_leaders"
                                              );
                                            }}
                                            activeOpacity={1}
                                          >
                                            <Image
                                              source={leadersIcon}
                                              style={
                                                this.onCheckExistingHealthMetric(
                                                  "church_leaders"
                                                )
                                                  ? styles.activeImage
                                                  : styles.inactiveImage
                                              }
                                            />
                                          </TouchableOpacity>
                                        </Col>
                                      </Row>
                                      <Row size={40}>
                                        <Text
                                          style={
                                            this.onCheckExistingHealthMetric(
                                              "church_leaders"
                                            )
                                              ? styles.activeToggleText
                                              : styles.inactiveToggleText
                                          }
                                        >
                                          Leaders
                                        </Text>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row size={2} />
                                </Col>
                              </Row>

                              <Row size={5}>
                                <Col size={2} />
                                <Col size={3}>
                                  <Row size={4}>
                                    <Col>
                                      <Row size={60}>
                                        <Col>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.onHealthMetricChange(
                                                "church_bible"
                                              );
                                            }}
                                            activeOpacity={1}
                                          >
                                            <Image
                                              source={bibleStudyIcon}
                                              style={
                                                this.onCheckExistingHealthMetric(
                                                  "church_bible"
                                                )
                                                  ? styles.activeImage
                                                  : styles.inactiveImage
                                              }
                                            />
                                          </TouchableOpacity>
                                        </Col>
                                      </Row>
                                      <Row size={40}>
                                        <Text
                                          style={
                                            this.onCheckExistingHealthMetric(
                                              "church_bible"
                                            )
                                              ? styles.activeToggleText
                                              : styles.inactiveToggleText
                                          }
                                        >
                                          Bible Study
                                        </Text>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row size={1} />
                                </Col>
                                <Col size={2} />
                                <Col size={3}>
                                  <Row size={1} />
                                  <Row size={4}>
                                    <Col>
                                      <Row size={60}>
                                        <Col>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.onHealthMetricChange(
                                                "church_praise"
                                              );
                                            }}
                                            activeOpacity={1}
                                          >
                                            <Image
                                              source={praiseIcon}
                                              style={
                                                this.onCheckExistingHealthMetric(
                                                  "church_praise"
                                                )
                                                  ? styles.activeImage
                                                  : styles.inactiveImage
                                              }
                                            />
                                          </TouchableOpacity>
                                        </Col>
                                      </Row>
                                      <Row size={40}>
                                        <Text
                                          style={
                                            this.onCheckExistingHealthMetric(
                                              "church_praise"
                                            )
                                              ? styles.activeToggleText
                                              : styles.inactiveToggleText
                                          }
                                        >
                                          Praise
                                        </Text>
                                      </Row>
                                    </Col>
                                  </Row>
                                </Col>
                                <Col size={2} />
                                <Col size={3}>
                                  <Row size={4}>
                                    <Col>
                                      <Row size={60}>
                                        <Col>
                                          <TouchableOpacity
                                            onPress={() => {
                                              this.onHealthMetricChange(
                                                "church_sharing"
                                              );
                                            }}
                                            activeOpacity={1}
                                          >
                                            <Image
                                              source={sharingTheGospelIcon}
                                              style={
                                                this.onCheckExistingHealthMetric(
                                                  "church_sharing"
                                                )
                                                  ? styles.activeImage
                                                  : styles.inactiveImage
                                              }
                                            />
                                          </TouchableOpacity>
                                        </Col>
                                      </Row>
                                      <Row size={40}>
                                        <Text
                                          style={
                                            this.onCheckExistingHealthMetric(
                                              "church_sharing"
                                            )
                                              ? styles.activeToggleText
                                              : styles.inactiveToggleText
                                          }
                                        >
                                          Sharing the Gospel
                                        </Text>
                                      </Row>
                                    </Col>
                                  </Row>
                                  <Row size={1} />
                                </Col>
                                <Col size={2} />
                              </Row>
                            </Col>
                            <Col style={{ width: sideSize * 0.1 }} />
                          </Row>
                        </Row>
                        <Row style={{ height: sideSize * 0.1 }} />
                      </Col>
                      <Col style={{ width: spacing }} />
                    </Row>
                    <Row style={{ height: spacing }} />
                  </Grid>
                </ScrollView>
              </Tab>
              <Tab
                heading="Comments / Activity"
                tabStyle={[styles.tabStyle]}
                textStyle={styles.textStyle}
                activeTabStyle={styles.activeTabStyle}
                activeTextStyle={styles.activeTextStyle}
              >
                {Object.prototype.hasOwnProperty.call(
                  this.state,
                  "commentsOrActivities"
                ) &&
                  this.state.commentsOrActivities && (
                    <View style={{ flex: 1 }}>
                      <FlatList
                        style={styles.root}
                        ref={flatList => {
                          commentsFlatList = flatList;
                        }}
                        onContentSizeChange={() =>
                          commentsFlatList.scrollToEnd()
                        }
                        data={this.state.commentsOrActivities}
                        extraData={this.state.commentsOrActivities}
                        ItemSeparatorComponent={() => (
                          <View style={styles.separator} />
                        )}
                        keyExtractor={item => item.ID.toString()}
                        renderItem={item => {
                          const commentOrActivity = item.item;
                          return this.renderActivityOrCommentRow(
                            commentOrActivity
                          );
                        }}
                      />
                      <KeyboardAccessory>
                        <View
                          style={{
                            backgroundColor: "white",
                            flexDirection: "row"
                          }}
                        >
                          <TextInput
                            placeholder="Write your comment or note here"
                            value={this.state.comment}
                            onChangeText={this.setComment}
                            style={{
                              borderColor: "#B4B4B4",
                              borderRadius: 5,
                              borderWidth: 1,
                              flex: 1,
                              margin: 10,
                              paddingLeft: 5,
                              paddingRight: 5
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => this.onSaveComment()}
                            style={{
                              backgroundColor: Colors.tintColor,
                              borderRadius: 80,
                              height: 40,
                              margin: 10,
                              paddingTop: 7,
                              paddingLeft: 10,
                              width: 40
                            }}
                          >
                            <Icon
                              android="md-send"
                              ios="ios-send"
                              style={{ color: "white", fontSize: 25 }}
                            />
                          </TouchableOpacity>
                        </View>
                      </KeyboardAccessory>
                    </View>
                  )}
              </Tab>
              <Tab
                heading="Members"
                tabStyle={styles.tabStyle}
                textStyle={styles.textStyle}
                activeTabStyle={styles.activeTabStyle}
                activeTextStyle={styles.activeTextStyle}
              />
              <Tab
                heading="Groups"
                tabStyle={styles.tabStyle}
                textStyle={styles.textStyle}
                activeTabStyle={styles.activeTabStyle}
                activeTextStyle={styles.activeTextStyle}
              />
            </Tabs>
          )}
          {successToast}
          {errorToast}
        </Container>
      );
    }
    return (
      <ScrollView>
        <Container>
          <Content>
            <Form>
              <ListItem icon>
                <Left>
                  <Icon
                    type="MaterialIcons"
                    name="group"
                    style={styles.icons}
                  />
                </Left>
                <Body>
                  <Input
                    placeholder="Required Field"
                    value={this.state.group.title}
                    onChangeText={this.setGroupName}
                  />
                </Body>
                <Right>
                  <Label style={styles.label}>Name</Label>
                </Right>
              </ListItem>
              <ListItem icon>
                <Left>
                  <Icon
                    android="md-people"
                    ios="ios-people"
                    style={styles.icons}
                  />
                </Left>
                <Body>
                  <Picker
                    mode="dropdown"
                    selectedValue={this.state.group.group_type}
                    onValueChange={this.setGroupType}
                  >
                    <Picker.Item label="Pre-Group" value="pre-group" />
                    <Picker.Item label="Group" value="group" />
                    <Picker.Item label="Church" value="church" />
                    <Picker.Item label="Team" value="team" />
                  </Picker>
                </Body>
                <Right>
                  <Label style={styles.label}>Group Type</Label>
                </Right>
              </ListItem>
            </Form>
          </Content>
          {successToast}
          {errorToast}
        </Container>
      </ScrollView>
    );
  }
}

GroupDetailScreen.propTypes = {
  user: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string
  }).isRequired,
  error: PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string
  }),
  group: PropTypes.shape({
    key: PropTypes.number
  }),
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired
  }).isRequired,
  getById: PropTypes.func.isRequired,
  saveGroup: PropTypes.func.isRequired,
  getUsersAndContacts: PropTypes.func.isRequired,
  groupsReducerResponse: PropTypes.string,
  getComments: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  getLocations: PropTypes.func.isRequired,
  getPeopleGroups: PropTypes.func.isRequired,
  getActivities: PropTypes.func.isRequired,
  getUsers: PropTypes.func.isRequired,
  usersReducerResponse: PropTypes.string
};
GroupDetailScreen.defaultProps = {
  error: null,
  group: null,
  groupsReducerResponse: null,
  usersReducerResponse: null
};
const mapStateToProps = state => ({
  user: state.userReducer,
  error: state.groupsReducer.error,
  groupsReducerResponse: state.groupsReducer.type,
  group: state.groupsReducer.group,
  usersContacts: state.groupsReducer.usersContacts,
  comments: state.groupsReducer.comments,
  comment: state.groupsReducer.comment,
  geonames: state.groupsReducer.geonames,
  peopleGroups: state.groupsReducer.peopleGroups,
  activities: state.groupsReducer.activities,
  users: state.usersReducer.users,
  usersReducerResponse: state.usersReducer.type
});
const mapDispatchToProps = dispatch => ({
  saveGroup: (domain, token, groupData) => {
    dispatch(saveGroup(domain, token, groupData));
  },
  getById: (domain, token, groupId) => {
    dispatch(getById(domain, token, groupId));
  },
  getUsersAndContacts: (domain, token) => {
    dispatch(getUsersAndContacts(domain, token));
  },
  getComments: (domain, token, groupId) => {
    dispatch(getCommentsByGroup(domain, token, groupId));
  },
  saveComment: (domain, token, groupId, commentData) => {
    dispatch(saveComment(domain, token, groupId, commentData));
  },
  getLocations: (domain, token) => {
    dispatch(getLocations(domain, token));
  },
  getPeopleGroups: (domain, token) => {
    dispatch(getPeopleGroups(domain, token));
  },
  getActivities: (domain, token, groupId) => {
    dispatch(getActivitiesByGroup(domain, token, groupId));
  },
  getUsers: (domain, token) => {
    dispatch(getUsers(domain, token));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupDetailScreen);
