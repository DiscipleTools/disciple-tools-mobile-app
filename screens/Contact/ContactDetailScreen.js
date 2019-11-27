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
  RefreshControl,
  Platform,
  TouchableHighlight,
  SafeAreaView,
} from 'react-native';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import PropTypes from 'prop-types';

import { Label, Input, Icon, Picker, DatePicker, Button } from 'native-base';
import Toast from 'react-native-easy-toast';
import { Col, Row, Grid } from 'react-native-easy-grid';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { Chip, Selectize } from 'react-native-material-selectize';
import ActionButton from 'react-native-action-button';
import { TabView, TabBar } from 'react-native-tab-view';

import sharedTools from '../../shared';
import KeyboardShift from '../../components/KeyboardShift';
import {
  save,
  getCommentsByContact,
  saveComment,
  getById,
  getByIdEnd,
  getActivitiesByContact,
  saveEnd,
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
import i18n from '../../languages';

let toastSuccess;
let toastError;
const containerPadding = 35;
const windowWidth = Dimensions.get('window').width;
const progressBarWidth = windowWidth - 100;
const milestonesGridSize = windowWidth + 5;
/* eslint-disable */
let commentsFlatList,
  subAssignedSelectizeRef,
  geonamesSelectizeRef,
  peopleGroupsSelectizeRef,
  sourcesSelectizeRef,
  groupsSelectizeRef,
  connectionsSelectizeRef,
  baptizedBySelectizeRef,
  coachedSelectizeRef,
  baptizedSelectizeRef,
  coachingSelectizeRef;
/* eslint-enable */
const defaultFaithMilestones = [
  'milestone_has_bible',
  'milestone_reading_bible',
  'milestone_belief',
  'milestone_can_share',
  'milestone_sharing',
  'milestone_baptized',
  'milestone_baptizing',
  'milestone_in_group',
  'milestone_planting',
];
const styles = StyleSheet.create({
  tabBarUnderlineStyle: {
    backgroundColor: Colors.tintColor,
  },
  tabStyle: { backgroundColor: '#FFFFFF' },
  textStyle: { color: 'gray' },
  activeTabStyle: { backgroundColor: '#FFFFFF' },
  activeTextStyle: { color: Colors.tintColor, fontWeight: 'bold' },
  addRemoveIcons: {
    fontSize: 30,
    marginRight: 0,
  },
  icon: {
    color: Colors.tintColor,
  },
  // Social Media Field
  socialMediaNames: {
    color: Colors.grayDark,
    fontSize: 12,
  },
  // Form
  formContainer: {
    paddingTop: 10,
    paddingBottom: 120,
    paddingLeft: containerPadding,
    paddingRight: containerPadding,
  },
  formRow: {
    paddingTop: 20,
    paddingBottom: 20,
    width: '100%',
  },
  formIconLabel: {
    width: 'auto',
  },
  formIcon: {
    color: Colors.tintColor,
    fontSize: 25,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  formParentLabel: {
    width: 'auto',
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
    marginLeft: 10,
    marginRight: 10,
  },
  formIconLabelCol: {
    width: 35,
  },
  formIconLabelView: {
    alignItems: 'center',
  },
  formFieldPadding: {
    paddingTop: 30,
  },
  // Progress Section
  progressIcon: { height: '100%', width: '100%' },
  progressIconActive: {
    opacity: 1,
  },
  progressIconInactive: {
    opacity: 0.15,
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
    marginRight: 10,
    marginBottom: 5,
    height: 40,
  },
  saveButton: {
    backgroundColor: Colors.tintColor,
    borderRadius: 5,
    marginTop: 40,
  },
  contactFABIcon: {
    color: 'white',
    fontSize: 20,
  },
  commentInput: {
    borderColor: '#B4B4B4',
    borderRadius: 5,
    borderWidth: 1,
    flex: 1,
    margin: 10,
    paddingLeft: 5,
    paddingRight: 5,
    textAlignVertical: 'center',
  },
  commentInputContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
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
});

const safeFind = (found, prop) => {
  if (typeof found === 'undefined') return '';
  return found[prop];
};

class ContactDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let navigationTitle = Object.prototype.hasOwnProperty.call(params, 'contactName')
      ? params.contactName
      : i18n.t('contactDetailScreen.addNewContact');
    let headerRight;
    let headerLeft;

    if (params) {
      if (params.onEnableEdit) {
        headerRight = params.onlyView ? (
          <Row onPress={params.onEnableEdit}>
            <Text style={{ color: '#FFFFFF', marginTop: 'auto', marginBottom: 'auto' }}>
              {i18n.t('global.edit')}
            </Text>
            <Icon
              type="MaterialCommunityIcons"
              name="pencil"
              style={[{ color: '#FFFFFF', paddingRight: 16 }]}
            />
          </Row>
        ) : (
          <Row onPress={params.onSaveContact}>
            <Text style={{ color: '#FFFFFF', marginTop: 'auto', marginBottom: 'auto' }}>
              {i18n.t('global.save')}
            </Text>
            <Icon
              type="Feather"
              name="check"
              style={[
                { color: '#FFFFFF', paddingRight: 16, marginTop: 'auto', marginBottom: 'auto' },
              ]}
            />
          </Row>
        );
      }

      if (params.onlyView) {
        headerLeft = (
          <Icon
            type="Feather"
            name="arrow-left"
            onPress={() => {
              if (params.fromGroupDetail) {
                navigation.navigate('GroupDetail');
              } else {
                params.onGoBack();
                navigation.goBack();
              }
            }}
            style={[{ paddingLeft: 16, color: '#FFFFFF', paddingRight: 16 }]}
          />
        );
      } else {
        navigationTitle = '';
        headerLeft = (
          <Row onPress={params.onDisableEdit}>
            <Icon
              type="AntDesign"
              name="close"
              style={[
                { paddingLeft: 16, color: '#FFFFFF', marginTop: 'auto', marginBottom: 'auto' },
              ]}
            />
            <Text style={{ color: '#FFFFFF', marginTop: 'auto', marginBottom: 'auto' }}>
              {i18n.t('global.cancel')}
            </Text>
          </Row>
        );
      }
    }

    return {
      title: navigationTitle,
      headerLeft,
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
    contact: {},
    unmodifiedContact: {},
    users: [],
    usersContacts: [],
    groups: [],
    peopleGroups: [],
    geonames: [],
    loadedLocal: false,
    comments: [],
    loadComments: false,
    loadingMoreComments: false,
    totalComments: 0,
    commentsOffset: 0,
    commentsLimit: 10,
    activities: [],
    loadActivities: false,
    loadingMoreActivities: false,
    totalActivities: 0,
    activitiesOffset: 0,
    activitiesLimit: 10,
    comment: '',
    progressBarValue: 0,
    overallStatusBackgroundColor: '#ffffff',
    activeFab: false,
    renderFab: true,
    showAssignedToModal: false,
    loading: false,
    moreFields: false,
    tabViewConfig: {
      index: 0,
      routes: [
        {
          key: 'details',
          title: i18n.t('global.details'),
        },
        {
          key: 'progress',
          title: i18n.t('global.progress'),
        },
        {
          key: 'comments',
          title: i18n.t('global.commentsActivity'),
        },
        {
          key: 'connections',
          title: i18n.t('contactDetailScreen.connections'),
        },
      ],
    },
  };

  componentDidMount() {
    const { navigation } = this.props;
    const { onlyView, contactId, contactName } = navigation.state.params;
    let newState = {};
    if (contactId) {
      newState = {
        contact: {
          ID: contactId,
          title: contactName,
          sources: {
            values: [
              {
                value: 'personal',
              },
            ],
          },
          overall_status: 'new',
          seeker_path: 'none',
        },
      };
      navigation.setParams({
        contactName,
        onEnableEdit: this.onEnableEdit,
        onDisableEdit: this.onDisableEdit,
        onSaveContact: this.onSaveContact,
      });
    } else {
      this.props.navigation.setParams({ hideTabBar: true });
      newState = {
        contact: {
          title: null,
          sources: {
            values: [
              {
                value: 'personal',
              },
            ],
          },
          overall_status: 'new',
          seeker_path: 'none',
        },
        overallStatusBackgroundColor: sharedTools.getSelectorColor('new'),
      };
    }
    if (onlyView) {
      newState = {
        ...newState,
        onlyView,
      };
    }
    this.setState(
      {
        ...newState,
      },
      () => {
        this.getLists(contactId || null);
      },
    );
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
      loading,
      comments: comments || prevState.comments,
      totalComments: totalComments || prevState.totalComments,
      loadComments: loadingComments,
      activities: activities || prevState.activities,
      totalActivities: totalActivities || prevState.totalActivities,
      loadActivities: loadingActivities,
      contact: prevState.contact,
      unmodifiedContact: prevState.unmodifiedContact,
    };

    // NEW COMMENT
    if (newComment) {
      newState.comments.unshift(newComment);
      newState = {
        ...newState,
        comments: newState.comments,
      };
    }
    // SAVE / GET BY ID
    if (contact) {
      // Update contact data only in these conditions:
      // Same contact created (offline/online)
      // Same contact updated (offline/online)
      // Same offline contact created in DB (AutoID to DBID)
      if (
        (typeof contact.ID !== 'undefined' && typeof prevState.contact.ID === 'undefined') ||
        contact.ID.toString() === prevState.contact.ID.toString() ||
        (contact.oldID && contact.oldID === prevState.contact.ID.toString())
      ) {
        newState = {
          ...newState,
          contact: {
            ...contact,
          },
          unmodifiedContact: {
            ...contact,
          },
        };
        if (newState.contact.oldID) {
          delete newState.contact.oldID;
        }
        if (newState.contact.overall_status) {
          newState = {
            ...newState,
            overallStatusBackgroundColor: sharedTools.getSelectorColor(
              newState.contact.overall_status,
            ),
          };
        }
        if (prevState.contact.initial_comment) {
          newState = {
            ...newState,
            comment: prevState.contact.initial_comment,
          };
        }
        if (newState.contact.location_grid) {
          newState.contact.location_grid.values.forEach((location) => {
            const foundLocation = newState.geonames.find(
              (geoname) => geoname.value === location.value,
            );
            if (!foundLocation) {
              // Add non existent contact location in the geonames list to avoid null exception
              newState = {
                ...newState,
                geonames: [
                  ...newState.geonames,
                  {
                    name: location.name,
                    value: location.value,
                  },
                ],
              };
            }
          });
        }
      }
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
      userReducerError,
      contact,
      navigation,
      newComment,
      contactsReducerError,
      saved,
    } = this.props;

    // NEW COMMENT
    if (newComment && prevProps.newComment !== newComment) {
      // Only do scroll when element its rendered
      if (commentsFlatList) {
        commentsFlatList.scrollToOffset({ animated: true, offset: 0 });
      }
      this.setComment('');
      this.setHeight(35);
    }

    // CONTACT SAVE / GET BY ID
    if (contact && prevProps.contact !== contact) {
      // Update contact data only in these conditions:
      // Same contact created (offline/online)
      // Same contact updated (offline/online)
      // Same offline contact created in DB (AutoID to DBID)
      if (
        (typeof contact.ID !== 'undefined' && typeof this.state.contact.ID === 'undefined') ||
        contact.ID.toString() === this.state.contact.ID.toString() ||
        (contact.oldID && contact.oldID === this.state.contact.ID.toString())
      ) {
        // Highlight Updates -> Compare this.state.contact with contact and show differences
        navigation.setParams({ contactName: contact.title });
        if (contact.seeker_path) {
          this.setContactSeekerPath(contact.seeker_path);
        }
        if (this.state.comment && this.state.comment.length > 0) {
          this.onSaveComment();
        }
        this.getContactByIdEnd();
      }
    }

    // CONTACT SAVE
    if (saved && prevProps.saved !== saved) {
      // Update contact data only in these conditions:
      // Same contact created (offline/online)
      // Same contact updated (offline/online)
      // Same offline contact created in DB (AutoID to DBID)
      if (
        (typeof contact.ID !== 'undefined' && typeof this.state.contact.ID === 'undefined') ||
        contact.ID.toString() === this.state.contact.ID.toString() ||
        (contact.oldID && contact.oldID === this.state.contact.ID.toString())
      ) {
        this.onRefreshCommentsActivities(contact.ID);
        toastSuccess.show(
          <View>
            <Text style={{ color: Colors.sucessText }}>{i18n.t('global.success.save')}</Text>
          </View>,
          3000,
        );
        this.onDisableEdit();
        this.props.endSaveContact();
      }
    }

    // ERROR
    const usersError = prevProps.userReducerError !== userReducerError && userReducerError;
    let contactsError = prevProps.contactsReducerError !== contactsReducerError;
    contactsError = contactsError && contactsReducerError;
    if (usersError || contactsError) {
      const error = userReducerError || contactsReducerError;
      toastError.show(
        <View>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.code')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{error.code}</Text>
          <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
            {i18n.t('global.error.message')}
          </Text>
          <Text style={{ color: Colors.errorText }}>{error.message}</Text>
        </View>,
        3000,
      );
    }
  }

  onRefresh(contactId) {
    this.getContactById(contactId);
    this.onRefreshCommentsActivities(contactId);
  }

  onRefreshCommentsActivities(contactId) {
    this.setState(
      {
        comments: [],
        activities: [],
        commentsOffset: 0,
        activitiesOffset: 0,
      },
      () => {
        this.getContactComments(contactId);
        if (this.props.isConnected) {
          this.getContactActivities(contactId);
        }
      },
    );
  }

  getLists = async (contactId) => {
    let newState = {};
    const users = await ExpoFileSystemStorage.getItem('usersList');
    if (users !== null) {
      newState = {
        ...newState,
        users: JSON.parse(users).map((user) => ({
          key: user.ID,
          label: user.name,
        })),
      };
    }

    const usersContacts = await ExpoFileSystemStorage.getItem('usersAndContactsList');
    if (usersContacts !== null) {
      newState = {
        ...newState,
        usersContacts: JSON.parse(usersContacts),
      };
    }

    const peopleGroups = await ExpoFileSystemStorage.getItem('peopleGroupsList');
    if (peopleGroups !== null) {
      newState = {
        ...newState,
        peopleGroups: JSON.parse(peopleGroups),
      };
    }

    const geonames = await ExpoFileSystemStorage.getItem('locationsList');
    if (geonames !== null) {
      newState = {
        ...newState,
        geonames: JSON.parse(geonames),
      };
    }

    const groups = await ExpoFileSystemStorage.getItem('searchGroupsList');
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
      // Only execute in detail mode
      if (contactId) {
        this.onRefresh(contactId);
      }
    });
  };

  getContactById(contactId) {
    this.props.getById(this.props.userData.domain, this.props.userData.token, contactId);
  }

  getContactByIdEnd() {
    this.props.getByIdEnd();
  }

  getContactComments(contactId) {
    this.props.getComments(
      this.props.userData.domain,
      this.props.userData.token,
      contactId,
      this.state.commentsOffset,
      this.state.commentsLimit,
    );
  }

  getContactActivities(contactId) {
    this.props.getActivities(
      this.props.userData.domain,
      this.props.userData.token,
      contactId,
      this.state.activitiesOffset,
      this.state.activitiesLimit,
    );
  }

  onEnableEdit = () => {
    this.setState((state) => {
      return {
        onlyView: false,
        tabViewConfig: {
          ...state.tabViewConfig,
          routes: state.tabViewConfig.routes.filter((route) => route.key !== 'comments'),
        },
      };
    });
    this.props.navigation.setParams({ hideTabBar: true, onlyView: false });
  };

  onDisableEdit = () => {
    const { unmodifiedContact } = this.state;
    this.setState((state) => {
      return {
        onlyView: true,
        contact: {
          ...unmodifiedContact,
        },
        overallStatusBackgroundColor: sharedTools.getSelectorColor(
          unmodifiedContact.overall_status,
        ),
        tabViewConfig: {
          ...state.tabViewConfig,
          routes: [
            {
              key: 'details',
              title: i18n.t('global.details'),
            },
            {
              key: 'progress',
              title: i18n.t('global.progress'),
            },
            {
              key: 'comments',
              title: i18n.t('global.commentsActivity'),
            },
            {
              key: 'connections',
              title: i18n.t('contactDetailScreen.connections'),
            },
          ],
        },
      };
    });
    this.props.navigation.setParams({ hideTabBar: false, onlyView: true });
  };

  setContactTitle = (value) => {
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        title: value,
      },
    }));
  };

  setSingleContactPhone = (value) => {
    this.setState((prevState) => ({
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
    this.setState((prevState) => ({
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
    this.setState((prevState) => ({
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

  getSelectizeValuesToSave = (dbData, selectizeRef) => {
    const dbItems = [...dbData];
    const localItems = [];

    const selectedValues = selectizeRef.getSelectedItems();

    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const item = selectedValues.entities.item[itemValue];
      localItems.push(item);
    });

    const itemsToSave = localItems
      .filter((localItem) => {
        const foundLocalInDatabase = dbItems.find((dbItem) => dbItem.value === localItem.value);
        return foundLocalInDatabase === undefined;
      })
      .map((localItem) => ({ value: localItem.value }));

    dbItems.forEach((dbItem) => {
      const foundDatabaseInLocal = localItems.find((localItem) => dbItem.value === localItem.value);
      if (!foundDatabaseInLocal) {
        itemsToSave.push({
          ...dbItem,
          delete: true,
        });
      }
    });

    return itemsToSave;
  };

  setContactInitialComment = (value) => {
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        initial_comment: value,
      },
    }));
  };

  setContactStatus = (value) => {
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        overall_status: value,
      },
      overallStatusBackgroundColor: sharedTools.getSelectorColor(value),
    }));
  };

  setContactSeekerPath = (value) => {
    const optionListValues = Object.keys(this.props.contactSettings.fields.seeker_path.values);
    const optionIndex = optionListValues.findIndex((key) => key === value);
    const newProgressValue = (100 / (optionListValues.length - 1)) * optionIndex;
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        seeker_path: value,
      },
      progressBarValue: newProgressValue,
    }));
  };

  setBaptismDate = (date) => {
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        baptism_date: sharedTools.formatDateToBackEnd(date),
      },
    }));
  };

  onSaveContact = (quickAction = {}) => {
    Keyboard.dismiss();
    const { unmodifiedContact } = this.state;
    const contact = this.transformContactObject(this.state.contact, quickAction);
    let contactToSave = {
      ...sharedTools.diff(unmodifiedContact, contact),
    };

    // Remove empty arrays
    if (!this.state.contact.title) {
      contactToSave = {
        ...contactToSave,
        title: '',
      };
    }

    Object.keys(contactToSave).forEach((key) => {
      const value = contactToSave[key];
      if (Object.prototype.hasOwnProperty.call(value, 'values') && value.values.length === 0) {
        delete contactToSave[key];
      }
    });

    if (this.state.contact.title) {
      contactToSave = {
        ...contactToSave,
        title: this.state.contact.title,
      };
    }

    if (this.state.contact.ID) {
      contactToSave = {
        ...contactToSave,
        ID: this.state.contact.ID,
      };
    }
    this.props.saveContact(this.props.userData.domain, this.props.userData.token, contactToSave);
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
    const age = newDate.getFullYear();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours %= 12;
    hours = hours || 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    const strTime = `${hours}:${minutes} ${ampm}`;
    return `${monthNames[newDate.getMonth()]} ${newDate.getDate()}, ${age} ${strTime}`;
  };

  setComment = (value) => {
    this.setState({
      comment: value,
    });
  };

  setHeight = (value) => {
    try {
      const height = value !== undefined ? value.nativeEvent.contentSize.height + 20 : 40;
      this.setState({
        height: Math.min(120, height),
        heightContainer: Math.min(120, height) + 20,
      });
    } catch (error) {
      this.setState({
        height: 40,
        heightContainer: 60,
      });
    }
  };

  onSaveComment = () => {
    const { comment } = this.state;
    if (comment.length > 0) {
      Keyboard.dismiss();
      this.props.saveComment(
        this.props.userData.domain,
        this.props.userData.token,
        this.state.contact.ID,
        {
          comment,
        },
      );
    }
  };

  onCheckExistingMilestone = (milestoneName) => {
    const milestones = this.state.contact.milestones
      ? [...this.state.contact.milestones.values]
      : [];
    // get milestones that exist in the list and are not deleted
    const foundMilestone = milestones.some(
      (milestone) => milestone.value === milestoneName && !milestone.delete,
    );
    return foundMilestone;
  };

  onMilestoneChange = (milestoneName) => {
    const milestonesList = this.state.contact.milestones
      ? [...this.state.contact.milestones.values]
      : [];
    const foundMilestone = milestonesList.find((milestone) => milestone.value === milestoneName);
    if (foundMilestone) {
      const milestoneIndex = milestonesList.indexOf(foundMilestone);
      if (foundMilestone.delete) {
        const milestoneModified = {
          ...foundMilestone,
        };
        delete milestoneModified.delete;
        milestonesList[milestoneIndex] = milestoneModified;
      } else {
        milestonesList[milestoneIndex] = {
          ...foundMilestone,
          delete: true,
        };
      }
    } else {
      milestonesList.push({
        value: milestoneName,
      });
    }
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        milestones: {
          values: milestonesList,
        },
      },
    }));
  };

  setContactAge = (value) => {
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        age: value,
      },
    }));
  };

  setContactGender = (value) => {
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        gender: value,
      },
    }));
  };

  getCommentsAndActivities() {
    const { comments, activities } = this.state;
    const list = comments.concat(activities);
    return list
      .filter((item, index) => list.indexOf(item) === index)
      .sort((a, b) => new Date(a.date).getTime() < new Date(b.date).getTime());
  }

  offlineBarRender = () => (
    <View style={[styles.offlineBar]}>
      <Text style={[styles.offlineBarText]}>{i18n.t('global.offline')}</Text>
    </View>
  );

  showMoreFields = () => {
    this.setState((state) => {
      return {
        moreFields: !state.moreFields,
      };
    });
  };

  detailView = () => (
    <View style={{ flex: 1 }}>
      {this.state.onlyView ? (
        <View>
          {!this.props.isConnected && this.offlineBarRender()}
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={() => this.onRefresh(this.state.contact.ID)}
              />
            }>
            <View
              style={[styles.formContainer, { marginTop: 10, paddingTop: 0 }]}
              pointerEvents="none">
              <Label
                style={{
                  color: Colors.tintColor,
                  fontSize: 12,
                  fontWeight: 'bold',
                  marginTop: 10,
                }}>
                {this.props.contactSettings.fields.overall_status.name}
              </Label>
              <Row style={[styles.formRow, { paddingTop: 5 }]}>
                <Col>
                  <Picker
                    selectedValue={this.state.contact.overall_status}
                    onValueChange={this.setContactStatus}
                    style={
                      Platform.OS === 'android'
                        ? {
                            color: '#ffffff',
                            backgroundColor: this.state.overallStatusBackgroundColor,
                          }
                        : {
                            backgroundColor: this.state.overallStatusBackgroundColor,
                          }
                    }>
                    {this.renderStatusPickerItems()}
                  </Picker>
                </Col>
              </Row>
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="user-circle" style={styles.formIcon} />
                </Col>
                <Col>{this.showAssignedUser()}</Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.assigned_to.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="Ionicons" name="md-people" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.subassigned
                      ? this.state.contact.subassigned.values
                          .map(
                            function(contact) {
                              return safeFind(
                                this.state.usersContacts.find(
                                  (user) => user.value === contact.value,
                                ),
                                'name',
                              );
                            }.bind(this),
                          )
                          .filter(String)
                          .join()
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.subassigned.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="phone" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.contact_phone
                      ? this.state.contact.contact_phone
                          .filter((phone) => !phone.delete)
                          .map((phone) => phone.value)
                          .join(', ')
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>{i18n.t('contactDetailScreen.mobile')}</Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="envelope" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.contact_email
                      ? this.state.contact.contact_email
                          .filter((email) => !email.delete)
                          .map((email) => email.value)
                          .join(', ')
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>{i18n.t('contactDetailScreen.email')}</Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon
                    type="Ionicons"
                    name="chatboxes"
                    style={[styles.formIcon, { marginTop: 0 }]}
                  />
                </Col>
                <Col>
                  {Object.keys(this.props.contactSettings.channels).map(
                    (channelName, channelNameIndex) => {
                      if (
                        Object.prototype.hasOwnProperty.call(
                          this.state.contact,
                          `contact_${channelName}`,
                        ) &&
                        this.state.contact[`contact_${channelName}`].length > 0
                      ) {
                        return (
                          <Col key={channelNameIndex.toString()}>
                            {this.state.contact[`contact_${channelName}`].map(
                              (socialMedia, socialMediaIndex) => (
                                <Text
                                  key={socialMediaIndex.toString()}
                                  style={socialMediaIndex === 0 ? { marginTop: 10 } : {}}>
                                  {socialMedia.value}
                                </Text>
                              ),
                            )}
                            <Text style={styles.socialMediaNames}>{channelName}</Text>
                          </Col>
                        );
                      }
                      return null;
                    },
                  )}
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={[styles.formLabel, { marginTop: 5 }]}>
                    {i18n.t('contactDetailScreen.socialMedia')}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="Entypo" name="home" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.contact_address
                      ? this.state.contact.contact_address
                          .filter((address) => !address.delete)
                          .map((address) => address.value)
                          .join(', ')
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>{i18n.t('global.address')}</Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="map-marker" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.location_grid
                      ? this.state.contact.location_grid.values
                          .map(
                            function(location) {
                              return safeFind(
                                this.state.geonames.find(
                                  (geoname) => geoname.value === location.value,
                                ),
                                'name',
                              );
                            }.bind(this),
                          )
                          .filter(String)
                          .join()
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.location_grid.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="globe" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.people_groups
                      ? this.state.contact.people_groups.values
                          .map(
                            function(peopleGroup) {
                              return safeFind(
                                this.state.peopleGroups.find(
                                  (person) => person.value === peopleGroup.value,
                                ),
                                'name',
                              );
                            }.bind(this),
                          )
                          .filter(String)
                          .join()
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.people_groups.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="clock-o" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.age ? this.state.contact.age : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.age.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon android="md-male" ios="ios-male" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.gender
                      ? this.props.contactSettings.fields.gender.values[this.state.contact.gender]
                          .label
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.gender.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon
                    android="md-arrow-dropright"
                    ios="ios-arrow-dropright"
                    style={styles.formIcon}
                  />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.sources
                      ? `${this.state.contact.sources.values
                          .map(
                            (source) =>
                              this.props.contactSettings.fields.sources.values[source.value].label,
                          )
                          .join(', ')}`
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.sources.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
            </View>
          </ScrollView>
        </View>
      ) : (
        <KeyboardShift>
          {() => (
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.formContainer}>
                <Label
                  style={[
                    {
                      color: Colors.tintColor,
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginTop: 10,
                    },
                    styles.formFieldPadding,
                  ]}>
                  {this.props.contactSettings.fields.overall_status.name}
                </Label>
                <Row style={{ paddingBottom: 30 }}>
                  <Col>
                    <Picker
                      selectedValue={this.state.contact.overall_status}
                      onValueChange={this.setContactStatus}
                      style={
                        Platform.OS === 'android'
                          ? {
                              color: '#ffffff',
                              backgroundColor: this.state.overallStatusBackgroundColor,
                            }
                          : {
                              backgroundColor: this.state.overallStatusBackgroundColor,
                            }
                      }>
                      {this.renderStatusPickerItems()}
                    </Picker>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="FontAwesome" name="user" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>{i18n.t('contactDetailScreen.fullName')}</Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="FontAwesome"
                        name="user"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Input
                      value={this.state.contact.title}
                      onChangeText={this.setContactTitle}
                      style={{
                        borderBottomWidth: 1,
                        borderStyle: 'solid',
                        borderBottomColor: '#D9D5DC',
                        fontSize: 15,
                        height: 10,
                      }}
                    />
                  </Col>
                </Row>
                <TouchableOpacity
                  onPress={() => {
                    this.updateShowAssignedToModal(true);
                  }}>
                  <Row style={styles.formFieldPadding}>
                    <Col style={styles.formIconLabelCol}>
                      <View style={styles.formIconLabelView}>
                        <Icon type="FontAwesome" name="user-circle" style={styles.formIcon} />
                      </View>
                    </Col>
                    <Col>
                      <Label style={styles.formLabel}>
                        {this.props.contactSettings.fields.assigned_to.name}
                      </Label>
                    </Col>
                  </Row>
                  <Row>
                    <Col style={styles.formIconLabelCol}>
                      <View style={styles.formIconLabelView}>
                        <Icon
                          type="FontAwesome"
                          name="user-circle"
                          style={[styles.formIcon, { opacity: 0 }]}
                        />
                      </View>
                    </Col>
                    <Col
                      style={{
                        borderBottomWidth: 1,
                        borderStyle: 'solid',
                        borderBottomColor: '#D9D5DC',
                      }}>
                      {this.showAssignedUser()}
                      <ModalFilterPicker
                        visible={this.state.showAssignedToModal}
                        onSelect={this.onSelectAssignedTo}
                        onCancel={this.onCancelAssignedTo}
                        options={this.state.users}
                      />
                    </Col>
                  </Row>
                </TouchableOpacity>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="Ionicons" name="md-people" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.subassigned.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="Ionicons"
                        name="md-people"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Selectize
                      ref={(selectize) => {
                        subAssignedSelectizeRef = selectize;
                      }}
                      itemId="value"
                      items={this.state.usersContacts}
                      selectedItems={
                        this.state.contact.subassigned
                          ? this.state.contact.subassigned.values.map((subassigned) => ({
                              name: this.state.usersContacts.find(
                                (user) => user.value === subassigned.value,
                              ).name,
                              value: subassigned.value,
                            }))
                          : []
                      }
                      textInputProps={{
                        placeholder: i18n.t('contactDetailScreen.subAssignThisContact'),
                      }}
                      renderChip={(id, onClose, item, style, iconStyle) => (
                        <Chip
                          key={id}
                          iconStyle={iconStyle}
                          onClose={onClose}
                          text={item.name}
                          style={style}
                        />
                      )}
                      renderRow={(id, onPress, item) => (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          key={id}
                          onPress={onPress}
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.87)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
                              {item.name}
                            </Text>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.54)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
                              {' '}
                              (#
                              {id})
                            </Text>
                          </View>
                        </TouchableOpacity>
                      )}
                      filterOnKey="name"
                      inputContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#CCCCCC',
                        padding: 5,
                      }}
                    />
                  </Col>
                </Row>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="FontAwesome" name="phone" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>{i18n.t('contactDetailScreen.mobile')}</Label>
                  </Col>
                  <Col style={styles.formIconLabel}>
                    <Icon
                      android="md-add"
                      ios="ios-add"
                      style={[styles.formIcon, styles.addRemoveIcons]}
                      onPress={this.onAddPhoneField}
                    />
                  </Col>
                </Row>
                {this.state.contact.contact_phone ? (
                  this.state.contact.contact_phone.map((phone, index) =>
                    !phone.delete ? (
                      <Row key={index.toString()}>
                        <Col style={styles.formIconLabelCol}>
                          <View style={styles.formIconLabelView}>
                            <Icon
                              type="FontAwesome"
                              name="phone"
                              style={[styles.formIcon, { opacity: 0 }]}
                            />
                          </View>
                        </Col>
                        <Col>
                          <Input
                            multiline
                            value={phone.value}
                            onChangeText={(value) => {
                              this.onPhoneFieldChange(value, index, phone.key, this);
                            }}
                            style={styles.inputContactAddress}
                          />
                        </Col>
                        <Col style={styles.formIconLabel}>
                          <Icon
                            android="md-remove"
                            ios="ios-remove"
                            style={[styles.formIcon, styles.addRemoveIcons]}
                            onPress={() => {
                              this.onRemovePhoneField(index, this);
                            }}
                          />
                        </Col>
                      </Row>
                    ) : null,
                  )
                ) : (
                  <Text />
                )}
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="FontAwesome" name="envelope" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>{i18n.t('contactDetailScreen.email')}</Label>
                  </Col>
                  <Col style={styles.formIconLabel}>
                    <Icon
                      android="md-add"
                      ios="ios-add"
                      style={[styles.formIcon, styles.addRemoveIcons]}
                      onPress={this.onAddEmailField}
                    />
                  </Col>
                </Row>
                {this.state.contact.contact_email ? (
                  this.state.contact.contact_email.map((email, index) =>
                    !email.delete ? (
                      <Row key={index.toString()}>
                        <Col style={styles.formIconLabelCol}>
                          <View style={styles.formIconLabelView}>
                            <Icon
                              type="FontAwesome"
                              name="envelope"
                              style={[styles.formIcon, { opacity: 0 }]}
                            />
                          </View>
                        </Col>
                        <Col>
                          <Input
                            multiline
                            value={email.value}
                            onChangeText={(value) => {
                              this.onEmailFieldChange(value, index, email.key, this);
                            }}
                            style={styles.inputContactAddress}
                          />
                        </Col>
                        <Col style={styles.formIconLabel}>
                          <Icon
                            android="md-remove"
                            ios="ios-remove"
                            style={[styles.formIcon, styles.addRemoveIcons]}
                            onPress={() => {
                              this.onRemoveEmailField(index, this);
                            }}
                          />
                        </Col>
                      </Row>
                    ) : null,
                  )
                ) : (
                  <Text />
                )}
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="Ionicons" name="chatboxes" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {i18n.t('contactDetailScreen.socialMedia')}
                    </Label>
                  </Col>
                  <Col style={styles.formIconLabel}>
                    <Icon
                      android="md-add"
                      ios="ios-add"
                      style={[styles.formIcon, styles.addRemoveIcons]}
                      onPress={this.onAddSocialMediaField}
                    />
                  </Col>
                </Row>
                {Object.keys(this.props.contactSettings.channels).map(
                  (channelName, channelNameIndex) => {
                    const propertyName = `contact_${channelName}`;
                    return (
                      <Col key={channelNameIndex.toString()}>
                        {this.state.contact[propertyName]
                          ? this.state.contact[propertyName].map((socialMedia, socialMediaIndex) =>
                              !socialMedia.key
                                ? this.renderSocialMediaField(
                                    socialMediaIndex,
                                    socialMedia,
                                    propertyName,
                                    channelName,
                                  )
                                : null,
                            )
                          : null}
                      </Col>
                    );
                  },
                )}
                {Object.keys(this.props.contactSettings.channels).map(
                  (channelName, channelNameIndex) => {
                    const propertyName = `contact_${channelName}`;
                    return (
                      <Col key={channelNameIndex.toString()}>
                        {this.state.contact[propertyName]
                          ? this.state.contact[propertyName].map((socialMedia, socialMediaIndex) =>
                              socialMedia.key && !socialMedia.delete
                                ? this.renderSocialMediaField(
                                    socialMediaIndex,
                                    socialMedia,
                                    propertyName,
                                    channelName,
                                  )
                                : null,
                            )
                          : null}
                      </Col>
                    );
                  },
                )}
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="Entypo" name="home" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>{i18n.t('global.address')}</Label>
                  </Col>
                  <Col style={styles.formIconLabel}>
                    <Icon
                      android="md-add"
                      ios="ios-add"
                      style={[styles.formIcon, styles.addRemoveIcons]}
                      onPress={this.onAddAddressField}
                    />
                  </Col>
                </Row>
                {this.state.contact.contact_address ? (
                  this.state.contact.contact_address.map((address, index) =>
                    !address.delete ? (
                      <Row key={index.toString()}>
                        <Col style={styles.formIconLabelCol}>
                          <View style={styles.formIconLabelView}>
                            <Icon
                              type="Entypo"
                              name="home"
                              style={[styles.formIcon, { opacity: 0 }]}
                            />
                          </View>
                        </Col>
                        <Col>
                          <Input
                            multiline
                            value={address.value}
                            onChangeText={(value) => {
                              this.onAddressFieldChange(value, index, address.key, this);
                            }}
                            style={styles.inputContactAddress}
                          />
                        </Col>
                        <Col style={styles.formIconLabel}>
                          <Icon
                            android="md-remove"
                            ios="ios-remove"
                            style={[styles.formIcon, styles.addRemoveIcons]}
                            onPress={() => {
                              this.onRemoveAddressField(index, this);
                            }}
                          />
                        </Col>
                      </Row>
                    ) : null,
                  )
                ) : (
                  <Text />
                )}
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="FontAwesome" name="map-marker" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.location_grid.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="FontAwesome"
                        name="map-marker"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Selectize
                      ref={(selectize) => {
                        geonamesSelectizeRef = selectize;
                      }}
                      itemId="value"
                      items={this.state.geonames}
                      selectedItems={
                        this.state.contact.location_grid
                          ? this.state.contact.location_grid.values.map((location) => ({
                              name: this.state.geonames.find(
                                (geoname) => geoname.value === location.value,
                              ).name,
                              value: location.value,
                            }))
                          : []
                      }
                      textInputProps={{
                        placeholder: i18n.t('contactDetailScreen.selectLocations'),
                      }}
                      renderRow={(id, onPress, item) => (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          key={id}
                          onPress={onPress}
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.87)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
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
                      inputContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#CCCCCC',
                        padding: 5,
                      }}
                    />
                  </Col>
                </Row>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="FontAwesome" name="globe" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.people_groups.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="FontAwesome"
                        name="globe"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Selectize
                      ref={(selectize) => {
                        peopleGroupsSelectizeRef = selectize;
                      }}
                      itemId="value"
                      items={this.state.peopleGroups}
                      selectedItems={
                        this.state.contact.people_groups
                          ? this.state.contact.people_groups.values.map((peopleGroup) => ({
                              name: this.state.peopleGroups.find(
                                (person) => person.value === peopleGroup.value,
                              ).name,
                              value: peopleGroup.value,
                            }))
                          : []
                      }
                      textInputProps={{
                        placeholder: i18n.t('global.selectPeopleGroups'),
                      }}
                      renderRow={(id, onPress, item) => (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          key={id}
                          onPress={onPress}
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.87)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
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
                      inputContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#CCCCCC',
                        padding: 5,
                      }}
                    />
                  </Col>
                </Row>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="FontAwesome" name="clock-o" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.age.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="FontAwesome"
                        name="clock-o"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Picker
                      mode="dropdown"
                      selectedValue={this.state.contact.age}
                      onValueChange={this.setContactAge}>
                      {Object.keys(this.props.contactSettings.fields.age.values).map((key) => {
                        const optionData = this.props.contactSettings.fields.age.values[key];
                        return <Picker.Item key={key} label={optionData.label} value={key} />;
                      })}
                    </Picker>
                  </Col>
                </Row>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon android="md-male" ios="ios-male" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.gender.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        android="md-male"
                        ios="ios-male"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Picker
                      mode="dropdown"
                      selectedValue={this.state.contact.gender}
                      onValueChange={this.setContactGender}>
                      {Object.keys(this.props.contactSettings.fields.gender.values).map((key) => {
                        const optionData = this.props.contactSettings.fields.gender.values[key];
                        return <Picker.Item key={key} label={optionData.label} value={key} />;
                      })}
                    </Picker>
                  </Col>
                </Row>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        android="md-arrow-dropright"
                        ios="ios-arrow-dropright"
                        style={styles.formIcon}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.sources.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        android="md-arrow-dropright"
                        ios="ios-arrow-dropright"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Selectize
                      ref={(selectize) => {
                        sourcesSelectizeRef = selectize;
                      }}
                      itemId="value"
                      items={Object.keys(this.props.contactSettings.fields.sources.values).map(
                        (key) => ({
                          name: this.props.contactSettings.fields.sources.values[key].label,
                          value: key,
                        }),
                      )}
                      selectedItems={
                        this.state.contact.sources
                          ? this.state.contact.sources.values.map((source) => ({
                              name: this.props.contactSettings.fields.sources.values[source.value]
                                .label,
                              value: source.value,
                            }))
                          : []
                      }
                      textInputProps={{
                        placeholder: i18n.t('contactDetailScreen.selectSources'),
                      }}
                      renderRow={(id, onPress, item) => (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          key={id}
                          onPress={onPress}
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.87)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
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
                      inputContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#CCCCCC',
                        padding: 5,
                      }}
                    />
                  </Col>
                </Row>
              </View>
            </ScrollView>
          )}
        </KeyboardShift>
      )}
    </View>
  );

  progressView = () => (
    <View style={{ flex: 1 }}>
      {this.state.onlyView ? (
        <View>
          {!this.props.isConnected && this.offlineBarRender()}
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={() => this.onRefresh(this.state.contact.ID)}
              />
            }>
            <View style={[styles.formContainer, { marginTop: 10 }]}>
              <Row style={[styles.formRow, { paddingTop: 15 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon android="md-calendar" ios="ios-calendar" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.seeker_path
                      ? this.props.contactSettings.fields.seeker_path.values[
                          this.state.contact.seeker_path
                        ].label
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.seeker_path.name}
                  </Label>
                </Col>
              </Row>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: 5,
                  marginBottom: 25,
                }}>
                <ProgressBarAnimated
                  width={progressBarWidth}
                  value={this.state.progressBarValue}
                  backgroundColor={Colors.tintColor}
                />
              </View>
              <View style={styles.formDivider} />
              <Label
                style={[styles.formLabel, { fontWeight: 'bold', marginBottom: 10, marginTop: 20 }]}>
                {this.props.contactSettings.fields.milestones.name}
              </Label>
              {this.renderfaithMilestones()}
              {this.renderCustomFaithMilestones()}
              <Grid style={{ marginTop: 25 }}>
                <View style={styles.formDivider} />
                <Row style={styles.formRow}>
                  <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                    <Icon type="Entypo" name="water" style={styles.formIcon} />
                  </Col>
                  <Col>
                    <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                      {this.state.contact.baptism_date ? this.state.contact.baptism_date : ''}
                    </Text>
                  </Col>
                  <Col style={styles.formIconLabel}>
                    <Label style={[styles.label, styles.formLabel]}>
                      {this.props.contactSettings.fields.baptism_date.name}
                    </Label>
                  </Col>
                </Row>
              </Grid>
            </View>
          </ScrollView>
        </View>
      ) : (
        <KeyboardShift>
          {() => (
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.formContainer}>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon android="md-calendar" ios="ios-calendar" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.seeker_path.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="FontAwesome"
                        name="user-circle"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Picker
                      mode="dropdown"
                      selectedValue={this.state.contact.seeker_path}
                      onValueChange={this.setContactSeekerPath}
                      textStyle={{ color: Colors.tintColor }}>
                      {Object.keys(this.props.contactSettings.fields.seeker_path.values).map(
                        (key) => {
                          const optionData = this.props.contactSettings.fields.seeker_path.values[
                            key
                          ];
                          return <Picker.Item key={key} label={optionData.label} value={key} />;
                        },
                      )}
                    </Picker>
                  </Col>
                </Row>
                <Label
                  style={[
                    styles.formLabel,
                    { fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
                  ]}>
                  {this.props.contactSettings.fields.milestones.name}
                </Label>
                {this.renderfaithMilestones()}
                {this.renderCustomFaithMilestones()}
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="Entypo" name="water" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.baptism_date.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="Entypo" name="water" style={[styles.formIcon, { opacity: 0 }]} />
                    </View>
                  </Col>
                  <Col>
                    <DatePicker
                      onDateChange={this.setBaptismDate}
                      defaultDate={
                        this.state.contact.baptism_date
                          ? new Date(this.state.contact.baptism_date)
                          : ''
                      }
                    />
                  </Col>
                </Row>
              </View>
            </ScrollView>
          )}
        </KeyboardShift>
      )}
    </View>
  );

  commentsView = () => (
    <View style={{ flex: 1 }}>
      {!this.props.isConnected && this.offlineBarRender()}
      <FlatList
        style={{
          backgroundColor: '#ffffff',
          flex: 1,
          marginBottom: 60,
        }}
        ref={(flatList) => {
          commentsFlatList = flatList;
        }}
        data={this.getCommentsAndActivities()}
        extraData={!this.state.loadingMoreComments || !this.state.loadingMoreActivities}
        inverted
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 1,
              backgroundColor: '#CCCCCC',
            }}
          />
        )}
        keyExtractor={(item, index) => String(index)}
        renderItem={(item) => {
          const commentOrActivity = item.item;
          return this.renderActivityOrCommentRow(commentOrActivity);
        }}
        refreshControl={
          <RefreshControl
            refreshing={this.state.loadComments || this.state.loadActivities}
            onRefresh={() => this.onRefreshCommentsActivities(this.state.contact.ID)}
          />
        }
        onScroll={({ nativeEvent }) => {
          const { loadingMoreComments, commentsOffset, activitiesOffset } = this.state;
          const flatList = nativeEvent;
          const contentOffsetY = flatList.contentOffset.y;
          const layoutMeasurementHeight = flatList.layoutMeasurement.height;
          const contentSizeHeight = flatList.contentSize.height;
          const heightOffsetSum = layoutMeasurementHeight + contentOffsetY;
          const distanceToStart = contentSizeHeight - heightOffsetSum;

          if (distanceToStart < 100) {
            if (!loadingMoreComments) {
              if (commentsOffset < this.state.totalComments) {
                this.setState(
                  {
                    loadingMoreComments: true,
                  },
                  () => {
                    this.getContactComments(this.state.contact.ID);
                  },
                );
              }
            }
            if (!this.state.loadingMoreActivities) {
              if (activitiesOffset < this.state.totalActivities) {
                this.setState(
                  {
                    loadingMoreActivities: true,
                  },
                  () => {
                    this.getContactActivities(this.state.contact.ID);
                  },
                );
              }
            }
          }
        }}
      />
      <SafeAreaView>
        <View>
          <KeyboardAccessory>
            <View style={[styles.commentInputContainer, { height: this.state.heightContainer }]}>
              <TextInput
                placeholder={i18n.t('global.writeYourCommentNoteHere')}
                value={this.state.comment}
                onChangeText={this.setComment}
                onContentSizeChange={this.setHeight}
                multiline
                style={[styles.commentInput, { height: this.state.height }]}
              />
              <TouchableOpacity
                onPress={() => this.onSaveComment()}
                style={[
                  {
                    backgroundColor: Colors.tintColor,
                    borderRadius: 80,
                    height: 40,
                    margin: 10,
                    paddingTop: 7,
                    width: 40,
                  },
                  i18n.isRTL ? { paddingRight: 10 } : { paddingLeft: 10 },
                ]}>
                <Icon android="md-send" ios="ios-send" style={{ color: 'white', fontSize: 25 }} />
              </TouchableOpacity>
            </View>
          </KeyboardAccessory>
        </View>
      </SafeAreaView>
    </View>
  );

  connectionsView = () => (
    <View style={{ flex: 1 }}>
      {this.state.onlyView ? (
        <View>
          {!this.props.isConnected && this.offlineBarRender()}
          <ScrollView
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={() => this.onRefresh(this.state.contact.ID)}
              />
            }>
            <View style={[styles.formContainer, { marginTop: 10 }]}>
              <Row style={[styles.formRow, { paddingTop: 15 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="users" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.groups
                      ? this.state.contact.groups.values
                          .map(
                            function(group) {
                              return safeFind(
                                this.state.groups.find(
                                  (groupItem) => groupItem.value === group.value,
                                ),
                                'name',
                              );
                            }.bind(this),
                          )
                          .filter(String)
                          .join()
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.groups.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={[styles.formRow, { paddingTop: 15 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="Entypo" name="network" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.relation
                      ? this.state.contact.relation.values
                          .map(
                            function(relation) {
                              return safeFind(
                                this.state.usersContacts.find(
                                  (user) => user.value === relation.value,
                                ),
                                'name',
                              );
                            }.bind(this),
                          )
                          .filter(String)
                          .join()
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.relation.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={[styles.formRow, { paddingTop: 15 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="Entypo" name="water" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.baptized_by
                      ? this.state.contact.baptized_by.values
                          .map(
                            function(baptizedBy) {
                              return safeFind(
                                this.state.usersContacts.find(
                                  (user) => user.value === baptizedBy.value,
                                ),
                                'name',
                              );
                            }.bind(this),
                          )
                          .filter(String)
                          .join()
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.baptized_by.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={[styles.formRow, { paddingTop: 15 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="Entypo" name="water" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.baptized
                      ? this.state.contact.baptized.values
                          .map(
                            function(baptized) {
                              return safeFind(
                                this.state.usersContacts.find(
                                  (user) => user.value === baptized.value,
                                ),
                                'name',
                              );
                            }.bind(this),
                          )
                          .filter(String)
                          .join()
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.baptized.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={[styles.formRow, { paddingTop: 15 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="black-tie" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.coached_by
                      ? this.state.contact.coached_by.values
                          .map(
                            function(coachedBy) {
                              return safeFind(
                                this.state.usersContacts.find(
                                  (user) => user.value === coachedBy.value,
                                ),
                                'name',
                              );
                            }.bind(this),
                          )
                          .filter(String)
                          .join()
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.coached_by.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={[styles.formRow, { paddingTop: 15 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="MaterialCommunityIcons" name="presentation" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                    {this.state.contact.coaching
                      ? this.state.contact.coaching.values
                          .map(
                            function(coaching) {
                              return safeFind(
                                this.state.usersContacts.find(
                                  (user) => user.value === coaching.value,
                                ),
                                'name',
                              );
                            }.bind(this),
                          )
                          .filter(String)
                          .join()
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.coaching.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
            </View>
          </ScrollView>
        </View>
      ) : (
        <KeyboardShift>
          {() => (
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.formContainer}>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="FontAwesome" name="users" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.groups.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="FontAwesome"
                        name="user-circle"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Selectize
                      ref={(selectize) => {
                        groupsSelectizeRef = selectize;
                      }}
                      itemId="value"
                      items={this.state.groups}
                      selectedItems={
                        this.state.contact.groups
                          ? this.state.contact.groups.values.map((group) => ({
                              name: this.state.groups.find(
                                (groupItem) => groupItem.value === group.value,
                              ).name,
                              value: group.value,
                            }))
                          : []
                      }
                      textInputProps={{
                        placeholder: i18n.t('contactDetailScreen.addGroup'),
                      }}
                      renderRow={(id, onPress, item) => (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          key={id}
                          onPress={onPress}
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.87)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
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
                      inputContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#CCCCCC',
                        padding: 5,
                      }}
                    />
                  </Col>
                </Row>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="Entypo" name="network" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.relation.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="FontAwesome"
                        name="user-circle"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Selectize
                      ref={(selectize) => {
                        connectionsSelectizeRef = selectize;
                      }}
                      itemId="value"
                      items={this.state.usersContacts}
                      selectedItems={
                        this.state.contact.relation
                          ? this.state.contact.relation.values.map((relation) => ({
                              name: this.state.usersContacts.find(
                                (user) => user.value === relation.value,
                              ).name,
                              value: relation.value,
                            }))
                          : []
                      }
                      textInputProps={{
                        placeholder: i18n.t('contactDetailScreen.addConnection'),
                      }}
                      renderRow={(id, onPress, item) => (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          key={id}
                          onPress={onPress}
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.87)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
                              {item.name}
                            </Text>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.54)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
                              {' '}
                              (#
                              {id})
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
                      inputContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#CCCCCC',
                        padding: 5,
                      }}
                    />
                  </Col>
                </Row>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="Entypo" name="water" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.baptized_by.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="FontAwesome"
                        name="user-circle"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Selectize
                      ref={(selectize) => {
                        baptizedBySelectizeRef = selectize;
                      }}
                      itemId="value"
                      items={this.state.usersContacts}
                      selectedItems={
                        this.state.contact.baptized_by
                          ? this.state.contact.baptized_by.values.map((contact) => ({
                              name: this.state.usersContacts.find(
                                (user) => user.value === contact.value,
                              ).name,
                              value: contact.value,
                            }))
                          : []
                      }
                      textInputProps={{
                        placeholder: i18n.t('contactDetailScreen.addBaptizedBy'),
                      }}
                      renderRow={(id, onPress, item) => (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          key={id}
                          onPress={onPress}
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.87)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
                              {item.name}
                            </Text>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.54)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
                              {' '}
                              (#
                              {id})
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
                      inputContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#CCCCCC',
                        padding: 5,
                      }}
                    />
                  </Col>
                </Row>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="Entypo" name="water" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.baptized.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="FontAwesome"
                        name="user-circle"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Selectize
                      ref={(selectize) => {
                        baptizedSelectizeRef = selectize;
                      }}
                      itemId="value"
                      items={this.state.usersContacts}
                      selectedItems={
                        this.state.contact.baptized
                          ? this.state.contact.baptized.values.map((baptizedItem) => ({
                              name: this.state.usersContacts.find(
                                (user) => user.value === baptizedItem.value,
                              ).name,
                              value: baptizedItem.value,
                            }))
                          : []
                      }
                      textInputProps={{
                        placeholder: i18n.t('contactDetailScreen.addBaptized'),
                      }}
                      renderRow={(id, onPress, item) => (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          key={id}
                          onPress={onPress}
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.87)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
                              {item.name}
                            </Text>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.54)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
                              {' '}
                              (#
                              {id})
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
                      inputContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#CCCCCC',
                        padding: 5,
                      }}
                    />
                  </Col>
                </Row>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon type="FontAwesome" name="black-tie" style={styles.formIcon} />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.coached_by.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="FontAwesome"
                        name="user-circle"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Selectize
                      ref={(selectize) => {
                        coachedSelectizeRef = selectize;
                      }}
                      itemId="value"
                      items={this.state.usersContacts}
                      selectedItems={
                        this.state.contact.coached_by
                          ? this.state.contact.coached_by.values.map((contact) => ({
                              name: this.state.usersContacts.find(
                                (user) => user.value === contact.value,
                              ).name,
                              value: contact.value,
                            }))
                          : []
                      }
                      textInputProps={{
                        placeholder: i18n.t('contactDetailScreen.addCoachedBy'),
                      }}
                      renderRow={(id, onPress, item) => (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          key={id}
                          onPress={onPress}
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.87)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
                              {item.name}
                            </Text>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.54)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
                              {' '}
                              (#
                              {id})
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
                      inputContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#CCCCCC',
                        padding: 5,
                      }}
                    />
                  </Col>
                </Row>
                <Row style={styles.formFieldPadding}>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="MaterialCommunityIcons"
                        name="presentation"
                        style={styles.formIcon}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Label style={styles.formLabel}>
                      {this.props.contactSettings.fields.coaching.name}
                    </Label>
                  </Col>
                </Row>
                <Row>
                  <Col style={styles.formIconLabelCol}>
                    <View style={styles.formIconLabelView}>
                      <Icon
                        type="FontAwesome"
                        name="user-circle"
                        style={[styles.formIcon, { opacity: 0 }]}
                      />
                    </View>
                  </Col>
                  <Col>
                    <Selectize
                      ref={(selectize) => {
                        coachingSelectizeRef = selectize;
                      }}
                      itemId="value"
                      items={this.state.usersContacts}
                      selectedItems={
                        this.state.contact.coaching
                          ? this.state.contact.coaching.values.map((contact) => ({
                              name: this.state.usersContacts.find(
                                (user) => user.value === contact.value,
                              ).name,
                              value: contact.value,
                            }))
                          : []
                      }
                      textInputProps={{
                        placeholder: i18n.t('contactDetailScreen.addCoaching'),
                      }}
                      renderRow={(id, onPress, item) => (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          key={id}
                          onPress={onPress}
                          style={{
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                          }}>
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.87)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
                              {item.name}
                            </Text>
                            <Text
                              style={{
                                color: 'rgba(0, 0, 0, 0.54)',
                                fontSize: 14,
                                lineHeight: 21,
                              }}>
                              {' '}
                              (#
                              {id})
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
                      inputContainerStyle={{
                        borderWidth: 1,
                        borderColor: '#CCCCCC',
                        padding: 5,
                      }}
                    />
                  </Col>
                </Row>
              </View>
            </ScrollView>
          )}
        </KeyboardShift>
      )}
    </View>
  );

  transformContactObject = (contact, quickAction = {}) => {
    let transformedContact = {
      ...contact,
    };
    if (
      Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_no_answer') ||
      Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_contact_established') ||
      Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_meeting_scheduled') ||
      Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_meeting_complete') ||
      Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_no_show')
    ) {
      transformedContact = {
        ...transformedContact,
        ...quickAction,
      };
    } else {
      // if property exist, get from json, otherwise, send empty array
      if (subAssignedSelectizeRef) {
        transformedContact = {
          ...transformedContact,
          subassigned: {
            values: this.getSelectizeValuesToSave(
              transformedContact.subassigned ? transformedContact.subassigned.values : [],
              subAssignedSelectizeRef,
            ),
          },
        };
      }
      if (geonamesSelectizeRef) {
        transformedContact = {
          ...transformedContact,
          location_grid: {
            values: this.getSelectizeValuesToSave(
              transformedContact.location_grid ? transformedContact.location_grid.values : [],
              geonamesSelectizeRef,
            ),
          },
        };
      }
      if (peopleGroupsSelectizeRef) {
        transformedContact = {
          ...transformedContact,
          people_groups: {
            values: this.getSelectizeValuesToSave(
              transformedContact.people_groups ? transformedContact.people_groups.values : [],
              peopleGroupsSelectizeRef,
            ),
          },
        };
      }
      if (sourcesSelectizeRef) {
        transformedContact = {
          ...transformedContact,
          sources: {
            values: this.getSelectizeValuesToSave(
              transformedContact.sources ? transformedContact.sources.values : [],
              sourcesSelectizeRef,
            ),
          },
        };
      }
      if (groupsSelectizeRef) {
        transformedContact = {
          ...transformedContact,
          groups: {
            values: this.getSelectizeValuesToSave(
              transformedContact.groups ? transformedContact.groups.values : [],
              groupsSelectizeRef,
            ),
          },
        };
      }
      if (connectionsSelectizeRef) {
        transformedContact = {
          ...transformedContact,
          relation: {
            values: this.getSelectizeValuesToSave(
              transformedContact.relation ? transformedContact.relation.values : [],
              connectionsSelectizeRef,
            ),
          },
        };
      }
      if (baptizedBySelectizeRef) {
        transformedContact = {
          ...transformedContact,
          baptized_by: {
            values: this.getSelectizeValuesToSave(
              transformedContact.baptized_by ? transformedContact.baptized_by.values : [],
              baptizedBySelectizeRef,
            ),
          },
        };
      }
      if (baptizedSelectizeRef) {
        transformedContact = {
          ...transformedContact,
          baptized: {
            values: this.getSelectizeValuesToSave(
              transformedContact.baptized ? transformedContact.baptized.values : [],
              baptizedSelectizeRef,
            ),
          },
        };
      }
      if (coachedSelectizeRef) {
        transformedContact = {
          ...transformedContact,
          coached_by: {
            values: this.getSelectizeValuesToSave(
              transformedContact.coached_by ? transformedContact.coached_by.values : [],
              coachedSelectizeRef,
            ),
          },
        };
      }
      if (coachingSelectizeRef) {
        transformedContact = {
          ...transformedContact,
          coaching: {
            values: this.getSelectizeValuesToSave(
              transformedContact.coaching ? transformedContact.coaching.values : [],
              coachingSelectizeRef,
            ),
          },
        };
      }
    }
    return transformedContact;
  };

  renderActivityOrCommentRow = (commentOrActivity) => (
    <View
      style={{
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'flex-start',
      }}>
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
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 6,
          }}>
          {Object.prototype.hasOwnProperty.call(commentOrActivity, 'content') && (
            <Grid>
              <Row>
                <Col>
                  <Text style={styles.name}>{commentOrActivity.author}</Text>
                </Col>
                <Col style={{ width: 110 }}>
                  <Text style={styles.time}>{this.onFormatDateToView(commentOrActivity.date)}</Text>
                </Col>
              </Row>
            </Grid>
          )}
          {Object.prototype.hasOwnProperty.call(commentOrActivity, 'object_note') && (
            <Grid>
              <Row>
                <Col>
                  <Text style={styles.name}>{commentOrActivity.name}</Text>
                </Col>
                <Col style={{ width: 110 }}>
                  <Text style={styles.time}>{this.onFormatDateToView(commentOrActivity.date)}</Text>
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
          }>
          {Object.prototype.hasOwnProperty.call(commentOrActivity, 'content')
            ? commentOrActivity.content
            : commentOrActivity.object_note}
        </Text>
      </View>
    </View>
  );

  renderSourcePickerItems = () =>
    Object.keys(this.props.contactSettings.fields.sources.values).map((key) => {
      const optionData = this.props.contactSettings.fields.sources.values[key];
      return <Picker.Item key={key} label={optionData.label} value={key} />;
    });

  renderStatusPickerItems = () =>
    Object.keys(this.props.contactSettings.fields.overall_status.values).map((key) => {
      const optionData = this.props.contactSettings.fields.overall_status.values[key];
      return <Picker.Item key={key} label={optionData.label} value={key} />;
    });

  tabChanged = (index) => {
    this.props.navigation.setParams({ hideTabBar: index === 2 });
    this.setState((prevState) => ({
      tabViewConfig: {
        ...prevState.tabViewConfig,
        index,
      },
      renderFab: !(index === 2),
    }));
  };

  onAddPhoneField = () => {
    const contactPhones = this.state.contact.contact_phone
      ? [...this.state.contact.contact_phone]
      : [];
    contactPhones.push({
      value: '',
    });
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        contact_phone: contactPhones,
      },
    }));
  };

  onPhoneFieldChange = (value, index, dbIndex, component) => {
    const phoneAddressList = [...component.state.contact.contact_phone];
    let contactPhone = {
      ...phoneAddressList[index],
    };
    contactPhone = {
      ...contactPhone,
      value,
    };
    if (dbIndex) {
      contactPhone = {
        ...contactPhone,
        key: dbIndex,
      };
    }
    phoneAddressList[index] = {
      ...contactPhone,
    };
    component.setState((prevState) => ({
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
    component.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        contact_phone: contactPhoneList,
      },
    }));
  };

  onAddEmailField = () => {
    const contactEmails = this.state.contact.contact_email ? this.state.contact.contact_email : [];
    contactEmails.push({
      value: '',
    });
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        contact_email: contactEmails,
      },
    }));
  };

  onEmailFieldChange = (value, index, dbIndex, component) => {
    const contactEmailList = [...component.state.contact.contact_email];
    let contactEmail = {
      ...contactEmailList[index],
    };
    contactEmail = {
      ...contactEmail,
      value,
    };
    if (dbIndex) {
      contactEmail = {
        ...contactEmail,
        key: dbIndex,
      };
    }
    contactEmailList[index] = {
      ...contactEmail,
    };
    component.setState((prevState) => ({
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
    component.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        contact_email: contactEmailList,
      },
    }));
  };

  onAddAddressField = () => {
    const contactAddress = this.state.contact.contact_address
      ? this.state.contact.contact_address
      : [];
    contactAddress.push({
      value: '',
    });
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        contact_address: contactAddress,
      },
    }));
  };

  onAddressFieldChange = (value, index, dbIndex, component) => {
    const contactAddressList = [...component.state.contact.contact_address];
    let contactAddress = {
      ...contactAddressList[index],
    };
    contactAddress = {
      ...contactAddress,
      value,
    };
    if (dbIndex) {
      contactAddress = {
        ...contactAddress,
        key: dbIndex,
      };
    }
    contactAddressList[index] = {
      ...contactAddress,
    };
    component.setState((prevState) => ({
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
    component.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        contact_address: contactAddressList,
      },
    }));
  };

  updateShowAssignedToModal = (value) => {
    this.setState({
      showAssignedToModal: value,
    });
  };

  onSelectAssignedTo = (key) => {
    this.setState((prevState) => ({
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
      (user) => `user-${user.key}` === this.state.contact.assigned_to,
    );
    return (
      <Text style={{ marginTop: 'auto', marginBottom: 'auto', fontSize: 15 }}>
        {foundUser ? foundUser.label : ''}
      </Text>
    );
  };

  socialMediaKeyIsDB = (key) => key;

  changeContactSocialMediaType = (value, fieldName, index, component) => {
    const oldList = component.state.contact[fieldName]
      ? [...component.state.contact[fieldName]]
      : [];
    const newList = component.state.contact[`contact_${value}`]
      ? [...component.state.contact[`contact_${value}`]]
      : [];
    // Remove object from oldList
    const socialMedia = { ...oldList[index] };
    if (socialMedia.key) {
      oldList[index] = {
        key: socialMedia.key,
        delete: true,
      };
      delete socialMedia.key;
    } else {
      oldList.splice(index, 1);
    }
    newList.unshift(socialMedia);
    component.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        [fieldName]: oldList,
        [`contact_${value}`]: newList,
      },
    }));
  };

  onRemoveSocialMediaField = (fieldName, index, component) => {
    const socialMediaList = [...component.state.contact[fieldName]];
    let socialMedia = socialMediaList[index];
    if (socialMedia.key) {
      socialMedia = {
        key: socialMedia.key,
        delete: true,
      };
      socialMediaList[index] = socialMedia;
    } else {
      socialMediaList.splice(index, 1);
    }
    component.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        [fieldName]: socialMediaList,
      },
    }));
  };

  onSocialMediaFieldChange = (value, fieldName, index, dbIndex, component) => {
    const socialMediaList = [...component.state.contact[fieldName]];
    let socialMediaElement = {
      ...socialMediaList[index],
      value,
    };
    if (dbIndex) {
      socialMediaElement = {
        ...socialMediaElement,
        key: dbIndex,
      };
    }
    socialMediaList[index] = {
      ...socialMediaElement,
    };
    component.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        [fieldName]: socialMediaList,
      },
    }));
  };

  onAddSocialMediaField = () => {
    const contactSocialMediaFacebookList = this.state.contact.contact_facebook
      ? [...this.state.contact.contact_facebook]
      : [];
    contactSocialMediaFacebookList.push({
      value: '',
    });
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        contact_facebook: contactSocialMediaFacebookList,
      },
    }));
  };

  renderfaithMilestones() {
    return (
      <Grid
        pointerEvents={this.state.onlyView ? 'none' : 'auto'}
        style={{
          height: milestonesGridSize,
        }}>
        <Row size={7}>
          <Col size={1} />
          <Col size={5}>
            <TouchableOpacity
              onPress={() => {
                this.onMilestoneChange('milestone_has_bible');
              }}
              activeOpacity={1}
              style={styles.progressIcon}>
              <Col>
                <Row size={3}>
                  <Image
                    source={hasBibleIcon}
                    style={[
                      styles.progressIcon,
                      this.onCheckExistingMilestone('milestone_has_bible')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}
                  />
                </Row>
                <Row size={1}>
                  <Text
                    style={[
                      styles.progressIconText,
                      this.onCheckExistingMilestone('milestone_has_bible')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}>
                    {this.props.contactSettings.fields.milestones.values.milestone_has_bible.label}
                  </Text>
                </Row>
              </Col>
            </TouchableOpacity>
          </Col>
          <Col size={1} />
          <Col size={5}>
            <TouchableOpacity
              onPress={() => {
                this.onMilestoneChange('milestone_reading_bible');
              }}
              activeOpacity={1}
              style={styles.progressIcon}>
              <Col>
                <Row size={3}>
                  <Image
                    source={readingBibleIcon}
                    style={[
                      styles.progressIcon,
                      this.onCheckExistingMilestone('milestone_reading_bible')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}
                  />
                </Row>
                <Row size={1}>
                  <Text
                    style={[
                      styles.progressIconText,
                      this.onCheckExistingMilestone('milestone_reading_bible')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}>
                    {
                      this.props.contactSettings.fields.milestones.values.milestone_reading_bible
                        .label
                    }
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
              style={styles.progressIcon}>
              <Col>
                <Row size={3}>
                  <Image
                    source={statesBeliefIcon}
                    style={[
                      styles.progressIcon,
                      this.onCheckExistingMilestone('milestone_belief')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}
                  />
                </Row>
                <Row size={1}>
                  <Text
                    style={[
                      styles.progressIconText,
                      this.onCheckExistingMilestone('milestone_belief')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}>
                    {this.props.contactSettings.fields.milestones.values.milestone_belief.label}
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
              style={styles.progressIcon}>
              <Col>
                <Row size={7}>
                  <Image
                    source={canShareGospelIcon}
                    style={[
                      styles.progressIcon,
                      this.onCheckExistingMilestone('milestone_can_share')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}
                  />
                </Row>
                <Row size={3}>
                  <Text
                    style={[
                      styles.progressIconText,
                      this.onCheckExistingMilestone('milestone_can_share')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}>
                    {this.props.contactSettings.fields.milestones.values.milestone_can_share.label}
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
              style={styles.progressIcon}>
              <Col>
                <Row size={7}>
                  <Image
                    source={sharingTheGospelIcon}
                    style={[
                      styles.progressIcon,
                      this.onCheckExistingMilestone('milestone_sharing')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}
                  />
                </Row>
                <Row size={3}>
                  <Text
                    style={[
                      styles.progressIconText,
                      this.onCheckExistingMilestone('milestone_sharing')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}>
                    {this.props.contactSettings.fields.milestones.values.milestone_sharing.label}
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
              style={styles.progressIcon}>
              <Col>
                <Row size={7}>
                  <Image
                    source={baptizedIcon}
                    style={[
                      styles.progressIcon,
                      this.onCheckExistingMilestone('milestone_baptized')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}
                  />
                </Row>
                <Row size={3}>
                  <Text
                    style={[
                      styles.progressIconText,
                      this.onCheckExistingMilestone('milestone_baptized')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}>
                    {this.props.contactSettings.fields.milestones.values.milestone_baptized.label}
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
                this.onMilestoneChange('milestone_baptizing');
              }}
              activeOpacity={1}
              style={styles.progressIcon}>
              <Col>
                <Row size={3}>
                  <Image
                    source={baptizingIcon}
                    style={[
                      styles.progressIcon,
                      this.onCheckExistingMilestone('milestone_baptizing')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}
                  />
                </Row>
                <Row size={1}>
                  <Text
                    style={[
                      styles.progressIconText,
                      this.onCheckExistingMilestone('milestone_baptizing')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}>
                    {this.props.contactSettings.fields.milestones.values.milestone_baptizing.label}
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
              style={styles.progressIcon}>
              <Col>
                <Row size={3}>
                  <Image
                    source={inChurchIcon}
                    style={[
                      styles.progressIcon,
                      this.onCheckExistingMilestone('milestone_in_group')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}
                  />
                </Row>
                <Row size={1}>
                  <Text
                    style={[
                      styles.progressIconText,
                      this.onCheckExistingMilestone('milestone_in_group')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}>
                    {this.props.contactSettings.fields.milestones.values.milestone_in_group.label}
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
              style={styles.progressIcon}>
              <Col>
                <Row size={3}>
                  <Image
                    source={startingChurchesIcon}
                    style={[
                      styles.progressIcon,
                      this.onCheckExistingMilestone('milestone_planting')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}
                  />
                </Row>
                <Row size={1}>
                  <Text
                    style={[
                      styles.progressIconText,
                      this.onCheckExistingMilestone('milestone_planting')
                        ? styles.progressIconActive
                        : styles.progressIconInactive,
                    ]}>
                    {this.props.contactSettings.fields.milestones.values.milestone_planting.label}
                  </Text>
                </Row>
              </Col>
            </TouchableOpacity>
          </Col>
          <Col size={1} />
        </Row>
      </Grid>
    );
  }

  renderCustomFaithMilestones() {
    const milestoneList = Object.keys(this.props.contactSettings.fields.milestones.values);
    const customMilestones = milestoneList.filter(
      (milestoneItem) => defaultFaithMilestones.indexOf(milestoneItem) < 0,
    );
    const rows = [];
    let columnsByRow = [];
    customMilestones.forEach((value, index) => {
      if ((index + 1) % 3 === 0 || index === customMilestones.length - 1) {
        // every third milestone or last milestone
        columnsByRow.push(<Col key={columnsByRow.length} size={1} />);
        columnsByRow.push(
          <Col key={columnsByRow.length} size={5}>
            <TouchableOpacity
              onPress={() => {
                this.onMilestoneChange(value);
              }}
              activeOpacity={1}
              underlayColor={this.onCheckExistingMilestone(value) ? Colors.tintColor : Colors.gray}
              style={{
                borderRadius: 10,
                backgroundColor: this.onCheckExistingMilestone(value)
                  ? Colors.tintColor
                  : Colors.gray,
                padding: 10,
              }}>
              <Text
                style={[
                  styles.progressIconText,
                  {
                    color: this.onCheckExistingMilestone(value) ? '#FFFFFF' : '#000000',
                  },
                ]}>
                {this.props.contactSettings.fields.milestones.values[value].label}
              </Text>
            </TouchableOpacity>
          </Col>,
        );
        columnsByRow.push(<Col key={columnsByRow.length} size={1} />);
        rows.push(
          <Row key={`${index.toString()}-1`} size={1}>
            <Text> </Text>
          </Row>,
        );
        rows.push(
          <Row key={index.toString()} size={7}>
            {columnsByRow}
          </Row>,
        );
        columnsByRow = [];
      } else if ((index + 1) % 3 !== 0) {
        columnsByRow.push(<Col key={columnsByRow.length} size={1} />);
        columnsByRow.push(
          <Col key={columnsByRow.length} size={5}>
            <TouchableHighlight
              onPress={() => {
                this.onMilestoneChange(value);
              }}
              activeOpacity={1}
              underlayColor={this.onCheckExistingMilestone(value) ? Colors.tintColor : Colors.gray}
              style={{
                borderRadius: 10,
                backgroundColor: this.onCheckExistingMilestone(value)
                  ? Colors.tintColor
                  : Colors.gray,
                padding: 10,
              }}>
              <Text
                style={[
                  styles.progressIconText,
                  {
                    color: this.onCheckExistingMilestone(value) ? '#FFFFFF' : '#000000',
                  },
                ]}>
                {this.props.contactSettings.fields.milestones.values[value].label}
              </Text>
            </TouchableHighlight>
          </Col>,
        );
      }
    });
    return <Grid pointerEvents={this.state.onlyView ? 'none' : 'auto'}>{rows}</Grid>;
  }

  renderSocialMediaPickerItems = () =>
    Object.keys(this.props.contactSettings.channels).map((channelName, index) => (
      <Picker.Item
        key={index.toString()}
        label={this.props.contactSettings.channels[channelName].label}
        value={this.props.contactSettings.channels[channelName].value}
      />
    ));

  renderSocialMediaField = (socialMediaIndex, socialMedia, propertyName, channelName) => (
    <Row key={socialMediaIndex.toString()} style={{ marginTop: 10, marginBottom: 10 }}>
      <Col style={styles.formIconLabelCol}>
        <View style={styles.formIconLabelView}>
          <Icon type="Ionicons" name="chatboxes" style={[styles.formIcon, { opacity: 0 }]} />
        </View>
      </Col>
      <Col>
        <Row>
          <Input
            value={socialMedia.value}
            onChangeText={(value) => {
              this.onSocialMediaFieldChange(
                value,
                propertyName,
                socialMediaIndex,
                socialMedia.key,
                this,
              );
            }}
            style={{
              borderBottomWidth: 1,
              borderStyle: 'solid',
              borderBottomColor: '#D9D5DC',
              fontSize: 15,
              height: 40,
            }}
            autoCapitalize="none"
          />
        </Row>
        <Row>
          <Picker
            onValueChange={(value) => {
              this.changeContactSocialMediaType(value, propertyName, socialMediaIndex, this);
            }}
            selectedValue={socialMedia.key ? propertyName.replace('contact_', '') : channelName}
            enabled={!socialMedia.key}>
            {this.renderSocialMediaPickerItems()}
          </Picker>
        </Row>
      </Col>
      <Col style={styles.formIconLabel}>
        <Icon
          android="md-remove"
          ios="ios-remove"
          style={[styles.formIcon, styles.addRemoveIcons, { marginTop: 5 }]}
          onPress={() => {
            this.onRemoveSocialMediaField(propertyName, socialMediaIndex, this);
          }}
        />
      </Col>
    </Row>
  );

  render() {
    const successToast = (
      <Toast
        ref={(toast) => {
          toastSuccess = toast;
        }}
        style={{ backgroundColor: Colors.successBackground }}
        positionValue={210}
      />
    );
    const errorToast = (
      <Toast
        ref={(toast) => {
          toastError = toast;
        }}
        style={{ backgroundColor: Colors.errorBackground }}
        positionValue={210}
      />
    );
    return (
      <View style={{ flex: 1 }}>
        {this.state.loadedLocal && (
          <View style={{ flex: 1 }}>
            {this.state.contact.ID ? (
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                  <TabView
                    navigationState={this.state.tabViewConfig}
                    renderTabBar={(props) => (
                      <TabBar
                        {...props}
                        style={styles.tabStyle}
                        activeColor={Colors.tintColor}
                        inactiveColor={Colors.gray}
                        scrollEnabled
                        tabStyle={{ width: 'auto' }}
                        indicatorStyle={styles.tabBarUnderlineStyle}
                        renderLabel={({ route, color }) => (
                          <Text style={{ color, fontWeight: 'bold' }}>{route.title}</Text>
                        )}
                      />
                    )}
                    renderScene={({ route }) => {
                      switch (route.key) {
                        case 'details':
                          return this.detailView();
                        case 'progress':
                          return this.progressView();
                        case 'comments':
                          return this.commentsView();
                        case 'connections':
                          return this.connectionsView();
                        default:
                          return null;
                      }
                    }}
                    onIndexChange={this.tabChanged}
                    initialLayout={{ width: windowWidth }}
                  />
                  {this.state.renderFab && (
                    <ActionButton
                      buttonColor={Colors.primaryRGBA}
                      renderIcon={(active) =>
                        active ? (
                          <Icon
                            type="MaterialCommunityIcons"
                            name="close"
                            style={{ color: 'white', fontSize: 22 }}
                          />
                        ) : (
                          <Icon
                            type="MaterialCommunityIcons"
                            name="comment-plus"
                            style={{ color: 'white', fontSize: 25 }}
                          />
                        )
                      }
                      degrees={0}
                      activeOpacity={0}
                      bgColor="rgba(0,0,0,0.5)"
                      nativeFeedbackRippleColor="rgba(0,0,0,0)">
                      <ActionButton.Item
                        buttonColor={Colors.primaryRGBA}
                        title={i18n.t('contactDetailScreen.noAnswer')}
                        onPress={() =>
                          this.onSaveContact({
                            quick_button_no_answer: this.state.contact.quick_button_no_answer
                              ? parseInt(this.state.contact.quick_button_no_answer, 10) + 1
                              : 1,
                          })
                        }
                        size={40}
                        nativeFeedbackRippleColor="rgba(0,0,0,0)"
                        textStyle={{ color: Colors.tintColor, fontSize: 15 }}
                        textContainerStyle={{ height: 'auto' }}>
                        <Icon type="Feather" name="phone-off" style={styles.contactFABIcon} />
                      </ActionButton.Item>
                      <ActionButton.Item
                        buttonColor={Colors.primaryRGBA}
                        title={i18n.t('contactDetailScreen.contactEstablished')}
                        onPress={() =>
                          this.onSaveContact({
                            quick_button_contact_established: Object.prototype.hasOwnProperty.call(
                              this.state.contact,
                              'quick_button_contact_established',
                            )
                              ? parseInt(this.state.contact.quick_button_contact_established, 10) +
                                1
                              : 1,
                          })
                        }
                        size={40}
                        nativeFeedbackRippleColor="rgba(0,0,0,0)"
                        textStyle={{ color: Colors.tintColor, fontSize: 15 }}
                        textContainerStyle={{ height: 'auto' }}>
                        <Icon
                          type="MaterialCommunityIcons"
                          name="phone-in-talk"
                          style={styles.contactFABIcon}
                        />
                      </ActionButton.Item>
                      <ActionButton.Item
                        buttonColor={Colors.primaryRGBA}
                        title={i18n.t('contactDetailScreen.meetingScheduled')}
                        onPress={() =>
                          this.onSaveContact({
                            quick_button_meeting_scheduled: Object.prototype.hasOwnProperty.call(
                              this.state.contact,
                              'quick_button_meeting_scheduled',
                            )
                              ? parseInt(this.state.contact.quick_button_meeting_scheduled, 10) + 1
                              : 1,
                          })
                        }
                        size={40}
                        nativeFeedbackRippleColor="rgba(0,0,0,0)"
                        textStyle={{ color: Colors.tintColor, fontSize: 15 }}
                        textContainerStyle={{ height: 'auto' }}>
                        <Icon
                          type="MaterialCommunityIcons"
                          name="calendar-plus"
                          style={styles.contactFABIcon}
                        />
                      </ActionButton.Item>
                      <ActionButton.Item
                        buttonColor={Colors.primaryRGBA}
                        title={i18n.t('contactDetailScreen.meetingCompleted')}
                        onPress={() =>
                          this.onSaveContact({
                            quick_button_meeting_complete: Object.prototype.hasOwnProperty.call(
                              this.state.contact,
                              'quick_button_meeting_complete',
                            )
                              ? parseInt(this.state.contact.quick_button_meeting_complete, 10) + 1
                              : 1,
                          })
                        }
                        size={40}
                        nativeFeedbackRippleColor="rgba(0,0,0,0)"
                        textStyle={{ color: Colors.tintColor, fontSize: 15 }}
                        textContainerStyle={{ height: 'auto' }}>
                        <Icon
                          type="MaterialCommunityIcons"
                          name="calendar-check"
                          style={styles.contactFABIcon}
                        />
                      </ActionButton.Item>
                      <ActionButton.Item
                        buttonColor={Colors.primaryRGBA}
                        title={i18n.t('contactDetailScreen.meetingNoShow')}
                        onPress={() =>
                          this.onSaveContact({
                            quick_button_no_show: Object.prototype.hasOwnProperty.call(
                              this.state.contact,
                              'quick_button_no_show',
                            )
                              ? parseInt(this.state.contact.quick_button_no_show, 10) + 1
                              : 1,
                          })
                        }
                        size={40}
                        nativeFeedbackRippleColor="rgba(0,0,0,0)"
                        textStyle={{ color: Colors.tintColor, fontSize: 15 }}
                        textContainerStyle={{ height: 'auto' }}>
                        <Icon
                          type="MaterialCommunityIcons"
                          name="calendar-remove"
                          style={styles.contactFABIcon}
                        />
                      </ActionButton.Item>
                    </ActionButton>
                  )}
                </View>
              </View>
            ) : (
              <KeyboardShift>
                {() => (
                  <ScrollView keyboardShouldPersistTaps="handled">
                    <View style={styles.formContainer}>
                      <Grid>
                        <Row>
                          <Label style={[styles.formLabel, { marginTop: 10, marginBottom: 5 }]}>
                            {i18n.t('contactDetailScreen.fullName')}
                          </Label>
                        </Row>
                        <Row>
                          <Input
                            placeholder={i18n.t('global.requiredField')}
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
                          <Label style={[styles.formLabel, { marginTop: 10, marginBottom: 5 }]}>
                            {i18n.t('contactDetailScreen.phoneNumber')}
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
                          <Label style={[styles.formLabel, { marginTop: 10, marginBottom: 5 }]}>
                            {i18n.t('contactDetailScreen.email')}
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
                          <Label style={[styles.formLabel, { marginTop: 10, marginBottom: 5 }]}>
                            {this.props.contactSettings.fields.sources.name}
                          </Label>
                        </Row>
                        <Row>
                          <Picker
                            onValueChange={this.setContactSource}
                            selectedValue={this.state.contact.sources.values[0].value}>
                            {this.renderSourcePickerItems()}
                          </Picker>
                        </Row>
                        <Row>
                          <Label style={[styles.formLabel, { marginTop: 10, marginBottom: 5 }]}>
                            {this.props.contactSettings.fields.location_grid.name}
                          </Label>
                        </Row>
                        <Row>
                          <Col style={{ paddingLeft: 10, paddingRight: 10 }}>
                            <Selectize
                              ref={(selectize) => {
                                geonamesSelectizeRef = selectize;
                              }}
                              itemId="value"
                              items={this.state.geonames}
                              selectedItems={[]}
                              textInputProps={{
                                placeholder: i18n.t('contactDetailScreen.selectLocations'),
                              }}
                              renderRow={(id, onPress, item) => (
                                <TouchableOpacity
                                  activeOpacity={0.6}
                                  key={id}
                                  onPress={onPress}
                                  style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 10,
                                  }}>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                    }}>
                                    <Text
                                      style={{
                                        color: 'rgba(0, 0, 0, 0.87)',
                                        fontSize: 14,
                                        lineHeight: 21,
                                      }}>
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
                              inputContainerStyle={{
                                borderWidth: 1,
                                borderColor: '#CCCCCC',
                                padding: 5,
                              }}
                            />
                          </Col>
                        </Row>
                        <Row>
                          <Label style={[styles.formLabel, { marginTop: 10, marginBottom: 5 }]}>
                            {i18n.t('contactDetailScreen.initialComment')}
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
                      <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={this.showMoreFields}
                        style={{
                          paddingVertical: 8,
                        }}>
                        <Label
                          style={{
                            color: Colors.tintColor,
                            fontSize: 12,
                            fontWeight: 'bold',
                            marginTop: 20,
                          }}>
                          {i18n.t('global.moreFields')}
                        </Label>
                      </TouchableOpacity>
                      {this.state.moreFields ? (
                        <Grid>
                          <View>
                            <Label
                              style={[
                                {
                                  color: Colors.tintColor,
                                  fontSize: 12,
                                  fontWeight: 'bold',
                                  marginTop: 10,
                                },
                                styles.formFieldPadding,
                              ]}>
                              {this.props.contactSettings.fields.overall_status.name}
                            </Label>
                            <Row style={{ paddingBottom: 30 }}>
                              <Col>
                                <Picker
                                  selectedValue={this.state.contact.overall_status}
                                  onValueChange={this.setContactStatus}
                                  style={
                                    Platform.OS === 'android'
                                      ? {
                                          color: '#ffffff',
                                          backgroundColor: this.state.overallStatusBackgroundColor,
                                        }
                                      : {
                                          backgroundColor: this.state.overallStatusBackgroundColor,
                                        }
                                  }>
                                  {this.renderStatusPickerItems()}
                                </Picker>
                              </Col>
                            </Row>
                          </View>
                          <Row style={styles.formFieldPadding}>
                            <Col style={styles.formIconLabelCol}>
                              <View style={styles.formIconLabelView}>
                                <Icon android="md-male" ios="ios-male" style={styles.formIcon} />
                              </View>
                            </Col>
                            <Col>
                              <Label style={styles.formLabel}>
                                {this.props.contactSettings.fields.gender.name}
                              </Label>
                            </Col>
                          </Row>
                          <Row>
                            <Col style={styles.formIconLabelCol}>
                              <View style={styles.formIconLabelView}>
                                <Icon
                                  android="md-male"
                                  ios="ios-male"
                                  style={[styles.formIcon, { opacity: 0 }]}
                                />
                              </View>
                            </Col>
                            <Col>
                              <Picker
                                mode="dropdown"
                                selectedValue={this.state.contact.gender}
                                onValueChange={this.setContactGender}>
                                {Object.keys(this.props.contactSettings.fields.gender.values).map(
                                  (key) => {
                                    const optionData = this.props.contactSettings.fields.gender
                                      .values[key];
                                    return (
                                      <Picker.Item key={key} label={optionData.label} value={key} />
                                    );
                                  },
                                )}
                              </Picker>
                            </Col>
                          </Row>
                          <Row style={styles.formFieldPadding}>
                            <Col style={styles.formIconLabelCol}>
                              <View style={styles.formIconLabelView}>
                                <Icon type="FontAwesome" name="globe" style={styles.formIcon} />
                              </View>
                            </Col>
                            <Col>
                              <Label style={styles.formLabel}>
                                {this.props.contactSettings.fields.people_groups.name}
                              </Label>
                            </Col>
                          </Row>
                          <Row>
                            <Col style={styles.formIconLabelCol}>
                              <View style={styles.formIconLabelView}>
                                <Icon
                                  type="FontAwesome"
                                  name="globe"
                                  style={[styles.formIcon, { opacity: 0 }]}
                                />
                              </View>
                            </Col>
                            <Col>
                              <Selectize
                                ref={(selectize) => {
                                  peopleGroupsSelectizeRef = selectize;
                                }}
                                itemId="value"
                                items={this.state.peopleGroups}
                                selectedItems={
                                  this.state.contact.people_groups
                                    ? this.state.contact.people_groups.values.map(
                                        (peopleGroup) => ({
                                          name: this.state.peopleGroups.find(
                                            (person) => person.value === peopleGroup.value,
                                          ).name,
                                          value: peopleGroup.value,
                                        }),
                                      )
                                    : []
                                }
                                textInputProps={{
                                  placeholder: i18n.t('global.selectPeopleGroups'),
                                }}
                                renderRow={(id, onPress, item) => (
                                  <TouchableOpacity
                                    activeOpacity={0.6}
                                    key={id}
                                    onPress={onPress}
                                    style={{
                                      paddingVertical: 8,
                                      paddingHorizontal: 10,
                                    }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                      }}>
                                      <Text
                                        style={{
                                          color: 'rgba(0, 0, 0, 0.87)',
                                          fontSize: 14,
                                          lineHeight: 21,
                                        }}>
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
                                inputContainerStyle={{
                                  borderWidth: 1,
                                  borderColor: '#CCCCCC',
                                  padding: 5,
                                }}
                              />
                            </Col>
                          </Row>
                          <Row style={styles.formFieldPadding}>
                            <Col style={styles.formIconLabelCol}>
                              <View style={styles.formIconLabelView}>
                                <Icon type="FontAwesome" name="clock-o" style={styles.formIcon} />
                              </View>
                            </Col>
                            <Col>
                              <Label style={styles.formLabel}>
                                {this.props.contactSettings.fields.age.name}
                              </Label>
                            </Col>
                          </Row>
                          <Row>
                            <Col style={styles.formIconLabelCol}>
                              <View style={styles.formIconLabelView}>
                                <Icon
                                  type="FontAwesome"
                                  name="clock-o"
                                  style={[styles.formIcon, { opacity: 0 }]}
                                />
                              </View>
                            </Col>
                            <Col>
                              <Picker
                                mode="dropdown"
                                selectedValue={this.state.contact.age}
                                onValueChange={this.setContactAge}>
                                {Object.keys(this.props.contactSettings.fields.age.values).map(
                                  (key) => {
                                    const optionData = this.props.contactSettings.fields.age.values[
                                      key
                                    ];
                                    return (
                                      <Picker.Item key={key} label={optionData.label} value={key} />
                                    );
                                  },
                                )}
                              </Picker>
                            </Col>
                          </Row>
                          <TouchableOpacity
                            onPress={() => {
                              this.updateShowAssignedToModal(true);
                            }}>
                            <Row style={styles.formFieldPadding}>
                              <Col style={styles.formIconLabelCol}>
                                <View style={styles.formIconLabelView}>
                                  <Icon
                                    type="FontAwesome"
                                    name="user-circle"
                                    style={styles.formIcon}
                                  />
                                </View>
                              </Col>
                              <Col>
                                <Label style={styles.formLabel}>
                                  {this.props.contactSettings.fields.assigned_to.name}
                                </Label>
                              </Col>
                            </Row>
                            <Row>
                              <Col style={styles.formIconLabelCol}>
                                <View style={styles.formIconLabelView}>
                                  <Icon
                                    type="FontAwesome"
                                    name="user-circle"
                                    style={[styles.formIcon, { opacity: 0 }]}
                                  />
                                </View>
                              </Col>
                              <Col
                                style={{
                                  borderBottomWidth: 1,
                                  borderStyle: 'solid',
                                  borderBottomColor: '#D9D5DC',
                                }}>
                                {this.showAssignedUser()}
                                <ModalFilterPicker
                                  visible={this.state.showAssignedToModal}
                                  onSelect={this.onSelectAssignedTo}
                                  onCancel={this.onCancelAssignedTo}
                                  options={this.state.users}
                                />
                              </Col>
                            </Row>
                          </TouchableOpacity>

                          <Row style={styles.formFieldPadding}>
                            <Col style={styles.formIconLabelCol}>
                              <View style={styles.formIconLabelView}>
                                <Icon type="Ionicons" name="chatboxes" style={styles.formIcon} />
                              </View>
                            </Col>
                            <Col>
                              <Label style={styles.formLabel}>
                                {i18n.t('contactDetailScreen.socialMedia')}
                              </Label>
                            </Col>
                            <Col style={styles.formIconLabel}>
                              <Icon
                                android="md-add"
                                ios="ios-add"
                                style={[styles.formIcon, styles.addRemoveIcons]}
                                onPress={this.onAddSocialMediaField}
                              />
                            </Col>
                          </Row>
                          {Object.keys(this.props.contactSettings.channels).map(
                            (channelName, channelNameIndex) => {
                              const propertyName = `contact_${channelName}`;
                              return (
                                <Col key={channelNameIndex.toString()}>
                                  {this.state.contact[propertyName]
                                    ? this.state.contact[
                                        propertyName
                                      ].map((socialMedia, socialMediaIndex) =>
                                        !socialMedia.key
                                          ? this.renderSocialMediaField(
                                              socialMediaIndex,
                                              socialMedia,
                                              propertyName,
                                              channelName,
                                            )
                                          : null,
                                      )
                                    : null}
                                </Col>
                              );
                            },
                          )}
                          {Object.keys(this.props.contactSettings.channels).map(
                            (channelName, channelNameIndex) => {
                              const propertyName = `contact_${channelName}`;
                              return (
                                <Col key={channelNameIndex.toString()}>
                                  {this.state.contact[propertyName]
                                    ? this.state.contact[
                                        propertyName
                                      ].map((socialMedia, socialMediaIndex) =>
                                        socialMedia.key && !socialMedia.delete
                                          ? this.renderSocialMediaField(
                                              socialMediaIndex,
                                              socialMedia,
                                              propertyName,
                                              channelName,
                                            )
                                          : null,
                                      )
                                    : null}
                                </Col>
                              );
                            },
                          )}

                          <Row style={styles.formFieldPadding}>
                            <Col style={styles.formIconLabelCol}>
                              <View style={styles.formIconLabelView}>
                                <Icon type="FontAwesome" name="users" style={styles.formIcon} />
                              </View>
                            </Col>
                            <Col>
                              <Label style={styles.formLabel}>
                                {this.props.contactSettings.fields.groups.name}
                              </Label>
                            </Col>
                          </Row>
                          <Row>
                            <Col style={styles.formIconLabelCol}>
                              <View style={styles.formIconLabelView}>
                                <Icon
                                  type="FontAwesome"
                                  name="user-circle"
                                  style={[styles.formIcon, { opacity: 0 }]}
                                />
                              </View>
                            </Col>
                            <Col>
                              <Selectize
                                ref={(selectize) => {
                                  groupsSelectizeRef = selectize;
                                }}
                                itemId="value"
                                items={this.state.groups}
                                selectedItems={
                                  this.state.contact.groups
                                    ? this.state.contact.groups.values.map((group) => ({
                                        name: this.state.groups.find(
                                          (groupItem) => groupItem.value === group.value,
                                        ).name,
                                        value: group.value,
                                      }))
                                    : []
                                }
                                textInputProps={{
                                  placeholder: i18n.t('contactDetailScreen.addGroup'),
                                }}
                                renderRow={(id, onPress, item) => (
                                  <TouchableOpacity
                                    activeOpacity={0.6}
                                    key={id}
                                    onPress={onPress}
                                    style={{
                                      paddingVertical: 8,
                                      paddingHorizontal: 10,
                                    }}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                      }}>
                                      <Text
                                        style={{
                                          color: 'rgba(0, 0, 0, 0.87)',
                                          fontSize: 14,
                                          lineHeight: 21,
                                        }}>
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
                                inputContainerStyle={{
                                  borderWidth: 1,
                                  borderColor: '#CCCCCC',
                                  padding: 5,
                                }}
                              />
                            </Col>
                          </Row>
                        </Grid>
                      ) : (
                        <Text />
                      )}
                      <Button block style={styles.saveButton} onPress={this.onSaveContact}>
                        <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>
                          {i18n.t('global.save')}
                        </Text>
                      </Button>
                    </View>
                  </ScrollView>
                )}
              </KeyboardShift>
            )}
          </View>
        )}
        {successToast}
        {errorToast}
      </View>
    );
  }
}

ContactDetailScreen.propTypes = {
  userData: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  contact: PropTypes.shape({
    ID: PropTypes.any,
    title: PropTypes.string,
    seeker_path: PropTypes.string,
    oldID: PropTypes.string,
  }),
  userReducerError: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.any,
  }),
  newComment: PropTypes.shape({
    ID: PropTypes.string,
    author: PropTypes.string,
    content: PropTypes.string,
    date: PropTypes.string,
    gravatar: PropTypes.string,
  }),
  contactsReducerError: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.any,
  }),
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        onlyView: PropTypes.any,
        contactId: PropTypes.any,
        contactName: PropTypes.string,
      }),
    }),
  }).isRequired,
  saveContact: PropTypes.func.isRequired,
  getById: PropTypes.func.isRequired,
  getComments: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  getActivities: PropTypes.func.isRequired,
  saved: PropTypes.bool,
  isConnected: PropTypes.bool,
  endSaveContact: PropTypes.func.isRequired,
  getByIdEnd: PropTypes.func.isRequired,
  contactSettings: PropTypes.shape({
    fields: PropTypes.shape({
      sources: PropTypes.shape({
        name: PropTypes.string,
        values: PropTypes.shape({}),
      }),
      overall_status: PropTypes.shape({
        name: PropTypes.string,
        values: PropTypes.shape({}),
      }),
      milestones: PropTypes.shape({
        name: PropTypes.string,
        values: PropTypes.shape({
          milestone_has_bible: PropTypes.shape({
            label: PropTypes.string,
          }),
          milestone_reading_bible: PropTypes.shape({
            label: PropTypes.string,
          }),
          milestone_belief: PropTypes.shape({
            label: PropTypes.string,
          }),
          milestone_can_share: PropTypes.shape({
            label: PropTypes.string,
          }),
          milestone_sharing: PropTypes.shape({
            label: PropTypes.string,
          }),
          milestone_baptized: PropTypes.shape({
            label: PropTypes.string,
          }),
          milestone_baptizing: PropTypes.shape({
            label: PropTypes.string,
          }),
          milestone_in_group: PropTypes.shape({
            label: PropTypes.string,
          }),
          milestone_planting: PropTypes.shape({
            label: PropTypes.string,
          }),
        }),
      }),
      assigned_to: PropTypes.shape({
        name: PropTypes.string,
        values: PropTypes.shape({}),
      }),
      subassigned: PropTypes.shape({
        name: PropTypes.string,
        values: PropTypes.shape({}),
      }),
      location_grid: PropTypes.shape({
        name: PropTypes.string,
        values: PropTypes.shape({}),
      }),
      people_groups: PropTypes.shape({
        name: PropTypes.string,
        values: PropTypes.shape({}),
      }),
      age: PropTypes.shape({
        name: PropTypes.string,
        values: PropTypes.shape({}),
      }),
      gender: PropTypes.shape({
        name: PropTypes.string,
        values: PropTypes.shape({}),
      }),
      seeker_path: PropTypes.shape({
        name: PropTypes.string,
        values: PropTypes.shape({}),
      }),
      baptism_date: PropTypes.shape({
        name: PropTypes.string,
      }),
      groups: PropTypes.shape({
        name: PropTypes.string,
      }),
      relation: PropTypes.shape({
        name: PropTypes.string,
      }),
      baptized_by: PropTypes.shape({
        name: PropTypes.string,
      }),
      baptized: PropTypes.shape({
        name: PropTypes.string,
      }),
      coached_by: PropTypes.shape({
        name: PropTypes.string,
      }),
      coaching: PropTypes.shape({
        name: PropTypes.string,
      }),
    }),
    channels: PropTypes.shape({}),
  }),
};

ContactDetailScreen.defaultProps = {
  contact: null,
  userReducerError: null,
  newComment: null,
  contactsReducerError: null,
  saved: null,
  isConnected: null,
  contactSettings: null,
};

const mapStateToProps = (state) => ({
  userData: state.userReducer.userData,
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
  saved: state.contactsReducer.saved,
  isConnected: state.networkConnectivityReducer.isConnected,
  contactSettings: state.contactsReducer.settings,
});

const mapDispatchToProps = (dispatch) => ({
  saveContact: (domain, token, contactDetail) => {
    dispatch(save(domain, token, contactDetail));
  },
  getById: (domain, token, contactId) => {
    dispatch(getById(domain, token, contactId));
  },
  getByIdEnd: () => {
    dispatch(getByIdEnd());
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
  endSaveContact: () => {
    dispatch(saveEnd());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetailScreen);
