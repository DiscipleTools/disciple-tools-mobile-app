import React from "react";
import { connect } from "react-redux";
import {
  ScrollView,
  Text,
  Keyboard,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  TextInput
} from "react-native";
import Toast from "react-native-easy-toast";
import {
  Container,
  Content,
  Item,
  Label,
  Input,
  Icon,
  List,
  Picker,
  Tabs,
  Tab,
  ScrollableTab,
  DatePicker
} from "native-base";
import Colors from "../constants/Colors";
import {
  getLocations,
  GROUPS_GET_LOCATIONS_SUCCESS,
  getUsersAndContacts,
  GROUPS_GET_USERS_CONTACTS_SUCCESS,
  search,
  GROUPS_SEARCH_SUCCESS
} from "../store/actions/groups.actions";
import {
  save,
  CONTACTS_SAVE_SUCCESS,
  getCommentsByContact,
  CONTACTS_GET_COMMENTS_SUCCESS,
  saveComment,
  CONTACTS_SAVE_COMMENT_SUCCESS,
  getById,
  CONTACTS_GETBYID_SUCCESS,
  getActivitiesByContact,
  CONTACTS_GET_ACTIVITIES_SUCCESS
} from "../store/actions/contacts.actions";
import PropTypes from "prop-types";
import MultipleTags from "react-native-multiple-tags";
import KeyboardShift from "../components/KeyboardShift";
import { Col, Row, Grid } from "react-native-easy-grid";
import KeyboardAccessory from "react-native-sticky-keyboard-accessory";
import ProgressBarAnimated from "react-native-progress-bar-animated";

import statesBeliefIcon from "../assets/icons/communion.png"; //replace
import baptismIcon from "../assets/icons/baptism.png";
import bibleStudyIcon from "../assets/icons/word.png";
import sharingTheGospelIcon from "../assets/icons/evangelism.png";

let toastSuccess,
  toastError,
  containerPadding = 35,
  windowWidth = Dimensions.get("window").width,
  progressBarWidth = windowWidth - 100,
  milestonesGridSize = windowWidth - (containerPadding - 5),
  commentsFlatList;
const styles = StyleSheet.create({
  tabBarUnderlineStyle: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.tintColor
  },
  tabStyle: { backgroundColor: "#FFFFFF" },
  textStyle: { color: "gray" },
  activeTabStyle: { backgroundColor: "#FFFFFF" },
  activeTextStyle: { color: Colors.tintColor, fontWeight: "bold" },
  addRemoveIcons: {
    fontSize: 30,
    color: "black"
  },
  icon: {
    color: Colors.tintColor
  },
  //Form
  formContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: containerPadding,
    paddingRight: containerPadding
  },
  formRow: {
    borderBottomColor: "#CCCCCC",
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10
  },
  formIconLabel: { width: "auto" },
  formIcon: {
    color: Colors.tintColor,
    fontSize: 25,
    marginTop: "auto",
    marginBottom: "auto",
    marginRight: 10
  },
  formLabel: {
    color: Colors.tintColor,
    fontSize: 12,
    marginTop: "auto",
    marginBottom: "auto"
  },
  //Progress Section
  progressIcon: { height: "100%", width: "100%" },
  progressIconActive: {
    opacity: 1
  },
  progressIconInactive: {
    opacity: 0.4
  },
  progressIconText: {
    fontSize: 11
  },
  // Comments Section
  name: {
    color: Colors.tintColor,
    fontSize: 13,
    fontWeight: "bold"
  },
  time: {
    color: Colors.tintColor,
    fontSize: 10
  }
});

function formatDateToPickerValue(formatted) {
  const newDate = new Date(new Date(formatted).setUTCHours(0, 0, 0, 0));
  // newDate.setDate(newDate.getDate() + 1); //Increment 1 day to show correct date in DatePicker
  return newDate;
}

class ContactDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    let navigationTitle = "Add New Contact",
      headerRight = (
        <Icon
          android="md-checkmark"
          ios="ios-checkmark"
          onPress={navigation.getParam("onSaveContact")}
          style={{
            paddingRight: 16,
            color: "#FFFFFF"
          }}
        />
      );

    if (params) {
      if (params.contactName) {
        navigationTitle = params.contactName;
      }
      if (params.onlyView) {
        headerRight = (
          <Icon
            android="md-create"
            ios="ios-create"
            onPress={navigation.getParam("onEnableEdit")}
            style={{
              paddingRight: 16,
              color: "#FFFFFF"
            }}
          />
        );
      }
    }

    return {
      title: navigationTitle,
      headerLeft: (
        <Icon
          android="md-arrow-back"
          ios="ios-arrow-back"
          onPress={() => navigation.push("Contacts")}
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
    contact: {
      ID: null,
      contact_phone: [],
      sources: {
        values: [
          {
            value: "personal"
          }
        ]
      },
      geonames: {
        values: []
      }
    },
    contactSources: [
      {
        label: "Personal",
        value: "personal"
      },
      {
        label: "Web",
        value: "web"
      },
      {
        label: "Phone",
        value: "phone"
      },
      {
        label: "Facebook",
        value: "facebook"
      },
      {
        label: "Twitter",
        value: "twitter"
      },
      {
        label: "LinkedIn",
        value: "linkedin"
      },
      {
        label: "Referral",
        value: "referral"
      },
      {
        label: "Advertisement",
        value: "advertisement"
      },
      {
        label: "Transfer",
        value: "transfer"
      }
    ],
    geonames: [],
    currentGeonames: [],
    groupsReducerResponse: "",
    renderView: false,
    contactsReducerResponse: "",
    commentsOrActivities: [],
    comment: "",
    progressBarValue: 0,
    groups: [],
    contacts: [],
    currentGroups: [],
    currentConnections: [],
    currentBaptizedBy: [],
    currentBaptized: [],
    currentCoachedBy: [],
    currentCoaching: [],
    usersContacts: [],
    currentSubassignedContacts: [],
    overallStatusBackgroundColor: "",
    listContactStates: [
      {
        label: "New Contact",
        value: "new"
      },
      {
        label: "Not Ready",
        value: "unassignable"
      },
      {
        label: "Dispatch Needed",
        value: "unassigned"
      },
      {
        label: "Waiting to be accepted",
        value: "assigned"
      },
      {
        label: "Active",
        value: "active"
      },
      {
        label: "Paused",
        value: "paused"
      },
      {
        label: "Closed",
        value: "closed"
      }
    ]
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.navigation.setParams({ onSaveContact: this.onSaveContact });
    this.props.navigation.setParams({ onEnableEdit: this.onEnableEdit });
    const onlyView = this.props.navigation.getParam("onlyView");
    const contactId = this.props.navigation.getParam("contactId");
    const contactName = this.props.navigation.getParam("contactName");

    if (contactId) {
      this.setState(state => ({
        ...state,
        contact: {
          ...state.contact,
          ID: contactId
        }
      }));
      this.props.navigation.setParams({ contactName: contactName });
    }
    if (onlyView) {
      this.setState(prevState => ({
        ...prevState,
        onlyView
      }));
    }
    this.getLocations();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      geonames,
      error,
      groupsReducerResponse,
      contact,
      contactsReducerResponse,
      navigation,
      comments,
      comment,
      activities,
      usersContacts,
      search
    } = nextProps;
    let newState = {
      ...prevState
    };
    console.log("getDerivedStateFromProps()");

    newState = {
      ...newState,
      groupsReducerResponse,
      contactsReducerResponse
    };

    //New response incomming
    if (groupsReducerResponse != prevState.groupsReducerResponse) {
      console.log("groupsReducerResponse", groupsReducerResponse);
      switch (groupsReducerResponse) {
        case GROUPS_GET_LOCATIONS_SUCCESS:
          newState = {
            ...newState,
            geonames,
            renderView: !prevState.contact.ID
          };
          break;
        case GROUPS_GET_USERS_CONTACTS_SUCCESS:
          newState = {
            ...newState,
            usersContacts
          };
          break;
        case GROUPS_SEARCH_SUCCESS:
          newState = {
            ...newState,
            groups: search
          };
          break;
      }
    }

    //New response incomming
    if (contactsReducerResponse != prevState.contactsReducerResponse) {
      console.log("contactsReducerResponse", contactsReducerResponse);
      switch (contactsReducerResponse) {
        case CONTACTS_SAVE_SUCCESS:
          //Creation
          toastSuccess.show("Contact Saved!", 2000);
          console.log("contact", contact);
          console.log("prevState.contact", prevState.contact);
          if (contact.ID && !prevState.contact.ID) {
            navigation.setParams({ contactName: contact.title });
            newState = {
              ...newState,
              contact,
              renderView: false
            };
          }
          break;
        case CONTACTS_GETBYID_SUCCESS:
          if (contact.baptism_date) {
            contact.baptism_date = formatDateToPickerValue(
              contact.baptism_date
            );
          }
          newState = {
            ...newState,
            contact,
            currentSubassignedContacts: contact.subassigned.values,
            currentGroups: contact.groups.values
          };
          break;
        case CONTACTS_GET_COMMENTS_SUCCESS:
          newState = {
            ...newState,
            commentsOrActivities: comments
          };
          break;
        case CONTACTS_GET_ACTIVITIES_SUCCESS: {
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
        case CONTACTS_SAVE_COMMENT_SUCCESS: {
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
      }
    }

    if (error) {
      console.log("error", error);
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

    return newState;
  }

  componentDidUpdate(prevProps) {

    const { contactsReducerResponse, groupsReducerResponse } = this.props;
    const { contact, contacts, renderView } = this.state;
    console.log("componentDidUpdate()");
    //console.log("prevProps", prevProps);
    //console.log("this.props", this.props);
    //console.log("------------------------");
    //New response incomming
    if (prevProps.groupsReducerResponse != groupsReducerResponse) {
      console.log("groupsReducerResponse", groupsReducerResponse);
      switch (groupsReducerResponse) {
        case GROUPS_GET_LOCATIONS_SUCCESS:
          //After creation / Loading in Get By Id
          if (contact.ID && contacts.length === 0) {
            this.getUsersContacts();
          }
          break;
        case GROUPS_GET_USERS_CONTACTS_SUCCESS:
          this.searchGroups();
          break;
        case GROUPS_SEARCH_SUCCESS:
          this.getContactById(contact.ID);
          break;
      }
    }

    //New response incomming
    if (prevProps.contactsReducerResponse != contactsReducerResponse) {
      console.log("contactsReducerResponse", contactsReducerResponse);
      switch (contactsReducerResponse) {
        case CONTACTS_SAVE_SUCCESS:
          // After creation
          if (!renderView) {
            this.getUsersContacts();
          }
          break;
        case CONTACTS_GETBYID_SUCCESS:
          this.setSeekerPath(contact.seeker_path);
          this.setContactStatus(contact.overall_status);
          this.getContactComments(contact.ID);
          //DETECT AFTER CREATION
          break;
        case CONTACTS_GET_COMMENTS_SUCCESS:
          this.getContactActivities(contact.ID);
          break;
      }
    }
    console.log("-----------------------------------------------");
  }

  getLocations() {
    this.props.getLocations(this.props.user.domain, this.props.user.token);
  }

  getUsersContacts() {
    this.props.getUsersAndContacts(
      this.props.user.domain,
      this.props.user.token
    );
  }

  searchGroups() {
    this.props.searchGroups(this.props.user.domain, this.props.user.token);
  }

  getContactById(contactId) {
    this.props.getById(
      this.props.user.domain,
      this.props.user.token,
      contactId
    );
  }

  getContactComments(contactId) {
    this.props.getComments(
      this.props.user.domain,
      this.props.user.token,
      contactId
    );
  }

  getContactActivities(contactId) {
    this.props.getActivities(
      this.props.user.domain,
      this.props.user.token,
      contactId
    );
  }

  renderStatusPickerItems = () => {
    return this.state.listContactStates.map((status, index) => {
      return (
        <Picker.Item key={index} label={status.label} value={status.value} />
      );
    });
  };

  renderSourcePickerItems = () => {
    return this.state.contactSources.map((source, index) => {
      return (
        <Picker.Item key={index} label={source.label} value={source.value} />
      );
    });
  };

  renderActivityOrCommentRow = commentOrActivity => (
    <View
      style={{
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "flex-start"
      }}
    >
      <Image
        style={{
          height: 16,
          marginTop: 10,
          width: 16
        }}
        source={{ uri: commentOrActivity.gravatar }}
      />
      <View
        style={{
          backgroundColor: "#F3F3F3",
          borderRadius: 5,
          flex: 1,
          marginLeft: 16,
          padding: 10
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 6
          }}
        >
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
              ? {
                  paddingLeft: 10,
                  paddingRight: 10
                }
              : {
                  paddingLeft: 10,
                  paddingRight: 10,
                  color: "#B4B4B4",
                  fontStyle: "italic"
                }
          }
        >
          {Object.prototype.hasOwnProperty.call(commentOrActivity, "content")
            ? commentOrActivity.content
            : commentOrActivity.object_note}
        </Text>
      </View>
    </View>
  );

  onEnableEdit = () => {
    this.setState(prevState => ({
      ...prevState,
      onlyView: false
    }));
    this.props.navigation.setParams({ onlyView: false });
  };

  setContactTitle = value => {
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        title: value
      }
    }));
  };

  setContactPhone = value => {
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        contact_phone: [
          {
            value: value
          }
        ]
      }
    }));
  };

  setContactEmail = value => {
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        contact_email: [
          {
            value: value
          }
        ]
      }
    }));
  };

  setContactSource = value => {
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        sources: {
          values: [
            {
              value: value
            }
          ]
        }
      }
    }));
  };

  setGeonames = () => {
    const dbGeonames = [...this.state.contact.geonames.values];
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

  setCurrentGeonames = value => {
    this.setState(prevState => ({
      ...prevState,
      currentGeonames: value
    }));
  };

  setContactInitialComment = value => {
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        initial_comment: value
      }
    }));
  };

  setContactStatus = value => {
    var newColor = "";

    if (value == "new" || value == "unassigned" || value == "closed") {
      newColor = "#d9534f";
    } else if (
      value == "unassignable" ||
      value == "assigned" ||
      value == "paused"
    ) {
      newColor = "#f0ad4e";
    } else if (value == "active") {
      newColor = "#5cb85c";
    }

    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        overall_status: value
      },
      overallStatusBackgroundColor: newColor
    }));
  };

  setSeekerPath = value => {
    let newProgressValue = 100 / 6;

    switch (value) {
      case "none":
        newProgressValue = newProgressValue * 0;
        break;
      case "attempted":
        newProgressValue = newProgressValue * 1;
        break;
      case "established":
        newProgressValue = newProgressValue * 2;
        break;
      case "scheduled":
        newProgressValue = newProgressValue * 3;
        break;
      case "met":
        newProgressValue = newProgressValue * 4;
        break;
      case "ongoing":
        newProgressValue = newProgressValue * 5;
        break;
      case "coaching":
        newProgressValue = newProgressValue * 6;
        break;
    }
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        seeker_path: value
      },
      progressBarValue: newProgressValue
    }));
  };

  setBaptismDate = value => {
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        baptism_date: value
      }
    }));
  };

  onSaveContact = () => {
    Keyboard.dismiss();
    const contactToSave = Object.assign({}, this.state.contact);
    contactToSave.geonames.values = this.setGeonames();
    if (Object.prototype.hasOwnProperty.call(contactToSave, "subassigned")) {
      contactToSave.subassigned.values = this.setSubassignedContacts();
    }
    if (Object.prototype.hasOwnProperty.call(contactToSave, "groups")) {
      contactToSave.groups.values = this.setGroups();
    }
    this.props.saveContact(
      this.props.user.domain,
      this.props.user.token,
      contactToSave
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
        this.state.contact.ID,
        {
          comment
        }
      );
    }
  };

  onCheckExistingMilestone = milestoneName => {
    const milestones = this.state.contact.milestones.values;
    const foundMilestone = milestones.some(
      milestone => milestone.value === milestoneName
    );
    return foundMilestone;
  };

  onMilestoneChange = milestoneName => {
    const milestones2 = this.state.contact.milestones.values;
    const foundMilestone = milestones2.find(
      milestone => milestone.value === milestoneName
    );
    if (foundMilestone) {
      const milestoneIndex = milestones2.indexOf(foundMilestone);
      milestones2.splice(milestoneIndex, 1);
    } else {
      milestones2.push({
        value: milestoneName
      });
    }
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        milestones: {
          values: milestones2
        }
      }
    }));
  };

  setCurrentSubassignedContacts = contacts => {
    this.setState(prevState => ({
      ...prevState,
      currentSubassignedContacts: contacts
    }));
  };

  setSubassignedContacts = () => {
    const dbContacts = [...this.state.contact.subassigned.values];
    const localContacts = [...this.state.currentSubassignedContacts];

    const contactsToSave = localContacts.map(localContact => ({
      value: localContact.value
    }));

    // add coaches to delete it in db
    dbContacts.forEach(dbContact => {
      const foundDbContactInLocalContact = localContacts.find(
        localContact => dbContact.value === localContact.value
      );
      if (!foundDbContactInLocalContact) {
        contactsToSave.push({
          value: dbContact.value,
          delete: true
        });
      }
    });
    return contactsToSave;
  };

  setCurrentGroups = groups => {
    this.setState(prevState => ({
      ...prevState,
      currentGroups: groups
    }));
  };

  setGroups = () => {
    const dbGroups = [...this.state.contact.groups.values];
    const localGroups = [...this.state.currentGroups];
    const groupsToSave = localGroups.map(localGroup => ({
      value: localGroup.value
    }));

    dbGroups.forEach(dbGroup => {
      const foundDbGroupInLocalGroup = localGroups.find(
        localGroup => dbGroup.value === localGroup.value
      );
      if (!foundDbGroupInLocalGroup) {
        groupsToSave.push({
          value: dbGroup.value,
          delete: true
        });
      }
    });
    return groupsToSave;
  };

  setCurrentConnections = () => {};

  setCurrentBaptizedBy = () => {};

  setCurrentBaptized = () => {};

  setCurrentCoachedBy = () => {};

  setCurrentCoaching = () => {};

  setContactLocations = () => {};

  setContactPeopleGroups = () => {};

  setContactAge = value => {
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        age: value
      }
    }));
  };

  setContactGender = value => {
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        gender: value
      }
    }));
  };

  setContactPeopleSources = () => {};

  render() {
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

    return (
      <Container>
        {this.state.contact.ID && this.state.renderView && (
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
              <KeyboardShift>
                {() => (
                  <ScrollView>
                    <View
                      style={styles.formContainer}
                      pointerEvents={this.state.onlyView ? "none" : "auto"}
                    >
                      <Label style={[styles.formLabel, { fontWeight: "bold" }]}>
                        Status
                      </Label>
                      <Grid>
                        <Row
                          style={[
                            styles.formRow,
                            { borderBottomColor: "transparent" }
                          ]}
                        >
                          <Col>
                            <Picker
                              selectedValue={this.state.contact.overall_status}
                              onValueChange={this.setContactStatus}
                              style={{
                                color: "#FFFFFF",
                                backgroundColor: this.state
                                  .overallStatusBackgroundColor
                              }}
                            >
                              {this.renderStatusPickerItems()}
                            </Picker>
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              android="md-people"
                              ios="ios-people"
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <MultipleTags
                              tags={this.state.usersContacts}
                              preselectedTags={
                                this.state.currentSubassignedContacts
                              }
                              objectKeyIdentifier="value"
                              objectValueIdentifier="name"
                              onChangeItem={this.setCurrentSubassignedContacts}
                              search
                              visibleOnOpen={!this.state.onlyView}
                              title="Sub-assigned to"
                              searchHitResponse={""}
                              defaultInstructionClosed={""}
                              defaultInstructionOpen={""}
                            />
                          </Col>
                          <Col style={styles.formIconLabel}>
                            <Label style={styles.formLabel} />
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              android="md-call"
                              ios="ios-call"
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <Label style={styles.formLabel}>Mobile</Label>
                          </Col>
                          <Col style={styles.formIconLabel}>
                            <Label style={styles.formLabel}>Mobile</Label>
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              android="md-mail"
                              ios="ios-mail"
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <Label style={styles.formLabel}>Email</Label>
                          </Col>
                          <Col style={styles.formIconLabel}>
                            <Label style={styles.formLabel}>Email</Label>
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              android="logo-facebook"
                              ios="logo-facebook"
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <Label style={styles.formLabel}>Message</Label>
                          </Col>
                          <Col style={styles.formIconLabel}>
                            <Label style={styles.formLabel}>Message</Label>
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              android="md-home"
                              ios="ios-home"
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <Label style={styles.formLabel}>Address</Label>
                          </Col>
                          <Col style={styles.formIconLabel}>
                            <Label style={styles.formLabel}>Address</Label>
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              android="md-pin"
                              ios="ios-pin"
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <Label style={styles.formLabel}>Location</Label>
                          </Col>
                          <Col style={styles.formIconLabel}>
                            <Label style={styles.formLabel}>Location</Label>
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              android="md-globe"
                              ios="ios-globe"
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <Label style={styles.formLabel}>People Group</Label>
                          </Col>
                          <Col style={styles.formIconLabel}>
                            <Label style={styles.formLabel}>People Group</Label>
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              android="md-time"
                              ios="ios-time"
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <Picker
                              mode="dropdown"
                              selectedValue={this.state.contact.age}
                              onValueChange={this.setContactAge}
                            >
                              <Picker.Item label="" value="not-set" />
                              <Picker.Item
                                label="Under 18 years old"
                                value="<19"
                              />
                              <Picker.Item
                                label="18-25 years old"
                                value="<26"
                              />
                              <Picker.Item
                                label="26-40 years old"
                                value="<41"
                              />
                              <Picker.Item
                                label="Over 40 years old"
                                value=">41"
                              />
                            </Picker>
                          </Col>
                          <Col style={styles.formIconLabel}>
                            <Label style={styles.formLabel}>Age</Label>
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              android="md-male"
                              ios="ios-male"
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <Picker
                              mode="dropdown"
                              selectedValue={this.state.contact.gender}
                              onValueChange={this.setContactGender}
                            >
                              <Picker.Item label="" value="not-set" />
                              <Picker.Item label="Male" value="male" />
                              <Picker.Item label="Female" value="female" />
                            </Picker>
                          </Col>
                          <Col style={styles.formIconLabel}>
                            <Label style={styles.formLabel}>Gender</Label>
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              android="md-arrow-dropright"
                              ios="ios-arrow-dropright"
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <Label style={styles.formLabel}>Source</Label>
                          </Col>
                          <Col style={styles.formIconLabel}>
                            <Label style={styles.formLabel}>Source</Label>
                          </Col>
                        </Row>
                      </Grid>
                    </View>
                  </ScrollView>
                )}
              </KeyboardShift>
            </Tab>
            <Tab
              heading="Progress"
              tabStyle={styles.tabStyle}
              textStyle={styles.textStyle}
              activeTabStyle={styles.activeTabStyle}
              activeTextStyle={styles.activeTextStyle}
            >
              <ScrollView>
                <View
                  style={styles.formContainer}
                  pointerEvents={this.state.onlyView ? "none" : "auto"}
                >
                  <Grid>
                    <Row
                      style={[
                        styles.formRow,
                        { borderBottomColor: "transparent" }
                      ]}
                    >
                      <Col style={styles.formIconLabel}>
                        <Icon
                          android="md-calendar"
                          ios="ios-calendar"
                          style={styles.formIcon}
                        />
                      </Col>
                      <Col>
                        <Picker
                          mode="dropdown"
                          selectedValue={this.state.contact.seeker_path}
                          onValueChange={this.setSeekerPath}
                          textStyle={{ color: Colors.tintColor }}
                        >
                          <Picker.Item
                            label="Contact Attempt Needed"
                            value="none"
                          />
                          <Picker.Item
                            label="Contact Attempted"
                            value="attempted"
                          />
                          <Picker.Item
                            label="Contact Established"
                            value="established"
                          />
                          <Picker.Item
                            label="First Meeting Scheduled"
                            value="scheduled"
                          />
                          <Picker.Item
                            label="First Meeting Complete"
                            value="met"
                          />
                          <Picker.Item
                            label="Ongoing Meetings"
                            value="ongoing"
                          />
                          <Picker.Item label="Being Coached" value="coaching" />
                        </Picker>
                      </Col>
                      <Col style={styles.formIconLabel}>
                        <Label style={styles.formLabel}>Seeker Path</Label>
                      </Col>
                    </Row>
                  </Grid>
                  <View
                    style={{
                      alignItems: "center",
                      marginTop: 5,
                      marginBottom: 25
                    }}
                  >
                    <ProgressBarAnimated
                      width={progressBarWidth}
                      value={this.state.progressBarValue}
                      backgroundColor={Colors.tintColor}
                    />
                  </View>
                  <Label
                    style={[
                      styles.formLabel,
                      { fontWeight: "bold", marginBottom: 10 }
                    ]}
                  >
                    Faith Milestones
                  </Label>
                  <Grid>
                    <Col
                      style={{
                        height: milestonesGridSize,
                        width: milestonesGridSize
                      }}
                    >
                      <Row size={5}>
                        <Col size={5}>
                          <TouchableOpacity
                            onPress={() => {
                              this.onMilestoneChange("milestone_has_bible");
                            }}
                            activeOpacity={1}
                            style={styles.progressIcon}
                          >
                            <Col>
                              <Row size={3}>
                                <Image
                                  source={statesBeliefIcon}
                                  style={[
                                    styles.progressIcon,
                                    this.onCheckExistingMilestone(
                                      "milestone_has_bible"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                />
                              </Row>
                              <Row
                                size={1}
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={[
                                    styles.progressIconText,
                                    this.onCheckExistingMilestone(
                                      "milestone_has_bible"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                >
                                  Has Bible
                                </Text>
                              </Row>
                            </Col>
                          </TouchableOpacity>
                        </Col>
                        <Col size={1} />
                        <Col size={5}>
                          <TouchableOpacity
                            onPress={() => {
                              this.onMilestoneChange("milestone_reading_bible");
                            }}
                            activeOpacity={1}
                            style={styles.progressIcon}
                          >
                            <Col>
                              <Row size={3}>
                                <Image
                                  source={bibleStudyIcon}
                                  style={[
                                    styles.progressIcon,
                                    this.onCheckExistingMilestone(
                                      "milestone_reading_bible"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                />
                              </Row>
                              <Row
                                size={1}
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={[
                                    styles.progressIconText,
                                    this.onCheckExistingMilestone(
                                      "milestone_reading_bible"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                >
                                  Reading Bible
                                </Text>
                              </Row>
                            </Col>
                          </TouchableOpacity>
                        </Col>
                        <Col size={1} />
                        <Col size={5}>
                          <TouchableOpacity
                            onPress={() => {
                              this.onMilestoneChange("milestone_belief");
                            }}
                            activeOpacity={1}
                            style={styles.progressIcon}
                          >
                            <Col>
                              <Row size={3}>
                                <Image
                                  source={statesBeliefIcon}
                                  style={[
                                    styles.progressIcon,
                                    this.onCheckExistingMilestone(
                                      "milestone_belief"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                />
                              </Row>
                              <Row
                                size={1}
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={[
                                    styles.progressIconText,
                                    this.onCheckExistingMilestone(
                                      "milestone_belief"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                >
                                  States Belief
                                </Text>
                              </Row>
                            </Col>
                          </TouchableOpacity>
                        </Col>
                        <Col size={2} />
                      </Row>
                      <Row size={1} />
                      <Row size={5}>
                        <Col size={5}>
                          <TouchableOpacity
                            onPress={() => {
                              this.onMilestoneChange("milestone_can_share");
                            }}
                            activeOpacity={1}
                            style={styles.progressIcon}
                          >
                            <Col>
                              <Row size={3}>
                                <Image
                                  source={statesBeliefIcon}
                                  style={[
                                    styles.progressIcon,
                                    this.onCheckExistingMilestone(
                                      "milestone_can_share"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                />
                              </Row>
                              <Row
                                size={1}
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={[
                                    styles.progressIconText,
                                    this.onCheckExistingMilestone(
                                      "milestone_can_share"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                >
                                  Can Share Gospel/Testimony
                                </Text>
                              </Row>
                            </Col>
                          </TouchableOpacity>
                        </Col>
                        <Col size={1} />
                        <Col size={5}>
                          <TouchableOpacity
                            onPress={() => {
                              this.onMilestoneChange("milestone_sharing");
                            }}
                            activeOpacity={1}
                            style={styles.progressIcon}
                          >
                            <Col>
                              <Row size={3}>
                                <Image
                                  source={sharingTheGospelIcon}
                                  style={[
                                    styles.progressIcon,
                                    this.onCheckExistingMilestone(
                                      "milestone_sharing"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                />
                              </Row>
                              <Row
                                size={1}
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={[
                                    styles.progressIconText,
                                    this.onCheckExistingMilestone(
                                      "milestone_sharing"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                >
                                  Sharing Gospel/Testimony
                                </Text>
                              </Row>
                            </Col>
                          </TouchableOpacity>
                        </Col>
                        <Col size={1} />
                        <Col size={5}>
                          <TouchableOpacity
                            onPress={() => {
                              this.onMilestoneChange("milestone_baptized");
                            }}
                            activeOpacity={1}
                            style={styles.progressIcon}
                          >
                            <Col>
                              <Row size={3}>
                                <Image
                                  source={baptismIcon}
                                  style={[
                                    styles.progressIcon,
                                    this.onCheckExistingMilestone(
                                      "milestone_baptized"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                />
                              </Row>
                              <Row
                                size={1}
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={[
                                    styles.progressIconText,
                                    this.onCheckExistingMilestone(
                                      "milestone_baptized"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                >
                                  Baptized
                                </Text>
                              </Row>
                            </Col>
                          </TouchableOpacity>
                        </Col>
                        <Col size={2} />
                      </Row>
                      <Row size={1} />
                      <Row size={5}>
                        <Col size={5}>
                          <TouchableOpacity
                            onPress={() => {
                              this.onMilestoneChange("milestone_baptizing");
                            }}
                            activeOpacity={1}
                            style={styles.progressIcon}
                          >
                            <Col>
                              <Row size={3}>
                                <Image
                                  source={statesBeliefIcon}
                                  style={[
                                    styles.progressIcon,
                                    this.onCheckExistingMilestone(
                                      "milestone_baptizing"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                />
                              </Row>
                              <Row
                                size={1}
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={[
                                    styles.progressIconText,
                                    this.onCheckExistingMilestone(
                                      "milestone_baptizing"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                >
                                  Baptizing
                                </Text>
                              </Row>
                            </Col>
                          </TouchableOpacity>
                        </Col>
                        <Col size={1} />
                        <Col size={5}>
                          <TouchableOpacity
                            onPress={() => {
                              this.onMilestoneChange("milestone_in_group");
                            }}
                            activeOpacity={1}
                            style={styles.progressIcon}
                          >
                            <Col>
                              <Row size={3}>
                                <Image
                                  source={statesBeliefIcon}
                                  style={[
                                    styles.progressIcon,
                                    this.onCheckExistingMilestone(
                                      "milestone_in_group"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                />
                              </Row>
                              <Row
                                size={1}
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={[
                                    styles.progressIconText,
                                    this.onCheckExistingMilestone(
                                      "milestone_in_group"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                >
                                  In Church/Group
                                </Text>
                              </Row>
                            </Col>
                          </TouchableOpacity>
                        </Col>
                        <Col size={1} />
                        <Col size={5}>
                          <TouchableOpacity
                            onPress={() => {
                              this.onMilestoneChange("milestone_planting");
                            }}
                            activeOpacity={1}
                            style={styles.progressIcon}
                          >
                            <Col>
                              <Row size={3}>
                                <Image
                                  source={statesBeliefIcon}
                                  style={[
                                    styles.progressIcon,
                                    this.onCheckExistingMilestone(
                                      "milestone_planting"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                />
                              </Row>
                              <Row
                                size={1}
                                style={{
                                  flex: 1,
                                  justifyContent: "center",
                                  alignItems: "center"
                                }}
                              >
                                <Text
                                  style={[
                                    styles.progressIconText,
                                    this.onCheckExistingMilestone(
                                      "milestone_planting"
                                    )
                                      ? styles.progressIconActive
                                      : styles.progressIconInactive
                                  ]}
                                >
                                  Starting Churches
                                </Text>
                              </Row>
                            </Col>
                          </TouchableOpacity>
                        </Col>
                        <Col size={2} />
                      </Row>
                    </Col>
                    <Col />
                  </Grid>
                  <Grid style={{ marginTop: 25 }}>
                    <Row
                      style={[
                        styles.formRow,
                        {
                          borderBottomColor: "transparent",
                          borderTopColor: "#CCCCCC",
                          borderTopWidth: 1
                        }
                      ]}
                    >
                      <Col style={styles.formIconLabel}>
                        <Icon
                          android="md-calendar"
                          ios="ios-calendar"
                          style={styles.formIcon}
                        />
                      </Col>
                      <Col>
                        <DatePicker
                          defaultDate={this.state.contact.baptism_date}
                          onDateChange={this.setBaptismDate}
                        />
                      </Col>
                      <Col style={styles.formIconLabel}>
                        <Label style={[styles.label, styles.formLabel]}>
                          Baptism Date
                        </Label>
                      </Col>
                    </Row>
                  </Grid>
                </View>
              </ScrollView>
            </Tab>
            <Tab
              heading="Comments / Activity"
              tabStyle={styles.tabStyle}
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
                      style={{
                        backgroundColor: "#ffffff",
                        flex: 1,
                        marginBottom: 60
                      }}
                      ref={flatList => {
                        commentsFlatList = flatList;
                      }}
                      onContentSizeChange={() => commentsFlatList.scrollToEnd()}
                      data={this.state.commentsOrActivities}
                      extraData={this.state.commentsOrActivities}
                      ItemSeparatorComponent={() => (
                        <View
                          style={{
                            height: 1,
                            backgroundColor: "#CCCCCC"
                          }}
                        />
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
              heading="Connections"
              tabStyle={styles.tabStyle}
              textStyle={styles.textStyle}
              activeTabStyle={styles.activeTabStyle}
              activeTextStyle={styles.activeTextStyle}
            >
              <KeyboardShift>
                {() => (
                  <ScrollView>
                    <View
                      style={styles.formContainer}
                      pointerEvents={this.state.onlyView ? "none" : "auto"}
                    >
                      <Grid>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              active
                              android={"md-people"}
                              ios={"ios-people"}
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <MultipleTags
                              tags={this.state.groups}
                              preselectedTags={this.state.currentGroups}
                              objectKeyIdentifier="value"
                              objectValueIdentifier="name"
                              onChangeItem={this.setCurrentGroups}
                              search
                              visibleOnOpen={!this.state.onlyView}
                              title={"Groups"}
                              searchHitResponse={""}
                              defaultInstructionClosed={""}
                              defaultInstructionOpen={""}
                            />
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              active
                              android={"md-git-network"}
                              ios={"ios-git-network"}
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <MultipleTags
                              tags={this.state.contacts}
                              preselectedTags={this.state.currentConnections}
                              objectKeyIdentifier="value"
                              objectValueIdentifier="name"
                              onChangeItem={this.setCurrentConnections}
                              search
                              visibleOnOpen={!this.state.onlyView}
                              title={"Connection"}
                              searchHitResponse={""}
                              defaultInstructionClosed={""}
                              defaultInstructionOpen={""}
                            />
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              active
                              android={"md-water"}
                              ios={"ios-water"}
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <MultipleTags
                              tags={this.state.contacts}
                              preselectedTags={this.state.currentBaptizedBy}
                              objectKeyIdentifier="value"
                              objectValueIdentifier="name"
                              onChangeItem={this.setCurrentBaptizedBy}
                              search
                              visibleOnOpen={!this.state.onlyView}
                              title={"Baptized by"}
                              searchHitResponse={""}
                              defaultInstructionClosed={""}
                              defaultInstructionOpen={""}
                            />
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              active
                              android={"md-people"}
                              ios={"ios-people"}
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <MultipleTags
                              tags={this.state.contacts}
                              preselectedTags={this.state.currentBaptized}
                              objectKeyIdentifier="value"
                              objectValueIdentifier="name"
                              onChangeItem={this.setCurrentBaptized}
                              search
                              visibleOnOpen={!this.state.onlyView}
                              title={"Baptized"}
                              searchHitResponse={""}
                              defaultInstructionClosed={""}
                              defaultInstructionOpen={""}
                            />
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              active
                              android={"md-people"}
                              ios={"ios-people"}
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <MultipleTags
                              tags={this.state.contacts}
                              preselectedTags={this.state.currentCoachedBy}
                              objectKeyIdentifier="value"
                              objectValueIdentifier="name"
                              onChangeItem={this.setCurrentCoachedBy}
                              search
                              visibleOnOpen={!this.state.onlyView}
                              title={"Coached by"}
                              searchHitResponse={""}
                              defaultInstructionClosed={""}
                              defaultInstructionOpen={""}
                            />
                          </Col>
                        </Row>
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              active
                              android={"md-people"}
                              ios={"ios-people"}
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <MultipleTags
                              tags={this.state.contacts}
                              preselectedTags={this.state.currentCoaching}
                              objectKeyIdentifier="value"
                              objectValueIdentifier="name"
                              onChangeItem={this.setCurrentCoaching}
                              search
                              visibleOnOpen={!this.state.onlyView}
                              title={"Coaching"}
                              searchHitResponse={""}
                              defaultInstructionClosed={""}
                              defaultInstructionOpen={""}
                            />
                          </Col>
                        </Row>
                      </Grid>
                    </View>
                  </ScrollView>
                )}
              </KeyboardShift>
            </Tab>
          </Tabs>
        )}
        {!this.state.contact.ID && this.state.renderView && (
          <KeyboardShift>
            {() => (
              <ScrollView>
                <Content>
                  <List>
                    <Item stackedLabel>
                      <Label>Full Name</Label>
                      <Input onChangeText={this.setContactTitle} />
                    </Item>
                    <Item stackedLabel>
                      <Label>Phone Number</Label>
                      <Input onChangeText={this.setContactPhone} />
                    </Item>
                    <Item stackedLabel>
                      <Label>Email</Label>
                      <Input onChangeText={this.setContactEmail} />
                    </Item>
                    <Item picker>
                      <Label>Source</Label>
                      <Picker
                        onValueChange={this.setContactSource}
                        selectedValue={
                          this.state.contact.sources.values[0].value
                        }
                      >
                        {this.renderSourcePickerItems()}
                      </Picker>
                    </Item>
                    <Item>
                      <MultipleTags
                        tags={this.state.geonames}
                        preselectedTags={this.state.currentGeonames}
                        objectKeyIdentifier="value"
                        objectValueIdentifier="name"
                        search
                        onChangeItem={this.setCurrentGeonames}
                        title="Locations"
                        visibleOnOpen
                      />
                    </Item>
                    <Item stackedLabel>
                      <Label>Initial Comment</Label>
                      <Input
                        multiline
                        onChangeText={this.setContactInitialComment}
                      />
                    </Item>
                  </List>
                </Content>
              </ScrollView>
            )}
          </KeyboardShift>
        )}
        {successToast}
        {errorToast}
      </Container>
    );
  }
}

ContactDetailScreen.propTypes = {
  error: PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string
  }),
  groupsReducerResponse: PropTypes.string,
  user: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string
  }).isRequired,
  contact: PropTypes.shape({
    key: PropTypes.number
  }),
  contactsReducerResponse: PropTypes.string
};

ContactDetailScreen.defaultProps = {
  error: null,
  groupsReducerResponse: null,
  contact: null,
  contactsReducerResponse: null
};

const mapStateToProps = state => ({
  error: state.groupsReducer.error,
  geonames: state.groupsReducer.geonames,
  user: state.userReducer,
  groupsReducerResponse: state.groupsReducer.type,
  contact: state.contactsReducer.contact,
  contactsReducerResponse: state.contactsReducer.type,
  comments: state.contactsReducer.comments,
  comment: state.contactsReducer.comment,
  activities: state.contactsReducer.activities,
  usersContacts: state.groupsReducer.usersContacts,
  search: state.groupsReducer.search
});
const mapDispatchToProps = dispatch => ({
  getLocations: (domain, token) => {
    dispatch(getLocations(domain, token));
  },
  saveContact: (domain, token, contactDetail) => {
    dispatch(save(domain, token, contactDetail));
  },
  getById: (domain, token, contactId) => {
    dispatch(getById(domain, token, contactId));
  },
  getComments: (domain, token, contactId) => {
    dispatch(getCommentsByContact(domain, token, contactId));
  },
  saveComment: (domain, token, contactId, commentData) => {
    dispatch(saveComment(domain, token, contactId, commentData));
  },
  getActivities: (domain, token, contactId) => {
    dispatch(getActivitiesByContact(domain, token, contactId));
  },
  getUsersAndContacts: (domain, token) => {
    dispatch(getUsersAndContacts(domain, token));
  },
  searchGroups: (domain, token) => {
    dispatch(search(domain, token));
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactDetailScreen);
