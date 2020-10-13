import React from 'react';
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
  RefreshControl,
  Platform,
  TouchableHighlight,
  Linking,
  BackHandler,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';
import { connect } from 'react-redux';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import PropTypes from 'prop-types';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Label, Input, Icon, Picker, DatePicker, Textarea, Button } from 'native-base';
import Toast from 'react-native-easy-toast';
import { Col, Row, Grid } from 'react-native-easy-grid';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import { Chip, Selectize } from 'react-native-material-selectize';
import ActionButton from 'react-native-action-button';
import { TabView, TabBar } from 'react-native-tab-view';
import { NavigationActions, StackActions } from 'react-navigation';
import MentionsTextInput from 'react-native-mentions';
import ParsedText from 'react-native-parsed-text';
//import * as Sentry from 'sentry-expo';
import { BlurView } from 'expo-blur';
import { CheckBox } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Html5Entities } from 'html-entities';

import moment from '../../languages/moment';
import sharedTools from '../../shared';
import {
  save,
  getCommentsByContact,
  saveComment,
  getById,
  getByIdEnd,
  getActivitiesByContact,
  saveEnd,
  deleteComment,
  loadingFalse,
  updatePrevious,
} from '../../store/actions/contacts.actions';
import { updatePrevious as updatePreviousGroups } from '../../store/actions/groups.actions';
import Colors from '../../constants/Colors';
import statusIcon from '../../assets/icons/status.png';
import hasBibleIcon from '../../assets/icons/book-bookmark.png';
import readingBibleIcon from '../../assets/icons/word.png';
import statesBeliefIcon from '../../assets/icons/language.png';
import canShareGospelIcon from '../../assets/icons/b-chat.png';
import sharingTheGospelIcon from '../../assets/icons/evangelism.png';
import baptizedIcon from '../../assets/icons/baptism.png';
import baptizingIcon from '../../assets/icons/water-aerobics.png';
import inChurchIcon from '../../assets/icons/group.png';
import dtIcon from '../../assets/images/dt-icon.png';
import startingChurchesIcon from '../../assets/icons/group-starting.png';
import i18n from '../../languages';
import { searchLocations } from '../../store/actions/groups.actions';

let toastSuccess;
let toastError;
const containerPadding = 20;
const windowWidth = Dimensions.get('window').width;
const progressBarWidth = windowWidth - 100;
const milestonesGridSize = windowWidth + 5;
const windowHeight = Dimensions.get('window').height;
let keyboardDidShowListener, keyboardDidHideListener, focusListener, hardwareBackPressListener;
//const hasNotch = Platform.OS === 'android' && StatusBar.currentHeight > 25;
//const extraNotchHeight = hasNotch ? StatusBar.currentHeight : 0;
const isIOS = Platform.OS === 'ios';
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
  coachingSelectizeRef,
  datePickerRef;
/* eslint-enable */
const entities = new Html5Entities();
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
let tabViewRoutes = [
  {
    key: 'details',
    title: 'global.details',
  },
  {
    key: 'progress',
    title: 'global.progress',
  },
  {
    key: 'comments',
    title: 'global.commentsActivity',
  },
  {
    key: 'connections',
    title: 'contactDetailScreen.connections',
  },
];
let self;
const styles = StyleSheet.create({
  tabBarUnderlineStyle: {
    backgroundColor: Colors.tintColor,
  },
  tabStyle: { backgroundColor: '#FFFFFF' },
  textStyle: { color: 'gray' },
  fieldsIcons: {
    height: 22,
    width: 22,
  },
  addRemoveIcons: {
    fontSize: 30,
    marginRight: 0,
    color: Colors.addRemoveIcons,
  },
  addIcons: { color: 'green' },
  removeIcons: { color: 'red' },
  // Social Media Field
  socialMediaNames: {
    color: Colors.grayDark,
    fontSize: 12,
  },
  // Form
  formContainer: {
    paddingTop: 10,
    paddingBottom: 100,
    paddingLeft: containerPadding,
    paddingRight: containerPadding,
  },
  formRow: {
    paddingTop: 15,
    paddingBottom: 15,
    width: '100%',
  },
  formIconLabel: {
    marginLeft: 10,
    width: 'auto',
    marginBottom: 'auto',
  },
  formIcon: {
    color: Colors.tintColor,
    fontSize: 22,
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
  },
  formIconLabelCol: {
    width: 35,
  },
  formIconLabelView: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  formFieldMargin: {
    marginTop: 20,
    marginBottom: 10,
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
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.mainBackgroundColor,
  },
  image: {
    height: 16,
    marginTop: 10,
    width: 16,
  },
  content: {
    backgroundColor: Colors.contentBackgroundColor,
    borderRadius: 5,
    flex: 1,
    marginLeft: 16,
    padding: 10,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  name: {
    color: Colors.tintColor,
    fontSize: 13,
    fontWeight: 'bold',
  },
  time: {
    color: Colors.tintColor,
    fontSize: 10,
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
  noCommentsContainer: {
    padding: 20,
    height: '90%',
    transform: [{ scaleY: -1 }],
  },
  noCommentsImage: {
    opacity: 0.5,
    height: 70,
    width: 70,
    padding: 10,
  },
  noCommentsText: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#A8A8A8',
    marginTop: 10,
  },
  contactTextField: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B4B4B4',
    height: 50,
    fontSize: 15,
  },
  contactTextRoundField: {
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: '#B4B4B4',
    height: 50,
    fontSize: 15,
  },
  selectizeField: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B4B4B4',
    borderBottomWidth: 1.5,
    borderBottomColor: '#B4B4B4',
    borderRadius: 5,
    minHeight: 50,
    marginTop: -15,
    padding: 10,
  },
  linkingText: {
    paddingTop: 4,
    paddingBottom: 8,
    textDecorationLine: 'underline',
  },
  statusFieldContainer: Platform.select({
    default: {
      borderStyle: 'solid',
      borderWidth: 2,
      borderRadius: 3,
    },
    ios: {},
  }),
  validationErrorMessage: {
    color: Colors.errorBackground,
  },
  suggestionsRowContainer: {
    flexDirection: 'row',
  },
  userIconBox: {
    height: 45,
    width: 45,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.tintColor,
  },
  usernameInitials: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  userDetailsBox: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    paddingRight: 15,
  },
  displayNameText: {
    fontSize: 13,
    fontWeight: '500',
  },
  usernameText: {
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
  // Edit/Delete comment dialog
  dialogBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  dialogBox: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
    height: windowHeight - windowHeight * 0.55,
    width: windowWidth - windowWidth * 0.1,
    marginTop: windowHeight * 0.1,
  },
  dialogButton: {
    backgroundColor: Colors.tintColor,
    borderRadius: 5,
    width: 100,
    marginTop: 20,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  dialogContent: {
    height: '100%',
    width: '100%',
    fontSize: 20,
    textAlign: 'center',
    color: Colors.grayDark,
    marginBottom: 5,
  },
  dialogComment: {
    borderWidth: 1,
    borderRadius: 5,
    borderStyle: 'solid',
    borderColor: '#B4B4B4',
    color: Colors.tintColor,
  },
  commentsActionButtons: {
    borderRadius: 80,
    height: 40,
    width: 40,
    marginBottom: 10,
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

const initialState = {
  contact: {},
  unmodifiedContact: {},
  users: [],
  usersContacts: [],
  groups: [],
  peopleGroups: [],
  geonames: [],
  loadedLocal: false,
  comments: {
    data: [],
    pagination: {
      limit: 10,
      offset: 0,
      total: 0,
    },
  },
  loadComments: false,
  loadingMoreComments: false,
  activities: {
    data: [],
    pagination: {
      limit: 10,
      offset: 0,
      total: 0,
    },
  },
  loadActivities: false,
  loadingMoreActivities: false,
  comment: '',
  progressBarValue: 0,
  overallStatusBackgroundColor: '#ffffff',
  showAssignedToModal: false,
  loading: false,
  moreFields: false,
  tabViewConfig: {
    index: 0,
    routes: [...tabViewRoutes],
  },
  foundGeonames: [],
  footerLocation: 0,
  footerHeight: 0,
  nameRequired: false,
  executingBack: false,
  keyword: '',
  suggestedUsers: [],
  height: sharedTools.commentFieldMinHeight,
  sources: [],
  nonExistingSources: [],
  unmodifiedSources: [],
  subAssignedContacts: [],
  unmodifiedSubAssignedContacts: [],
  relationContacts: [],
  unmodifiedRelationContacts: [],
  baptizedByContacts: [],
  unmodifiedBaptizedByContacts: [],
  baptizedContacts: [],
  unmodifiedBaptizedContacts: [],
  coachedByContacts: [],
  unmodifiedCoachedByContacts: [],
  coachedContacts: [],
  unmodifiedCoachedContacts: [],
  connectionGroups: [],
  unmodifiedConnectionGroups: [],
  assignedToContacts: [],
  unmodifedAssignedToContacts: [],
  commentDialog: {
    toggle: false,
    data: {},
    delete: false,
  },
  showFilterView: false,
  filtersSettings: {
    showComments: true,
    showActivities: true,
  },
};

const safeFind = (found, prop) => {
  if (typeof found === 'undefined') return '';
  return found[prop];
};

class ContactDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    self = this;
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let navigationTitle = Object.prototype.hasOwnProperty.call(params, 'contactName')
      ? params.contactName
      : i18n.t('contactDetailScreen.addNewContact');
    let headerRight = () => (
      <Row onPress={params.onSaveContact}>
        <Text style={{ color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' }}>
          {i18n.t('global.save')}
        </Text>
        <Icon
          type="Feather"
          name="check"
          style={[
            { color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' },
            self && self.props.isRTL ? { paddingLeft: 16 } : { paddingRight: 16 },
          ]}
        />
      </Row>
    );
    let headerLeft;

    if (params) {
      if (params.onEnableEdit && params.contactId && params.onlyView) {
        headerRight = () => (
          <Row onPress={params.onEnableEdit}>
            <Text
              style={{ color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' }}>
              {i18n.t('global.edit')}
            </Text>
            <Icon
              type="MaterialCommunityIcons"
              name="pencil"
              style={[
                { color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' },
                self && self.props.isRTL ? { paddingLeft: 16 } : { paddingRight: 16 },
              ]}
            />
          </Row>
        );
      }
      if (params.onlyView) {
        headerLeft = () => (
          <Icon
            type="Feather"
            name="arrow-left"
            onPress={params.backButtonTap}
            style={{ paddingLeft: 16, color: Colors.headerTintColor, paddingRight: 16 }}
          />
        );
      } else {
        headerLeft = () => (
          <Row onPress={params.onDisableEdit}>
            <Icon
              type="AntDesign"
              name="close"
              style={[
                { color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' },
                self && self.props.isRTL ? { paddingRight: 16 } : { paddingLeft: 16 },
              ]}
            />
            <Text
              style={{ color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' }}>
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
      headerTintColor: Colors.headerTintColor,
      headerTitleStyle: {
        fontWeight: 'bold',
        width: params.onlyView
          ? Platform.select({
              android: 200,
              ios: 180,
            })
          : Platform.select({
              android: 180,
              ios: 140,
            }),
        marginLeft: params.onlyView ? undefined : 25,
      },
    };
  };

  state = {
    ...initialState,
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.onLoad();

    let params = {
      onEnableEdit: this.onEnableEdit.bind(this),
      onDisableEdit: this.onDisableEdit.bind(this),
      onSaveContact: this.onSaveContact.bind(this),
      backButtonTap: this.backButtonTap.bind(this),
    };
    // Add afterBack param to execute 'parents' functions (ContactsView, NotificationsView)
    if (!navigation.state.params.afterBack) {
      params = {
        ...params,
        afterBack: this.afterBack.bind(this),
      };
    }
    navigation.setParams(params);

    keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow.bind(this),
    );
    keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide.bind(this),
    );
    focusListener = navigation.addListener('didFocus', () => {
      //Focus on 'detail mode' (going back or open detail view)
      if (typeof this.props.navigation.state.params.contactId !== 'undefined') {
        this.props.loadingFalse();
        this.onRefresh(this.props.navigation.state.params.contactId, true);
      }
    });
    // Android bottom back button listener
    hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.state.params.backButtonTap();
      return true;
    });
  }

  componentDidCatch(error, errorInfo) {
    //Sentry.captureException(errorInfo);
  }

  componentWillUnmount() {
    keyboardDidShowListener.remove();
    keyboardDidHideListener.remove();
    focusListener.remove();
    hardwareBackPressListener.remove();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      contact,
      loading,
      comments,
      loadingComments,
      activities,
      loadingActivities,
      foundGeonames,
    } = nextProps;
    let newState = {
      ...prevState,
      loading,
      comments: prevState.comments,
      loadComments: loadingComments,
      activities: prevState.activities,
      loadActivities: loadingActivities,
      contact: prevState.contact,
      unmodifiedContact: prevState.unmodifiedContact,
    };

    // SAVE / GET BY ID
    if (contact) {
      newState = {
        ...newState,
        contact: {
          ...contact,
        },
        unmodifiedContact: {
          ...contact,
        },
      };
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
      if (newState.contact.sources) {
        newState.contact.sources.values.forEach((sourceContact) => {
          const foundSource = newState.sources.find(
            (sourceItem) => sourceItem.value === sourceContact.value,
          );
          if (!foundSource) {
            // Add non existent contact source in sources list to avoid null exception
            newState = {
              ...newState,
              sources: [
                ...newState.sources,
                {
                  name: sourceContact.value,
                  value: sourceContact.value,
                },
              ],
              nonExistingSources: [
                ...newState.nonExistingSources,
                {
                  name: sourceContact.value,
                  value: sourceContact.value,
                },
              ],
              unmodifiedSources: [
                ...newState.unmodifiedSources,
                {
                  name: sourceContact.value,
                  value: sourceContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.subassigned) {
        // Clear collection
        newState = {
          ...newState,
          subAssignedContacts: [],
        };

        newState.contact.subassigned.values.forEach((subassignedContact) => {
          const foundSubassigned = newState.usersContacts.find(
            (user) => user.value === subassignedContact.value,
          );
          if (!foundSubassigned) {
            // Add non existent contact subassigned in subassigned list (user does not have access permission to this contacts)
            newState = {
              ...newState,
              subAssignedContacts: [
                ...newState.subAssignedContacts,
                {
                  name: subassignedContact.name,
                  value: subassignedContact.value,
                },
              ],
              unmodifiedSubAssignedContacts: [
                ...newState.unmodifiedSubAssignedContacts,
                {
                  name: subassignedContact.name,
                  value: subassignedContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.relation) {
        // Clear collection
        newState = {
          ...newState,
          relationContacts: [],
        };

        newState.contact.relation.values.forEach((relationContact) => {
          const foundRelation = newState.usersContacts.find(
            (user) => user.value === relationContact.value,
          );
          if (!foundRelation) {
            // Add non existent contact relation in relation list (user does not have access permission to this contacts)
            newState = {
              ...newState,
              relationContacts: [
                ...newState.relationContacts,
                {
                  name: relationContact.name,
                  value: relationContact.value,
                },
              ],
              unmodifiedRelationContacts: [
                ...newState.unmodifiedRelationContacts,
                {
                  name: relationContact.name,
                  value: relationContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.baptized_by) {
        // Clear collection
        newState = {
          ...newState,
          baptizedByContacts: [],
        };

        newState.contact.baptized_by.values.forEach((baptizedByContact) => {
          const foundBaptized = newState.usersContacts.find(
            (user) => user.value === baptizedByContact.value,
          );
          if (!foundBaptized) {
            // Add non existent contact relation in relation list (user does not have access permission to this contacts)
            newState = {
              ...newState,
              baptizedByContacts: [
                ...newState.baptizedByContacts,
                {
                  name: baptizedByContact.name,
                  value: baptizedByContact.value,
                },
              ],
              unmodifiedBaptizedByContacts: [
                ...newState.unmodifiedBaptizedByContacts,
                {
                  name: baptizedByContact.name,
                  value: baptizedByContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.baptized) {
        // Clear collection
        newState = {
          ...newState,
          baptizedContacts: [],
        };

        newState.contact.baptized.values.forEach((baptizedContact) => {
          const foundBaptized = newState.usersContacts.find(
            (user) => user.value === baptizedContact.value,
          );
          if (!foundBaptized) {
            // Add non existent contact baptized to list (user does not have access permission to this contacts)
            newState = {
              ...newState,
              baptizedContacts: [
                ...newState.baptizedContacts,
                {
                  name: baptizedContact.name,
                  value: baptizedContact.value,
                },
              ],
              unmodifiedBaptizedContacts: [
                ...newState.unmodifiedBaptizedContacts,
                {
                  name: baptizedContact.name,
                  value: baptizedContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.coached_by) {
        // Clear collection
        newState = {
          ...newState,
          coachedByContacts: [],
        };

        newState.contact.coached_by.values.forEach((coachedByContact) => {
          const foundcoachedBy = newState.usersContacts.find(
            (user) => user.value === coachedByContact.value,
          );
          if (!foundcoachedBy) {
            // Add non existent contact coachedBy to list (user does not have access permission to this contacts)
            newState = {
              ...newState,
              coachedByContacts: [
                ...newState.coachedByContacts,
                {
                  name: coachedByContact.name,
                  value: coachedByContact.value,
                },
              ],
              unmodifiedCoachedByContacts: [
                ...newState.unmodifiedCoachedByContacts,
                {
                  name: coachedByContact.name,
                  value: coachedByContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.coaching) {
        // Clear collection
        newState = {
          ...newState,
          coachedContacts: [],
        };

        newState.contact.coaching.values.forEach((coachedContact) => {
          const foundCoached = newState.usersContacts.find(
            (user) => user.value === coachedContact.value,
          );
          if (!foundCoached) {
            // Add non existent contact coached to list (user does not have access permission to this contacts)
            newState = {
              ...newState,
              coachedContacts: [
                ...newState.coachedContacts,
                {
                  name: coachedContact.name,
                  value: coachedContact.value,
                },
              ],
              unmodifiedCoachedContacts: [
                ...newState.unmodifiedCoachedContacts,
                {
                  name: coachedContact.name,
                  value: coachedContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.groups) {
        // Clear collection
        newState = {
          ...newState,
          connectionGroups: [],
        };

        newState.contact.groups.values.forEach((groupConnection) => {
          const foundGroup = newState.groups.find((group) => group.value === groupConnection.value);
          if (!foundGroup) {
            // Add non existent group to list (user does not have access permission to this groups)
            newState = {
              ...newState,
              connectionGroups: [
                ...newState.connectionGroups,
                {
                  name: groupConnection.name,
                  value: groupConnection.value,
                },
              ],
              unmodifiedConnectionGroups: [
                ...newState.unmodifiedConnectionGroups,
                {
                  name: groupConnection.name,
                  value: groupConnection.value,
                },
              ],
            };
          }
        });
      }
      if (newState.contact.assigned_to) {
        // Clear collection
        newState = {
          ...newState,
          assignedToContacts: [],
        };

        let foundAssigned = newState.users.find(
          (user) => user.key === newState.contact.assigned_to.key,
        );
        if (!foundAssigned) {
          // Add non existent group to list (user does not have access permission to this groups)
          newState = {
            ...newState,
            assignedToContacts: [
              ...newState.assignedToContacts,
              {
                label: newState.contact.assigned_to.label,
                key: newState.contact.assigned_to.key,
              },
            ],
            unmodifedAssignedToContacts: [
              ...newState.unmodifedAssignedToContacts,
              {
                label: newState.contact.assigned_to.label,
                key: newState.contact.assigned_to.key,
              },
            ],
          };
        }
      }
    }

    // GET COMMENTS
    if (comments) {
      if (
        newState.contact.ID &&
        Object.prototype.hasOwnProperty.call(comments, newState.contact.ID)
      ) {
        // NEW COMMENTS (PAGINATION)
        if (comments[newState.contact.ID].pagination.offset > 0) {
          newState = {
            ...newState,
            loadingMoreComments: false,
          };
        }
        // ONLINE MODE: USE STATE PAGINATION - OFFLINE MODE: USE STORE PAGINATION
        // UPDATE OFFSET
        newState = {
          ...newState,
          comments: {
            ...comments[newState.contact.ID],
          },
        };
      }
    }

    // GET ACTIVITIES
    if (activities) {
      if (
        newState.contact.ID &&
        Object.prototype.hasOwnProperty.call(activities, newState.contact.ID)
      ) {
        // NEW ACTIVITIES (PAGINATION)
        if (activities[newState.contact.ID].pagination.offset > 0) {
          newState = {
            ...newState,
            loadingMoreActivities: false,
          };
        }
        // ONLINE MODE: USE STATE PAGINATION - OFFLINE MODE: USE STORE PAGINATION
        // UPDATE OFFSET
        newState = {
          ...newState,
          activities: {
            ...activities[newState.contact.ID],
          },
        };
      }
    }

    // GET FILTERED LOCATIONS
    if (foundGeonames) {
      newState = {
        ...newState,
        foundGeonames,
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
    }

    // CONTACT SAVE / GET BY ID
    if (contact && prevProps.contact !== contact) {
      // Update contact data only in these conditions:
      // Same contact created (offline/online)
      // Same contact updated (offline/online)
      // Same offline contact created in DB (AutoID to DBID)
      if (
        (typeof contact.ID !== 'undefined' && typeof this.state.contact.ID === 'undefined') ||
        (contact.ID && contact.ID.toString() === this.state.contact.ID.toString()) ||
        (contact.oldID && contact.oldID === this.state.contact.ID.toString())
      ) {
        // Highlight Updates -> Compare this.state.contact with contact and show differences
        navigation.setParams({ contactName: contact.title, contactId: contact.ID });
        if (contact.seeker_path) {
          this.setContactSeekerPath(contact.seeker_path);
        }
        if (this.state.comment && this.state.comment.length > 0) {
          this.onSaveComment();
        }
        this.getContactByIdEnd();
        // Add contact to 'previousContacts' array on creation
        if (
          !this.props.previousContacts.find(
            (previousContact) => previousContact.contactId === parseInt(contact.ID),
          )
        ) {
          this.props.updatePrevious([
            ...this.props.previousContacts,
            {
              contactId: parseInt(contact.ID),
              onlyView: true,
              contactName: contact.title,
            },
          ]);
        }
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
        (contact.ID && contact.ID.toString() === this.state.contact.ID.toString()) ||
        (contact.oldID && contact.oldID === this.state.contact.ID.toString())
      ) {
        // Highlight Updates -> Compare this.state.group with group and show differences
        this.onRefreshCommentsActivities(contact.ID, true);
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
    // Fix to press back button in comments tab
    if (prevProps.navigation.state.params.hideTabBar !== navigation.state.params.hideTabBar) {
      if (!navigation.state.params.hideTabBar && this.state.executingBack) {
        setTimeout(() => {
          navigation.goBack(null);
          navigation.state.params.afterBack();
        }, 1000);
      }
    }
  }

  onLoad() {
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
          seeker_path: 'none',
        },
      };
      navigation.setParams({
        contactName,
      });
    } else {
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
          seeker_path: 'none',
        },
      };
      navigation.setParams({
        hideTabBar: true,
      });
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

  keyboardDidShow(event) {
    this.setState({
      footerLocation: isIOS ? event.endCoordinates.height /*+ extraNotchHeight*/ : 0,
    });
  }

  keyboardDidHide(event) {
    this.setState({
      footerLocation: 0,
    });
  }

  backButtonTap = () => {
    let { navigation } = this.props;
    let { params } = navigation.state;
    if (params.hideTabBar) {
      this.setState(
        {
          executingBack: true,
        },
        () => {
          navigation.setParams({
            hideTabBar: false,
          });
        },
      );
    } else {
      //Fix to returning using Android back button! -> goBack(null)
      navigation.goBack(null);
      navigation.state.params.afterBack();
    }
  };

  afterBack = () => {
    let { navigation } = this.props;
    let newPreviousContacts = [...this.props.previousContacts];
    newPreviousContacts.pop();
    this.props.updatePrevious(newPreviousContacts);
    if (newPreviousContacts.length > 0) {
      this.props.loadingFalse();
      let currentParams = {
        ...newPreviousContacts[newPreviousContacts.length - 1],
      };
      this.setState({
        contact: {
          ID: currentParams.contactId,
          title: currentParams.contactName,
          sources: {
            values: [
              {
                value: 'personal',
              },
            ],
          },
          seeker_path: 'none',
        },
        overallStatusBackgroundColor: '#ffffff',
      });
      navigation.setParams({
        ...currentParams,
      });
      this.onRefresh(currentParams.contactId, true);
    } else if (navigation.state.params.fromNotificationView) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'ContactList' })],
      });
      navigation.dispatch(resetAction);
      navigation.navigate('NotificationList');
    } else {
      // Prevent error when view loaded from GroupDetailScreen.js
      if (typeof navigation.state.params.onGoBack === 'function') {
        navigation.state.params.onGoBack();
      }
    }
  };

  onRefresh(contactId, forceRefresh = false) {
    if (!self.state.loading || forceRefresh) {
      self.getContactById(contactId);
      self.onRefreshCommentsActivities(contactId, true);
    }
  }

  onRefreshCommentsActivities(contactId, resetPagination = false) {
    this.getContactComments(contactId, resetPagination);
    this.getContactActivities(contactId, resetPagination);
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
          contactID: parseInt(user.contact_id),
        })),
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

    let sourcesList = Object.keys(this.props.contactSettings.fields.sources.values).map((key) => ({
      name: this.props.contactSettings.fields.sources.values[key].label,
      value: key,
    }));

    let userContactsList = this.props.contactsList.map((contact) => ({
      name: contact.title,
      value: contact.ID,
    }));

    newState = {
      ...newState,
      usersContacts: [...userContactsList],
      groups: this.props.groupsList.map((group) => ({
        name: group.title,
        value: group.ID,
      })),
      loadedLocal: true,
      sources: [...sourcesList],
      unmodifiedSources: [...sourcesList],
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

  getContactComments(contactId, resetPagination = false) {
    if (this.props.isConnected) {
      if (resetPagination) {
        this.props.getComments(this.props.userData.domain, this.props.userData.token, contactId, {
          offset: 0,
          limit: 10,
        });
      } else {
        //ONLY GET DATA IF THERE IS MORE DATA TO GET
        if (
          !this.state.loadComments &&
          this.state.comments.pagination.offset < this.state.comments.pagination.total
        ) {
          this.props.getComments(
            this.props.userData.domain,
            this.props.userData.token,
            contactId,
            this.state.comments.pagination,
          );
        }
      }
    }
  }

  getContactActivities(contactId, resetPagination = false) {
    if (this.props.isConnected) {
      if (resetPagination) {
        this.props.getActivities(this.props.userData.domain, this.props.userData.token, contactId, {
          offset: 0,
          limit: 10,
        });
      } else {
        //ONLY GET DATA IF THERE IS MORE DATA TO GET
        if (
          !this.state.loadActivities &&
          this.state.activities.pagination.offset < this.state.activities.pagination.total
        ) {
          this.props.getActivities(
            this.props.userData.domain,
            this.props.userData.token,
            contactId,
            this.state.activities.pagination,
          );
        }
      }
    }
  }

  onEnableEdit = () => {
    this.setState((state) => {
      let indexFix;
      if (state.tabViewConfig.index < 3) {
        indexFix = state.tabViewConfig.index;
      } else if (state.tabViewConfig.index > 2) {
        indexFix = state.tabViewConfig.index - 1;
      }
      return {
        onlyView: false,
        tabViewConfig: {
          ...state.tabViewConfig,
          index: indexFix,
          routes: state.tabViewConfig.routes.filter((route) => route.key !== 'comments'),
        },
      };
    });
    this.props.navigation.setParams({
      hideTabBar: true,
      onlyView: false,
      contactName: this.state.contact.title,
    });
  };

  onDisableEdit = () => {
    const {
      unmodifiedContact,
      unmodifiedSources,
      unmodifiedSubAssignedContacts,
      unmodifiedRelationContacts,
      unmodifiedBaptizedByContacts,
      unmodifiedBaptizedContacts,
      unmodifiedCoachedByContacts,
      unmodifiedCoachedContacts,
      unmodifiedConnectionGroups,
      unmodifedAssignedToContacts,
    } = this.state;
    this.setState((state) => {
      // Set correct index in Tab position according to view mode and current tab position
      const indexFix =
        state.tabViewConfig.index > 1 && !state.onlyView
          ? state.tabViewConfig.index + 1
          : state.tabViewConfig.index;
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
          index: indexFix,
          routes: [...tabViewRoutes],
        },
        sources: [...unmodifiedSources],
        subAssignedContacts: [...unmodifiedSubAssignedContacts],
        relationContacts: [...unmodifiedRelationContacts],
        baptizedByContacts: [...unmodifiedBaptizedByContacts],
        baptizedContacts: [...unmodifiedBaptizedContacts],
        coachedByContacts: [...unmodifiedCoachedByContacts],
        coachedContacts: [...unmodifiedCoachedContacts],
        connectionGroups: [...unmodifiedConnectionGroups],
        assignedToContacts: [...unmodifedAssignedToContacts],
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

  setBaptismDate = (date = null) => {
    // (event, date) => {
    if (!date) {
      // Clean DatePicker value
      datePickerRef.state.chosenDate = null;
      datePickerRef.state.defaultDate = null;
      this.forceUpdate();
    }
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        baptism_date: date ? sharedTools.formatDateToBackEnd(date) : '',
      },
    }));
  };

  onSaveContact = (quickAction = {}) => {
    this.setState(
      {
        nameRequired: false,
      },
      () => {
        Keyboard.dismiss();
        if (this.state.contact.title) {
          const { unmodifiedContact } = this.state;
          let contact = this.transformContactObject(this.state.contact, quickAction);
          // Do not save fields with empty values
          Object.keys(contact)
            .filter(
              (key) =>
                key.includes('contact_') &&
                Object.prototype.toString.call(contact[key]) === '[object Array]' &&
                contact[key].length > 0,
            )
            .forEach((key) => {
              contact = {
                ...contact,
                [key]: contact[key].filter(
                  (socialMedia) =>
                    socialMedia.delete || (!socialMedia.delete && socialMedia.value.length > 0),
                ),
              };
            });
          let contactToSave = {
            ...sharedTools.diff(unmodifiedContact, contact),
            title: entities.encode(this.state.contact.title),
          };
          // Remove empty arrays
          Object.keys(contactToSave).forEach((key) => {
            const value = contactToSave[key];
            if (
              Object.prototype.hasOwnProperty.call(value, 'values') &&
              value.values.length === 0
            ) {
              delete contactToSave[key];
            }
          });
          if (this.state.contact.ID) {
            contactToSave = {
              ...contactToSave,
              ID: this.state.contact.ID,
            };
          }
          if (contactToSave.assigned_to) {
            contactToSave = {
              ...contactToSave,
              assigned_to: `user-${contactToSave.assigned_to.key}`,
            };
          }
          this.props.saveContact(
            this.props.userData.domain,
            this.props.userData.token,
            contactToSave,
          );
        } else {
          //Empty contact title/name
          this.setState({
            nameRequired: true,
          });
        }
      },
    );
  };

  onFormatDateToView = (date) => {
    return moment(new Date(date)).format('LLL');
  };

  formatActivityDate = (comment) => {
    let baptismDateRegex = /\{(\d+)\}+/;
    if (baptismDateRegex.test(comment)) {
      comment = comment.replace(baptismDateRegex, this.formatTimestampToDate);
    }
    return comment;
  };

  formatTimestampToDate = (match, timestamp) => {
    return moment(new Date(timestamp * 1000)).format('LL');
  };

  setComment = (value) => {
    this.setState({
      comment: value,
    });
  };

  onSaveComment = () => {
    const { comment } = this.state;
    if (!this.state.loadComments) {
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
    const { comments, activities, filtersSettings } = this.state;
    let list = [];
    if (filtersSettings.showComments) {
      list = list.concat(comments.data);
    }
    if (filtersSettings.showActivities) {
      list = list.concat(activities.data);
    }
    return sharedTools.groupCommentsActivities(list);
  }

  getSelectizeItems = (contactList, localList) => {
    const items = [];
    if (contactList) {
      contactList.values.forEach((listItem) => {
        const foundItem = localList.find((localItem) => localItem.value === listItem.value);
        if (foundItem) {
          items.push({
            name: foundItem.name,
            value: listItem.value,
          });
        }
      });
    }
    return items;
  };

  showMoreFields = () => {
    this.setState((state) => {
      return {
        moreFields: !state.moreFields,
      };
    });
  };

  linkingPhoneDialer = (phoneNumber) => {
    let number = '';
    if (Platform.OS === 'ios') {
      number = 'telprompt:${' + phoneNumber + '}';
    } else {
      number = 'tel:${' + phoneNumber + '}';
    }
    Linking.openURL(number);
  };

  offlineBarRender = () => (
    <View style={[styles.offlineBar]}>
      <Text style={[styles.offlineBarText]}>{i18n.t('global.offline')}</Text>
    </View>
  );

  goToContactDetailScreen = (contactID, name) => {
    let { navigation } = this.props;
    /* eslint-disable */
    // Save new contact in 'previousContacts' array
    if (
      !this.props.previousContacts.find(
        (previousContact) => previousContact.contactId === contactID,
      )
    ) {
      // Add contact to 'previousContacts' array on creation
      this.props.updatePrevious([
        ...this.props.previousContacts,
        {
          contactId: contactID,
          onlyView: true,
          contactName: name,
        },
      ]);
    }
    navigation.push('ContactDetail', {
      contactId: contactID,
      onlyView: true,
      contactName: name,
      afterBack: () => this.afterBack(),
    });
    /* eslint-enable */
  };

  goToGroupDetailScreen = (groupID, name) => {
    // Clean 'previousContacts' array
    this.props.updatePreviousGroups([
      {
        groupId: groupID,
        onlyView: true,
        groupName: name,
      },
    ]);
    this.props.navigation.navigate('GroupDetail', {
      groupId: groupID,
      onlyView: true,
      groupName: name,
    });
  };

  noCommentsRender = () => (
    <ScrollView
      style={styles.noCommentsContainer}
      refreshControl={
        <RefreshControl
          refreshing={this.state.loadComments || this.state.loadActivities}
          onRefresh={() => this.onRefreshCommentsActivities(this.state.contact.ID, true)}
        />
      }>
      <Grid style={{ transform: [{ scaleY: -1 }] }}>
        <Col>
          <Row style={{ justifyContent: 'center' }}>
            <Image style={styles.noCommentsImage} source={dtIcon} />
          </Row>
          <Row>
            <Text style={styles.noCommentsText}>
              {i18n.t('contactDetailScreen.noContactCommentPlacheHolder')}
            </Text>
          </Row>
          <Row>
            <Text style={styles.noCommentsText}>
              {i18n.t('contactDetailScreen.noContactCommentPlacheHolder1')}
            </Text>
          </Row>
          {!this.props.isConnected && (
            <Row>
              <Text style={[styles.noCommentsText, { backgroundColor: '#fff2ac' }]}>
                {i18n.t('contactDetailScreen.noContactCommentPlacheHolderOffline')}
              </Text>
            </Row>
          )}
        </Col>
      </Grid>
    </ScrollView>
  );

  toggleFilterView = () => {
    this.setState((prevState) => ({
      showFilterView: !prevState.showFilterView,
    }));
  };

  resetFilters = () => {
    this.setState(
      {
        filtersSettings: {
          showComments: true,
          showActivities: true,
        },
      },
      () => {
        this.toggleFilterView();
      },
    );
  };

  toggleFilter = (value, filterName) => {
    this.setState((prevState) => ({
      filtersSettings: {
        ...prevState.filtersSettings,
        [filterName]: !value,
      },
    }));
  };

  detailView = () => (
    /*_viewable_*/
    <View style={{ flex: 1 }}>
      {this.state.onlyView ? (
        <View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={() => this.onRefresh(this.state.contact.ID)}
              />
            }>
            <View style={[styles.formContainer, { marginTop: 0, paddingTop: 0 }]}>
              <Row style={[styles.formRow, { paddingTop: 15 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Image source={statusIcon} style={[styles.fieldsIcons, {}]} />
                </Col>
                <Col>
                  <Label
                    style={[
                      {
                        color: Colors.tintColor,
                        fontSize: 12,
                        fontWeight: 'bold',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                      },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.props.contactSettings.fields.overall_status.name}
                  </Label>
                </Col>
              </Row>
              <Row style={[styles.formRow, { paddingTop: 5 }]} pointerEvents="none">
                <Col
                  style={[
                    styles.statusFieldContainer,
                    Platform.select({
                      default: { borderColor: this.state.overallStatusBackgroundColor },
                      ios: {},
                    }),
                  ]}>
                  <Picker
                    selectedValue={this.state.contact.overall_status}
                    onValueChange={this.setContactStatus}
                    style={Platform.select({
                      android: {
                        color: '#ffffff',
                        backgroundColor: this.state.overallStatusBackgroundColor,
                        width: '100%',
                      },
                      default: {
                        backgroundColor: this.state.overallStatusBackgroundColor,
                      },
                    })}
                    textStyle={{
                      color: '#ffffff',
                    }}>
                    {this.renderStatusPickerItems()}
                  </Picker>
                </Col>
              </Row>
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="briefcase-account"
                    style={styles.formIcon}
                  />
                </Col>
                <Col>
                  {this.state.contact.assigned_to
                    ? this.renderContactLink(this.state.contact.assigned_to)
                    : null}
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.fields.assigned_to.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="briefcase-download"
                    style={[styles.formIcon, { marginTop: 0 }]}
                  />
                </Col>
                <Col>
                  <View>
                    {this.state.contact.subassigned ? (
                      this.state.contact.subassigned.values.map((contact, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          activeOpacity={0.5}
                          onPress={() => this.goToContactDetailScreen(contact.value, contact.name)}>
                          <Text
                            style={[
                              styles.linkingText,
                              { marginTop: 'auto', marginBottom: 'auto' },
                              this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                            ]}>
                            {contact.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text></Text>
                    )}
                  </View>
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
                  <Icon
                    type="FontAwesome"
                    name="phone"
                    style={[styles.formIcon, { marginTop: 0 }]}
                  />
                </Col>
                <Col>
                  <View>
                    {this.state.contact.contact_phone ? (
                      this.state.contact.contact_phone
                        .filter((phone) => !phone.delete)
                        .map((phone, index) => (
                          <TouchableOpacity
                            key={index.toString()}
                            activeOpacity={0.5}
                            onPress={() => this.linkingPhoneDialer(phone.value)}>
                            <Text
                              style={[
                                styles.linkingText,
                                { marginTop: 'auto', marginBottom: 'auto' },
                                this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                              ]}>
                              {phone.value}
                            </Text>
                          </TouchableOpacity>
                        ))
                    ) : (
                      <Text></Text>
                    )}
                  </View>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>{i18n.t('contactDetailScreen.mobile')}</Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon
                    type="FontAwesome"
                    name="envelope"
                    style={[styles.formIcon, { marginTop: 0, fontSize: 20 }]}
                  />
                </Col>
                <Col>
                  <View>
                    {this.state.contact.contact_email ? (
                      this.state.contact.contact_email
                        .filter((email) => !email.delete)
                        .map((email, index) => (
                          <Text
                            key={index.toString()}
                            style={[
                              styles.linkingText,
                              { marginTop: 'auto', marginBottom: 'auto' },
                              this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                            ]}
                            onPress={() => Linking.openURL('mailto:' + email.value)}>
                            {email.value}
                          </Text>
                        ))
                    ) : (
                      <Text></Text>
                    )}
                  </View>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.channels.email.label}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon
                    type="Ionicons"
                    name="chatboxes"
                    style={[styles.formIcon, { marginTop: 0, fontSize: 25 }]}
                  />
                </Col>
                <Col>
                  {Object.keys(this.props.contactSettings.channels)
                    .filter(
                      (channelName) =>
                        channelName !== 'phone' &&
                        channelName !== 'email' &&
                        channelName !== 'address',
                    )
                    .map((channelName, channelNameIndex) => {
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
                                  style={[
                                    socialMediaIndex === 0 ? { marginTop: 10 } : {},
                                    this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                                  ]}>
                                  {socialMedia.value}
                                </Text>
                              ),
                            )}
                            <Text
                              style={[
                                styles.socialMediaNames,
                                this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                              ]}>
                              {channelName}
                            </Text>
                          </Col>
                        );
                      }
                      return null;
                    })}
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={[styles.formLabel, {}]}>
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
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.contact.contact_address
                      ? this.state.contact.contact_address
                          .filter((address) => !address.delete)
                          .map((address) => address.value)
                          .join(', ')
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.contactSettings.channels.address.label}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="map-marker" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.contact.location_grid
                      ? this.state.contact.location_grid.values
                          .map(
                            function (location) {
                              return safeFind(
                                this.state.geonames.find(
                                  (geoname) => geoname.value === location.value,
                                ),
                                'name',
                              );
                            }.bind(this),
                          )
                          .filter(String)
                          .join(', ')
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
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.contact.people_groups
                      ? this.state.contact.people_groups.values
                          .map(
                            function (peopleGroup) {
                              return safeFind(
                                this.state.peopleGroups.find(
                                  (person) => person.value === peopleGroup.value,
                                ),
                                'name',
                              );
                            }.bind(this),
                          )
                          .filter(String)
                          .join(', ')
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
                  <Icon
                    type="FontAwesome5"
                    name="user-clock"
                    style={[styles.formIcon, { fontSize: 20 }]}
                  />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.contact.age && this.state.contact.age !== 'not-set'
                      ? this.state.contact.age
                      : ''}
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
                  <Icon
                    type="MaterialCommunityIcons"
                    name="gender-male-female"
                    style={[styles.formIcon, { fontSize: 25 }]}
                  />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
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
                    type="Foundation"
                    name={this.props.isRTL ? 'arrow-left' : 'arrow-right'}
                    style={styles.formIcon}
                  />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.contact.sources
                      ? `${this.state.contact.sources.values
                          .map(
                            (source) =>
                              this.state.sources.find(
                                (sourceItem) => sourceItem.value === source.value,
                              ).name,
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
        <KeyboardAwareScrollView /*_editable_*/
          enableAutomaticScroll
          enableOnAndroid
          keyboardOpeningTime={0}
          extraScrollHeight={150}
          keyboardShouldPersistTaps="handled">
          <View style={[styles.formContainer, { marginTop: 10, paddingTop: 0 }]}>
            <Row style={[styles.formRow, { paddingTop: 15 }]}>
              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                <Image source={statusIcon} style={[styles.fieldsIcons, {}]} />
              </Col>
              <Col>
                <Label
                  style={[
                    {
                      color: Colors.tintColor,
                      fontSize: 12,
                      fontWeight: 'bold',
                      marginTop: 0,
                    },
                    this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                  ]}>
                  {this.props.contactSettings.fields.overall_status.name}
                </Label>
              </Col>
            </Row>
            <Row style={[styles.formRow, { paddingTop: 5 }]}>
              <Col
                style={[
                  styles.statusFieldContainer,
                  Platform.select({
                    default: { borderColor: this.state.overallStatusBackgroundColor },
                    ios: {},
                  }),
                ]}>
                <Picker
                  selectedValue={this.state.contact.overall_status}
                  onValueChange={this.setContactStatus}
                  style={Platform.select({
                    android: {
                      color: '#ffffff',
                      backgroundColor: this.state.overallStatusBackgroundColor,
                      width: '100%',
                    },
                    default: {
                      backgroundColor: this.state.overallStatusBackgroundColor,
                    },
                  })}
                  textStyle={{
                    color: '#ffffff',
                  }}>
                  {this.renderStatusPickerItems()}
                </Picker>
              </Col>
            </Row>
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="FontAwesome" name="user" style={styles.formIcon} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {i18n.t('contactDetailScreen.fullName.label')}
                </Label>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="FontAwesome" name="user" style={[styles.formIcon, { opacity: 0 }]} />
                </View>
              </Col>
              <Col>
                <Col
                  style={
                    this.state.nameRequired
                      ? {
                          backgroundColor: '#FFE6E6',
                          borderWidth: 2,
                          borderColor: Colors.errorBackground,
                        }
                      : null
                  }>
                  <Input
                    value={this.state.contact.title}
                    onChangeText={this.setContactTitle}
                    style={[
                      this.state.nameRequired
                        ? [styles.contactTextField, { borderBottomWidth: 0 }]
                        : styles.contactTextField,
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}
                  />
                </Col>
                {this.state.nameRequired ? (
                  <Text style={styles.validationErrorMessage}>
                    {i18n.t('contactDetailScreen.fullName.error')}
                  </Text>
                ) : null}
              </Col>
            </Row>
            <TouchableOpacity
              onPress={() => {
                this.updateShowAssignedToModal(true);
              }}>
              <Row style={styles.formFieldMargin}>
                <Col style={styles.formIconLabelCol}>
                  <View style={styles.formIconLabelView}>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="briefcase-account"
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
                      type="MaterialCommunityIcons"
                      name="briefcase-account"
                      style={[styles.formIcon, { opacity: 0 }]}
                    />
                  </View>
                </Col>
                <Col
                  style={[
                    styles.contactTextRoundField,
                    { paddingRight: 10 },
                    this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                  ]}>
                  <Picker
                    selectedValue={
                      this.state.contact.assigned_to ? this.state.contact.assigned_to.key : null
                    }
                    onValueChange={this.onSelectAssignedTo}>
                    {this.renderPickerItems([
                      ...this.state.users,
                      ...this.state.assignedToContacts,
                    ])}
                  </Picker>
                </Col>
              </Row>
            </TouchableOpacity>
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="briefcase-download"
                    style={styles.formIcon}
                  />
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
                    type="MaterialCommunityIcons"
                    name="briefcase-download"
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
                  items={[...this.state.subAssignedContacts, ...this.state.usersContacts]}
                  selectedItems={this.getSelectizeItems(this.state.contact.subassigned, [
                    ...this.state.subAssignedContacts,
                    ...this.state.usersContacts,
                  ])}
                  textInputProps={{
                    placeholder: i18n.t('contactDetailScreen.subAssignThisContact'),
                  }}
                  renderChip={(id, onClose, item, style, iconStyle) => (
                    <Chip
                      key={id}
                      iconStyle={iconStyle}
                      onClose={(props) => {
                        let foundSubassignedIndex = this.state.subAssignedContacts.findIndex(
                          (subassigned) => subassigned.value === id,
                        );
                        if (foundSubassignedIndex > -1) {
                          // Remove subassigned from list
                          const subAssignedContacts = [...this.state.subAssignedContacts];
                          subAssignedContacts.splice(foundSubassignedIndex, 1);
                          this.setState({
                            subAssignedContacts: [...subAssignedContacts],
                          });
                        }
                        onClose(props);
                      }}
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
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
            <Row style={styles.formFieldMargin}>
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
                  style={[styles.addRemoveIcons, styles.addIcons]}
                  onPress={this.onAddPhoneField}
                />
              </Col>
            </Row>
            {this.state.contact.contact_phone ? (
              this.state.contact.contact_phone.map((phone, index) =>
                !phone.delete ? (
                  <Row key={index.toString()} style={{ marginBottom: 10 }}>
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
                        value={phone.value}
                        onChangeText={(value) => {
                          this.onPhoneFieldChange(value, index, phone.key, this);
                        }}
                        style={styles.contactTextField}
                        keyboardType="phone-pad"
                      />
                    </Col>
                    <Col style={styles.formIconLabel}>
                      <Icon
                        android="md-remove"
                        ios="ios-remove"
                        style={[styles.formIcon, styles.addRemoveIcons, styles.removeIcons]}
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
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon
                    type="FontAwesome"
                    name="envelope"
                    style={[styles.formIcon, { fontSize: 20 }]}
                  />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {this.props.contactSettings.channels.email.label}
                </Label>
              </Col>
              <Col style={styles.formIconLabel}>
                <Icon
                  android="md-add"
                  ios="ios-add"
                  style={[styles.addRemoveIcons, styles.addIcons]}
                  onPress={this.onAddEmailField}
                />
              </Col>
            </Row>
            {this.state.contact.contact_email ? (
              this.state.contact.contact_email.map((email, index) =>
                !email.delete ? (
                  <Row key={index.toString()} style={{ marginBottom: 10 }}>
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
                        value={email.value}
                        onChangeText={(value) => {
                          this.onEmailFieldChange(value, index, email.key, this);
                        }}
                        style={styles.contactTextField}
                        keyboardType="email-address"
                      />
                    </Col>
                    <Col style={styles.formIconLabel}>
                      <Icon
                        android="md-remove"
                        ios="ios-remove"
                        style={[styles.formIcon, styles.addRemoveIcons, styles.removeIcons]}
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
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon
                    type="Ionicons"
                    name="chatboxes"
                    style={[styles.formIcon, { fontSize: 25 }]}
                  />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>{i18n.t('contactDetailScreen.socialMedia')}</Label>
              </Col>
              <Col style={styles.formIconLabel}>
                <Icon
                  android="md-add"
                  ios="ios-add"
                  style={[styles.addRemoveIcons, styles.addIcons]}
                  onPress={this.onAddSocialMediaField}
                />
              </Col>
            </Row>
            {Object.keys(this.props.contactSettings.channels)
              .filter(
                (channelName) =>
                  channelName !== 'phone' && channelName !== 'email' && channelName !== 'address',
              )
              .map((channelName, channelNameIndex) => {
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
              })}
            {Object.keys(this.props.contactSettings.channels)
              .filter(
                (channelName) =>
                  channelName !== 'phone' && channelName !== 'email' && channelName !== 'address',
              )
              .map((channelName, channelNameIndex) => {
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
              })}
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="Entypo" name="home" style={styles.formIcon} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {this.props.contactSettings.channels.address.label}
                </Label>
              </Col>
              <Col style={styles.formIconLabel}>
                <Icon
                  android="md-add"
                  ios="ios-add"
                  style={[styles.addRemoveIcons, styles.addIcons]}
                  onPress={this.onAddAddressField}
                />
              </Col>
            </Row>
            {this.state.contact.contact_address ? (
              this.state.contact.contact_address.map((address, index) =>
                !address.delete ? (
                  <Row key={index.toString()} style={{ marginBottom: 10 }}>
                    <Col style={styles.formIconLabelCol}>
                      <View style={styles.formIconLabelView}>
                        <Icon type="Entypo" name="home" style={[styles.formIcon, { opacity: 0 }]} />
                      </View>
                    </Col>
                    <Col>
                      <Input
                        multiline
                        value={address.value}
                        onChangeText={(value) => {
                          this.onAddressFieldChange(value, index, address.key, this);
                        }}
                        style={styles.contactTextField}
                      />
                    </Col>
                    <Col style={styles.formIconLabel}>
                      <Icon
                        android="md-remove"
                        ios="ios-remove"
                        style={[styles.formIcon, styles.addRemoveIcons, styles.removeIcons]}
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
            <Row style={styles.formFieldMargin}>
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
                  items={this.state.foundGeonames}
                  selectedItems={this.getSelectizeItems(
                    this.state.contact.location_grid,
                    this.state.geonames,
                  )}
                  textInputProps={{
                    placeholder: i18n.t('contactDetailScreen.selectLocations'),
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
                      </View>
                    </TouchableOpacity>
                  )}
                  filterOnKey="name"
                  inputContainerStyle={styles.selectizeField}
                  textInputProps={{
                    onChangeText: this.searchLocationsDelayed,
                  }}
                />
              </Col>
            </Row>
            <Row style={styles.formFieldMargin}>
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
                  <Icon type="FontAwesome" name="globe" style={[styles.formIcon, { opacity: 0 }]} />
                </View>
              </Col>
              <Col>
                <Selectize
                  ref={(selectize) => {
                    peopleGroupsSelectizeRef = selectize;
                  }}
                  itemId="value"
                  items={this.state.peopleGroups}
                  selectedItems={this.getSelectizeItems(
                    this.state.contact.people_groups,
                    this.state.peopleGroups,
                  )}
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
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon
                    type="FontAwesome5"
                    name="user-clock"
                    style={[styles.formIcon, { fontSize: 20 }]}
                  />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>{this.props.contactSettings.fields.age.name}</Label>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon
                    type="FontAwesome5"
                    name="user-clock"
                    style={[styles.formIcon, { opacity: 0 }]}
                  />
                </View>
              </Col>
              <Col style={[styles.contactTextRoundField, { paddingRight: 10 }]}>
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
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="gender-male-female"
                    style={[styles.formIcon, { fontSize: 25 }]}
                  />
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
                    type="MaterialCommunityIcons"
                    name="gender-male-female"
                    style={[styles.formIcon, { opacity: 0 }]}
                  />
                </View>
              </Col>
              <Col style={[styles.contactTextRoundField, { paddingRight: 10 }]}>
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
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="Foundation" name="arrow-right" style={styles.formIcon} />
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
                  items={this.state.sources}
                  selectedItems={
                    this.state.contact.sources
                      ? // Only add option elements (by contact sources) does exist in source list
                        this.state.contact.sources.values
                          .filter((contactSource) =>
                            this.state.sources.find(
                              (sourceItem) => sourceItem.value === contactSource.value,
                            ),
                          )
                          .map((contactSource) => {
                            return {
                              name: this.state.sources.find(
                                (sourceItem) => sourceItem.value === contactSource.value,
                              ).name,
                              value: contactSource.value,
                            };
                          })
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
                      onClose={(props) => {
                        const nonExistingSourcesList = [...this.state.nonExistingSources];
                        let foundNonExistingSource = nonExistingSourcesList.findIndex(
                          (source) => source.value === id,
                        );
                        if (foundNonExistingSource > -1) {
                          // Remove custom source from select list
                          const sourceList = [...this.state.sources]; //,
                          let foundSourceIndex = sourceList.findIndex(
                            (source) => source.value === id,
                          );
                          sourceList.splice(foundSourceIndex, 1);
                          this.setState({
                            sources: [...sourceList],
                          });
                        }
                        onClose(props);
                      }}
                      text={item.name}
                      style={style}
                    />
                  )}
                  filterOnKey="name"
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );

  progressView = () => (
    /*_viewable_*/
    <View style={{ flex: 1 }}>
      {this.state.onlyView ? (
        <View>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={() => this.onRefresh(this.state.contact.ID)}
              />
            }>
            <View style={[styles.formContainer, { marginTop: 0 }]}>
              <Row style={[styles.formRow, { marginBottom: 10 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="map-marker-path"
                    style={styles.formIcon}
                  />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
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
              <Row style={[styles.formRow, { paddingTop: 10 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="Octicons" name="milestone" style={styles.formIcon} />
                </Col>
                <Col>
                  <Label
                    style={[
                      styles.formLabel,
                      { fontWeight: 'bold', marginBottom: 'auto', marginTop: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.props.contactSettings.fields.milestones.name}
                  </Label>
                </Col>
              </Row>
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
                      {this.state.contact.baptism_date && this.state.contact.baptism_date.length > 0
                        ? moment(new Date(this.state.contact.baptism_date * 1000))
                            .utc()
                            .format('LL')
                        : ''}
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
        <KeyboardAwareScrollView /*_editable_*/
          enableAutomaticScroll
          enableOnAndroid
          keyboardOpeningTime={0}
          extraScrollHeight={150}
          keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <Row style={[styles.formFieldMargin, {}]}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="map-marker-path"
                    style={styles.formIcon}
                  />
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
              <Col style={[styles.contactTextRoundField, { paddingRight: 10 }]}>
                <Picker
                  mode="dropdown"
                  selectedValue={this.state.contact.seeker_path}
                  onValueChange={this.setContactSeekerPath}
                  textStyle={{ color: Colors.tintColor }}>
                  {Object.keys(this.props.contactSettings.fields.seeker_path.values).map((key) => {
                    const optionData = this.props.contactSettings.fields.seeker_path.values[key];
                    return <Picker.Item key={key} label={optionData.label} value={key} />;
                  })}
                </Picker>
              </Col>
            </Row>
            <Row style={[styles.formRow, { paddingTop: 10 }]}>
              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                <Icon type="Octicons" name="milestone" style={[styles.formIcon, {}]} />
              </Col>
              <Col>
                <Label
                  style={[
                    styles.formLabel,
                    { fontWeight: 'bold', marginBottom: 'auto', marginTop: 'auto' },
                  ]}>
                  {this.props.contactSettings.fields.milestones.name}
                </Label>
              </Col>
            </Row>
            {this.renderfaithMilestones()}
            {this.renderCustomFaithMilestones()}
            <Row style={styles.formFieldMargin}>
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
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="Entypo" name="water" style={[styles.formIcon, { opacity: 0 }]} />
                </View>
              </Col>
              <Col>
                <DatePicker
                  ref={(ref) => (datePickerRef = ref)}
                  onDateChange={this.setBaptismDate}
                  defaultDate={
                    this.state.contact.baptism_date && this.state.contact.baptism_date.length > 0
                      ? new Date(this.state.contact.baptism_date * 1000)
                      : ''
                  }
                />
              </Col>
              <Col style={[styles.formIconLabel, { marginTop: 'auto', marginBottom: 'auto' }]}>
                <Icon
                  type="AntDesign"
                  name="close"
                  style={[styles.formIcon, styles.addRemoveIcons, styles.removeIcons]}
                  onPress={() => this.setBaptismDate()}
                />
              </Col>
            </Row>
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );

  onSuggestionTap(username, hidePanel) {
    hidePanel();
    let comment = this.state.comment.slice(0, -this.state.keyword.length),
      mentionFormat = `@[${username.label}](${username.key})`;
    this.setState({
      suggestedUsers: [],
      comment: `${comment}${mentionFormat}`,
    });
  }

  filterUsers(keyword) {
    let newKeyword = keyword.replace('@', '');
    this.setState((state) => {
      return {
        suggestedUsers: state.users.filter((user) =>
          user.label.toLowerCase().includes(newKeyword.toLowerCase()),
        ),
        keyword,
      };
    });
  }

  renderSuggestionsRow({ item }, hidePanel) {
    return (
      <TouchableOpacity onPress={() => this.onSuggestionTap(item, hidePanel)}>
        <View style={styles.suggestionsRowContainer}>
          <View style={styles.userIconBox}>
            <Text style={styles.usernameInitials}>
              {!!item.label && item.label.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userDetailsBox}>
            <Text style={styles.displayNameText}>{item.label}</Text>
            <Text style={styles.usernameText}>@{item.label}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  commentsView = () => {
    /*_viewable_*/
    if (this.state.showFilterView) {
      return (
        <View style={{ flex: 1 }}>
          <Text
            style={[
              {
                color: Colors.tintColor,
                fontSize: 18,
                textAlign: 'left',
                fontWeight: 'bold',
                marginBottom: 20,
                marginTop: 20,
                marginLeft: 10,
              },
            ]}>
            {i18n.t('global.showing')}:
          </Text>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              this.toggleFilter(this.state.filtersSettings.showComments, 'showComments')
            }>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
              }}>
              <Text
                style={{
                  marginRight: 'auto',
                  marginLeft: 10,
                }}>
                {i18n.t('global.comments')} ({this.state.comments.data.length})
              </Text>
              <CheckBox
                Component={TouchableWithoutFeedback}
                checked={this.state.filtersSettings.showComments}
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                checkedColor={Colors.tintColor}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() =>
              this.toggleFilter(this.state.filtersSettings.showActivities, 'showActivities')
            }>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
              }}>
              <Text
                style={{
                  marginRight: 'auto',
                  marginLeft: 10,
                }}>
                {i18n.t('global.activity')} ({this.state.activities.data.length})
              </Text>
              <CheckBox
                Component={TouchableWithoutFeedback}
                checked={this.state.filtersSettings.showActivities}
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
                checkedColor={Colors.tintColor}
              />
            </View>
          </TouchableOpacity>
          <View style={{ position: 'absolute', bottom: 0, flexDirection: 'row' }}>
            <Button
              style={{
                height: 75,
                width: windowWidth / 2,
                backgroundColor: '#FFFFFF',
              }}
              onPress={() => this.resetFilters()}>
              <Text
                style={{
                  color: Colors.primary,
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}>
                {i18n.t('global.reset')}
              </Text>
            </Button>
            <Button
              style={{
                height: 75,
                width: windowWidth / 2,
                backgroundColor: Colors.primary,
              }}
              onPress={() => this.toggleFilterView()}>
              <Text
                style={{
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}>
                {i18n.t('global.apply')}
              </Text>
            </Button>
          </View>
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, paddingBottom: this.state.footerHeight + this.state.footerLocation }}>
          {this.state.comments.data.length == 0 &&
          this.state.activities.data.length == 0 &&
          !this.state.loadComments &&
          !this.state.loadActivities ? (
            this.noCommentsRender()
          ) : (
            <FlatList
              style={{
                backgroundColor: '#ffffff',
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
                  onRefresh={() => this.onRefreshCommentsActivities(this.state.contact.ID, true)}
                />
              }
              onScroll={({ nativeEvent }) => {
                sharedTools.onlyExecuteLastCall(
                  {},
                  () => {
                    const flatList = nativeEvent;
                    const contentOffsetY = flatList.contentOffset.y;
                    const layoutMeasurementHeight = flatList.layoutMeasurement.height;
                    const contentSizeHeight = flatList.contentSize.height;
                    const heightOffsetSum = layoutMeasurementHeight + contentOffsetY;
                    const distanceToStart = contentSizeHeight - heightOffsetSum;
                    if (distanceToStart < 100) {
                      this.getContactComments(this.state.contact.ID);
                      this.getContactActivities(this.state.contact.ID);
                    }
                  },
                  500,
                );
              }}
            />
          )}
          <View style={{ backgroundColor: Colors.mainBackgroundColor }}>
            <MentionsTextInput
              editable={!this.state.loadComments}
              placeholder={i18n.t('global.writeYourCommentNoteHere')}
              value={this.state.comment}
              onChangeText={this.setComment}
              style={this.props.isRTL ? { textAlign: 'right', flex: 1 } : {}}
              textInputStyle={{
                borderColor: '#B4B4B4',
                borderRadius: 5,
                borderWidth: 1,
                padding: 5,
                margin: 10,
                width: windowWidth - 120,
                backgroundColor: this.state.loadComments ? '#e6e6e6' : '#FFFFFF',
              }}
              loadingComponent={() => (
                <View
                  style={{
                    flex: 1,
                    width: windowWidth,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <ActivityIndicator />
                </View>
              )}
              textInputMinHeight={40}
              textInputMaxHeight={80}
              trigger={'@'}
              triggerLocation={'new-word-only'}
              triggerCallback={this.filterUsers.bind(this)}
              renderSuggestionsRow={this.renderSuggestionsRow.bind(this)}
              suggestionsData={this.state.suggestedUsers}
              keyExtractor={(item, index) => item.key.toString()}
              suggestionRowHeight={45}
              horizontal={false}
              MaxVisibleRowCount={3}
            />
            <TouchableOpacity
              onPress={() => this.onSaveComment()}
              style={[
                styles.commentsActionButtons,
                {
                  paddingTop: 7,
                  marginRight: 60,
                },
                this.state.loadComments
                  ? { backgroundColor: '#e6e6e6' }
                  : { backgroundColor: Colors.tintColor },
                this.props.isRTL ? { paddingRight: 10 } : { paddingLeft: 10 },
              ]}>
              <Icon android="md-send" ios="ios-send" style={[{ color: 'white', fontSize: 25 }]} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleFilterView()}
              style={[
                styles.commentsActionButtons,
                {
                  marginRight: 10,
                },
              ]}>
              <Icon
                type="FontAwesome"
                name="filter"
                style={[
                  {
                    color: Colors.tintColor,
                    fontSize: 35,
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: 'auto',
                    marginBottom: 'auto',
                  },
                ]}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  connectionsView = () => (
    /*_viewable_*/
    <View style={{ flex: 1 }}>
      {this.state.onlyView ? (
        <View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={() => this.onRefresh(this.state.contact.ID)}
              />
            }>
            <View style={[styles.formContainer, { marginTop: 0 }]}>
              <Row style={[styles.formRow, { paddingTop: 15 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon
                    type="FontAwesome"
                    name="users"
                    style={[styles.formIcon, { marginTop: 0 }]}
                  />
                </Col>
                <Col>
                  <View>
                    {this.state.contact.groups ? (
                      this.state.contact.groups.values.map((group, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          activeOpacity={0.5}
                          onPress={() => this.goToGroupDetailScreen(group.value, group.name)}>
                          <Text
                            style={[
                              styles.linkingText,
                              { marginTop: 'auto', marginBottom: 'auto' },
                              this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                            ]}>
                            {group.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text></Text>
                    )}
                  </View>
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
                  <Icon
                    type="FontAwesome5"
                    name="user-friends"
                    style={[styles.formIcon, { marginTop: 0 }]}
                  />
                </Col>
                <Col>
                  <View>
                    {this.state.contact.relation ? (
                      this.state.contact.relation.values.map((contact, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          activeOpacity={0.5}
                          onPress={() => this.goToContactDetailScreen(contact.value, contact.name)}>
                          <Text
                            style={[
                              styles.linkingText,
                              { marginTop: 'auto', marginBottom: 'auto' },
                              this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                            ]}>
                            {contact.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text></Text>
                    )}
                  </View>
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
                  <Icon type="Entypo" name="water" style={[styles.formIcon, { marginTop: 0 }]} />
                </Col>
                <Col>
                  <View>
                    {this.state.contact.baptized_by ? (
                      this.state.contact.baptized_by.values.map((contact, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          activeOpacity={0.5}
                          onPress={() => this.goToContactDetailScreen(contact.value, contact.name)}>
                          <Text
                            style={[
                              styles.linkingText,
                              { marginTop: 'auto', marginBottom: 'auto' },
                              this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                            ]}>
                            {contact.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text></Text>
                    )}
                  </View>
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
                  <Icon
                    type="FontAwesome5"
                    name="water"
                    style={[styles.formIcon, { marginTop: 0 }]}
                  />
                </Col>
                <Col>
                  <View>
                    {this.state.contact.baptized ? (
                      this.state.contact.baptized.values.map((contact, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          activeOpacity={0.5}
                          onPress={() => this.goToContactDetailScreen(contact.value, contact.name)}>
                          <Text
                            style={[
                              styles.linkingText,
                              { marginTop: 'auto', marginBottom: 'auto' },
                              this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                            ]}>
                            {contact.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text></Text>
                    )}
                  </View>
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
                  <Icon
                    type="FontAwesome"
                    name="black-tie"
                    style={[styles.formIcon, { marginTop: 0 }]}
                  />
                </Col>
                <Col>
                  <View>
                    {this.state.contact.coached_by ? (
                      this.state.contact.coached_by.values.map((contact, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          activeOpacity={0.5}
                          onPress={() => this.goToContactDetailScreen(contact.value, contact.name)}>
                          <Text
                            style={[
                              styles.linkingText,
                              { marginTop: 'auto', marginBottom: 'auto' },
                              this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                            ]}>
                            {contact.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text></Text>
                    )}
                  </View>
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
                  <Icon
                    type="MaterialCommunityIcons"
                    name="presentation"
                    style={[styles.formIcon, { marginTop: 0 }]}
                  />
                </Col>
                <Col>
                  <View>
                    {this.state.contact.coaching ? (
                      this.state.contact.coaching.values.map((contact, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          activeOpacity={0.5}
                          onPress={() => this.goToContactDetailScreen(contact.value, contact.name)}>
                          <Text
                            style={[
                              styles.linkingText,
                              { marginTop: 'auto', marginBottom: 'auto' },
                              this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                            ]}>
                            {contact.name}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text></Text>
                    )}
                  </View>
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
        <KeyboardAwareScrollView /*_editable_*/
          enableAutomaticScroll
          enableOnAndroid
          keyboardOpeningTime={0}
          extraScrollHeight={150}
          keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <Row style={styles.formFieldMargin}>
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
                  items={[...this.state.connectionGroups, ...this.state.groups]}
                  selectedItems={this.getSelectizeItems(this.state.contact.groups, [
                    ...this.state.connectionGroups,
                    ...this.state.groups,
                  ])}
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
                      onClose={(props) => {
                        let foundGroupIndex = this.state.connectionGroups.findIndex(
                          (groupConnection) => groupConnection.value === id,
                        );
                        if (foundGroupIndex > -1) {
                          // Remove group from list
                          const connectionGroups = [...this.state.connectionGroups];
                          connectionGroups.splice(foundGroupIndex, 1);
                          this.setState({
                            connectionGroups: [...connectionGroups],
                          });
                        }
                        onClose(props);
                      }}
                      text={item.name}
                      style={style}
                    />
                  )}
                  filterOnKey="name"
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="FontAwesome5" name="user-friends" style={styles.formIcon} />
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
                  items={[...this.state.relationContacts, ...this.state.usersContacts]}
                  selectedItems={this.getSelectizeItems(this.state.contact.relation, [
                    ...this.state.relationContacts,
                    ...this.state.usersContacts,
                  ])}
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
                      onClose={(props) => {
                        let foundRelationIndex = this.state.relationContacts.findIndex(
                          (relation) => relation.value === id,
                        );
                        if (foundRelationIndex > -1) {
                          // Remove relation from list
                          const relationContacts = [...this.state.relationContacts];
                          relationContacts.splice(foundRelationIndex, 1);
                          this.setState({
                            relationContacts: [...relationContacts],
                          });
                        }
                        onClose(props);
                      }}
                      text={item.name}
                      style={style}
                    />
                  )}
                  filterOnKey="name"
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
            <Row style={styles.formFieldMargin}>
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
                  items={[...this.state.baptizedByContacts, ...this.state.usersContacts]}
                  selectedItems={this.getSelectizeItems(this.state.contact.baptized_by, [
                    ...this.state.baptizedByContacts,
                    ...this.state.usersContacts,
                  ])}
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
                      onClose={(props) => {
                        let foundBaptizedByIndex = this.state.baptizedByContacts.findIndex(
                          (baptized) => baptized.value === id,
                        );
                        if (foundBaptizedByIndex > -1) {
                          // Remove baptized from list
                          const baptizedByContacts = [...this.state.baptizedByContacts];
                          baptizedByContacts.splice(foundBaptizedByIndex, 1);
                          this.setState({
                            baptizedByContacts: [...baptizedByContacts],
                          });
                        }
                        onClose(props);
                      }}
                      text={item.name}
                      style={style}
                    />
                  )}
                  filterOnKey="name"
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="FontAwesome5" name="water" style={styles.formIcon} />
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
                  items={[...this.state.baptizedContacts, ...this.state.usersContacts]}
                  selectedItems={this.getSelectizeItems(this.state.contact.baptized, [
                    ...this.state.baptizedContacts,
                    ...this.state.usersContacts,
                  ])}
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
                      onClose={(props) => {
                        let foundBaptizedIndex = this.state.baptizedContacts.findIndex(
                          (baptized) => baptized.value === id,
                        );
                        if (foundBaptizedIndex > -1) {
                          // Remove baptized from list
                          const baptizedContacts = [...this.state.baptizedContacts];
                          baptizedContacts.splice(foundBaptizedIndex, 1);
                          this.setState({
                            baptizedContacts: [...baptizedContacts],
                          });
                        }
                        onClose(props);
                      }}
                      text={item.name}
                      style={style}
                    />
                  )}
                  filterOnKey="name"
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
            <Row style={styles.formFieldMargin}>
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
                  items={[...this.state.coachedByContacts, ...this.state.usersContacts]}
                  selectedItems={this.getSelectizeItems(this.state.contact.coached_by, [
                    ...this.state.coachedByContacts,
                    ...this.state.usersContacts,
                  ])}
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
                      onClose={(props) => {
                        let foundCoachedByIndex = this.state.coachedByContacts.findIndex(
                          (coachedBy) => coachedBy.value === id,
                        );
                        if (foundCoachedByIndex > -1) {
                          // Remove coachedBy from list
                          const coachedByContacts = [...this.state.coachedByContacts];
                          coachedByContacts.splice(foundCoachedByIndex, 1);
                          this.setState({
                            coachedByContacts: [...coachedByContacts],
                          });
                        }
                        onClose(props);
                      }}
                      text={item.name}
                      style={style}
                    />
                  )}
                  filterOnKey="name"
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="MaterialCommunityIcons" name="presentation" style={styles.formIcon} />
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
                  items={[...this.state.coachedContacts, ...this.state.usersContacts]}
                  selectedItems={this.getSelectizeItems(this.state.contact.coaching, [
                    ...this.state.coachedContacts,
                    ...this.state.usersContacts,
                  ])}
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
                      onClose={(props) => {
                        let foundCoachedIndex = this.state.coachedContacts.findIndex(
                          (coached) => coached.value === id,
                        );
                        if (foundCoachedIndex > -1) {
                          // Remove coached from list
                          const coachedContacts = [...this.state.coachedContacts];
                          coachedContacts.splice(foundCoachedIndex, 1);
                          this.setState({
                            coachedContacts: [...coachedContacts],
                          });
                        }
                        onClose(props);
                      }}
                      text={item.name}
                      style={style}
                    />
                  )}
                  filterOnKey="name"
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
          </View>
        </KeyboardAwareScrollView>
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

  openCommentDialog = (comment, deleteComment = false) => {
    this.setState({
      commentDialog: {
        toggle: true,
        data: comment,
        delete: deleteComment,
      },
    });
  };

  renderActivityOrCommentRow = (commentOrActivity) => (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: commentOrActivity.data[0].gravatar }} />
      <View style={styles.content}>
        {
          // Comment
          commentOrActivity.data
            .sort((a, b) => {
              // Sort comments/activities group 'asc'
              return new Date(a.date) > new Date(b.date);
            })
            .map((item, index) => {
              return (
                <View>
                  {index === 0 && (
                    <View style={styles.contentHeader}>
                      <Grid>
                        <Row>
                          <Col>
                            <Text
                              style={[
                                styles.name,
                                this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                              ]}>
                              {Object.prototype.hasOwnProperty.call(item, 'content')
                                ? item.author
                                : item.name}
                            </Text>
                          </Col>
                          <Col style={{ width: 110 }}>
                            <Text
                              style={[
                                styles.time,
                                this.props.isRTL
                                  ? { textAlign: 'left', flex: 1 }
                                  : { textAlign: 'right' },
                              ]}>
                              {this.onFormatDateToView(item.date)}
                            </Text>
                          </Col>
                        </Row>
                      </Grid>
                    </View>
                  )}
                  <ParsedText
                    style={[
                      {
                        paddingLeft: 10,
                        paddingRight: 10,
                      },
                      Object.prototype.hasOwnProperty.call(item, 'object_note')
                        ? { color: '#B4B4B4', fontStyle: 'italic' }
                        : {},
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                      index > 0 ? { marginTop: 20 } : {},
                    ]}
                    parse={[
                      {
                        pattern: sharedTools.mentionPattern,
                        style: { color: Colors.primary },
                        renderText: sharedTools.renderMention,
                      },
                    ]}>
                    {Object.prototype.hasOwnProperty.call(item, 'content')
                      ? item.content
                      : this.formatActivityDate(item.object_note)}
                  </ParsedText>
                  {Object.prototype.hasOwnProperty.call(item, 'content') &&
                    item.author.toLowerCase() === this.props.userData.username.toLowerCase() && (
                      <Grid style={{ marginTop: 20 }}>
                        <Row
                          style={{
                            marginTop: 'auto',
                            marginBottom: 'auto',
                          }}>
                          <Row
                            style={{ marginLeft: 0, marginRight: 'auto' }}
                            onPress={() => {
                              this.openCommentDialog(item, true);
                            }}>
                            <Icon
                              type="MaterialCommunityIcons"
                              name="delete"
                              style={{
                                color: Colors.iconDelete,
                                fontSize: 20,
                              }}
                            />
                            <Text
                              style={{
                                color: Colors.primary,
                                fontSize: 14,
                              }}>
                              {i18n.t('global.delete')}
                            </Text>
                          </Row>
                          <Row
                            style={{
                              marginLeft: 'auto',
                              marginRight: 0,
                            }}
                            onPress={() => {
                              this.openCommentDialog(item);
                            }}>
                            <Icon
                              type="MaterialCommunityIcons"
                              name="pencil"
                              style={{
                                color: Colors.primary,
                                fontSize: 20,
                                marginLeft: 'auto',
                              }}
                            />
                            <Text
                              style={{
                                color: Colors.primary,
                                fontSize: 14,
                              }}>
                              {i18n.t('global.edit')}
                            </Text>
                          </Row>
                        </Row>
                      </Grid>
                    )}
                </View>
              );
            })
        }
      </View>
    </View>
  );

  renderPickerItems = (items) =>
    items.map((item) => {
      return (
        <Picker.Item key={item.key} label={item.label + ' (#' + item.key + ')'} value={item.key} />
      );
    });

  renderSourcePickerItems = () =>
    this.state.sources.map((source) => {
      return <Picker.Item key={source.value} label={source.name} value={source.value} />;
    });

  renderStatusPickerItems = () =>
    Object.keys(this.props.contactSettings.fields.overall_status.values).map((key) => {
      const optionData = this.props.contactSettings.fields.overall_status.values[key];
      return <Picker.Item key={key} label={optionData.label} value={key} />;
    });

  tabChanged = (index) => {
    // Hide tabBar when tab its in 'comments' section
    /*this.props.navigation.setParams({
      hideTabBar: (index === 2 && this.state.onlyView) || !this.state.onlyView,
    });*/
    this.setState((prevState) => ({
      tabViewConfig: {
        ...prevState.tabViewConfig,
        index,
      },
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

  onSelectAssignedTo = (value) => {
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        assigned_to: {
          key: value,
          label: [...this.state.users, ...this.state.assignedToContacts].find(
            (user) => user.key === value,
          ).label,
        },
      },
      showAssignedToModal: false,
      assignedToContacts: [], // Clear non existing assigentToContacts list
    }));
  };

  onCancelAssignedTo = () => {
    this.setState({
      showAssignedToModal: false,
    });
  };

  renderContactLink = (assignedTo) => {
    let foundContact, valueToSearch, nameToShow;
    if (assignedTo.key) {
      valueToSearch = assignedTo.key;
      nameToShow = assignedTo.label;
    } else if (assignedTo.value) {
      valueToSearch = assignedTo.value;
      nameToShow = assignedTo.name;
    }
    foundContact = this.state.users.find(
      (user) => user.key === parseInt(valueToSearch) || user.contactID === parseInt(valueToSearch),
    );
    if (!foundContact) {
      foundContact = this.state.usersContacts.find(
        (user) => user.value === valueToSearch.toString(),
      );
    }
    // User have accesss to this assigned_to user/contact
    if (foundContact && foundContact.contactID) {
      // Contact exist in 'this.state.users' list
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this.goToContactDetailScreen(foundContact.contactID, nameToShow)}>
          <Text
            style={[styles.linkingText, this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
            {nameToShow}
          </Text>
        </TouchableOpacity>
      );
    } else if (foundContact) {
      // Contact exist in 'this.state.usersContacts' list
      return (
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => this.goToContactDetailScreen(valueToSearch, nameToShow)}>
          <Text
            style={[styles.linkingText, this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
            {nameToShow}
          </Text>
        </TouchableOpacity>
      );
    } else {
      // User does not exist in any list
      return (
        <Text
          style={[
            { marginTop: 4, marginBottom: 4, fontSize: 15 },
            this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
          ]}>
          {nameToShow}
        </Text>
      );
    }
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
    contactSocialMediaFacebookList.unshift({
      value: '',
    });
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        contact_facebook: contactSocialMediaFacebookList,
      },
    }));
  };

  onCloseCommentDialog() {
    this.setState({
      commentDialog: {
        toggle: false,
        data: {},
        delete: false,
      },
    });
  }

  onUpdateComment(commentData) {
    this.props.saveComment(
      this.props.userData.domain,
      this.props.userData.token,
      this.state.contact.ID,
      commentData,
    );
    this.onCloseCommentDialog();
  }

  onDeleteComment(commentData) {
    this.props.deleteComment(
      this.props.userData.domain,
      this.props.userData.token,
      this.state.contact.ID,
      commentData.ID,
    );
    this.onCloseCommentDialog();
  }

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
    Object.keys(this.props.contactSettings.channels)
      .filter(
        (channelName) =>
          channelName !== 'phone' && channelName !== 'email' && channelName !== 'address',
      )
      .map((channelName, index) => (
        <Picker.Item
          key={index.toString()}
          label={this.props.contactSettings.channels[channelName].label}
          value={this.props.contactSettings.channels[channelName].value}
        />
      ));

  renderSocialMediaField = (socialMediaIndex, socialMedia, propertyName, channelName) => (
    <Row key={socialMediaIndex.toString()} style={{ marginBottom: 20 }}>
      <Col style={styles.formIconLabelCol}>
        <View style={styles.formIconLabelView}>
          <Icon type="Ionicons" name="chatboxes" style={[styles.formIcon, { opacity: 0 }]} />
        </View>
      </Col>
      <Col>
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
          style={[styles.contactTextField, { marginBottom: 10 }]}
          autoCapitalize="none"
          placeholder={i18n.t('contactDetailScreen.socialMedia')}
        />
        <Row style={[styles.contactTextRoundField, { paddingRight: 10 }]}>
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
          style={[styles.formIcon, styles.addRemoveIcons, styles.removeIcons]}
          onPress={() => {
            this.onRemoveSocialMediaField(propertyName, socialMediaIndex, this);
          }}
        />
      </Col>
    </Row>
  );

  searchLocationsDelayed = sharedTools.debounce((queryText) => {
    this.setState(
      {
        foundGeonames: [],
      },
      () => {
        if (queryText.length > 0) {
          this.searchLocations(queryText);
        }
      },
    );
  }, 750);

  searchLocations = (queryText) => {
    this.props.searchLocations(this.props.userData.domain, this.props.userData.token, queryText);
  };

  onMeetingComplete = () => {
    this.onSaveQuickAction('quick_button_meeting_complete');
    var isQuestionnaireEnabled = false;
    var q_id = null;
    // loop thru all (active) questionnaires, and check whether 'contact'->'meeting_complete' is enabled
    this.props.questionnaires.map((questionnaire) => {
      if (
        questionnaire.trigger_type == 'contact' &&
        questionnaire.trigger_value == 'meeting_complete'
      ) {
        isQuestionnaireEnabled = true;
        q_id = questionnaire.id;
      }
    });
    if (isQuestionnaireEnabled) {
      this.props.navigation.navigate(
        NavigationActions.navigate({
          routeName: 'Questionnaire',
          action: NavigationActions.navigate({
            routeName: 'Question',
            params: {
              userData: this.props.userData,
              contact: this.state.contact,
              q_id,
            },
          }),
        }),
      );
    }
  };

  onSaveQuickAction = (quickActionPropertyName) => {
    let newActionValue = this.state.contact[quickActionPropertyName]
      ? parseInt(this.state.contact[quickActionPropertyName], 10) + 1
      : 1;
    if (this.props.isConnected) {
      this.onSaveContact({
        [quickActionPropertyName]: newActionValue,
      });
    } else {
      // Update Seeker Path in OFFLINE mode
      let seekerPathValue = null;
      let quickActionName = quickActionPropertyName.replace('quick_button_', '');
      switch (quickActionName) {
        case 'no_answer': {
          seekerPathValue = 'attempted';
          break;
        }
        case 'contact_established': {
          seekerPathValue = 'established';
          break;
        }
        case 'meeting_scheduled': {
          seekerPathValue = 'scheduled';
          break;
        }
        case 'meeting_complete': {
          seekerPathValue = 'met';
          break;
        }
      }
      if (seekerPathValue && this.state.contact.seeker_path != 'met') {
        this.setState(
          (prevState) => ({
            contact: {
              ...prevState.contact,
              seeker_path: seekerPathValue,
            },
          }),
          () => {
            this.onSaveContact({
              [quickActionPropertyName]: newActionValue,
            });
          },
        );
      } else {
        this.onSaveContact({
          [quickActionPropertyName]: newActionValue,
        });
      }
    }
  };

  render() {
    const successToast = (
      <Toast
        ref={(toast) => {
          toastSuccess = toast;
        }}
        style={{ backgroundColor: Colors.successBackground }}
        positionValue={250}
      />
    );
    const errorToast = (
      <Toast
        ref={(toast) => {
          toastError = toast;
        }}
        style={{ backgroundColor: Colors.errorBackground }}
        positionValue={250}
      />
    );
    return (
      <View style={{ flex: 1 }}>
        {this.state.loadedLocal && (
          <View style={{ flex: 1 }}>
            {this.state.contact.ID ? (
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                  {!this.props.isConnected && this.offlineBarRender()}
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
                          <Text style={{ color, fontWeight: 'bold' }}>{i18n.t(route.title)}</Text>
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
                  {this.state.onlyView && this.state.tabViewConfig.index != 2 && (
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
                        title={this.props.contactSettings.fields.quick_button_no_answer.name}
                        onPress={() => {
                          this.onSaveQuickAction('quick_button_no_answer');
                        }}
                        size={40}
                        buttonColor={Colors.colorNo}
                        nativeFeedbackRippleColor="rgba(0,0,0,0)"
                        textStyle={{ color: Colors.tintColor, fontSize: 15 }}
                        textContainerStyle={{ height: 'auto' }}>
                        <Icon type="Feather" name="phone-off" style={styles.contactFABIcon} />
                      </ActionButton.Item>
                      <ActionButton.Item
                        title={
                          this.props.contactSettings.fields.quick_button_contact_established.name
                        }
                        onPress={() => {
                          this.onSaveQuickAction('quick_button_contact_established');
                        }}
                        size={40}
                        buttonColor={Colors.colorYes}
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
                        title={
                          this.props.contactSettings.fields.quick_button_meeting_scheduled.name
                        }
                        onPress={() => {
                          this.onSaveQuickAction('quick_button_meeting_scheduled');
                        }}
                        buttonColor={Colors.colorWait}
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
                        title={this.props.contactSettings.fields.quick_button_meeting_complete.name}
                        onPress={() => {
                          this.onMeetingComplete();
                        }}
                        size={40}
                        buttonColor={Colors.colorYes}
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
                        title={this.props.contactSettings.fields.quick_button_no_show.name}
                        onPress={() => {
                          this.onSaveQuickAction('quick_button_no_show');
                        }}
                        size={40}
                        buttonColor={Colors.colorNo}
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
                  {this.state.commentDialog.toggle ? (
                    <BlurView
                      tint="dark"
                      intensity={50}
                      style={[
                        styles.dialogBackground,
                        {
                          width: windowWidth,
                          height: windowHeight,
                        },
                      ]}>
                      <KeyboardAvoidingView
                        behavior={'position'}
                        contentContainerStyle={{
                          height: windowHeight / 1.5,
                        }}>
                        <View style={styles.dialogBox}>
                          <Grid>
                            <Row>
                              {this.state.commentDialog.delete ? (
                                <View style={styles.dialogContent}>
                                  <Row style={{ height: 30 }}>
                                    <Label style={[styles.name, { marginBottom: 5 }]}>
                                      {i18n.t('global.delete')}
                                    </Label>
                                  </Row>
                                  <Row>
                                    <Text style={{ fontSize: 15 }}>
                                      {this.state.commentDialog.data.content}
                                    </Text>
                                  </Row>
                                </View>
                              ) : (
                                <View style={styles.dialogContent}>
                                  <Grid>
                                    <Row style={{ height: 30 }}>
                                      <Label style={[styles.name, { marginBottom: 5 }]}>
                                        {i18n.t('global.edit')}
                                      </Label>
                                    </Row>
                                    <Row>
                                      <Input
                                        multiline
                                        value={this.state.commentDialog.data.content}
                                        onChangeText={(value) => {
                                          this.setState((prevState) => ({
                                            commentDialog: {
                                              ...prevState.commentDialog,
                                              data: {
                                                ...prevState.commentDialog.data,
                                                content: value,
                                              },
                                            },
                                          }));
                                        }}
                                        style={[
                                          styles.contactTextField,
                                          { height: 'auto', minHeight: 50 },
                                        ]}
                                      />
                                    </Row>
                                  </Grid>
                                </View>
                              )}
                            </Row>
                            <Row style={{ height: 60 }}>
                              <Button
                                transparent
                                style={{
                                  marginTop: 20,
                                  marginLeft: 'auto',
                                  marginRight: 'auto',
                                  marginBottom: 'auto',
                                  paddingLeft: 25,
                                  paddingRight: 25,
                                }}
                                onPress={() => {
                                  this.onCloseCommentDialog();
                                }}>
                                <Text style={{ color: Colors.primary }}>
                                  {i18n.t('global.close')}
                                </Text>
                              </Button>
                              {this.state.commentDialog.delete ? (
                                <Button
                                  block
                                  style={[
                                    styles.dialogButton,
                                    { backgroundColor: Colors.buttonDelete },
                                  ]}
                                  onPress={() => {
                                    this.onDeleteComment(this.state.commentDialog.data);
                                  }}>
                                  <Text style={{ color: Colors.buttonText }}>
                                    {i18n.t('global.delete')}
                                  </Text>
                                </Button>
                              ) : (
                                <Button
                                  block
                                  style={styles.dialogButton}
                                  onPress={() => {
                                    this.onUpdateComment(this.state.commentDialog.data);
                                  }}>
                                  <Text style={{ color: Colors.buttonText }}>
                                    {i18n.t('global.save')}
                                  </Text>
                                </Button>
                              )}
                            </Row>
                          </Grid>
                        </View>
                      </KeyboardAvoidingView>
                    </BlurView>
                  ) : null}
                </View>
              </View>
            ) : (
              <KeyboardAwareScrollView /*_addnew_ _editable_*/
                enableAutomaticScroll
                enableOnAndroid
                keyboardOpeningTime={0}
                extraScrollHeight={150}
                keyboardShouldPersistTaps="handled">
                {!this.props.isConnected && this.offlineBarRender()}
                <View style={styles.formContainer}>
                  <Grid>
                    <Row style={styles.formFieldMargin}>
                      <Col style={styles.formIconLabelCol}>
                        <View style={styles.formIconLabelView}>
                          <Icon type="FontAwesome" name="user" style={styles.formIcon} />
                        </View>
                      </Col>
                      <Col>
                        <Label style={[styles.formLabel, {}]}>
                          {i18n.t('contactDetailScreen.fullName.label')}
                        </Label>
                      </Col>
                    </Row>
                    <Row
                      style={
                        this.state.nameRequired
                          ? {
                              backgroundColor: '#FFE6E6',
                              borderWidth: 2,
                              borderColor: Colors.errorBackground,
                            }
                          : null
                      }>
                      <Input
                        placeholder={i18n.t('global.requiredField')}
                        onChangeText={this.setContactTitle}
                        style={
                          this.state.nameRequired
                            ? [styles.contactTextField, { borderBottomWidth: 0 }]
                            : styles.contactTextField
                        }
                      />
                    </Row>
                    {this.state.nameRequired ? (
                      <Text style={styles.validationErrorMessage}>
                        {i18n.t('contactDetailScreen.fullName.error')}
                      </Text>
                    ) : null}
                    <Row style={styles.formFieldMargin}>
                      <Col style={styles.formIconLabelCol}>
                        <View style={styles.formIconLabelView}>
                          <Icon
                            type="FontAwesome"
                            name="phone"
                            style={[styles.formIcon, { fontSize: 20 }]}
                          />
                        </View>
                      </Col>
                      <Col>
                        <Label style={[styles.formLabel, {}]}>
                          {i18n.t('contactDetailScreen.phoneNumber')}
                        </Label>
                      </Col>
                    </Row>
                    <Row>
                      <Input
                        onChangeText={this.setSingleContactPhone}
                        style={styles.contactTextRoundField}
                        keyboardType="phone-pad"
                      />
                    </Row>
                    <Row style={styles.formFieldMargin}>
                      <Col style={styles.formIconLabelCol}>
                        <View style={styles.formIconLabelView}>
                          <Icon type="FontAwesome" name="envelope" style={styles.formIcon} />
                        </View>
                      </Col>
                      <Col>
                        <Label style={[styles.formLabel, {}]}>
                          {this.props.contactSettings.channels.email.label}
                        </Label>
                      </Col>
                    </Row>
                    <Row>
                      <Input
                        onChangeText={this.setContactEmail}
                        style={styles.contactTextRoundField}
                        keyboardType="email-address"
                      />
                    </Row>
                    <Row style={styles.formFieldMargin}>
                      <Col style={styles.formIconLabelCol}>
                        <View style={styles.formIconLabelView}>
                          <Icon
                            type="Ionicons"
                            name="chatboxes"
                            style={[styles.formIcon, { fontSize: 25 }]}
                          />
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
                          style={[styles.addRemoveIcons, styles.addIcons]}
                          onPress={this.onAddSocialMediaField}
                        />
                      </Col>
                    </Row>
                    {Object.keys(this.props.contactSettings.channels)
                      .filter(
                        (channelName) =>
                          channelName !== 'phone' &&
                          channelName !== 'email' &&
                          channelName !== 'address',
                      )
                      .map((channelName, channelNameIndex) => {
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
                      })}
                    {Object.keys(this.props.contactSettings.channels)
                      .filter(
                        (channelName) =>
                          channelName !== 'phone' &&
                          channelName !== 'email' &&
                          channelName !== 'address',
                      )
                      .map((channelName, channelNameIndex) => {
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
                      })}
                    <Row style={styles.formFieldMargin}>
                      <Col style={styles.formIconLabelCol}>
                        <View style={styles.formIconLabelView}>
                          <Icon type="FontAwesome" name="comment" style={styles.formIcon} />
                        </View>
                      </Col>
                      <Col>
                        <Label style={[styles.formLabel, {}]}>
                          {i18n.t('contactDetailScreen.initialComment')}
                        </Label>
                      </Col>
                    </Row>
                    <Row>
                      <Textarea
                        onChangeText={this.setContactInitialComment}
                        style={[styles.contactTextRoundField, { width: '100%' }]}
                      />
                    </Row>
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
                      <View>
                        <Row style={styles.formFieldMargin}>
                          <Col style={styles.formIconLabelCol}>
                            <View style={styles.formIconLabelView}>
                              <Icon
                                type="MaterialCommunityIcons"
                                name="gender-male-female"
                                style={[styles.formIcon, { fontSize: 25 }]}
                              />
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
                                type="MaterialCommunityIcons"
                                name="gender-male-female"
                                style={[styles.formIcon, { opacity: 0 }]}
                              />
                            </View>
                          </Col>
                          <Col style={[styles.contactTextRoundField, { paddingRight: 10 }]}>
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
                        <Row style={styles.formFieldMargin}>
                          <Col style={styles.formIconLabelCol}>
                            <View style={styles.formIconLabelView}>
                              <Icon
                                type="FontAwesome5"
                                name="user-clock"
                                style={[styles.formIcon, { fontSize: 20 }]}
                              />
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
                                type="FontAwesome5"
                                name="user-clock"
                                style={[styles.formIcon, { opacity: 0 }]}
                              />
                            </View>
                          </Col>
                          <Col style={[styles.contactTextRoundField, { paddingRight: 10 }]}>
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
                        <Row style={styles.formFieldMargin}>
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
                              selectedItems={this.getSelectizeItems(
                                this.state.contact.people_groups,
                                this.state.peopleGroups,
                              )}
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
                              inputContainerStyle={styles.selectizeField}
                            />
                          </Col>
                        </Row>
                        <Row style={styles.formFieldMargin}>
                          <Col style={styles.formIconLabelCol}>
                            <View style={styles.formIconLabelView}>
                              <Icon type="Entypo" name="home" style={styles.formIcon} />
                            </View>
                          </Col>
                          <Col>
                            <Label style={styles.formLabel}>
                              {this.props.contactSettings.channels.address.label}
                            </Label>
                          </Col>
                          <Col style={styles.formIconLabel}>
                            <Icon
                              android="md-add"
                              ios="ios-add"
                              style={[styles.addRemoveIcons, styles.addIcons]}
                              onPress={this.onAddAddressField}
                            />
                          </Col>
                        </Row>
                        {this.state.contact.contact_address ? (
                          this.state.contact.contact_address.map((address, index) =>
                            !address.delete ? (
                              <Row key={index.toString()} style={{ marginBottom: 10 }}>
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
                                    style={styles.contactTextField}
                                  />
                                </Col>
                                <Col style={styles.formIconLabel}>
                                  <Icon
                                    android="md-remove"
                                    ios="ios-remove"
                                    style={[
                                      styles.formIcon,
                                      styles.addRemoveIcons,
                                      styles.removeIcons,
                                    ]}
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
                        <Row style={styles.formFieldMargin}>
                          <Col style={styles.formIconLabelCol}>
                            <View style={styles.formIconLabelView}>
                              <Icon type="FontAwesome" name="map-marker" style={styles.formIcon} />
                            </View>
                          </Col>
                          <Col>
                            <Label style={[styles.formLabel, { marginTop: 10, marginBottom: 5 }]}>
                              {this.props.contactSettings.fields.location_grid.name}
                            </Label>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <Selectize
                              ref={(selectize) => {
                                geonamesSelectizeRef = selectize;
                              }}
                              itemId="value"
                              items={this.state.foundGeonames}
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
                              inputContainerStyle={styles.selectizeField}
                              textInputProps={{
                                onChangeText: this.searchLocationsDelayed,
                              }}
                            />
                          </Col>
                        </Row>
                        <Row style={styles.formFieldMargin}>
                          <Col style={styles.formIconLabelCol}>
                            <View style={styles.formIconLabelView}>
                              <Icon type="Foundation" name="arrow-right" style={styles.formIcon} />
                            </View>
                          </Col>
                          <Col>
                            <Label style={[styles.formLabel, { marginTop: 10, marginBottom: 5 }]}>
                              {this.props.contactSettings.fields.sources.name}
                            </Label>
                          </Col>
                        </Row>
                        <Row style={[styles.contactTextRoundField, { paddingRight: 10 }]}>
                          <Picker
                            onValueChange={this.setContactSource}
                            selectedValue={this.state.contact.sources.values[0].value}>
                            {this.renderSourcePickerItems()}
                          </Picker>
                        </Row>
                      </View>
                    ) : null}
                  </Grid>
                </View>
              </KeyboardAwareScrollView>
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
  newComment: PropTypes.bool,
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
        key: PropTypes.number,
        label: PropTypes.string,
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
  isRTL: false,
  questionnaires: [],
  previousContacts: [],
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
  foundGeonames: state.groupsReducer.foundGeonames,
  groupsList: state.groupsReducer.groups,
  contactsList: state.contactsReducer.contacts,
  isRTL: state.i18nReducer.isRTL,
  questionnaires: state.questionnaireReducer.questionnaires,
  previousContacts: state.contactsReducer.previousContacts,
  previousGroups: state.groupsReducer.previousGroups,
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
  getComments: (domain, token, contactId, pagination) => {
    dispatch(getCommentsByContact(domain, token, contactId, pagination));
  },
  saveComment: (domain, token, contactId, commentData) => {
    dispatch(saveComment(domain, token, contactId, commentData));
  },
  getActivities: (domain, token, contactId, pagination) => {
    dispatch(getActivitiesByContact(domain, token, contactId, pagination));
  },
  endSaveContact: () => {
    dispatch(saveEnd());
  },
  searchLocations: (domain, token, queryText) => {
    dispatch(searchLocations(domain, token, queryText));
  },
  deleteComment: (domain, token, contactId, commentId) => {
    dispatch(deleteComment(domain, token, contactId, commentId));
  },
  loadingFalse: () => {
    dispatch(loadingFalse());
  },
  updatePrevious: (previousContacts) => {
    dispatch(updatePrevious(previousContacts));
  },
  updatePreviousGroups: (previousGroups) => {
    dispatch(updatePreviousGroups(previousGroups));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetailScreen);
