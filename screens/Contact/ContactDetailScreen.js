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
import Menu, { MenuItem } from 'react-native-material-menu';

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
  getShareSettings,
  addUserToShare,
  removeUserToShare,
} from '../../store/actions/contacts.actions';
import {
  updatePrevious as updatePreviousGroups,
  searchLocations,
} from '../../store/actions/groups.actions';
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

let toastSuccess;
let toastError;
const containerPadding = 20;
const windowWidth = Dimensions.get('window').width;
const milestonesGridSize = windowWidth + 5;
const windowHeight = Dimensions.get('window').height;
let keyboardDidShowListener, keyboardDidHideListener, focusListener, hardwareBackPressListener;
const isIOS = Platform.OS === 'ios';
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
let self;
const styles = StyleSheet.create({
  tabBarUnderlineStyle: {
    backgroundColor: Colors.tintColor,
  },
  tabStyle: { backgroundColor: '#FFFFFF' },
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
    width: 25,
  },
  formParentLabel: {
    width: 'auto',
    maxWidth: 100,
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
  overallStatusBackgroundColor: '#ffffff',
  loading: false,
  tabViewConfig: {
    index: 0,
    routes: [],
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
  showShareView: false,
  sharedUsers: [],
  showReasonStatusView: false,
  selectedReasonStatus: {
    key: null,
    value: null,
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
          <Row>
            <Row onPress={params.onEnableEdit}>
              <Text
                style={{ color: Colors.headerTintColor, marginTop: 'auto', marginBottom: 'auto' }}>
                {i18n.t('global.edit')}
              </Text>
              <Icon
                type="MaterialCommunityIcons"
                name="pencil"
                style={{
                  color: Colors.headerTintColor,
                  marginTop: 'auto',
                  marginBottom: 'auto',
                  fontSize: 24,
                }}
              />
            </Row>
            <Row
              onPress={() => {
                params.toggleMenu(true, this.menuRef);
              }}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingLeft: 12,
                  paddingRight: 12,
                }}>
                <Menu
                  ref={(menu) => {
                    if (menu) {
                      this.menuRef = menu;
                    }
                  }}
                  button={
                    <Icon
                      type="Entypo"
                      name="dots-three-vertical"
                      style={{
                        color: Colors.headerTintColor,
                        fontSize: 20,
                      }}
                    />
                  }>
                  <MenuItem
                    onPress={() => {
                      params.toggleMenu(false, this.menuRef);
                      params.toggleShareView();
                    }}>
                    {i18n.t('global.share')}
                  </MenuItem>
                </Menu>
              </View>
            </Row>
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
              android: 180,
              ios: 140,
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
    tabViewConfig: {
      ...initialState.tabViewConfig,
      routes: this.getRoutesWithRender(),
    },
  };

  getRoutesWithRender() {
    return [
      ...this.props.contactSettings.tiles.map((tile) => {
        return {
          key: tile.name,
          title: tile.label,
          render: () => {
            return this.renderCustomView(tile.fields);
          },
        };
      }),
      {
        key: 'comments',
        title: i18n.t('global.commentsActivity'),
        render: () => {
          return this.commentsView();
        },
      },
    ];
  }

  renderCreationFields() {
    let creationFields = [];
    this.props.contactSettings.tiles.forEach((tile) => {
      let creationFieldsByTile = tile.fields.filter(
        (field) =>
          Object.prototype.hasOwnProperty.call(field, 'in_create_form') &&
          field.in_create_form === true,
      );
      if (creationFieldsByTile.length > 0) {
        creationFields.push(...creationFieldsByTile);
      }
    });
    return creationFields;
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.onLoad();

    let params = {
      onEnableEdit: this.onEnableEdit.bind(this),
      onDisableEdit: this.onDisableEdit.bind(this),
      onSaveContact: this.onSaveContact.bind(this),
      backButtonTap: this.backButtonTap.bind(this),
      toggleMenu: this.toggleMenu.bind(this),
      toggleShareView: this.toggleShareView.bind(this),
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
      if (this.contactIsCreated()) {
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
      loadingShare,
      shareSettings,
      navigation,
    } = nextProps;
    let newState = {
      ...prevState,
      loading: loading || loadingShare,
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
        let contactReasonStatusKey = `reason_${newState.contact.overall_status}`;
        // CONTACT HAS STATUS WITH REASON
        let contactHasStatusReason = Object.prototype.hasOwnProperty.call(
          newState.contact,
          contactReasonStatusKey,
        );
        if (contactHasStatusReason) {
          newState = {
            ...newState,
            selectedReasonStatus: {
              key: contactReasonStatusKey,
              value: newState.contact[contactReasonStatusKey],
            },
            unmodifiedSelectedReasonStatus: {
              key: contactReasonStatusKey,
              value: newState.contact[contactReasonStatusKey],
            },
          };
        }
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
        navigation.state.params.contactId &&
        Object.prototype.hasOwnProperty.call(comments, navigation.state.params.contactId)
      ) {
        // NEW COMMENTS (PAGINATION)
        if (comments[navigation.state.params.contactId].pagination.offset > 0) {
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
            ...comments[navigation.state.params.contactId],
          },
        };
      } else {
        newState = {
          ...newState,
          comments: {
            ...initialState.comments,
          },
        };
      }
    }

    // GET ACTIVITIES
    if (activities) {
      if (
        navigation.state.params.contactId &&
        Object.prototype.hasOwnProperty.call(activities, navigation.state.params.contactId)
      ) {
        // NEW ACTIVITIES (PAGINATION)
        if (activities[navigation.state.params.contactId].pagination.offset > 0) {
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
            ...activities[navigation.state.params.contactId],
          },
        };
      } else {
        newState = {
          ...newState,
          activities: {
            ...initialState.activities,
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

    if (shareSettings) {
      if (
        navigation.state.params.contactId &&
        Object.prototype.hasOwnProperty.call(shareSettings, navigation.state.params.contactId)
      ) {
        newState = {
          ...newState,
          sharedUsers: shareSettings[navigation.state.params.contactId],
        };
      }
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
      savedShare,
    } = this.props;

    // NEW COMMENT
    if (newComment && prevProps.newComment !== newComment) {
      // Only do scroll when element its rendered
      if (this.commentsFlatListRef) {
        this.commentsFlatListRef.scrollToOffset({ animated: true, offset: 0 });
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
        (Object.prototype.hasOwnProperty.call(contact, 'ID') &&
          !Object.prototype.hasOwnProperty.call(this.state.contact, 'ID')) ||
        (Object.prototype.hasOwnProperty.call(contact, 'ID') &&
          contact.ID.toString() === this.state.contact.ID.toString()) ||
        (Object.prototype.hasOwnProperty.call(contact, 'oldID') &&
          contact.oldID === this.state.contact.ID.toString())
      ) {
        // Highlight Updates -> Compare this.state.contact with contact and show differences
        navigation.setParams({ contactName: contact.name, contactId: contact.ID });
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
              contactName: contact.name,
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
        // Highlight Updates -> Compare this.state.contact with current contact and show differences
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

    // Share Contact with user
    if (savedShare && prevProps.savedShare !== savedShare) {
      // Highlight Updates -> Compare this.state.contact with current contact and show differences
      this.onRefreshCommentsActivities(this.state.contact.ID, true);
      toastSuccess.show(
        <View>
          <Text style={{ color: Colors.sucessText }}>{i18n.t('global.success.save')}</Text>
        </View>,
        3000,
      );
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

  contactIsCreated = () =>
    Object.prototype.hasOwnProperty.call(this.props.navigation.state.params, 'contactId');

  onLoad() {
    const { navigation } = this.props;
    const { onlyView, contactId, contactName } = navigation.state.params;
    let newState = {};
    if (this.contactIsCreated()) {
      newState = {
        contact: {
          ID: contactId,
          name: contactName,
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
          name: null,
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
    this.setState(newState, () => {
      this.getLists();
    });
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
          name: currentParams.contactName,
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
      self.getShareSettings(contactId);
    }
  }

  onRefreshCommentsActivities(contactId, resetPagination = false) {
    this.getContactComments(contactId, resetPagination);
    this.getContactActivities(contactId, resetPagination);
  }

  getLists = async () => {
    let newState = {};

    const users = await ExpoFileSystemStorage.getItem('usersList');
    if (users !== null) {
      newState = {
        ...newState,
        users: JSON.parse(users).map((user) => {
          let newUser = {
            key: user.ID,
            label: user.name,
          };
          // Prevent 'null' values
          if (
            Object.prototype.hasOwnProperty.call(user, 'contact_id') &&
            sharedTools.isNumeric(user.contact_id)
          ) {
            newUser = {
              ...newUser,
              contactID: parseInt(user.contact_id),
            };
          }
          return newUser;
        }),
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
      if (this.contactIsCreated()) {
        this.onRefresh(this.state.contact.ID);
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

  getShareSettings(contactId) {
    this.props.getShareSettings(this.props.userData.domain, this.props.userData.token, contactId);
    if (this.state.showShareView) {
      this.toggleShareView();
    }
  }

  addUserToShare(userId) {
    this.props.addUserToShare(
      this.props.userData.domain,
      this.props.userData.token,
      this.state.contact.ID,
      userId,
    );
  }

  removeUserToShare(userId) {
    this.props.removeUserToShare(
      this.props.userData.domain,
      this.props.userData.token,
      this.state.contact.ID,
      userId,
    );
  }

  onEnableEdit = () => {
    this.setState((prevState) => {
      let indexFix = prevState.tabViewConfig.index;
      // Last tab (comments/activities)
      if (prevState.tabViewConfig.index === prevState.tabViewConfig.routes.length - 1) {
        indexFix = indexFix - 1; // -1 for commentsTab
      }
      return {
        onlyView: false,
        tabViewConfig: {
          ...prevState.tabViewConfig,
          index: indexFix,
          routes: this.getRoutesWithRender().filter(
            (route) => route.key !== 'comments', // && route.key !== 'other',
          ),
        },
      };
    });
    this.props.navigation.setParams({
      hideTabBar: true,
      onlyView: false,
      contactName: this.state.contact.name,
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
      unmodifiedSelectedReasonStatus,
    } = this.state;
    this.setState((prevState) => {
      // Set correct index in Tab position according to view mode and current tab position
      let indexFix = prevState.tabViewConfig.index;
      let newState = {
        onlyView: true,
        contact: {
          ...unmodifiedContact,
        },
        overallStatusBackgroundColor: sharedTools.getSelectorColor(
          unmodifiedContact.overall_status,
        ),
        tabViewConfig: {
          ...prevState.tabViewConfig,
          index: indexFix,
          routes: this.getRoutesWithRender(),
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

      let contactReasonStatusKey = `reason_${unmodifiedContact.overall_status}`;
      let contactHasStatusReason = Object.prototype.hasOwnProperty.call(
        unmodifiedContact,
        contactReasonStatusKey,
      );
      // CONTACT HAS STATUS WITH REASON
      if (contactHasStatusReason) {
        newState = {
          ...newState,
          selectedReasonStatus: unmodifiedSelectedReasonStatus,
        };
      } else {
        newState = {
          ...newState,
          selectedReasonStatus: {
            key: null,
            value: null,
          },
        };
      }
      return newState;
    });
    this.props.navigation.setParams({ hideTabBar: false, onlyView: true });
  };

  onSelectizeValueChange = (propName, selectedItems) => {
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        [propName]: {
          values: sharedTools.getSelectizeValuesToSave(
            prevState.contact[propName] ? prevState.contact[propName].values : [],
            selectedItems,
          ),
        },
      },
    }));
  };

  setContactStatus = (value) => {
    let contactHaveReason = Object.prototype.hasOwnProperty.call(
      this.props.contactSettings.fields,
      `reason_${value}`,
    );
    this.setState((prevState) => {
      let newState = {
        contact: {
          ...prevState.contact,
          overall_status: value,
        },
        overallStatusBackgroundColor: sharedTools.getSelectorColor(value),
        showReasonStatusView: contactHaveReason,
      };

      if (contactHaveReason) {
        // SET FIRST REASON STATUS AS DEFAULT SELECTED OPTION
        let reasonValues = Object.keys(this.props.contactSettings.fields[`reason_${value}`].values);
        newState = {
          ...newState,
          selectedReasonStatus: {
            key: `reason_${value}`,
            value: reasonValues[0],
          },
        };
      }

      return newState;
    });
  };

  onSaveContact = (quickAction = {}) => {
    this.setState(
      {
        nameRequired: false,
      },
      () => {
        Keyboard.dismiss();
        if (this.state.contact.name && this.state.contact.name.length > 0) {
          const { unmodifiedContact } = this.state;
          let contactToSave = {
            ...this.state.contact,
          };
          if (
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_no_answer') ||
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_contact_established') ||
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_meeting_scheduled') ||
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_meeting_complete') ||
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_no_show')
          ) {
            contactToSave = {
              ...contactToSave,
              ...quickAction,
            };
          }
          contactToSave = {
            ...sharedTools.diff(unmodifiedContact, contactToSave),
            name: entities.encode(this.state.contact.name),
          };
          // Do not save fields with empty values
          Object.keys(contactToSave)
            .filter(
              (key) =>
                key.includes('contact_') &&
                Object.prototype.toString.call(contactToSave[key]) === '[object Array]' &&
                contactToSave[key].length > 0,
            )
            .forEach((key) => {
              contactToSave = {
                ...contactToSave,
                [key]: contactToSave[key].filter(
                  (socialMedia) =>
                    socialMedia.delete || (!socialMedia.delete && socialMedia.value.length > 0),
                ),
              };
            });
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
          //After 'sharedTools.diff()' method, ID is removed, then we add it again
          if (Object.prototype.hasOwnProperty.call(this.state.contact, 'ID')) {
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
          //Empty contact name
          this.setState({
            nameRequired: true,
          });
        }
      },
    );
  };

  formatActivityDate = (comment) => {
    let baptismDateRegex = /\{(\d+)\}+/;
    if (baptismDateRegex.test(comment)) {
      comment = comment.replace(baptismDateRegex, (match, timestamp) =>
        sharedTools.formatDateToView(timestamp * 1000),
      );
    }
    return comment;
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

  onCheckExistingMilestone = (milestoneName, customProp = null) => {
    let list = customProp ? this.state.contact[customProp] : this.state.contact.milestones;
    const milestonesList = list ? [...list.values] : [];
    // Return 'boolean' acording to milestone existing in the 'milestonesList'
    return milestonesList.some(
      (milestone) => milestone.value === milestoneName && !milestone.delete,
    );
  };

  onMilestoneChange = (milestoneName, customProp = null) => {
    let list = customProp ? this.state.contact[customProp] : this.state.contact.milestones;
    let propName = customProp ? customProp : 'milestones';
    const milestonesList = list ? [...list.values] : [];
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
        [propName]: {
          values: milestonesList,
        },
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

  toggleMenu = (value, menuRef) => {
    if (value) {
      menuRef.show();
    } else {
      menuRef.hide();
    }
  };

  toggleShareView = () => {
    this.setState((prevState) => ({
      showShareView: !prevState.showShareView,
    }));
  };

  renderConnectionLink = (
    connectionList,
    list,
    isGroup = false,
    search = false,
    keyName = null,
  ) => {
    let collection;
    if (this.isConnected) {
      collection = [...connectionList.values];
    } else {
      collection = this.getSelectizeItems(connectionList, list);
    }
    return collection.map((entity, index) => (
      <TouchableOpacity
        key={index.toString()}
        activeOpacity={0.5}
        onPress={() => {
          if (search) {
            const resetAction = StackActions.reset({
              index: 0,
              actions: [
                NavigationActions.navigate({
                  routeName: 'ContactList',
                  params: {
                    customFilter: {
                      [keyName]: entity.value,
                    },
                  },
                }),
              ],
            });
            this.props.navigation.dispatch(resetAction);
          } else if (isGroup) {
            this.goToGroupDetailScreen(entity.value, entity.name);
          } else {
            this.goToContactDetailScreen(entity.value, entity.name);
          }
        }}>
        <Text
          style={[
            styles.linkingText,
            { marginTop: 'auto', marginBottom: 'auto' },
            this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
          ]}>
          {entity.name}
        </Text>
      </TouchableOpacity>
    ));
  };

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
                this.commentsFlatListRef = flatList;
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
                <View key={index.toString()}>
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
                              {sharedTools.formatDateToView(item.date)}
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

  renderStatusPickerItems = () =>
    Object.keys(this.props.contactSettings.fields.overall_status.values).map((key) => {
      const optionData = this.props.contactSettings.fields.overall_status.values[key];
      return <Picker.Item key={key} label={optionData.label} value={key} />;
    });

  tabChanged = (index) => {
    this.setState((prevState) => ({
      tabViewConfig: {
        ...prevState.tabViewConfig,
        index,
      },
    }));
  };

  onAddCommunicationField = (key) => {
    const communicationList = this.state.contact[key] ? [...this.state.contact[key]] : [];
    communicationList.push({
      value: '',
    });
    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        [key]: communicationList,
      },
    }));
  };

  onCommunicationFieldChange = (key, value, index, dbIndex, component) => {
    const communicationList = [...component.state.contact[key]];
    let communicationItem = {
      ...communicationList[index],
    };
    communicationItem = {
      ...communicationItem,
      value,
    };
    if (dbIndex) {
      communicationItem = {
        ...communicationItem,
        key: dbIndex,
      };
    }
    communicationList[index] = {
      ...communicationItem,
    };
    component.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        [key]: communicationList,
      },
    }));
  };

  onRemoveCommunicationField = (key, index, component) => {
    const communicationList = [...component.state.contact[key]];
    let communicationItem = communicationList[index];
    if (communicationItem.key) {
      communicationItem = {
        key: communicationItem.key,
        delete: true,
      };
      communicationList[index] = communicationItem;
    } else {
      communicationList.splice(index, 1);
    }
    component.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        [key]: communicationList,
      },
    }));
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

  setFieldContentStyle(field) {
    let newStyles = {};
    if (field.type == 'key_select' || field.type == 'user_select') {
      newStyles = {
        ...styles.contactTextRoundField,
        paddingRight: 10,
      };
    }
    if (field.name == 'name' && this.state.nameRequired) {
      newStyles = {
        ...newStyles,
        backgroundColor: '#FFE6E6',
        borderWidth: 2,
        borderColor: Colors.errorBackground,
      };
    }
    return newStyles;
  }

  renderFieldIcon(field, detailMode = false, hideIcon = false) {
    let iconType = '',
      iconName = '';
    switch (field.type) {
      case 'location': {
        iconType = 'FontAwesome';
        iconName = 'map-marker';
        break;
      }
      case 'date': {
        iconType = 'MaterialIcons';
        iconName = 'date-range';
        break;
      }
      case 'connection': {
        iconType = 'FontAwesome';
        iconName = 'users';
        break;
      }
      case 'multi_select': {
        if (field.name.includes('tag')) {
          iconType = 'AntDesign';
          iconName = 'tags';
        } else {
          iconType = 'MaterialCommunityIcons';
          iconName = 'hexagon-multiple';
        }
        break;
      }
      case 'communication_channel': {
        if (field.name.includes('phone')) {
          iconType = 'FontAwesome';
          iconName = 'phone';
        } else if (field.name.includes('email')) {
          iconType = 'FontAwesome';
          iconName = 'envelope';
        } else if (field.name.includes('twitter')) {
          iconType = 'MaterialCommunityIcons';
          iconName = 'twitter';
        } else if (field.name.includes('facebook')) {
          iconType = 'MaterialCommunityIcons';
          iconName = 'facebook';
        } else {
          iconType = 'Feather';
          iconName = 'hash';
        }
        break;
      }
      case 'key_select': {
        iconType = 'MaterialCommunityIcons';
        iconName = 'hexagon';
        break;
      }
      case 'user_select': {
        iconType = 'FontAwesome';
        iconName = 'user';
        break;
      }
      default: {
        iconType = 'FontAwesome';
        iconName = 'user';
        break;
      }
    }
    return (
      <Icon
        type={iconType}
        name={iconName}
        style={[
          styles.formIcon,
          detailMode ? { marginTop: 0 } : {},
          hideIcon ? { opacity: 0 } : {},
        ]}
      />
    );
  }

  renderCustomView = (fields, createView = false) => (
    <View style={{ flex: 1 }}>
      {this.state.onlyView && createView === false ? (
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
              {fields.map((field, index) => (
                <View key={index.toString()}>
                  {field.name == 'overall_status' || field.name == 'milestones' ? (
                    this.renderFieldValue(field)
                  ) : (
                    <Row style={[styles.formRow, { paddingTop: 15 }]}>
                      <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                        {this.renderFieldIcon(field, true)}
                      </Col>
                      <Col>
                        <View>{this.renderFieldValue(field)}</View>
                      </Col>
                      <Col style={styles.formParentLabel}>
                        <Label style={styles.formLabel}>{field.label}</Label>
                      </Col>
                    </Row>
                  )}
                  {field.name == 'overall_status' ? null : <View style={styles.formDivider} />}
                </View>
              ))}
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
            {fields
              .filter((field) => field.name !== 'tags')
              .map((field, index) => (
                <View key={index.toString()}>
                  {field.name == 'overall_status' ||
                  field.name == 'milestones' ||
                  field.type == 'communication_channel' ? (
                    this.renderField(field)
                  ) : (
                    <Col>
                      <Row style={styles.formFieldMargin}>
                        <Col style={styles.formIconLabelCol}>
                          <View style={styles.formIconLabelView}>
                            {this.renderFieldIcon(field)}
                          </View>
                        </Col>
                        <Col>
                          <Label style={styles.formLabel}>{field.label}</Label>
                        </Col>
                      </Row>
                      <Row>
                        <Col style={styles.formIconLabelCol}>
                          <View style={styles.formIconLabelView}>
                            {this.renderFieldIcon(field, false, true)}
                          </View>
                        </Col>
                        <Col style={this.setFieldContentStyle(field)}>
                          {this.renderField(field)}
                        </Col>
                      </Row>
                      {field.name == 'name' && this.state.nameRequired ? (
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
                            <Text style={styles.validationErrorMessage}>
                              {i18n.t('contactDetailScreen.fullName.error')}
                            </Text>
                          </Col>
                        </Row>
                      ) : null}
                    </Col>
                  )}
                </View>
              ))}
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );

  renderFieldValue = (field) => {
    let propExist = Object.prototype.hasOwnProperty.call(this.state.contact, field.name);
    let mappedValue;
    let value = this.state.contact[field.name],
      valueType = field.type;
    let postType;
    if (Object.prototype.hasOwnProperty.call(field, 'post_type')) {
      postType = field.post_type;
    }
    switch (valueType) {
      case 'location': {
        if (propExist) {
          mappedValue = (
            <Text style={this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}}>
              {value.values.map((location) => location.name).join(', ')}
            </Text>
          );
        }
        break;
      }
      case 'date': {
        if (propExist && value.length > 0) {
          mappedValue = (
            <Text>
              {sharedTools.formatDateToView(
                sharedTools.isNumeric(value) ? parseInt(value) * 1000 : value,
              )}
            </Text>
          );
        }
        break;
      }
      case 'connection': {
        if (propExist) {
          let collection = [],
            isGroup = false;
          if (field.name === 'people_groups') {
            mappedValue = (
              <Text
                style={[
                  { marginTop: 'auto', marginBottom: 'auto' },
                  this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                ]}>
                {value.values
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
                  .join(', ')}
              </Text>
            );
          } else {
            switch (postType) {
              case 'contacts': {
                collection = [
                  ...this.state.subAssignedContacts,
                  ...this.state.relationContacts,
                  ...this.state.baptizedByContacts,
                  ...this.state.coachedByContacts,
                  ...this.state.coachedContacts,
                  ...this.state.usersContacts,
                ];
                break;
              }
              case 'groups': {
                collection = [...this.state.connectionGroups, ...this.state.groups];
                isGroup = true;
                break;
              }
              default: {
                break;
              }
            }
            mappedValue = this.renderConnectionLink(value, collection, isGroup);
          }
        }
        break;
      }
      case 'multi_select': {
        // Dont check field existence (propExist) to render all the options
        if (field.name == 'tags') {
          mappedValue = this.renderConnectionLink(
            value,
            this.props.tags.map((tag) => ({ value: tag, name: tag })),
            false,
            true,
            'tags',
          );
        } else if (field.name == 'milestones') {
          mappedValue = (
            <Col style={{ paddingBottom: 15 }}>
              <Row style={[styles.formRow, { paddingTop: 10 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="user" style={styles.formIcon} />
                </Col>
                <Col>
                  <Label
                    style={[
                      styles.formLabel,
                      { fontWeight: 'bold', marginBottom: 'auto', marginTop: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {field.label}
                  </Label>
                </Col>
              </Row>
              {this.renderfaithMilestones()}
              {this.renderCustomFaithMilestones()}
            </Col>
          );
        } else if (field.name == 'sources') {
          if (propExist) {
            mappedValue = (
              <Text
                style={[
                  { marginTop: 'auto', marginBottom: 'auto' },
                  this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                ]}>
                {value.values
                  .map(
                    (source) =>
                      this.state.sources.find((sourceItem) => sourceItem.value === source.value)
                        .name,
                  )
                  .join(', ')}
              </Text>
            );
          }
        } else {
          mappedValue = (
            <Row style={{ flexWrap: 'wrap' }}>
              {Object.keys(field.default).map((value, index) =>
                this.renderMultiSelectField(field, value, index),
              )}
            </Row>
          );
        }
        break;
      }
      case 'communication_channel': {
        if (propExist) {
          if (field.name.includes('phone')) {
            mappedValue = value
              .filter((communicationChannel) => !communicationChannel.delete)
              .map((communicationChannel, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  activeOpacity={0.5}
                  onPress={() => {
                    this.linkingPhoneDialer(communicationChannel.value);
                  }}>
                  <Text
                    style={[
                      styles.linkingText,
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {communicationChannel.value}
                  </Text>
                </TouchableOpacity>
              ));
          } else if (field.name.includes('email')) {
            mappedValue = value
              .filter((communicationChannel) => !communicationChannel.delete)
              .map((communicationChannel, index) => (
                <TouchableOpacity
                  key={index.toString()}
                  activeOpacity={0.5}
                  onPress={() => {
                    Linking.openURL('mailto:' + communicationChannel.value);
                  }}>
                  <Text
                    style={[
                      styles.linkingText,
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {communicationChannel.value}
                  </Text>
                </TouchableOpacity>
              ));
          } else {
            mappedValue = (
              <Text
                style={[
                  { marginTop: 'auto', marginBottom: 'auto' },
                  this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                ]}>
                {value
                  .filter((communicationChannel) => !communicationChannel.delete)
                  .map((communicationChannel) => communicationChannel.value)
                  .join(', ')}
              </Text>
            );
          }
        }
        break;
      }
      case 'key_select': {
        if (propExist) {
          if (field.name === 'overall_status') {
            mappedValue = (
              <Col>
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
                      {field.label}
                    </Label>
                  </Col>
                </Row>
                <Row
                  style={[styles.formRow, { paddingTop: 5, paddingBottom: 5 }]}
                  pointerEvents="none">
                  <Col
                    style={[
                      styles.statusFieldContainer,
                      Platform.select({
                        android: {
                          borderColor: this.state.overallStatusBackgroundColor,
                          backgroundColor: this.state.overallStatusBackgroundColor,
                        },
                      }),
                    ]}>
                    <Picker
                      selectedValue={value}
                      onValueChange={this.setContactStatus}
                      style={Platform.select({
                        android: {
                          color: '#ffffff',
                          backgroundColor: 'transparent',
                        },
                        ios: {
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
                <Row style={{ paddingBottom: 15 }}>
                  {Object.prototype.hasOwnProperty.call(
                    this.state.contact,
                    `reason_${this.state.contact.overall_status}`,
                  ) ? (
                    <Text>
                      (
                      {
                        this.props.contactSettings.fields[
                          `reason_${this.state.contact.overall_status}`
                        ].values[this.state.contact[`reason_${this.state.contact.overall_status}`]]
                          .label
                      }
                      )
                    </Text>
                  ) : null}
                </Row>
              </Col>
            );
          } else {
            mappedValue = (
              <Text style={this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}}>
                {field.default[value] ? field.default[value].label : ''}
              </Text>
            );
          }
        }
        break;
      }
      case 'user_select': {
        if (propExist) {
          mappedValue = this.renderContactLink(value);
        }
        break;
      }
      default: {
        if (propExist) {
          mappedValue = (
            <Text style={this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}}>
              {value.toString()}
            </Text>
          );
        }
        break;
      }
    }
    return mappedValue;
  };

  renderMultiSelectField = (field, value, index) => (
    <TouchableOpacity
      key={index.toString()}
      onPress={() => {
        if (!this.state.onlyView) {
          this.onMilestoneChange(value, field.name);
        }
      }}
      activeOpacity={1}
      underlayColor={
        this.onCheckExistingMilestone(value, field.name) ? Colors.tintColor : Colors.gray
      }
      style={{
        borderRadius: 10,
        backgroundColor: this.onCheckExistingMilestone(value, field.name)
          ? Colors.tintColor
          : Colors.gray,
        padding: 10,
        marginRight: 10,
        marginBottom: 10,
      }}>
      <Text
        style={[
          styles.progressIconText,
          {
            color: this.onCheckExistingMilestone(value, field.name) ? '#FFFFFF' : '#000000',
          },
        ]}>
        {entities.encode(field.default[value].label)}
      </Text>
    </TouchableOpacity>
  );

  renderField = (field) => {
    let propExist = Object.prototype.hasOwnProperty.call(this.state.contact, field.name);
    let mappedValue;
    let value = this.state.contact[field.name],
      valueType = field.type;
    let postType;
    if (Object.prototype.hasOwnProperty.call(field, 'post_type')) {
      postType = field.post_type;
    }
    switch (valueType) {
      case 'location': {
        mappedValue = (
          <Selectize
            itemId="value"
            items={this.state.foundGeonames}
            selectedItems={this.getSelectizeItems(
              this.state.contact[field.name],
              this.state.geonames,
            )}
            textInputProps={{
              placeholder: i18n.t('global.selectLocations'),
              onChangeText: this.searchLocationsDelayed,
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
            onChangeSelectedItems={(selectedItems) =>
              this.onSelectizeValueChange(field.name, selectedItems)
            }
            inputContainerStyle={styles.selectizeField}
          />
        );
        break;
      }
      case 'date': {
        mappedValue = (
          <Row>
            <DatePicker
              ref={(ref) => {
                this[`${field.name}Ref`] = ref;
              }}
              onDateChange={(dateValue) =>
                this.setContactCustomFieldValue(field.name, dateValue, valueType)
              }
              defaultDate={
                this.state.contact[field.name] && this.state.contact[field.name].length > 0
                  ? sharedTools.formatDateToDatePicker(this.state.contact[field.name] * 1000)
                  : ''
              }
            />
            <Icon
              type="AntDesign"
              name="close"
              style={[
                styles.formIcon,
                styles.addRemoveIcons,
                styles.removeIcons,
                { marginLeft: 'auto' },
              ]}
              onPress={() => this.setContactCustomFieldValue(field.name, null, valueType)}
            />
          </Row>
        );
        break;
      }
      case 'connection': {
        let listItems = [],
          placeholder = '';
        if (field.name == 'people_groups') {
          listItems = [...this.state.peopleGroups];
          placeholder = i18n.t('global.selectPeopleGroups');
        } else {
          switch (postType) {
            case 'contacts': {
              listItems = [...this.state.usersContacts];
              placeholder = i18n.t('global.searchContacts');
              break;
            }
            case 'groups': {
              listItems = [...this.state.groups];
              placeholder = i18n.t('groupDetailScreen.searchGroups');
              break;
            }
            default:
          }
        }
        mappedValue = (
          <Selectize
            itemId="value"
            items={listItems}
            selectedItems={this.getSelectizeItems(this.state.contact[field.name], listItems)}
            textInputProps={{
              placeholder: placeholder,
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
            onChangeSelectedItems={(selectedItems) =>
              this.onSelectizeValueChange(field.name, selectedItems)
            }
            inputContainerStyle={styles.selectizeField}
          />
        );
        break;
      }
      case 'multi_select': {
        if (field.name == 'sources') {
          mappedValue = (
            <Selectize
              itemId="value"
              items={this.state.sources}
              selectedItems={
                this.state.contact[field.name]
                  ? // Only add option elements (by contact sources) does exist in source list
                    this.state.contact[field.name].values
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
                      let foundSourceIndex = sourceList.findIndex((source) => source.value === id);
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
              onChangeSelectedItems={(selectedItems) =>
                this.onSelectizeValueChange(field.name, selectedItems)
              }
              inputContainerStyle={styles.selectizeField}
            />
          );
        } else if (field.name == 'milestones') {
          mappedValue = (
            <Col style={{ paddingBottom: 15 }}>
              <Row style={[styles.formRow, { paddingTop: 10 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="user" style={styles.formIcon} />
                </Col>
                <Col>
                  <Label
                    style={[
                      styles.formLabel,
                      { fontWeight: 'bold', marginBottom: 'auto', marginTop: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {field.label}
                  </Label>
                </Col>
              </Row>
              {this.renderfaithMilestones()}
              {this.renderCustomFaithMilestones()}
            </Col>
          );
        } else {
          mappedValue = (
            <Row style={{ flexWrap: 'wrap' }}>
              {Object.keys(field.default).map((value, index) =>
                this.renderMultiSelectField(field, value, index),
              )}
            </Row>
          );
        }
        break;
      }
      case 'communication_channel': {
        let keyboardType = 'default';
        if (field.name.includes('phone')) {
          keyboardType = 'phone-pad';
        } else if (field.name.includes('email')) {
          keyboardType = 'email-address';
        }
        mappedValue = (
          <Col>
            <Row style={styles.formFieldMargin}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="FontAwesome" name="user" style={styles.formIcon} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>{field.label}</Label>
              </Col>
              <Col style={styles.formIconLabel}>
                <Icon
                  android="md-add"
                  ios="ios-add"
                  style={[styles.addRemoveIcons, styles.addIcons]}
                  onPress={() => {
                    this.onAddCommunicationField(field.name);
                  }}
                />
              </Col>
            </Row>
            {value &&
              value.map((communicationChannel, index) =>
                !communicationChannel.delete ? (
                  <Row key={index.toString()} style={{ marginBottom: 10 }}>
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
                        value={communicationChannel.value}
                        onChangeText={(value) => {
                          this.onCommunicationFieldChange(
                            field.name,
                            value,
                            index,
                            communicationChannel.key,
                            this,
                          );
                        }}
                        style={styles.contactTextField}
                        keyboardType={keyboardType}
                      />
                    </Col>
                    <Col style={styles.formIconLabel}>
                      <Icon
                        android="md-remove"
                        ios="ios-remove"
                        style={[styles.formIcon, styles.addRemoveIcons, styles.removeIcons]}
                        onPress={() => {
                          this.onRemoveCommunicationField(field.name, index, this);
                        }}
                      />
                    </Col>
                  </Row>
                ) : null,
              )}
          </Col>
        );
        break;
      }
      case 'key_select': {
        if (field.name === 'overall_status') {
          mappedValue = (
            <Col>
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
                    {field.label}
                  </Label>
                </Col>
              </Row>
              <Row style={[styles.formRow, { paddingTop: 5, paddingBottom: 5 }]}>
                <Col
                  style={[
                    styles.statusFieldContainer,
                    Platform.select({
                      android: {
                        borderColor: this.state.overallStatusBackgroundColor,
                        backgroundColor: this.state.overallStatusBackgroundColor,
                      },
                    }),
                  ]}>
                  <Picker
                    selectedValue={value}
                    onValueChange={this.setContactStatus}
                    style={Platform.select({
                      android: {
                        color: '#ffffff',
                        backgroundColor: 'transparent',
                      },
                      ios: {
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
              {Object.prototype.hasOwnProperty.call(
                this.state.contact,
                `reason_${this.state.contact.overall_status}`,
              ) ? (
                <TouchableOpacity activeOpacity={0.6} onPress={this.toggleReasonStatusView}>
                  <Row>
                    <Text>
                      (
                      {
                        this.props.contactSettings.fields[
                          `reason_${this.state.contact.overall_status}`
                        ].values[this.state.contact[`reason_${this.state.contact.overall_status}`]]
                          .label
                      }
                      )
                    </Text>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="pencil"
                      style={{
                        fontSize: 21,
                      }}
                    />
                  </Row>
                </TouchableOpacity>
              ) : null}
            </Col>
          );
        } else {
          mappedValue = (
            <Picker
              mode="dropdown"
              selectedValue={this.state.contact[field.name]}
              onValueChange={(value) => this.setContactCustomFieldValue(field.name, value)}
              textStyle={{ color: Colors.tintColor }}>
              {Object.keys(field.default).map((key) => {
                const optionData = field.default[key];
                return <Picker.Item key={key} label={optionData.label} value={key} />;
              })}
            </Picker>
          );
        }
        break;
      }
      case 'user_select': {
        mappedValue = (
          <Picker
            mode="dropdown"
            selectedValue={propExist ? value.key : null}
            onValueChange={(value) => this.setContactCustomFieldValue(field.name, value)}
            textStyle={{ color: Colors.tintColor }}>
            {[...this.state.users, ...this.state.assignedToContacts].map((item) => {
              return (
                <Picker.Item
                  key={item.key}
                  label={item.label + ' (#' + item.key + ')'}
                  value={item.key}
                />
              );
            })}
          </Picker>
        );
        break;
      }
      case 'number': {
        mappedValue = (
          <Input
            value={value}
            keyboardType="numeric"
            onChangeText={(value) => this.setContactCustomFieldValue(field.name, value)}
            style={[
              styles.contactTextField,
              this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
            ]}
          />
        );
        break;
      }
      case 'text': {
        mappedValue = (
          <Input
            value={value}
            onChangeText={(value) => this.setContactCustomFieldValue(field.name, value)}
            style={[
              field.name == 'name' && this.state.nameRequired
                ? [styles.contactTextField, { borderBottomWidth: 0 }]
                : styles.contactTextField,
              this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
            ]}
          />
        );
        break;
      }
      default: {
        mappedValue = <Text>{field.toString()}</Text>;
        break;
      }
    }
    return mappedValue;
  };

  setContactCustomFieldValue = (fieldName, value, fieldType = null) => {
    if (fieldType == 'date') {
      if (!value) {
        // Clear DatePicker value
        this[`${fieldName}Ref`].state.chosenDate = undefined;
        this[`${fieldName}Ref`].state.defaultDate = new Date();
        this.forceUpdate();
      }
      value = value ? sharedTools.formatDateToBackEnd(value) : '';
    }

    this.setState((prevState) => ({
      contact: {
        ...prevState.contact,
        [fieldName]: value,
      },
    }));
  };

  toggleReasonStatusView = (confirmReasonChange = false) => {
    this.setState((prevState) => {
      let newState = {
        showReasonStatusView: !prevState.showReasonStatusView,
      };
      if (confirmReasonChange) {
        // Save selected reason on contact detail
        newState = {
          ...newState,
          contact: {
            ...prevState.contact,
            [prevState.selectedReasonStatus.key]: prevState.selectedReasonStatus.value,
          },
        };
      } else {
        // Revert selectedReasonStatus to current cotnact reasonStatus
        newState = {
          ...newState,
          selectedReasonStatus: {
            key: `reason_${this.state.contact.overall_status}`,
            value: this.state.contact[`reason_${this.state.contact.overall_status}`],
          },
        };
      }
      return newState;
    });
  };

  renderReasonStatusPickerItems = (collection) => {
    return Object.keys(collection).map((key) => {
      let value = collection[key];
      return <Picker.Item key={key} label={value.label} value={key} />;
    });
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
            {this.contactIsCreated() ? (
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
                        <Text style={{ color, fontWeight: 'bold' }}>{route.title}</Text>
                      )}
                    />
                  )}
                  renderScene={({ route }) => {
                    return route.render();
                  }}
                  onIndexChange={this.tabChanged}
                  initialLayout={{ width: windowWidth }}
                />
                {this.state.onlyView &&
                  this.state.tabViewConfig.index !== this.state.tabViewConfig.routes.length - 1 && (
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
                {this.state.showShareView ? (
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
                    <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={-50}>
                      <View style={[styles.dialogBox, { height: windowHeight * 0.65 }]}>
                        <Grid>
                          <Row>
                            <ScrollView keyboardShouldPersistTaps="handled">
                              <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 10 }}>
                                {i18n.t('global.shareSettings')}
                              </Text>
                              <Text>{i18n.t('contactDetailScreen.contactSharedWith')}:</Text>
                              <Selectize
                                itemId="value"
                                items={this.state.users.map((user) => ({
                                  name: user.label,
                                  value: user.key,
                                }))}
                                selectedItems={this.getSelectizeItems(
                                  { values: [...this.state.sharedUsers] },
                                  this.state.users.map((user) => ({
                                    name: user.label,
                                    value: user.key,
                                  })),
                                )}
                                textInputProps={{
                                  placeholder: i18n.t('global.searchUsers'),
                                }}
                                renderChip={(id, onClose, item, style, iconStyle) => (
                                  <Chip
                                    key={id}
                                    iconStyle={iconStyle}
                                    onClose={(props) => {
                                      this.removeUserToShare(item.value);
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
                                    onPress={(props) => {
                                      this.addUserToShare(parseInt(item.value));
                                      onPress(props);
                                    }}
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
                                inputContainerStyle={[styles.selectizeField]}
                                showItems="onFocus"
                              />
                            </ScrollView>
                          </Row>
                          <Row style={{ height: 60, borderColor: '#B4B4B4', borderTopWidth: 1 }}>
                            <Button
                              block
                              style={styles.dialogButton}
                              onPress={this.toggleShareView}>
                              <Text style={{ color: Colors.buttonText }}>
                                {i18n.t('global.close')}
                              </Text>
                            </Button>
                          </Row>
                        </Grid>
                      </View>
                    </KeyboardAvoidingView>
                  </BlurView>
                ) : null}
                {this.state.showReasonStatusView ? (
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
                    <View style={[styles.dialogBox, { height: windowHeight - windowHeight * 0.4 }]}>
                      <Grid>
                        <Row>
                          <View>
                            <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 20 }}>
                              {
                                this.props.contactSettings.fields[
                                  `reason_${this.state.contact.overall_status}`
                                ].name
                              }
                            </Text>
                            <Text style={{ marginBottom: 20 }}>
                              {
                                this.props.contactSettings.fields[
                                  `reason_${this.state.contact.overall_status}`
                                ].description
                              }
                            </Text>
                            <Text style={{ marginBottom: 20 }}>
                              {i18n.t('global.chooseOption')}:
                            </Text>
                            <View style={styles.contactTextRoundField}>
                              <Picker
                                selectedValue={this.state.selectedReasonStatus.value}
                                onValueChange={(value) => {
                                  this.setState({
                                    selectedReasonStatus: {
                                      key: `reason_${this.state.contact.overall_status}`,
                                      value,
                                    },
                                  });
                                }}>
                                {this.renderReasonStatusPickerItems(
                                  this.props.contactSettings.fields[
                                    `reason_${this.state.contact.overall_status}`
                                  ].values,
                                )}
                              </Picker>
                            </View>
                          </View>
                        </Row>
                        <Row style={{ height: 60, borderColor: '#B4B4B4', borderTopWidth: 1 }}>
                          <Button
                            block
                            style={[styles.dialogButton, { backgroundColor: '#FFFFFF' }]}
                            onPress={() => this.toggleReasonStatusView()}>
                            <Text style={{ color: Colors.primary }}>{i18n.t('global.cancel')}</Text>
                          </Button>
                          <Button
                            block
                            style={styles.dialogButton}
                            onPress={() => this.toggleReasonStatusView(true)}>
                            <Text style={{ color: Colors.buttonText }}>
                              {i18n.t('global.confirm')}
                            </Text>
                          </Button>
                        </Row>
                      </Grid>
                    </View>
                  </BlurView>
                ) : null}
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
                  {this.renderCustomView(this.renderCreationFields(), true)}
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
    name: PropTypes.string,
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
  loadingShare: state.contactsReducer.loadingShare,
  shareSettings: state.contactsReducer.shareSettings,
  savedShare: state.contactsReducer.savedShare,
  tags: state.contactsReducer.tags,
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
  getShareSettings: (domain, token, contactId) => {
    dispatch(getShareSettings(domain, token, contactId));
  },
  addUserToShare: (domain, token, contactId, userId) => {
    dispatch(addUserToShare(domain, token, contactId, userId));
  },
  removeUserToShare: (domain, token, contactId, userData) => {
    dispatch(removeUserToShare(domain, token, contactId, userData));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactDetailScreen);
