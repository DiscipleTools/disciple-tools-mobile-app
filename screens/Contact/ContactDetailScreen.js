import React from 'react';
import { connect } from 'react-redux';
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
  TextInput,
  AsyncStorage,
  RefreshControl,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  Container,
  Label,
  Input,
  Icon,
  Picker,
  Tabs,
  Tab,
  ScrollableTab,
  DatePicker,
  Fab,
  Button,
} from 'native-base';
import Toast from 'react-native-easy-toast';
import { Col, Row, Grid } from 'react-native-easy-grid';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { Chip, Selectize } from 'react-native-material-selectize';

import KeyboardShift from '../../components/KeyboardShift';
import {
  save,
  getCommentsByContact,
  saveComment,
  getById,
  getActivitiesByContact,
} from '../../store/actions/contacts.actions';
import Colors from '../../constants/Colors';
import hasBibleIcon from '../../assets/icons/book-bookmark.png';
import readingBibleIcon from '../../assets/icons/word.png';
import statesBeliefIcon from '../../assets/icons/language.png';
import canShareGospelIcon from '../../assets/icons/b-chat.png';
import sharingTheGospelIcon from '../../assets/icons/evangelism.png';
import baptizedIcon from '../../assets/icons/baptism.png';
import baptizingIcon from '../../assets/icons/water-aerobics.png';
import inChurchIcon from '../../assets/icons/multiple-11.png';
import startingChurchesIcon from '../../assets/icons/symbol-213-7.png';

// let toastSuccess;
let toastError;
const containerPadding = 35;
const windowWidth = Dimensions.get('window').width;
const progressBarWidth = windowWidth - 100;
const milestonesGridSize = windowWidth + 5;
/* eslint-disable */
let commentsFlatList,
  subAssiSelectizeRef,
  geonamesSelectizeRef,
  pplGroupsSelectizeRef,
  sourcesSelectizeRef,
  groupsSelectizeRef,
  connectSelectizeRef,
  baptBySelectizeRef,
  coachedSelectizeRef,
  baptizedSelectizeRef,
  coachingSelectizeRef;
/* eslint-enable */
const styles = StyleSheet.create({
  tabBarUnderlineStyle: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.tintColor,
  },
  tabStyle: { backgroundColor: '#FFFFFF' },
  textStyle: { color: 'gray' },
  activeTabStyle: { backgroundColor: '#FFFFFF' },
  activeTextStyle: { color: Colors.tintColor, fontWeight: 'bold' },
  addRemoveIcons: {
    fontSize: 30,
    color: 'black',
  },
  icon: {
    color: Colors.tintColor,
  },
  // Form
  formContainer: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: containerPadding,
    paddingRight: containerPadding,
  },
  formRow: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  formIconLabel: { width: 'auto' },
  formIcon: {
    color: Colors.tintColor,
    fontSize: 25,
    marginTop: 'auto',
    marginBottom: 'auto',
    marginRight: 10,
  },
  formLabel: {
    color: Colors.tintColor,
    fontSize: 12,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  formDivider: {
    borderBottomColor: '#CCCCCC',
    borderBottomWidth: 1,
    marginLeft: 5,
    marginRight: 5,
  },
  // Progress Section
  progressIcon: { height: '100%', width: '100%' },
  progressIconActive: {
    opacity: 1,
  },
  progressIconInactive: {
    opacity: 0.4,
  },
  progressIconText: {
    fontSize: 9,
    textAlign: 'center',
    width: '100%',
  },
  // Comments Section
  name: {
    color: Colors.tintColor,
    fontSize: 13,
    fontWeight: 'bold',
  },
  time: {
    color: Colors.tintColor,
    fontSize: 10,
  },
  inputContactAddress: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#D9D5DC',
    margin: 5,
  },
});

class ContactDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let navigationTitle = 'Add New Contact';
    let headerRight = (
      <Icon
        type="MaterialIcons"
        name="check"
        onPress={navigation.getParam('onSaveContact')}
        style={{
          paddingRight: 16,
          color: '#FFFFFF',
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
            type="MaterialIcons"
            name="create"
            onPress={navigation.getParam('onEnableEdit')}
            style={{
              paddingRight: 16,
              color: '#FFFFFF',
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
          onPress={() => navigation.push('ContactList')}
          style={[{ paddingLeft: 16, color: '#FFFFFF' }]}
        />
      ),
      headerRight,
      headerStyle: {
        backgroundColor: Colors.tintColor,
      },
      headerTintColor: '#FFFFFF',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    };
  };

  state = {
    contact: {
      sources: {
        values: [
          {
            value: 'personal',
          },
        ],
      },
      milestones: {
        values: [],
      },
      contact_phone: [],
      contact_email: [],
      contact_address: [],
      geonames: {
        values: [],
      },
      subassigned: {
        values: [],
      },
      people_groups: {
        values: [],
      },
      groups: {
        values: [],
      },
      relation: {
        values: [],
      },
      baptized_by: {
        values: [],
      },
      baptized: {
        values: [],
      },
      coached_by: {
        values: [],
      },
      coaching: {
        values: [],
      },
    },
    contactSources: [
      {
        name: 'Personal',
        value: 'personal',
      },
      {
        name: 'Web',
        value: 'web',
      },
      {
        name: 'Phone',
        value: 'phone',
      },
      {
        name: 'Facebook',
        value: 'facebook',
      },
      {
        name: 'Twitter',
        value: 'twitter',
      },
      {
        name: 'Linkedin',
        value: 'linkedin',
      },
      {
        name: 'Referral',
        value: 'referral',
      },
      {
        name: 'Advertisement',
        value: 'advertisement',
      },
      {
        name: 'Transfer',
        value: 'transfer',
      },
    ],
    users: [],
    usersContacts: [],
    groups: [],
    peopleGroups: [],
    geonames: [],
    loadedLocal: false,
    comments: [],
    loadingComments: false,
    loadingMoreComments: false,
    totalComments: 0,
    commentsOffset: 0,
    commentsLimit: 10,
    activities: [],
    loadingActivities: false,
    loadingMoreActivities: false,
    totalActivities: 0,
    activitiesOffset: 0,
    activitiesLimit: 10,
    comment: '',
    progressBarValue: 0,
    overallStatusBackgroundColor: '#ffffff',
    listContactStates: [
      {
        label: 'New Contact',
        value: 'new',
      },
      {
        label: 'Not Ready',
        value: 'unassignable',
      },
      {
        label: 'Dispatch Needed',
        value: 'unassigned',
      },
      {
        label: 'Waiting to be accepted',
        value: 'assigned',
      },
      {
        label: 'Active',
        value: 'active',
      },
      {
        label: 'Paused',
        value: 'paused',
      },
      {
        label: 'Closed',
        value: 'closed',
      },
    ],
    activeFab: false,
    renderFab: true,
    showAssignedToModal: false,
    loading: false,
    dataRetrieved: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({ onSaveContact: this.onSaveContact });
    this.props.navigation.setParams({ onEnableEdit: this.onEnableEdit });
    const onlyView = this.props.navigation.getParam('onlyView');
    const contactId = this.props.navigation.getParam('contactId');
    const contactName = this.props.navigation.getParam('contactName');
    if (contactId) {
      this.setState(prevState => ({
        contact: {
          ...prevState.contact,
          ID: contactId,
        },
      }));
      this.props.navigation.setParams({ contactName });
    }
    if (onlyView) {
      this.setState({
        onlyView,
      });
    }
    this.getLists();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      contact,
      loading,
      comments,
      totalComments,
      loadingComments,
      activities,
      totalActivities,
      loadingActivities,
      newComment,
    } = nextProps;
    let newState = {
      ...prevState,
      contact: contact || prevState.contact,
      loading,
      comments: comments || prevState.comments,
      totalComments: totalComments || prevState.totalComments,
      loadingComments,
      activities: activities || prevState.activities,
      totalActivities: totalActivities || prevState.totalActivities,
      loadingActivities,
    };

    // NEW COMMENT
    if (newComment) {
      const newComments = newState.comments;
      newComments.push(newComment);
      newState = {
        ...newState,
        comments: newComments,
        comment: '',
      };
    }

    // GET BY ID
    if (contact) {
      // Update contact status select color
      let newColor = '';
      if (contact.overall_status === 'new' || contact.overall_status === 'unassigned' || contact.overall_status === 'closed') {
        newColor = '#d9534f';
      } else if (
        contact.overall_status === 'unassignable'
        || contact.overall_status === 'assigned'
        || contact.overall_status === 'paused'
      ) {
        newColor = '#f0ad4e';
      } else if (contact.overall_status === 'active') {
        newColor = '#5cb85c';
      }
      newState = {
        ...newState,
        overallStatusBackgroundColor: newColor,
        dataRetrieved: true,
      };
    }

    // GET COMMENTS
    if (comments) {
      // NEW COMMENTS (PAGINATION)
      if (prevState.commentsOffset > 0) {
        newState = {
          ...newState,
          comments: prevState.comments.concat(comments),
          loadingMoreComments: false,
        };
      }
      newState = {
        // UPDATE OFFSET
        ...newState,
        commentsOffset: prevState.commentsOffset + prevState.commentsLimit,
      };
    }

    // GET ACTIVITITES
    if (activities) {
      // NEW ACTIVITIES (PAGINATION)
      if (prevState.activitiesOffset > 0) {
        newState = {
          ...newState,
          activities: prevState.activities.concat(activities),
          loadingMoreActivities: false,
        };
      }
      newState = {
        // UPDATE OFFSET
        ...newState,
        activitiesOffset: prevState.activitiesOffset + prevState.activitiesLimit,
      };
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    const {
      userReducerError, contact, navigation, newComment, contactsReducerError,
    } = this.props;

    // ERROR
    const usersError = (prevProps.userReducerError !== userReducerError && userReducerError);
    let contactsError = (prevProps.contactsReducerError !== contactsReducerError);
    contactsError = (contactsError && contactsReducerError);
    if (usersError || contactsError) {
      const error = userReducerError || contactsReducerError;
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

    // CONTACT SAVE / GET BY ID
    if (contact && prevProps.contact !== contact) {
      // Highlight Updates -> Compare prevState.contact with contact and show differences
      if (contact.ID) {
        navigation.setParams({ contactName: contact.title });
      }
      if (contact.seeker_path) {
        this.setContactSeekerPath(contact.seeker_path);
      }
    }

    // NEW COMMENT
    if (newComment && prevProps.newComment !== newComment) {
      Keyboard.dismiss();
    }
  }

  onRefresh(contactId) {
    this.getContactById(contactId);
  }

  onRefreshCommentsActivities(contactId) {
    this.setState({
      comments: [],
      activities: [],
      commentsOffset: 0,
      activitiesOffset: 0,
    }, () => {
      this.getContactComments(contactId);
      this.getContactActivities(contactId);
    });
  }

  getLists = async () => {
    let newState = {};
    const users = await AsyncStorage.getItem('usersList');
    if (users !== null) {
      newState = {
        ...newState,
        users: JSON.parse(users).map(user => ({
          key: user.ID,
          label: user.name,
        })),
      };
    }

    const usersContacts = await AsyncStorage.getItem('usersAndContactsList');
    if (usersContacts !== null) {
      newState = {
        ...newState,
        usersContacts: JSON.parse(usersContacts),
      };
    }

    const peopleGroups = await AsyncStorage.getItem('peopleGroupsList');
    if (peopleGroups !== null) {
      newState = {
        ...newState,
        peopleGroups: JSON.parse(peopleGroups),
      };
    }

    const geonames = await AsyncStorage.getItem('locationsList');
    if (geonames !== null) {
      newState = {
        ...newState,
        geonames: JSON.parse(geonames),
      };
    }

    const groups = await AsyncStorage.getItem('searchGroupsList');
    if (groups !== null) {
      newState = {
        ...newState,
        groups: JSON.parse(groups),
      };
    }

    newState = {
      ...newState,
      loadedLocal: true,
    };

    this.setState(newState, () => {
      if (this.state.contact.ID) {
        this.onRefresh(this.state.contact.ID);
        this.getContactComments(this.state.contact.ID);
        this.getContactActivities(this.state.contact.ID);
      }
    });
  };

  getContactById(contactId) {
    this.setState({
      dataRetrieved: false,
    }, () => {
      this.props.getById(
        this.props.user.domain,
        this.props.user.token,
        contactId,
      );
    });
  }

  getContactComments(contactId) {
    this.props.getComments(
      this.props.user.domain,
      this.props.user.token,
      contactId,
      this.state.commentsOffset,
      this.state.commentsLimit,
    );
  }

  getContactActivities(contactId) {
    this.props.getActivities(
      this.props.user.domain,
      this.props.user.token,
      contactId,
      this.state.activitiesOffset,
      this.state.activitiesLimit,
    );
  }

  renderStatusPickerItems = () => this.state.listContactStates.map(status => (
    <Picker.Item
      key={status.value}
      label={status.label}
      value={status.value}
    />
  ));

  renderSourcePickerItems = () => this.state.contactSources.map(source => (
    <Picker.Item
      key={source.value}
      label={source.name}
      value={source.value}
    />
  ));

  renderActivityOrCommentRow = commentOrActivity => (
    <View
      style={{
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}
    >
      <Image
        style={{
          height: 16,
          marginTop: 10,
          width: 16,
        }}
        source={{ uri: commentOrActivity.gravatar }}
      />
      <View
        style={{
          backgroundColor: '#F3F3F3',
          borderRadius: 5,
          flex: 1,
          marginLeft: 16,
          padding: 10,
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}
        >
          {Object.prototype.hasOwnProperty.call(
            commentOrActivity,
            'content',
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
            'object_note',
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
                paddingRight: 10,
              }
              : {
                paddingLeft: 10,
                paddingRight: 10,
                color: '#B4B4B4',
                fontStyle: 'italic',
              }
          }
        >
          {Object.prototype.hasOwnProperty.call(commentOrActivity, 'content')
            ? commentOrActivity.content
            : commentOrActivity.object_note}
        </Text>
      </View>
    </View>
  )

  onEnableEdit = () => {
    this.setState({
      onlyView: false,
    });
    this.props.navigation.setParams({ onlyView: false });
  };

  setContactTitle = (value) => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        title: value,
      },
    }));
  };

  setSingleContactPhone = (value) => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contact_phone: [
          {
            value,
          },
        ],
      },
    }));
  };

  setContactEmail = (value) => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contact_email: [
          {
            value,
          },
        ],
      },
    }));
  };

  setContactSource = (value) => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        sources: {
          values: [
            {
              value,
            },
          ],
        },
      },
    }));
  };

  setGeonames = () => {
    const dbGeonames = [...this.state.contact.geonames.values];

    const localGeonames = [];
    const selectedValues = this.geonamesSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const geoname = selectedValues.entities.item[itemValue];
      localGeonames.push(geoname);
    });

    const geonamesToSave = localGeonames.filter((localGeoname) => {
      const foundLocalInDb = dbGeonames.find(dbGeoname => dbGeoname.value === localGeoname.value);
      return foundLocalInDb === undefined;
    }).map(geoname => ({ value: geoname.value }));

    dbGeonames.forEach((dbGeoname) => {
      const dbInLocal = localGeonames.find(localGeoname => dbGeoname.value === localGeoname.value);
      if (!dbInLocal) {
        geonamesToSave.push({ value: dbGeoname.value, delete: true });
      }
    });

    return geonamesToSave;
  };

  setContactInitialComment = (value) => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        initial_comment: value,
      },
    }));
  };

  setContactStatus = (value) => {
    let newColor = '';

    if (value === 'new' || value === 'unassigned' || value === 'closed') {
      newColor = '#d9534f';
    } else if (
      value === 'unassignable'
      || value === 'assigned'
      || value === 'paused'
    ) {
      newColor = '#f0ad4e';
    } else if (value === 'active') {
      newColor = '#5cb85c';
    }

    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        overall_status: value,
      },
      overallStatusBackgroundColor: newColor,
    }));
  };

  setContactSeekerPath = (value) => {
    let newProgressValue = 100 / 6;

    switch (value) {
      case 'none':
        newProgressValue *= 0;
        break;
      case 'attempted':
        newProgressValue *= 1;
        break;
      case 'established':
        newProgressValue *= 2;
        break;
      case 'scheduled':
        newProgressValue *= 3;
        break;
      case 'met':
        newProgressValue *= 4;
        break;
      case 'ongoing':
        newProgressValue *= 5;
        break;
      case 'coaching':
        newProgressValue *= 6;
        break;
      default:
        break;
    }
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        seeker_path: value,
      },
      progressBarValue: newProgressValue,
    }));
  };

  setBaptismDate = (value) => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        baptism_date: value,
      },
    }));
  };

  onSaveContact = (quickAction = {}) => {
    Keyboard.dismiss();
    let contactToSave = {
      ID: this.state.contact.ID,
    };
    if (
      Object.prototype.hasOwnProperty.call(
        quickAction,
        'quick_button_no_answer',
      )
      || Object.prototype.hasOwnProperty.call(
        quickAction,
        'quick_button_contact_established',
      )
      || Object.prototype.hasOwnProperty.call(
        quickAction,
        'quick_button_meeting_scheduled',
      )
      || Object.prototype.hasOwnProperty.call(
        quickAction,
        'quick_button_meeting_complete',
      )
      || Object.prototype.hasOwnProperty.call(
        quickAction,
        'quick_button_no_show',
      )
      || Object.prototype.hasOwnProperty.call(
        quickAction,
        'quick_button_phone_off',
      )
    ) {
      contactToSave = {
        ...contactToSave,
        ...quickAction,
      };
    } else {
      contactToSave = JSON.parse(JSON.stringify(this.state.contact));
      if (Object.prototype.hasOwnProperty.call(contactToSave, 'geonames') && this.geonamesSelectizeRef) {
        contactToSave.geonames.values = this.setGeonames();
      }
      if (Object.prototype.hasOwnProperty.call(contactToSave, 'subassigned') && this.subAssiSelectizeRef) {
        contactToSave.subassigned.values = this.setContactSubassignedContacts();
      }
      if (Object.prototype.hasOwnProperty.call(contactToSave, 'groups') && this.groupsSelectizeRef) {
        contactToSave.groups.values = this.setGroups();
      }
      if (Object.prototype.hasOwnProperty.call(contactToSave, 'relation') && this.connectSelectizeRef) {
        contactToSave.relation.values = this.setConnections();
      }
      if (Object.prototype.hasOwnProperty.call(contactToSave, 'baptized_by') && this.baptBySelectizeRef) {
        contactToSave.baptized_by.values = this.setBaptizedBy();
      }
      if (Object.prototype.hasOwnProperty.call(contactToSave, 'baptized') && this.baptizedSelectizeRef) {
        contactToSave.baptized.values = this.setBaptized();
      }
      if (Object.prototype.hasOwnProperty.call(contactToSave, 'coached_by') && this.coachedSelectizeRef) {
        contactToSave.coached_by.values = this.setCoachedBy();
      }
      if (Object.prototype.hasOwnProperty.call(contactToSave, 'coaching') && this.coachingSelectizeRef) {
        contactToSave.coaching.values = this.setCoaching();
      }
      if (Object.prototype.hasOwnProperty.call(contactToSave, 'people_groups') && this.pplGroupsSelectizeRef) {
        contactToSave.people_groups.values = this.setPeopleGroups();
      }
      if (Object.prototype.hasOwnProperty.call(contactToSave, 'sources') && this.sourcesSelectizeRef) {
        contactToSave.sources.values = this.setSources();
      }
    }

    this.props.saveContact(
      this.props.user.domain,
      this.props.user.token,
      contactToSave,
    );
  };

  onFormatDateToView = (date) => {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const newDate = new Date(date);
    let hours = newDate.getHours();
    let minutes = newDate.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours || 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;
    return `${monthNames[newDate.getMonth()]} ${newDate.getDate()}, ${strTime}`;
  };

  setComment = (value) => {
    this.setState({
      comment: value,
    });
  };

  onSaveComment = () => {
    const { comment } = this.state;

    if (comment.length > 0) {
      this.props.saveComment(
        this.props.user.domain,
        this.props.user.token,
        this.state.contact.ID,
        {
          comment,
        },
      );
    }
  };

  onCheckExistingMilestone = (milestoneName) => {
    const milestones = this.state.contact.milestones.values;
    const foundMilestone = milestones.some(
      milestone => milestone.value === milestoneName,
    );
    return foundMilestone;
  };

  onMilestoneChange = (milestoneName) => {
    const milestones2 = this.state.contact.milestones.values;
    const foundMilestone = milestones2.find(
      milestone => milestone.value === milestoneName,
    );
    if (foundMilestone) {
      const milestoneIndex = milestones2.indexOf(foundMilestone);
      milestones2.splice(milestoneIndex, 1);
    } else {
      milestones2.push({
        value: milestoneName,
      });
    }
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        milestones: {
          values: milestones2,
        },
      },
    }));
  };

  setGroups = () => {
    const dbGroups = [...this.state.contact.groups.values];

    const lclGroups = [];
    const selectedValues = this.groupsSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const group = selectedValues.entities.item[itemValue];
      lclGroups.push(group);
    });

    const groupsToSave = lclGroups.filter((lclGroup) => {
      const foundLocalInDb = dbGroups.find(dbGroup => dbGroup.value === lclGroup.value);
      return foundLocalInDb === undefined;
    }).map(group => ({ value: group.value }));

    dbGroups.forEach((dbGroup) => {
      const dbInLocal = lclGroups.find(lclGroup => dbGroup.value === lclGroup.value);
      if (!dbInLocal) {
        groupsToSave.push({ value: dbGroup.value, delete: true });
      }
    });

    return groupsToSave;
  };

  setConnections = () => {
    const dbConnections = [...this.state.contact.relation.values];

    const lclConnections = [];
    const selectedValues = this.connectSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const connection = selectedValues.entities.item[itemValue];
      lclConnections.push(connection);
    });

    const connectionsToSave = lclConnections.filter((lclConnection) => {
      const foundLocalInDb = dbConnections.find(dbCnt => dbCnt.value === lclConnection.value);
      return foundLocalInDb === undefined;
    }).map(connection => ({ value: connection.value }));

    dbConnections.forEach((dbConnection) => {
      const dbInLocal = lclConnections.find(lclCnt => dbConnection.value === lclCnt.value);
      if (!dbInLocal) {
        connectionsToSave.push({ value: dbConnection.value, delete: true });
      }
    });

    return connectionsToSave;
  };

  setBaptizedBy = () => {
    const dbBaptizedBy = [...this.state.contact.baptized_by.values];

    const lclBaptizedBy = [];
    const selectedValues = this.baptBySelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const baptizedBy = selectedValues.entities.item[itemValue];
      lclBaptizedBy.push(baptizedBy);
    });

    const baptizedByToSave = lclBaptizedBy.filter((lclBaptized) => {
      const foundLocalInDb = dbBaptizedBy.find(dbBpt => dbBpt.value === lclBaptized.value);
      return foundLocalInDb === undefined;
    }).map(baptizedBy => ({ value: baptizedBy.value }));

    dbBaptizedBy.forEach((dbBaptized) => {
      const dbInLocal = lclBaptizedBy.find(lclBaptized => dbBaptized.value === lclBaptized.value);
      if (!dbInLocal) {
        baptizedByToSave.push({ value: dbBaptized.value, delete: true });
      }
    });

    return baptizedByToSave;
  };

  setBaptized = () => {
    const dbBaptizeds = [...this.state.contact.baptized.values];

    const lclBaptizeds = [];
    const selectedValues = this.baptizedSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const baptized = selectedValues.entities.item[itemValue];
      lclBaptizeds.push(baptized);
    });

    const baptizedToSave = lclBaptizeds.filter((lclBaptized) => {
      const foundLocalInDb = dbBaptizeds.find(dbBaptized => dbBaptized.value === lclBaptized.value);
      return foundLocalInDb === undefined;
    }).map(baptized => ({ value: baptized.value }));

    dbBaptizeds.forEach((dbBaptized) => {
      const dbInLocal = lclBaptizeds.find(lclBaptized => dbBaptized.value === lclBaptized.value);
      if (!dbInLocal) {
        baptizedToSave.push({ value: dbBaptized.value, delete: true });
      }
    });

    return baptizedToSave;
  };

  setCoachedBy = () => {
    const dbCoachedBy = [...this.state.contact.coached_by.values];

    const lclCoachedBy = [];
    const selectedValues = this.coachedSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const coached = selectedValues.entities.item[itemValue];
      lclCoachedBy.push(coached);
    });

    const coachedToSave = lclCoachedBy.filter((lclCoached) => {
      const foundLocalInDb = dbCoachedBy.find(dbCoached => dbCoached.value === lclCoached.value);
      return foundLocalInDb === undefined;
    }).map(coached => ({ value: coached.value }));

    dbCoachedBy.forEach((dbCoached) => {
      const dbInLocal = lclCoachedBy.find(lclCoached => dbCoached.value === lclCoached.value);
      if (!dbInLocal) {
        coachedToSave.push({ value: dbCoached.value, delete: true });
      }
    });

    return coachedToSave;
  };

  setCoaching = () => {
    const dbCoaching = [...this.state.contact.coaching.values];

    const lclCoaching = [];
    const selectedValues = this.coachingSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const coaching = selectedValues.entities.item[itemValue];
      lclCoaching.push(coaching);
    });

    const coachingToSave = lclCoaching.filter((lclCoach) => {
      const localInDb = dbCoaching.find(dbCoach => dbCoach.value === lclCoach.value);
      return localInDb === undefined;
    }).map(coaching => ({ value: coaching.value }));

    dbCoaching.forEach((dbCoach) => {
      const dbInLocal = lclCoaching.find(lclCoach => dbCoach.value === lclCoach.value);
      if (!dbInLocal) {
        coachingToSave.push({ value: dbCoach.value, delete: true });
      }
    });

    return coachingToSave;
  };

  setContactAge = (value) => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        age: value,
      },
    }));
  };

  setContactGender = (value) => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        gender: value,
      },
    }));
  };

  setToggleFab = () => {
    this.setState(prevState => ({
      activeFab: !prevState.activeFab,
    }));
  };

  tabChanged = (event) => {
    this.props.navigation.setParams({ hideTabBar: event.i === 2 });
    this.setState({
      renderFab: !(event.i === 2),
    });
  };

  onAddPhoneField = () => {
    const contactPhones = this.state.contact.contact_phone;
    contactPhones.push({
      value: '',
    });
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contact_phone: contactPhones,
      },
    }));
  };

  onPhoneFieldChange = (value, index, dbIndex, component) => {
    const phoneAddressList = component.state.contact.contact_phone;
    const contactPhone = phoneAddressList[index];
    contactPhone.value = value;
    if (dbIndex) {
      contactPhone.key = dbIndex;
    }
    component.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contact_phone: phoneAddressList,
      },
    }));
  };

  onRemovePhoneField = (index, component) => {
    const contactPhoneList = [...component.state.contact.contact_phone];
    let contactPhone = contactPhoneList[index];
    if (contactPhone.key) {
      contactPhone = {
        key: contactPhone.key,
        delete: true,
      };
      contactPhoneList[index] = contactPhone;
    } else {
      contactPhoneList.splice(index, 1);
    }
    component.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contact_phone: contactPhoneList,
      },
    }));
  };

  onAddEmailField = () => {
    const contactEmails = this.state.contact.contact_email;
    contactEmails.push({
      value: '',
    });
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contact_email: contactEmails,
      },
    }));
  };

  onEmailFieldChange = (value, index, dbIndex, component) => {
    const contactEmailList = component.state.contact.contact_email;
    const contactEmail = contactEmailList[index];
    contactEmail.value = value;
    if (dbIndex) {
      contactEmail.key = dbIndex;
    }
    component.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        contact_email: contactEmailList,
      },
    }));
  };

  onRemoveEmailField = (index, component) => {
    const contactEmailList = [...component.state.contact.contact_email];
    let contactEmail = contactEmailList[index];
    if (contactEmail.key) {
      contactEmail = {
        key: contactEmail.key,
        delete: true,
      };
      contactEmailList[index] = contactEmail;
    } else {
      contactEmailList.splice(index, 1);
    }
    component.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contact_email: contactEmailList,
      },
    }));
  };

  onAddAddressField = () => {
    const contactAddress = this.state.contact.contact_address;
    contactAddress.push({
      value: '',
    });
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contact_address: contactAddress,
      },
    }));
  };

  onAddressFieldChange = (value, index, dbIndex, component) => {
    const contactAddressList = component.state.contact.contact_address;
    const contactAddress = contactAddressList[index];
    contactAddress.value = value;
    if (dbIndex) {
      contactAddress.key = dbIndex;
    }
    component.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contact_address: contactAddressList,
      },
    }));
  };

  onRemoveAddressField = (index, component) => {
    const contactAddressList = [...component.state.contact.contact_address];
    let contactAddress = contactAddressList[index];
    if (contactAddress.key) {
      contactAddress = {
        key: contactAddress.key,
        delete: true,
      };
      contactAddressList[index] = contactAddress;
    } else {
      contactAddressList.splice(index, 1);
    }
    component.setState(prevState => ({
      contact: {
        ...prevState.contact,
        contact_address: contactAddressList,
      },
    }));
  };

  setPeopleGroups = () => {
    const dbPGs = [...this.state.contact.people_groups.values];

    const lclPGs = [];
    const selectedValues = this.pplGroupsSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const peopleGroup = selectedValues.entities.item[itemValue];
      lclPGs.push(peopleGroup);
    });

    const peopleGroupsToSave = lclPGs.filter((lclPG) => {
      const foundLocalInDb = dbPGs.find(dbPG => dbPG.value === lclPG.value);
      return foundLocalInDb === undefined;
    }).map(peopleGroup => ({ value: peopleGroup.value }));

    dbPGs.forEach((dbPG) => {
      const dbInLocal = lclPGs.find(lclPG => dbPG.value === lclPG.value);
      if (!dbInLocal) {
        peopleGroupsToSave.push({ value: dbPG.value, delete: true });
      }
    });

    return peopleGroupsToSave;
  };

  setSources = () => {
    const dbSources = [...this.state.contact.sources.values];

    const localSources = [];
    const selectedValues = this.sourcesSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const source = selectedValues.entities.item[itemValue];
      localSources.push(source);
    });

    const sourcesToSave = localSources.filter((localSource) => {
      const foundLocalInDb = dbSources.find(dbSource => dbSource.value === localSource.value);
      return foundLocalInDb === undefined;
    }).map(source => ({ value: source.value }));

    dbSources.forEach((dbSource) => {
      const dbInLocal = localSources.find(localSource => dbSource.value === localSource.value);
      if (!dbInLocal) {
        sourcesToSave.push({ value: dbSource.value, delete: true });
      }
    });

    return sourcesToSave;
  };

  updateShowAssignedToModal = (value) => {
    this.setState({
      showAssignedToModal: value,
    });
  };

  onSelectAssignedTo = (key) => {
    this.setState(prevState => ({
      contact: {
        ...prevState.contact,
        assigned_to: `user-${key}`,
      },
      showAssignedToModal: false,
    }));
  };

  onCancelAssignedTo = () => {
    this.setState({
      showAssignedToModal: false,
    });
  };

  showAssignedUser = () => {
    const foundUser = this.state.users.find(
      user => `user-${user.key}` === this.state.contact.assigned_to,
    );    

    return <Text>{foundUser ? foundUser.label : ''}</Text>;
  };

  setContactSubassignedContacts = () => {
    const dbContacts = [...this.state.contact.subassigned.values];

    const localContacts = [];
    const selectedValues = this.subAssiSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const contact = selectedValues.entities.item[itemValue];
      localContacts.push(contact);
    });

    const subassignedContactToSave = localContacts.filter((localContact) => {
      const foundLocalInDb = dbContacts.find(dbContact => dbContact.value === localContact.value);
      return foundLocalInDb === undefined;
    }).map(contact => ({ value: contact.value }));

    dbContacts.forEach((dbContact) => {
      const dbInLocal = localContacts.find(localContact => dbContact.value === localContact.value);
      if (!dbInLocal) {
        subassignedContactToSave.push({ value: dbContact.value, delete: true });
      }
    });

    return subassignedContactToSave;
  };

  render() {
    /* const successToast = (
      <Toast
        ref={(toast) => {
          toastSuccess = toast;
        }}
        style={{ backgroundColor: 'green' }}
        position="center"
      />
    ); */
    const errorToast = (
      <Toast
        ref={(toast) => {
          toastError = toast;
        }}
        style={{ backgroundColor: Colors.errorBackground }}
        position="center"
      />
    );

    return (
      <Container>
        {this.state.contact.ID && this.state.loadedLocal && (
          <Container>
            <View style={{ flex: 1 }}>
              <Tabs
                renderTabBar={() => <ScrollableTab />}
                tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                onChangeTab={this.tabChanged}
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
                      <ScrollView
                        keyboardShouldPersistTaps="handled"
                        refreshControl={(
                          <RefreshControl
                            refreshing={this.state.loading}
                            onRefresh={() => this.onRefresh(this.state.contact.ID)}
                          />
                        )}
                      >
                        <View
                          style={{
                            paddingLeft: containerPadding - 15,
                            paddingRight: containerPadding - 15,
                            marginTop: 20,
                          }}
                          pointerEvents={this.state.onlyView ? 'none' : 'auto'}
                        >
                          <Label
                            style={[styles.formLabel, { fontWeight: 'bold' }]}
                          >
                            Status
                          </Label>
                          <Row style={styles.formRow}>
                            <Col>
                              <Picker
                                selectedValue={
                                  this.state.contact.overall_status
                                }
                                onValueChange={this.setContactStatus}
                                style={{
                                  color: '#ffffff',
                                  backgroundColor: this.state.overallStatusBackgroundColor,
                                }}
                              >
                                {this.renderStatusPickerItems()}
                              </Picker>
                            </Col>
                          </Row>
                        </View>
                        {this.state.dataRetrieved && (
                          <View
                            style={styles.formContainer}
                            pointerEvents={this.state.onlyView ? 'none' : 'auto'}
                          >
                            <Grid>
                              <TouchableOpacity
                                onPress={() => {
                                  this.updateShowAssignedToModal(true);
                                }}
                              >
                                <Row style={styles.formRow}>
                                  <Col style={styles.formIconLabel}>
                                    <Icon
                                      type="FontAwesome"
                                      name="user-circle"
                                      style={styles.formIcon}
                                    />
                                  </Col>
                                  <Col>
                                    {this.showAssignedUser()}
                                    <ModalFilterPicker
                                      visible={this.state.showAssignedToModal}
                                      onSelect={this.onSelectAssignedTo}
                                      onCancel={this.onCancelAssignedTo}
                                      options={this.state.users}
                                    />
                                  </Col>
                                  <Col style={styles.formIconLabel}>
                                    <Label style={styles.formLabel}>
                                      Assigned to
                                    </Label>
                                  </Col>
                                </Row>
                                <View style={styles.formDivider} />
                              </TouchableOpacity>
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    type="Ionicons"
                                    name="md-people"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col />
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>
                                    Sub-assigned to
                                  </Label>
                                </Col>
                              </Row>
                              <Row>
                                <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
                                  <Selectize
                                    ref={(selectize) => { this.subAssiSelectizeRef = selectize; }}
                                    itemId="value"
                                    items={this.state.usersContacts}
                                    selectedItems={this.state.contact.subassigned.values}
                                    textInputProps={{
                                      placeholder: 'Sub-assign this contact',
                                    }}
                                    renderRow={(id, onPress, item) => (
                                      <TouchableOpacity
                                        activeOpacity={0.6}
                                        key={id}
                                        onPress={onPress}
                                        style={{
                                          paddingVertical: 8,
                                          paddingHorizontal: 10,
                                        }}
                                      >
                                        <View style={{
                                          flexDirection: 'row',
                                        }}
                                        >
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {item.name}
                                          </Text>
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.54)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {id}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                    renderChip={(id, onClose, item, style, iconStyle) => (
                                      <Chip
                                        key={id}
                                        iconStyle={iconStyle}
                                        onClose={onClose}
                                        text={item.name}
                                        style={style}
                                      />
                                    )}
                                    filterOnKey="name"
                                    keyboardShouldPersistTaps
                                    inputContainerStyle={{ borderWidth: 1, borderColor: '#CCCCCC', padding: 5 }}
                                  />
                                </Col>
                              </Row>
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    type="FontAwesome"
                                    name="phone"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col>
                                  <Row>
                                    <View style={{ flex: 1 }}>
                                      <Text
                                        style={{
                                          textAlign: 'right',
                                          paddingRight: 10,
                                        }}
                                      >
                                        <Icon
                                          android="md-add"
                                          ios="ios-add"
                                          onPress={this.onAddPhoneField}
                                          style={styles.addRemoveIcons}
                                        />
                                      </Text>
                                    </View>
                                  </Row>
                                </Col>
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>Mobile</Label>
                                </Col>
                              </Row>
                              {this.state.contact.contact_phone.map(
                                (phone, index) => {
                                  if (!phone.delete) {
                                    return (
                                      <Row
                                        key={index.toString()}
                                        style={styles.formRow}
                                      >
                                        <Col>
                                          <Input
                                            multiline
                                            value={phone.value}
                                            onChangeText={(value) => {
                                              this.onPhoneFieldChange(
                                                value,
                                                index,
                                                phone.key,
                                                this,
                                              );
                                            }}
                                            style={styles.inputContactAddress}
                                          />
                                        </Col>
                                        <Col style={styles.formIconLabel}>
                                          <Icon
                                            android="md-remove"
                                            ios="ios-remove"
                                            onPress={() => {
                                              this.onRemovePhoneField(
                                                index,
                                                this,
                                              );
                                            }}
                                            style={[
                                              styles.addRemoveIcons,
                                              {
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                              },
                                            ]}
                                          />
                                        </Col>
                                      </Row>
                                    );
                                  }
                                  return '';
                                },
                              )}
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    type="FontAwesome"
                                    name="envelope"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col>
                                  <Row>
                                    <View style={{ flex: 1 }}>
                                      <Text
                                        style={{
                                          textAlign: 'right',
                                          paddingRight: 10,
                                        }}
                                      >
                                        <Icon
                                          android="md-add"
                                          ios="ios-add"
                                          onPress={this.onAddEmailField}
                                          style={styles.addRemoveIcons}
                                        />
                                      </Text>
                                    </View>
                                  </Row>
                                </Col>
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>Email</Label>
                                </Col>
                              </Row>
                              {this.state.contact.contact_email.map(
                                (email, index) => {
                                  if (!email.delete) {
                                    return (
                                      <Row
                                        key={index.toString()}
                                        style={styles.formRow}
                                      >
                                        <Col>
                                          <Input
                                            multiline
                                            value={email.value}
                                            onChangeText={(value) => {
                                              this.onEmailFieldChange(
                                                value,
                                                index,
                                                email.key,
                                                this,
                                              );
                                            }}
                                            style={styles.inputContactAddress}
                                          />
                                        </Col>
                                        <Col style={styles.formIconLabel}>
                                          <Icon
                                            android="md-remove"
                                            ios="ios-remove"
                                            onPress={() => {
                                              this.onRemoveEmailField(
                                                index,
                                                this,
                                              );
                                            }}
                                            style={[
                                              styles.addRemoveIcons,
                                              {
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                              },
                                            ]}
                                          />
                                        </Col>
                                      </Row>
                                    );
                                  }
                                  return '';
                                },
                              )}
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    android="logo-facebook"
                                    ios="logo-facebook"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col>
                                  <Text />
                                </Col>
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>Message</Label>
                                </Col>
                              </Row>
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    type="Entypo"
                                    name="home"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col>
                                  <Row>
                                    <View style={{ flex: 1 }}>
                                      <Text
                                        style={{
                                          textAlign: 'right',
                                          paddingRight: 10,
                                        }}
                                      >
                                        <Icon
                                          android="md-add"
                                          ios="ios-add"
                                          onPress={this.onAddAddressField}
                                          style={styles.addRemoveIcons}
                                        />
                                      </Text>
                                    </View>
                                  </Row>
                                </Col>
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>Address</Label>
                                </Col>
                              </Row>
                              {this.state.contact.contact_address.map(
                                (address, index) => {
                                  if (!address.delete) {
                                    return (
                                      <Row
                                        key={index.toString()}
                                        style={styles.formRow}
                                      >
                                        <Col>
                                          <Input
                                            multiline
                                            value={address.value}
                                            onChangeText={(value) => {
                                              this.onAddressFieldChange(
                                                value,
                                                index,
                                                address.key,
                                                this,
                                              );
                                            }}
                                            style={styles.inputContactAddress}
                                          />
                                        </Col>
                                        <Col style={styles.formIconLabel}>
                                          <Icon
                                            android="md-remove"
                                            ios="ios-remove"
                                            onPress={() => {
                                              this.onRemoveAddressField(
                                                index,
                                                this,
                                              );
                                            }}
                                            style={[
                                              styles.addRemoveIcons,
                                              {
                                                paddingLeft: 10,
                                                paddingRight: 10,
                                              },
                                            ]}
                                          />
                                        </Col>
                                      </Row>
                                    );
                                  }
                                  return '';
                                },
                              )}
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    type="FontAwesome"
                                    name="map-marker"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col />
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>
                                    Location
                                  </Label>
                                </Col>
                              </Row>
                              <Row>
                                <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
                                  <Selectize
                                    ref={(selectize) => { this.geonamesSelectizeRef = selectize; }}
                                    itemId="value"
                                    items={this.state.geonames}
                                    selectedItems={this.state.contact.geonames.values}
                                    textInputProps={{
                                      placeholder: 'Select locations',
                                    }}
                                    renderRow={(id, onPress, item) => (
                                      <TouchableOpacity
                                        activeOpacity={0.6}
                                        key={id}
                                        onPress={onPress}
                                        style={{
                                          paddingVertical: 8,
                                          paddingHorizontal: 10,
                                        }}
                                      >
                                        <View style={{
                                          flexDirection: 'row',
                                        }}
                                        >
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {item.name}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                    renderChip={(id, onClose, item, style, iconStyle) => (
                                      <Chip
                                        key={id}
                                        iconStyle={iconStyle}
                                        onClose={onClose}
                                        text={item.name}
                                        style={style}
                                      />
                                    )}
                                    filterOnKey="name"
                                    keyboardShouldPersistTaps
                                    inputContainerStyle={{ borderWidth: 1, borderColor: '#CCCCCC', padding: 5 }}
                                  />
                                </Col>
                              </Row>
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    type="FontAwesome"
                                    name="globe"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col />
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>
                                    People Group
                                  </Label>
                                </Col>
                              </Row>
                              <Row>
                                <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
                                  <Selectize
                                    ref={(selectize) => { this.pplGroupsSelectizeRef = selectize; }}
                                    itemId="value"
                                    items={this.state.peopleGroups}
                                    selectedItems={this.state.contact.people_groups.values}
                                    textInputProps={{
                                      placeholder: 'Select People Groups',
                                    }}
                                    renderRow={(id, onPress, item) => (
                                      <TouchableOpacity
                                        activeOpacity={0.6}
                                        key={id}
                                        onPress={onPress}
                                        style={{
                                          paddingVertical: 8,
                                          paddingHorizontal: 10,
                                        }}
                                      >
                                        <View style={{
                                          flexDirection: 'row',
                                        }}
                                        >
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {item.name}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                    renderChip={(id, onClose, item, style, iconStyle) => (
                                      <Chip
                                        key={id}
                                        iconStyle={iconStyle}
                                        onClose={onClose}
                                        text={item.name}
                                        style={style}
                                      />
                                    )}
                                    filterOnKey="name"
                                    keyboardShouldPersistTaps
                                    inputContainerStyle={{ borderWidth: 1, borderColor: '#CCCCCC', padding: 5 }}
                                  />
                                </Col>
                              </Row>
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    type="FontAwesome"
                                    name="clock-o"
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
                              <View style={styles.formDivider} />
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
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    android="md-arrow-dropright"
                                    ios="ios-arrow-dropright"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col />
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>
                                    Source
                                  </Label>
                                </Col>
                              </Row>
                              <Row>
                                <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
                                  <Selectize
                                    ref={(selectize) => { this.sourcesSelectizeRef = selectize; }}
                                    itemId="value"
                                    items={this.state.contactSources}
                                    selectedItems={this.state.contact.sources.values}
                                    textInputProps={{
                                      placeholder: 'Select sources',
                                    }}
                                    renderRow={(id, onPress, item) => (
                                      <TouchableOpacity
                                        activeOpacity={0.6}
                                        key={id}
                                        onPress={onPress}
                                        style={{
                                          paddingVertical: 8,
                                          paddingHorizontal: 10,
                                        }}
                                      >
                                        <View style={{
                                          flexDirection: 'row',
                                        }}
                                        >
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {item.name}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                    renderChip={(id, onClose, item, style, iconStyle) => (
                                      <Chip
                                        key={id}
                                        iconStyle={iconStyle}
                                        onClose={onClose}
                                        text={item.name}
                                        style={style}
                                      />
                                    )}
                                    filterOnKey="name"
                                    keyboardShouldPersistTaps
                                    inputContainerStyle={{ borderWidth: 1, borderColor: '#CCCCCC', padding: 5 }}
                                  />
                                </Col>
                              </Row>
                              <View style={styles.formDivider} />
                            </Grid>
                          </View>
                        )}
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
                  <ScrollView
                    refreshControl={(
                      <RefreshControl
                        refreshing={this.state.loading}
                        onRefresh={() => this.onRefresh(this.state.contact.ID)}
                      />
                    )}
                  >
                    <View
                      style={styles.formContainer}
                      pointerEvents={this.state.onlyView ? 'none' : 'auto'}
                    >
                      <Grid>
                        <Row style={styles.formRow}>
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
                              onValueChange={this.setContactSeekerPath}
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
                              <Picker.Item
                                label="Being Coached"
                                value="coaching"
                              />
                            </Picker>
                          </Col>
                          <Col style={styles.formIconLabel}>
                            <Label style={styles.formLabel}>Seeker Path</Label>
                          </Col>
                        </Row>
                      </Grid>
                      <View
                        style={{
                          alignItems: 'center',
                          marginTop: 5,
                          marginBottom: 25,
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
                          { fontWeight: 'bold', marginBottom: 10 },
                        ]}
                      >
                        Faith Milestones
                      </Label>
                      <Grid
                        style={{
                          height: milestonesGridSize,
                        }}
                      >
                        <Row size={6}>
                          <Col size={1} />
                          <Col size={5}>
                            <TouchableOpacity
                              onPress={() => {
                                this.onMilestoneChange('milestone_has_bible');
                              }}
                              activeOpacity={1}
                              style={styles.progressIcon}
                            >
                              <Col>
                                <Row size={3}>
                                  <Image
                                    source={hasBibleIcon}
                                    style={[
                                      styles.progressIcon,
                                      this.onCheckExistingMilestone(
                                        'milestone_has_bible',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
                                    ]}
                                  />
                                </Row>
                                <Row size={1}>
                                  <Text
                                    style={[
                                      styles.progressIconText,
                                      this.onCheckExistingMilestone(
                                        'milestone_has_bible',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
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
                                this.onMilestoneChange(
                                  'milestone_reading_bible',
                                );
                              }}
                              activeOpacity={1}
                              style={styles.progressIcon}
                            >
                              <Col>
                                <Row size={3}>
                                  <Image
                                    source={readingBibleIcon}
                                    style={[
                                      styles.progressIcon,
                                      this.onCheckExistingMilestone(
                                        'milestone_reading_bible',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
                                    ]}
                                  />
                                </Row>
                                <Row size={1}>
                                  <Text
                                    style={[
                                      styles.progressIconText,
                                      this.onCheckExistingMilestone(
                                        'milestone_reading_bible',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
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
                                this.onMilestoneChange('milestone_belief');
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
                                        'milestone_belief',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
                                    ]}
                                  />
                                </Row>
                                <Row size={1}>
                                  <Text
                                    style={[
                                      styles.progressIconText,
                                      this.onCheckExistingMilestone(
                                        'milestone_belief',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
                                    ]}
                                  >
                                    States Belief
                                  </Text>
                                </Row>
                              </Col>
                            </TouchableOpacity>
                          </Col>
                          <Col size={1} />
                        </Row>
                        <Row size={1} />
                        <Row size={7}>
                          <Col size={1} />
                          <Col size={5}>
                            <TouchableOpacity
                              onPress={() => {
                                this.onMilestoneChange('milestone_can_share');
                              }}
                              activeOpacity={1}
                              style={styles.progressIcon}
                            >
                              <Col>
                                <Row size={7}>
                                  <Image
                                    source={canShareGospelIcon}
                                    style={[
                                      styles.progressIcon,
                                      this.onCheckExistingMilestone(
                                        'milestone_can_share',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
                                    ]}
                                  />
                                </Row>
                                <Row size={3}>
                                  <Text
                                    style={[
                                      styles.progressIconText,
                                      this.onCheckExistingMilestone(
                                        'milestone_can_share',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
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
                                this.onMilestoneChange('milestone_sharing');
                              }}
                              activeOpacity={1}
                              style={styles.progressIcon}
                            >
                              <Col>
                                <Row size={7}>
                                  <Image
                                    source={sharingTheGospelIcon}
                                    style={[
                                      styles.progressIcon,
                                      this.onCheckExistingMilestone(
                                        'milestone_sharing',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
                                    ]}
                                  />
                                </Row>
                                <Row size={3}>
                                  <Text
                                    style={[
                                      styles.progressIconText,
                                      this.onCheckExistingMilestone(
                                        'milestone_sharing',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
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
                                this.onMilestoneChange('milestone_baptized');
                              }}
                              activeOpacity={1}
                              style={styles.progressIcon}
                            >
                              <Col>
                                <Row size={7}>
                                  <Image
                                    source={baptizedIcon}
                                    style={[
                                      styles.progressIcon,
                                      this.onCheckExistingMilestone(
                                        'milestone_baptized',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
                                    ]}
                                  />
                                </Row>
                                <Row size={3}>
                                  <Text
                                    style={[
                                      styles.progressIconText,
                                      this.onCheckExistingMilestone(
                                        'milestone_baptized',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
                                    ]}
                                  >
                                    Baptized
                                  </Text>
                                </Row>
                              </Col>
                            </TouchableOpacity>
                          </Col>
                          <Col size={1} />
                        </Row>
                        <Row size={1} />
                        <Row size={6}>
                          <Col size={1} />
                          <Col size={5}>
                            <TouchableOpacity
                              onPress={() => {
                                this.onMilestoneChange('milestone_baptizing');
                              }}
                              activeOpacity={1}
                              style={styles.progressIcon}
                            >
                              <Col>
                                <Row size={3}>
                                  <Image
                                    source={baptizingIcon}
                                    style={[
                                      styles.progressIcon,
                                      this.onCheckExistingMilestone(
                                        'milestone_baptizing',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
                                    ]}
                                  />
                                </Row>
                                <Row size={1}>
                                  <Text
                                    style={[
                                      styles.progressIconText,
                                      this.onCheckExistingMilestone(
                                        'milestone_baptizing',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
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
                                this.onMilestoneChange('milestone_in_group');
                              }}
                              activeOpacity={1}
                              style={styles.progressIcon}
                            >
                              <Col>
                                <Row size={3}>
                                  <Image
                                    source={inChurchIcon}
                                    style={[
                                      styles.progressIcon,
                                      this.onCheckExistingMilestone(
                                        'milestone_in_group',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
                                    ]}
                                  />
                                </Row>
                                <Row size={1}>
                                  <Text
                                    style={[
                                      styles.progressIconText,
                                      this.onCheckExistingMilestone(
                                        'milestone_in_group',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
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
                                this.onMilestoneChange('milestone_planting');
                              }}
                              activeOpacity={1}
                              style={styles.progressIcon}
                            >
                              <Col>
                                <Row size={3}>
                                  <Image
                                    source={startingChurchesIcon}
                                    style={[
                                      styles.progressIcon,
                                      this.onCheckExistingMilestone(
                                        'milestone_planting',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
                                    ]}
                                  />
                                </Row>
                                <Row size={1}>
                                  <Text
                                    style={[
                                      styles.progressIconText,
                                      this.onCheckExistingMilestone(
                                        'milestone_planting',
                                      )
                                        ? styles.progressIconActive
                                        : styles.progressIconInactive,
                                    ]}
                                  >
                                    Starting Churches
                                  </Text>
                                </Row>
                              </Col>
                            </TouchableOpacity>
                          </Col>
                          <Col size={1} />
                        </Row>
                      </Grid>
                      <Grid style={{ marginTop: 25 }}>
                        <View style={styles.formDivider} />
                        <Row style={styles.formRow}>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              type="Entypo"
                              name="water"
                              style={styles.formIcon}
                            />
                          </Col>
                          <Col>
                            <DatePicker
                              placeHolderText="Add baptism date"
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
                  <View style={{ flex: 1 }}>
                    <FlatList
                      style={{
                        backgroundColor: '#ffffff',
                        flex: 1,
                        marginBottom: 60,
                      }}
                      ref={(flatList) => {
                        commentsFlatList = flatList;
                      }}
                      data={this.state.comments.concat(this.state.activities).sort(
                        (a, b) => new Date(a.date).getTime() < new Date(b.date).getTime(),
                      )}
                      extraData={this.state.comments.concat(this.state.activities).sort(
                        (a, b) => new Date(a.date).getTime() < new Date(b.date).getTime(),
                      )}
                      ItemSeparatorComponent={() => (
                        <View
                          style={{
                            height: 1,
                            backgroundColor: '#CCCCCC',
                          }}
                        />
                      )}
                      keyExtractor={item => item.ID}
                      renderItem={(item) => {
                        const commentOrActivity = item.item;
                        return this.renderActivityOrCommentRow(
                          commentOrActivity,
                        );
                      }}
                      refreshControl={(
                        <RefreshControl
                          refreshing={(this.state.loadingComments || this.state.loadingActivities)}
                          onRefresh={() => this.onRefreshCommentsActivities(this.state.contact.ID)}
                        />
                      )}
                      onScroll={({ nativeEvent }) => {
                        const {
                          loadingMoreComments, commentsOffset, activitiesOffset,
                        } = this.state;
                        const fL = nativeEvent;
                        const toEnd = (fL.contentSize.height - fL.contentOffset.y);
                        if (toEnd < 600) {
                          if (!loadingMoreComments) {
                            if (commentsOffset < this.state.totalComments) {
                              this.setState({
                                loadingMoreComments: true,
                              }, () => {
                                this.getContactComments(this.state.contact.ID);
                              });
                            }
                          }
                          if (!this.state.loadingMoreActivities) {
                            if (activitiesOffset < this.state.totalActivities) {
                              this.setState({
                                loadingMoreActivities: true,
                              }, () => {
                                this.getContactActivities(this.state.contact.ID);
                              });
                            }
                          }
                        }
                      }}
                    />
                    <KeyboardAccessory>
                      <View
                        style={{
                          backgroundColor: 'white',
                          flexDirection: 'row',
                        }}
                      >
                        <TextInput
                          placeholder="Write your comment or note here"
                          value={this.state.comment}
                          onChangeText={this.setComment}
                          style={{
                            borderColor: '#B4B4B4',
                            borderRadius: 5,
                            borderWidth: 1,
                            flex: 1,
                            margin: 10,
                            paddingLeft: 5,
                            paddingRight: 5,
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
                            width: 40,
                          }}
                        >
                          <Icon
                            android="md-send"
                            ios="ios-send"
                            style={{ color: 'white', fontSize: 25 }}
                          />
                        </TouchableOpacity>
                      </View>
                    </KeyboardAccessory>
                  </View>
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
                      <ScrollView
                        keyboardShouldPersistTaps="handled"
                        refreshControl={(
                          <RefreshControl
                            refreshing={this.state.loading}
                            onRefresh={() => this.onRefresh(this.state.contact.ID)}
                          />
                        )}
                      >
                        {this.state.dataRetrieved && (
                          <View
                            style={styles.formContainer}
                            pointerEvents={this.state.onlyView ? 'none' : 'auto'}
                          >
                            <Grid>
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    active
                                    type="FontAwesome"
                                    name="users"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col />
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>
                                    Groups
                                  </Label>
                                </Col>
                              </Row>
                              <Row>
                                <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
                                  <Selectize
                                    ref={(selectize) => { this.groupsSelectizeRef = selectize; }}
                                    itemId="value"
                                    items={this.state.groups}
                                    selectedItems={this.state.contact.groups.values}
                                    textInputProps={{
                                      placeholder: 'Add group',
                                    }}
                                    renderRow={(id, onPress, item) => (
                                      <TouchableOpacity
                                        activeOpacity={0.6}
                                        key={id}
                                        onPress={onPress}
                                        style={{
                                          paddingVertical: 8,
                                          paddingHorizontal: 10,
                                        }}
                                      >
                                        <View style={{
                                          flexDirection: 'row',
                                        }}
                                        >
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {item.name}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                    renderChip={(id, onClose, item, style, iconStyle) => (
                                      <Chip
                                        key={id}
                                        iconStyle={iconStyle}
                                        onClose={onClose}
                                        text={item.name}
                                        style={style}
                                      />
                                    )}
                                    filterOnKey="name"
                                    keyboardShouldPersistTaps
                                    inputContainerStyle={{ borderWidth: 1, borderColor: '#CCCCCC', padding: 5 }}
                                  />
                                </Col>
                              </Row>
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    active
                                    type="Entypo"
                                    name="network"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col />
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>
                                    Connection
                                  </Label>
                                </Col>
                              </Row>
                              <Row>
                                <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
                                  <Selectize
                                    ref={(selectize) => { this.connectSelectizeRef = selectize; }}
                                    itemId="value"
                                    items={this.state.usersContacts}
                                    selectedItems={this.state.contact.relation.values}
                                    textInputProps={{
                                      placeholder: 'Add connection',
                                    }}
                                    renderRow={(id, onPress, item) => (
                                      <TouchableOpacity
                                        activeOpacity={0.6}
                                        key={id}
                                        onPress={onPress}
                                        style={{
                                          paddingVertical: 8,
                                          paddingHorizontal: 10,
                                        }}
                                      >
                                        <View style={{
                                          flexDirection: 'row',
                                        }}
                                        >
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {item.name}
                                          </Text>
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.54)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {id}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                    renderChip={(id, onClose, item, style, iconStyle) => (
                                      <Chip
                                        key={id}
                                        iconStyle={iconStyle}
                                        onClose={onClose}
                                        text={item.name}
                                        style={style}
                                      />
                                    )}
                                    filterOnKey="name"
                                    keyboardShouldPersistTaps
                                    inputContainerStyle={{ borderWidth: 1, borderColor: '#CCCCCC', padding: 5 }}
                                  />
                                </Col>
                              </Row>
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    active
                                    type="Entypo"
                                    name="water"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col />
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>
                                    Baptized by
                                  </Label>
                                </Col>
                              </Row>
                              <Row>
                                <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
                                  <Selectize
                                    ref={(selectize) => { this.baptBySelectizeRef = selectize; }}
                                    itemId="value"
                                    items={this.state.usersContacts}
                                    selectedItems={this.state.contact.baptized_by.values}
                                    textInputProps={{
                                      placeholder: 'Add baptized by',
                                    }}
                                    renderRow={(id, onPress, item) => (
                                      <TouchableOpacity
                                        activeOpacity={0.6}
                                        key={id}
                                        onPress={onPress}
                                        style={{
                                          paddingVertical: 8,
                                          paddingHorizontal: 10,
                                        }}
                                      >
                                        <View style={{
                                          flexDirection: 'row',
                                        }}
                                        >
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {item.name}
                                          </Text>
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.54)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {id}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                    renderChip={(id, onClose, item, style, iconStyle) => (
                                      <Chip
                                        key={id}
                                        iconStyle={iconStyle}
                                        onClose={onClose}
                                        text={item.name}
                                        style={style}
                                      />
                                    )}
                                    filterOnKey="name"
                                    keyboardShouldPersistTaps
                                    inputContainerStyle={{ borderWidth: 1, borderColor: '#CCCCCC', padding: 5 }}
                                  />
                                </Col>
                              </Row>
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    active
                                    type="Entypo"
                                    name="water"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col />
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>
                                    Baptized
                                  </Label>
                                </Col>
                              </Row>
                              <Row>
                                <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
                                  <Selectize
                                    ref={(selectize) => { this.baptizedSelectizeRef = selectize; }}
                                    itemId="value"
                                    items={this.state.usersContacts}
                                    selectedItems={this.state.contact.baptized.values}
                                    textInputProps={{
                                      placeholder: 'Add baptized',
                                    }}
                                    renderRow={(id, onPress, item) => (
                                      <TouchableOpacity
                                        activeOpacity={0.6}
                                        key={id}
                                        onPress={onPress}
                                        style={{
                                          paddingVertical: 8,
                                          paddingHorizontal: 10,
                                        }}
                                      >
                                        <View style={{
                                          flexDirection: 'row',
                                        }}
                                        >
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {item.name}
                                          </Text>
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.54)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {id}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                    renderChip={(id, onClose, item, style, iconStyle) => (
                                      <Chip
                                        key={id}
                                        iconStyle={iconStyle}
                                        onClose={onClose}
                                        text={item.name}
                                        style={style}
                                      />
                                    )}
                                    filterOnKey="name"
                                    keyboardShouldPersistTaps
                                    inputContainerStyle={{ borderWidth: 1, borderColor: '#CCCCCC', padding: 5 }}
                                  />
                                </Col>
                              </Row>
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    active
                                    type="FontAwesome"
                                    name="black-tie"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col />
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>
                                    Coached By
                                  </Label>
                                </Col>
                              </Row>
                              <Row>
                                <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
                                  <Selectize
                                    ref={(selectize) => { this.coachedSelectizeRef = selectize; }}
                                    itemId="value"
                                    items={this.state.usersContacts}
                                    selectedItems={this.state.contact.coached_by.values}
                                    textInputProps={{
                                      placeholder: 'Add coached by',
                                    }}
                                    renderRow={(id, onPress, item) => (
                                      <TouchableOpacity
                                        activeOpacity={0.6}
                                        key={id}
                                        onPress={onPress}
                                        style={{
                                          paddingVertical: 8,
                                          paddingHorizontal: 10,
                                        }}
                                      >
                                        <View style={{
                                          flexDirection: 'row',
                                        }}
                                        >
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {item.name}
                                          </Text>
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.54)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {id}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                    renderChip={(id, onClose, item, style, iconStyle) => (
                                      <Chip
                                        key={id}
                                        iconStyle={iconStyle}
                                        onClose={onClose}
                                        text={item.name}
                                        style={style}
                                      />
                                    )}
                                    filterOnKey="name"
                                    keyboardShouldPersistTaps
                                    inputContainerStyle={{ borderWidth: 1, borderColor: '#CCCCCC', padding: 5 }}
                                  />
                                </Col>
                              </Row>
                              <View style={styles.formDivider} />
                              <Row style={styles.formRow}>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    active
                                    type="MaterialCommunityIcons"
                                    name="presentation"
                                    style={styles.formIcon}
                                  />
                                </Col>
                                <Col />
                                <Col style={styles.formIconLabel}>
                                  <Label style={styles.formLabel}>
                                    Coaching
                                  </Label>
                                </Col>
                              </Row>
                              <Row>
                                <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
                                  <Selectize
                                    ref={(selectize) => { this.coachingSelectizeRef = selectize; }}
                                    itemId="value"
                                    items={this.state.usersContacts}
                                    selectedItems={this.state.contact.coaching.values}
                                    textInputProps={{
                                      placeholder: 'Add coaching',
                                    }}
                                    renderRow={(id, onPress, item) => (
                                      <TouchableOpacity
                                        activeOpacity={0.6}
                                        key={id}
                                        onPress={onPress}
                                        style={{
                                          paddingVertical: 8,
                                          paddingHorizontal: 10,
                                        }}
                                      >
                                        <View style={{
                                          flexDirection: 'row',
                                        }}
                                        >
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {item.name}
                                          </Text>
                                          <Text style={{
                                            color: 'rgba(0, 0, 0, 0.54)',
                                            fontSize: 14,
                                            lineHeight: 21,
                                          }}
                                          >
                                            {id}
                                          </Text>
                                        </View>
                                      </TouchableOpacity>
                                    )}
                                    renderChip={(id, onClose, item, style, iconStyle) => (
                                      <Chip
                                        key={id}
                                        iconStyle={iconStyle}
                                        onClose={onClose}
                                        text={item.name}
                                        style={style}
                                      />
                                    )}
                                    filterOnKey="name"
                                    keyboardShouldPersistTaps
                                    inputContainerStyle={{ borderWidth: 1, borderColor: '#CCCCCC', padding: 5 }}
                                  />
                                </Col>
                              </Row>
                              <View style={styles.formDivider} />
                            </Grid>
                          </View>
                        )}
                      </ScrollView>
                    )}
                  </KeyboardShift>
                </Tab>
              </Tabs>
              {this.state.renderFab && (
                <Fab
                  active={this.state.activeFab}
                  onPress={() => this.setToggleFab()}
                  style={{ backgroundColor: Colors.tintColor }}
                >
                  <Icon
                    type="MaterialCommunityIcons"
                    name="comment-plus"
                    style={{ color: 'white' }}
                  />
                  <Button style={{ backgroundColor: Colors.tintColor }}>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="phone-classic"
                      style={{ color: 'white' }}
                      onPress={() => this.onSaveContact({
                        quick_button_phone_off:
                          parseInt(
                            this.state.contact.quick_button_phone_off,
                            10,
                          ) + 1,
                      })
                      }
                    />
                  </Button>
                  <Button style={{ backgroundColor: Colors.tintColor }}>
                    <Icon
                      type="Feather"
                      name="phone-off"
                      style={{ color: 'white' }}
                      onPress={() => this.onSaveContact({
                        quick_button_no_answer:
                          parseInt(
                            this.state.contact.quick_button_no_answer,
                            10,
                          ) + 1,
                      })
                      }
                    />
                  </Button>
                  <Button style={{ backgroundColor: Colors.tintColor }}>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="phone-in-talk"
                      style={{ color: 'white' }}
                      onPress={() => this.onSaveContact({
                        quick_button_contact_established:
                          parseInt(
                            this.state.contact
                              .quick_button_contact_established,
                            10,
                          ) + 1,
                      })
                      }
                    />
                  </Button>
                  <Button style={{ backgroundColor: Colors.tintColor }}>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="calendar-plus"
                      style={{ color: 'white' }}
                      onPress={() => this.onSaveContact({
                        quick_button_meeting_scheduled:
                          parseInt(
                            this.state.contact.quick_button_meeting_scheduled,
                            10,
                          ) + 1,
                      })
                      }
                    />
                  </Button>
                  <Button style={{ backgroundColor: Colors.tintColor }}>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="calendar-check"
                      style={{ color: 'white' }}
                      onPress={() => this.onSaveContact({
                        quick_button_meeting_complete:
                          parseInt(
                            this.state.contact.quick_button_meeting_complete,
                            10,
                          ) + 1,
                      })
                      }
                    />
                  </Button>
                  <Button style={{ backgroundColor: Colors.tintColor }}>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="calendar-remove"
                      style={{ color: 'white' }}
                      onPress={() => this.onSaveContact({
                        quick_button_no_show:
                          parseInt(
                            this.state.contact.quick_button_no_show,
                            10,
                          ) + 1,
                      })
                      }
                    />
                  </Button>
                </Fab>
              )}
            </View>
          </Container>
        )}
        {!this.state.contact.ID && this.state.loadedLocal && (
          <KeyboardShift>
            {() => (
              <ScrollView keyboardShouldPersistTaps="handled">
                <View style={styles.formContainer}>
                  <Grid>
                    <Row>
                      <Label
                        style={[
                          styles.formLabel,
                          { marginTop: 10, marginBottom: 5 },
                        ]}
                      >
                        Full Name
                      </Label>
                    </Row>
                    <Row>
                      <Input
                        placeholder="Required field"
                        onChangeText={this.setContactTitle}
                        style={{
                          borderColor: '#B4B4B4',
                          borderWidth: 1,
                          borderRadius: 5,
                          borderStyle: 'solid',
                          fontSize: 13,
                          paddingLeft: 15,
                        }}
                      />
                    </Row>
                    <Row>
                      <Label
                        style={[
                          styles.formLabel,
                          { marginTop: 10, marginBottom: 5 },
                        ]}
                      >
                        Phone Number
                      </Label>
                    </Row>
                    <Row>
                      <Input
                        onChangeText={this.setSingleContactPhone}
                        style={{
                          borderColor: '#B4B4B4',
                          borderWidth: 1,
                          borderRadius: 5,
                          borderStyle: 'solid',
                          fontSize: 13,
                          paddingLeft: 15,
                        }}
                      />
                    </Row>
                    <Row>
                      <Label
                        style={[
                          styles.formLabel,
                          { marginTop: 10, marginBottom: 5 },
                        ]}
                      >
                        Email
                      </Label>
                    </Row>
                    <Row>
                      <Input
                        onChangeText={this.setContactEmail}
                        style={{
                          borderColor: '#B4B4B4',
                          borderWidth: 1,
                          borderRadius: 5,
                          borderStyle: 'solid',
                          fontSize: 13,
                          paddingLeft: 15,
                        }}
                      />
                    </Row>
                    <Row>
                      <Label
                        style={[
                          styles.formLabel,
                          { marginTop: 10, marginBottom: 5 },
                        ]}
                      >
                        Source
                      </Label>
                    </Row>
                    <Row>
                      <Picker
                        onValueChange={this.setContactSource}
                        selectedValue={
                          this.state.contact.sources.values[0].value
                        }
                      >
                        {this.renderSourcePickerItems()}
                      </Picker>
                    </Row>
                    <Row>
                      <Label
                        style={[
                          styles.formLabel,
                          { marginTop: 10, marginBottom: 5 },
                        ]}
                      >
                        Locations
                      </Label>
                    </Row>
                    <Row>
                      <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <Selectize
                          ref={(selectize) => { this.geonamesSelectizeRef = selectize; }}
                          itemId="value"
                          items={this.state.geonames}
                          selectedItems={this.state.contact.geonames.values}
                          textInputProps={{
                            placeholder: 'Select locations',
                          }}
                          renderRow={(id, onPress, item) => (
                            <TouchableOpacity
                              activeOpacity={0.6}
                              key={id}
                              onPress={onPress}
                              style={{
                                paddingVertical: 8,
                                paddingHorizontal: 10,
                              }}
                            >
                              <View style={{
                                flexDirection: 'row',
                              }}
                              >
                                <Text style={{
                                  color: 'rgba(0, 0, 0, 0.87)',
                                  fontSize: 14,
                                  lineHeight: 21,
                                }}
                                >
                                  {item.name}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          )}
                          renderChip={(id, onClose, item, style, iconStyle) => (
                            <Chip
                              key={id}
                              iconStyle={iconStyle}
                              onClose={onClose}
                              text={item.name}
                              style={style}
                            />
                          )}
                          filterOnKey="name"
                          keyboardShouldPersistTaps
                          inputContainerStyle={{ borderWidth: 1, borderColor: '#CCCCCC', padding: 5 }}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Label
                        style={[
                          styles.formLabel,
                          { marginTop: 10, marginBottom: 5 },
                        ]}
                      >
                        Initial Comment
                      </Label>
                    </Row>
                    <Row>
                      <Input
                        multiline
                        onChangeText={this.setContactInitialComment}
                        style={{
                          borderColor: '#B4B4B4',
                          borderWidth: 1,
                          borderRadius: 5,
                          borderStyle: 'solid',
                          fontSize: 13,
                          paddingLeft: 15,
                        }}
                      />
                    </Row>
                  </Grid>
                </View>
              </ScrollView>
            )}
          </KeyboardShift>
        )}
        {/* successToast */}
        {errorToast}
      </Container>
    );
  }
}

ContactDetailScreen.propTypes = {
  user: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  contact: PropTypes.shape({
    key: PropTypes.number,
  }),
  userReducerError: PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string,
  }),
  newComment: PropTypes.shape({
    ID: PropTypes.string,
    author: PropTypes.string,
    content: PropTypes.string,
    date: PropTypes.string,
    gravatar: PropTypes.string,
  }),
  contactsReducerError: PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string,
  }),
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
  }).isRequired,
  saveContact: PropTypes.func.isRequired,
  getById: PropTypes.func.isRequired,
  getComments: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  getActivities: PropTypes.func.isRequired,
};

ContactDetailScreen.defaultProps = {
  contact: null,
  userReducerError: null,
  newComment: null,
  contactsReducerError: null,
};


const mapStateToProps = state => ({
  user: state.userReducer,
  userReducerError: state.userReducer.error,
  contact: state.contactsReducer.contact,
  comments: state.contactsReducer.comments,
  totalComments: state.contactsReducer.totalComments,
  loadingComments: state.contactsReducer.loadingComments,
  activities: state.contactsReducer.activities,
  totalActivities: state.contactsReducer.totalActivities,
  loadingActivities: state.contactsReducer.loadingActivities,
  newComment: state.contactsReducer.newComment,
  contactsReducerError: state.contactsReducer.error,
  loading: state.contactsReducer.loading,
});
const mapDispatchToProps = dispatch => ({
  saveContact: (domain, token, contactDetail) => {
    dispatch(save(domain, token, contactDetail));
  },
  getById: (domain, token, contactId) => {
    dispatch(getById(domain, token, contactId));
  },
  getComments: (domain, token, contactId, offset, limit) => {
    dispatch(getCommentsByContact(domain, token, contactId, offset, limit));
  },
  saveComment: (domain, token, contactId, commentData) => {
    dispatch(saveComment(domain, token, contactId, commentData));
  },
  getActivities: (domain, token, contactId, offset, limit) => {
    dispatch(getActivitiesByContact(domain, token, contactId, offset, limit));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactDetailScreen);
