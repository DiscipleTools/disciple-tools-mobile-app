import React from 'react';
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
  RefreshControl,
  Platform,
  TouchableHighlight,
  BackHandler,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import { Label, Input, Icon, Picker, DatePicker, Button } from 'native-base';
import Toast from 'react-native-easy-toast';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Chip, Selectize } from 'react-native-material-selectize';
import ActionButton from 'react-native-action-button';
import { TabView, TabBar } from 'react-native-tab-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationActions, StackActions } from 'react-navigation';
import MentionsTextInput from 'react-native-mentions';
import ParsedText from 'react-native-parsed-text';
import { BlurView } from 'expo-blur';
import { CheckBox } from 'react-native-elements';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Html5Entities } from 'html-entities';
import Menu, { MenuItem } from 'react-native-material-menu';

import sharedTools from '../../shared';
import {
  saveGroup,
  getById,
  getCommentsByGroup,
  saveComment,
  getActivitiesByGroup,
  getByIdEnd,
  searchLocations,
  deleteComment,
  loadingFalse,
  updatePrevious,
  getShareSettings,
  addUserToShare,
  removeUserToShare,
} from '../../store/actions/groups.actions';
import { updatePrevious as updatePreviousContacts } from '../../store/actions/contacts.actions';
import Colors from '../../constants/Colors';
import statusIcon from '../../assets/icons/status.png';
// Health Metrics Icons
import baptismIcon from '../../assets/icons/baptism.png';
import bibleStudyIcon from '../../assets/icons/word.png';
import communionIcon from '../../assets/icons/communion.png';
import fellowShipIcon from '../../assets/icons/fellowship.png';
import givingIcon from '../../assets/icons/giving.png';
import prayerIcon from '../../assets/icons/prayer.png';
import praiseIcon from '../../assets/icons/praise.png';
import sharingTheGospelIcon from '../../assets/icons/evangelism.png';
import leadersIcon from '../../assets/icons/leadership.png';
import circleIcon from '../../assets/icons/circle.png';
import dottedCircleIcon from '../../assets/icons/dotted-circle.png';
// Groups Circle Icons
import swimmingPoolIcon from '../../assets/icons/swimming-pool.png';
import groupCircleIcon from '../../assets/icons/group-circle.png';
import groupDottedCircleIcon from '../../assets/icons/group-dotted-circle.png';
import groupChildIcon from '../../assets/icons/group-child.png';
import groupParentIcon from '../../assets/icons/group-parent.png';
import groupPeerIcon from '../../assets/icons/group-peer.png';
import groupTypeIcon from '../../assets/icons/group-type.png';
// Members Icons
import footprint from '../../assets/icons/footprint.png';

import dtIcon from '../../assets/images/dt-icon.png';

import i18n from '../../languages';

let toastSuccess;
let toastError;
const containerPadding = 20;
const windowWidth = Dimensions.get('window').width;
const spacing = windowWidth * 0.025;
const sideSize = windowWidth - 2 * spacing;
const circleSideSize = windowWidth / 3 + 20;
const windowHeight = Dimensions.get('window').height;
let keyboardDidShowListener, keyboardDidHideListener, focusListener, hardwareBackPressListener;
//const hasNotch = Platform.OS === 'android' && StatusBar.currentHeight > 25;
//const extraNotchHeight = hasNotch ? StatusBar.currentHeight : 0;
const isIOS = Platform.OS === 'ios';
/* eslint-disable */
let commentsFlatListRef, addMembersSelectizeRef;
/* eslint-enable */
const entities = new Html5Entities();
const defaultHealthMilestones = [
  'church_baptism',
  'church_bible',
  'church_communion',
  'church_fellowship',
  'church_giving',
  'church_leaders',
  'church_praise',
  'church_prayer',
  'church_sharing',
];
let self;
const styles = StyleSheet.create({
  activeImage: {
    opacity: 1,
    height: '100%',
    width: '100%',
  },
  inactiveImage: {
    opacity: 0.15,
    height: '100%',
    width: '100%',
  },
  toggleText: {
    textAlign: 'center',
  },
  activeToggleText: {
    color: '#000000',
    fontSize: 9,
  },
  inactiveToggleText: {
    color: '#D9D5DC',
    fontSize: 9,
  },
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
  groupFABIcon: {
    color: 'white',
    fontSize: 20,
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
  formIconLabel: { marginLeft: 10, width: 'auto' },
  formIconLabelMarginLeft: {
    marginLeft: containerPadding + 10,
  },
  formIconLabelMargin: {
    marginRight: containerPadding + 10,
    marginTop: 25,
    marginBottom: 15,
  },
  formIcon: {
    color: Colors.tintColor,
    fontSize: 25,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  formParentLabel: {
    width: 'auto',
    maxWidth: 75,
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
  formDivider2: {
    marginTop: 25,
    marginBottom: 15,
  },
  formDivider2Margin: {
    marginTop: 25,
    marginBottom: 15,
    marginLeft: containerPadding + 10,
    marginRight: containerPadding + 10,
  },
  formIconLabelCol: {
    width: 35,
    marginRight: 10,
  },
  formIconLabelView: {
    alignItems: 'center',
  },
  formFieldPadding: {
    paddingTop: 30,
  },
  formContainerNoPadding: {
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
  },
  // Groups section
  groupCircleParentContainer: {
    height: circleSideSize,
  },
  groupCircleContainer: {
    height: '100%',
    width: circleSideSize,
  },
  groupCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    height: '85%',
    width: '85%',
    marginTop: '7.5%',
    marginRight: '7.5%',
    marginBottom: '7.5%',
    marginLeft: '7.5%',
  },
  groupCenterIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    height: '40%',
    width: '40%',
    marginTop: '25%',
    resizeMode: 'contain',
  },
  groupCircleName: {
    justifyContent: 'center',
    marginTop: '20%',
    marginLeft: '20%',
    marginRight: '20%',
  },
  groupCircleNameText: { fontSize: 11, textAlign: 'center' },
  groupCircleCounter: {
    justifyContent: 'center',
    marginTop: '-5%',
  },
  groupIcons: {
    height: 30,
    width: 32,
  },
  progressIconText: {
    fontSize: 9,
    textAlign: 'center',
    width: '100%',
  },
  membersIconActive: {
    opacity: 1,
  },
  membersIconInactive: {
    opacity: 0.15,
  },
  membersLeaderIcon: {
    height: 30,
    width: 18,
    marginLeft: 0,
  },
  membersCloseIcon: {
    color: Colors.grayDark,
    fontSize: 25,
    marginTop: 'auto',
    marginBottom: 'auto',
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
  membersCount: {
    color: Colors.tintColor,
    fontSize: 15,
  },
  addMembersHyperlink: {
    paddingTop: 150,
    textAlign: 'center',
    color: '#A8A8A8',
    fontSize: 18,
    opacity: 0.7,
  },
  groupTextField: {
    borderBottomWidth: 1,
    borderStyle: 'solid',
    borderColor: '#B4B4B4',
    height: 50,
    fontSize: 15,
  },
  groupTextRoundField: {
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
  dateIcons: {
    width: 20,
    height: 20,
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  linkingText: {
    paddingTop: 4,
    paddingBottom: 8,
    textDecorationLine: 'underline',
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
  formFieldMargin: {
    marginTop: 20,
    marginBottom: 10,
  },
});

const initialState = {
  group: {},
  unmodifiedGroup: {},
  onlyView: false,
  loadedLocal: false,
  comment: '',
  users: [],
  usersContacts: [],
  geonames: [],
  peopleGroups: [],
  groups: [],
  comments: {
    data: [],
    pagination: {
      limit: 10,
      offset: 0,
      total: 0,
    },
  },
  loadComments: false,
  loadMoreComments: false,
  activities: {
    data: [],
    pagination: {
      limit: 10,
      offset: 0,
      total: 0,
    },
  },
  loadActivities: false,
  loadMoreActivities: false,
  showAssignedToModal: false,
  groupStatusBackgroundColor: '#ffffff',
  loading: false,
  tabViewConfig: {
    index: 0,
    routes: [
      /*...tabViewRoutes*/
    ],
  },
  updateMembersList: false,
  foundGeonames: [],
  footerLocation: 0,
  footerHeight: 0,
  nameRequired: false,
  executingBack: false,
  keyword: '',
  suggestedUsers: [],
  height: sharedTools.commentFieldMinHeight,
  groupCoachContacts: [],
  unmodifiedGroupCoachContacts: [],
  parentGroups: [],
  unmodifiedParentGroups: [],
  peerGroups: [],
  unmodifiedPeerGroups: [],
  childGroups: [],
  unmodifiedChildGroups: [],
  membersContacts: [],
  unmodifiedMembersContacts: [],
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
};

const safeFind = (found, prop) => {
  if (typeof found === 'undefined') return '';
  return found[prop];
};

class GroupDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    self = this;
  }

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    let navigationTitle = Object.prototype.hasOwnProperty.call(params, 'groupName')
      ? params.groupName
      : i18n.t('groupDetailScreen.addNewGroup');
    let headerRight = () => (
      <Row onPress={params.onSaveGroup}>
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
      if (params.onEnableEdit && params.groupId && params.onlyView) {
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
                params.toggleMenu(true, menuRef);
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
                      menuRef = menu;
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
                      params.toggleMenu(false, menuRef);
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
            style={[{ paddingLeft: 16, color: Colors.headerTintColor, paddingRight: 16 }]}
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
      ...this.props.groupSettings.tiles.map((tile) => {
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
    this.props.groupSettings.tiles.forEach((tile) => {
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
      onSaveGroup: this.onSaveGroup.bind(this),
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
      if (this.groupIsCreated()) {
        this.props.loadingFalse();
        this.onRefresh(this.props.navigation.state.params.groupId, true);
      }
    });
    // Android bottom back button listener
    hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', () => {
      this.props.navigation.state.params.backButtonTap();
      return true;
    });
  }

  componentDidCatch(error, errorInfo) {}

  componentWillUnmount() {
    keyboardDidShowListener.remove();
    keyboardDidHideListener.remove();
    focusListener.remove();
    hardwareBackPressListener.remove();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      group,
      loading,
      comments,
      loadingComments,
      activities,
      loadingActivities,
      foundGeonames,
      isConnected,
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
      group: prevState.group,
      unmodifiedGroup: prevState.unmodifiedGroup,
    };

    // SAVE / GET BY ID
    if (group) {
      newState = {
        ...newState,
        group: {
          ...group,
        },
        unmodifiedGroup: {
          ...group,
        },
      };
      if (newState.group.group_status) {
        newState = {
          ...newState,
          groupStatusBackgroundColor: sharedTools.getSelectorColor(newState.group.group_status),
        };
      }
      if (newState.group.location_grid) {
        newState.group.location_grid.values.forEach((location) => {
          const foundLocation = newState.geonames.find(
            (geoname) => geoname.value === location.value,
          );
          if (!foundLocation) {
            // Add non existent group location in the geonames list to avoid null exception
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
      if (newState.group.members) {
        // Add member names to list in OFFLINE mode
        if (!isConnected) {
          let membersList = newState.group.members.values.map((member) => {
            if (!member.name) {
              member = {
                ...member,
                name: safeFind(
                  newState.usersContacts.find((user) => user.value === member.value),
                  'name',
                ),
              };
            }
            return member;
          });
          newState = {
            ...newState,
            group: {
              ...newState.group,
              members: {
                values: [...membersList],
              },
            },
            unmodifiedGroup: {
              ...newState.group,
              members: {
                values: [...membersList],
              },
            },
          };
        }
        newState = {
          ...newState,
          updateMembersList: !newState.updateMembersList,
        };

        // Clear collection
        newState = {
          ...newState,
          membersContacts: [],
        };

        newState.group.members.values.forEach((member) => {
          const foundMember = newState.usersContacts.find(
            (contact) => contact.value === member.value,
          );
          if (!foundMember) {
            // Add non existent member contact in members list (user does not have access permission to this contact/s)
            newState = {
              ...newState,
              membersContacts: [
                ...newState.membersContacts,
                {
                  name: member.name,
                  value: member.value,
                },
              ],
              unmodifiedMembersContacts: [
                ...newState.unmodifiedMembersContacts,
                {
                  name: member.name,
                  value: member.value,
                },
              ],
            };
          }
        });
      }
      if (newState.group.coaches) {
        // Clear collection
        newState = {
          ...newState,
          groupCoachContacts: [],
        };

        newState.group.coaches.values.forEach((coachContact) => {
          const foundCoachContact = newState.usersContacts.find(
            (user) => user.value === coachContact.value,
          );
          if (!foundCoachContact) {
            // Add non existent coach contact in usersContacts list (user does not have access permission to this contacts)
            newState = {
              ...newState,
              groupCoachContacts: [
                ...newState.groupCoachContacts,
                {
                  name: coachContact.name,
                  value: coachContact.value,
                },
              ],
              unmodifiedGroupCoachContacts: [
                ...newState.unmodifiedGroupCoachContacts,
                {
                  name: coachContact.name,
                  value: coachContact.value,
                },
              ],
            };
          }
        });
      }
      if (newState.group.parent_groups) {
        // Clear collection
        newState = {
          ...newState,
          parentGroups: [],
        };

        newState.group.parent_groups.values.forEach((parentGroup) => {
          const foundParentGroup = newState.groups.find(
            (groups) => groups.value === parentGroup.value,
          );
          if (!foundParentGroup) {
            // Add non existent parent group in groups list (user does not have access permission to this group/s)
            newState = {
              ...newState,
              parentGroups: [
                ...newState.parentGroups,
                {
                  name: parentGroup.name,
                  value: parentGroup.value,
                },
              ],
              unmodifiedParentGroups: [
                ...newState.unmodifiedParentGroups,
                {
                  name: parentGroup.name,
                  value: parentGroup.value,
                },
              ],
            };
          }
        });
      }
      if (newState.group.peer_groups) {
        // Clear collection
        newState = {
          ...newState,
          peerGroups: [],
        };

        newState.group.peer_groups.values.forEach((peerGroup) => {
          const foundPeerGroup = newState.groups.find((groups) => groups.value === peerGroup.value);
          if (!foundPeerGroup) {
            // Add non existent peer group in groups list (user does not have access permission to this group/s)
            newState = {
              ...newState,
              peerGroups: [
                ...newState.peerGroups,
                {
                  name: peerGroup.name,
                  value: peerGroup.value,
                },
              ],
              unmodifiedPeerGroups: [
                ...newState.unmodifiedPeerGroups,
                {
                  name: peerGroup.name,
                  value: peerGroup.value,
                },
              ],
            };
          }
        });
      }
      if (newState.group.child_groups) {
        // Clear collection
        newState = {
          ...newState,
          childGroups: [],
        };

        newState.group.child_groups.values.forEach((childGroup) => {
          const foundChildGroup = newState.groups.find(
            (groups) => groups.value === childGroup.value,
          );
          if (!foundChildGroup) {
            // Add non existent child group in groups list (user does not have access permission to this group/s)
            newState = {
              ...newState,
              childGroups: [
                ...newState.childGroups,
                {
                  name: childGroup.name,
                  value: childGroup.value,
                },
              ],
              unmodifiedChildGroups: [
                ...newState.unmodifiedChildGroups,
                {
                  name: childGroup.name,
                  value: childGroup.value,
                },
              ],
            };
          }
        });
      }
      if (newState.group.assigned_to) {
        // Clear collection
        newState = {
          ...newState,
          assignedToContacts: [],
        };

        let foundAssigned = newState.users.find(
          (user) => user.key === newState.group.assigned_to.key,
        );
        if (!foundAssigned) {
          // Add non existent group to list (user does not have access permission to this groups)
          newState = {
            ...newState,
            assignedToContacts: [
              ...newState.assignedToContacts,
              {
                label: newState.group.assigned_to.label,
                key: newState.group.assigned_to.key,
              },
            ],
            unmodifedAssignedToContacts: [
              ...newState.unmodifedAssignedToContacts,
              {
                label: newState.group.assigned_to.label,
                key: newState.group.assigned_to.key,
              },
            ],
          };
        }
      }
    }

    // GET COMMENTS
    if (comments) {
      if (
        navigation.state.params.groupId &&
        Object.prototype.hasOwnProperty.call(comments, navigation.state.params.groupId)
      ) {
        // NEW COMMENTS (PAGINATION)
        if (comments[navigation.state.params.groupId].pagination.offset > 0) {
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
            ...comments[navigation.state.params.groupId],
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

    // GET ACTIVITITES
    if (activities) {
      if (
        navigation.state.params.groupId &&
        Object.prototype.hasOwnProperty.call(activities, navigation.state.params.groupId)
      ) {
        // NEW ACTIVITIES (PAGINATION)
        if (activities[navigation.state.params.groupId].pagination.offset > 0) {
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
            ...activities[navigation.state.params.groupId],
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
        navigation.state.params.groupId &&
        Object.prototype.hasOwnProperty.call(shareSettings, navigation.state.params.groupId)
      ) {
        newState = {
          ...newState,
          sharedUsers: shareSettings[navigation.state.params.groupId],
        };
      }
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    const {
      userReducerError,
      group,
      navigation,
      newComment,
      groupsReducerError,
      saved,
      savedShare,
    } = this.props;

    // NEW COMMENT
    if (newComment && prevProps.newComment !== newComment) {
      commentsFlatListRef.scrollToOffset({ animated: true, offset: 0 });
      this.setComment('');
    }

    // GROUP SAVE / GET BY ID
    if (group && prevProps.group !== group) {
      // Update group data only in these conditions:
      // Same group created (offline/online)
      // Same group updated (offline/online)
      // Same offline group created in DB (AutoID to DBID)
      if (
        (Object.prototype.hasOwnProperty.call(group, 'ID') &&
          !Object.prototype.hasOwnProperty.call(this.state.group, 'ID')) ||
        (Object.prototype.hasOwnProperty.call(group, 'ID') &&
          group.ID.toString() === this.state.group.ID.toString()) ||
        (Object.prototype.hasOwnProperty.call(group, 'oldID') &&
          group.oldID === this.state.group.ID.toString())
      ) {
        // Highlight Updates -> Compare this.state.group with group and show differences
        navigation.setParams({ groupName: group.name, groupId: group.ID });
        this.getGroupByIdEnd();
        // Add group to 'previousGroups' array on creation
        if (
          !this.props.previousGroups.find(
            (previousGroup) => parseInt(previousGroup.groupId) === parseInt(group.ID),
          )
        ) {
          this.props.updatePrevious([
            ...this.props.previousGroups,
            {
              groupId: parseInt(group.ID),
              onlyView: true,
              groupName: group.name,
            },
          ]);
        }
      }
    }

    // Share Contact with user
    if (savedShare && prevProps.savedShare !== savedShare) {
      // Highlight Updates -> Compare this.state.group with current group and show differences
      this.onRefreshCommentsActivities(this.state.group.ID, true);
      toastSuccess.show(
        <View>
          <Text style={{ color: Colors.sucessText }}>{i18n.t('global.success.save')}</Text>
        </View>,
        3000,
      );
    }

    // GROUP SAVE
    if (saved && prevProps.saved !== saved) {
      // Update group data only in these conditions:
      // Same group created (offline/online)
      // Same group updated (offline/online)
      // Sane offline group created in DB (AutoID to DBID)
      if (
        (typeof group.ID !== 'undefined' && typeof this.state.group.ID === 'undefined') ||
        (group.ID && group.ID.toString() === this.state.group.ID.toString()) ||
        (group.oldID && group.oldID === this.state.group.ID.toString())
      ) {
        // Highlight Updates -> Compare this.state.group with contact and show differences
        this.onRefreshCommentsActivities(group.ID, true);
        toastSuccess.show(
          <View>
            <Text style={{ color: Colors.sucessText }}>{i18n.t('global.success.save')}</Text>
          </View>,
          3000,
        );
        this.onDisableEdit();
      }
    }

    // ERROR
    const usersError = prevProps.userReducerError !== userReducerError && userReducerError;
    let groupsError = prevProps.groupsReducerError !== groupsReducerError;
    groupsError = groupsError && groupsReducerError;
    if (usersError || groupsError) {
      const error = userReducerError || groupsReducerError;
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
    let newPreviousGroups = [...this.props.previousGroups];
    newPreviousGroups.pop();
    this.props.updatePrevious(newPreviousGroups);
    if (newPreviousGroups.length > 0) {
      this.props.loadingFalse();
      let currentParams = {
        ...newPreviousGroups[newPreviousGroups.length - 1],
      };
      this.setState({
        group: {
          ID: currentParams.groupId,
          name: currentParams.groupName,
          group_type: 'group',
        },
        groupStatusBackgroundColor: '#ffffff',
      });
      navigation.setParams({
        ...currentParams,
      });
      this.onRefresh(currentParams.groupId, true);
    } else if (navigation.state.params.fromNotificationView) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'GroupList' })],
      });
      navigation.dispatch(resetAction);
      navigation.navigate('NotificationList');
    } else {
      navigation.goBack();
      // Prevent error when view loaded from ContactDetailScreen.js
      if (typeof navigation.state.params.onGoBack === 'function') {
        navigation.state.params.onGoBack();
      }
    }
  };

  groupIsCreated = () =>
    Object.prototype.hasOwnProperty.call(this.props.navigation.state.params, 'groupId');

  onLoad() {
    const { navigation } = this.props;
    const { groupId, onlyView, groupName } = navigation.state.params;
    let newState = {};
    if (this.groupIsCreated()) {
      newState = {
        group: {
          ...this.state.group,
          ID: groupId,
          name: groupName,
          group_type: 'group',
        },
      };
      navigation.setParams({ groupName });
    } else {
      newState = {
        group: {
          name: null,
          group_type: 'group',
        },
      };
      navigation.setParams({ hideTabBar: true });
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

  onRefresh(groupId, forceRefresh = false) {
    if (!self.state.loading || forceRefresh) {
      self.getGroupById(groupId);
      self.onRefreshCommentsActivities(groupId, true);
      self.getShareSettings(groupId);
    }
  }

  onRefreshCommentsActivities(groupId, resetPagination = false) {
    this.getGroupComments(groupId, resetPagination);
    this.getGroupActivities(groupId, resetPagination);
  }

  getLists = async () => {
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

    newState = {
      ...newState,
      usersContacts: this.props.contactsList.map((contact) => ({
        name: contact.title,
        value: contact.ID,
      })),
      groups: this.props.groupsList.map((group) => ({
        name: group.title,
        value: group.ID,
      })),
      loadedLocal: true,
    };

    this.setState(newState, () => {
      // Only execute in detail mode
      if (this.groupIsCreated()) {
        this.onRefresh(this.state.group.ID);
      }
    });
  };

  getGroupById(groupId) {
    this.props.getById(this.props.userData.domain, this.props.userData.token, groupId);
  }

  getGroupByIdEnd() {
    this.props.getByIdEnd();
  }

  getGroupComments(groupId, resetPagination = false) {
    if (this.props.isConnected) {
      if (resetPagination) {
        this.props.getComments(this.props.userData.domain, this.props.userData.token, groupId, {
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
            groupId,
            this.state.comments.pagination,
          );
        }
      }
    }
  }

  getGroupActivities(groupId, resetPagination = false) {
    if (this.props.isConnected) {
      if (resetPagination) {
        this.props.getActivities(this.props.userData.domain, this.props.userData.token, groupId, {
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
            groupId,
            this.state.activities.pagination,
          );
        }
      }
    }
  }

  getShareSettings(groupId) {
    this.props.getShareSettings(this.props.userData.domain, this.props.userData.token, groupId);
    if (this.state.showShareView) {
      this.toggleShareView();
    }
  }

  addUserToShare(userId) {
    this.props.addUserToShare(
      this.props.userData.domain,
      this.props.userData.token,
      this.state.group.ID,
      userId,
    );
  }

  removeUserToShare(userId) {
    this.props.removeUserToShare(
      this.props.userData.domain,
      this.props.userData.token,
      this.state.group.ID,
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
      groupName: this.state.group.name,
    });
  };

  onDisableEdit = () => {
    const {
      unmodifiedGroup,
      unmodifiedGroupCoachContacts,
      unmodifiedParentGroups,
      unmodifiedPeerGroups,
      unmodifiedChildGroups,
      unmodifiedMembersContacts,
      unmodifedAssignedToContacts,
    } = this.state;
    this.setState((prevState) => {
      // Set correct index in Tab position according to view mode and current tab position
      let indexFix = prevState.tabViewConfig.index;
      return {
        onlyView: true,
        group: {
          ...unmodifiedGroup,
        },
        groupStatusBackgroundColor: sharedTools.getSelectorColor(unmodifiedGroup.group_status),
        tabViewConfig: {
          ...prevState.tabViewConfig,
          index: indexFix,
          routes: this.getRoutesWithRender(),
        },
        groupCoachContacts: [...unmodifiedGroupCoachContacts],
        parentGroups: [...unmodifiedParentGroups],
        peerGroups: [...unmodifiedPeerGroups],
        childGroups: [...unmodifiedChildGroups],
        membersContacts: [...unmodifiedMembersContacts],
        assignedToContacts: [...unmodifedAssignedToContacts],
      };
    });
    this.props.navigation.setParams({ hideTabBar: false, onlyView: true });
  };

  setGroupStatus = (value) => {
    let newColor = '';
    if (value === 'inactive') {
      newColor = '#d9534f';
    } else if (value === 'active') {
      newColor = '#5cb85c';
    }
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        group_status: value,
      },
      groupStatusBackgroundColor: newColor,
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

  goToContactDetailScreen = (contactID, name) => {
    this.props.updatePreviousContacts([
      {
        contactId: contactID,
        onlyView: true,
        contactName: name,
      },
    ]);
    this.props.navigation.navigate('ContactDetail', {
      contactId: contactID,
      onlyView: true,
      contactName: name,
    });
  };

  getSelectizeItems = (groupList, localList) => {
    const items = [];
    if (groupList) {
      groupList.values.forEach((listItem) => {
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

  onCheckExistingHealthMetric = (metricName) => {
    const healthMetrics = this.state.group.health_metrics
      ? [...this.state.group.health_metrics.values]
      : [];
    // get healthMetrics that exist in the list and are not deleted
    const foundhealthMetric = healthMetrics.some(
      (healthMetric) => healthMetric.value === metricName && !healthMetric.delete,
    );
    return foundhealthMetric;
  };

  onHealthMetricChange = (metricName) => {
    const healthMetrics = this.state.group.health_metrics
      ? [...this.state.group.health_metrics.values]
      : [];
    const foundhealthMetric = healthMetrics.find((metric) => metric.value === metricName);
    if (foundhealthMetric) {
      const healthMetricIndex = healthMetrics.indexOf(foundhealthMetric);
      if (foundhealthMetric.delete) {
        const healthMetricModified = {
          ...foundhealthMetric,
        };
        delete healthMetricModified.delete;
        healthMetrics[healthMetricIndex] = healthMetricModified;
      } else {
        healthMetrics[healthMetricIndex] = {
          ...foundhealthMetric,
          delete: true,
        };
      }
    } else {
      healthMetrics.push({
        value: metricName,
      });
    }
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        health_metrics: {
          values: healthMetrics,
        },
      },
    }));
  };

  setComment = (value) => {
    this.setState({
      comment: value,
    });
  };

  onAddMember = (selectedValue) => {
    this.setState((prevState) => {
      let previousMembers = prevState.group.members ? prevState.group.members.values : [];
      return {
        group: {
          ...prevState.group,
          members: {
            values: [
              ...previousMembers,
              {
                name: safeFind(
                  prevState.usersContacts.find((user) => user.value === selectedValue.value),
                  'name',
                ), // Show name in list while request its processed
                value: selectedValue.value,
              },
            ],
          },
        },
      };
    });
  };

  onRemoveMember = (selectedValue) => {
    const foundMember = this.state.group.members.values.find(
      (member) => member.value === selectedValue.value,
    );
    if (foundMember) {
      let membersListCopy = [...this.state.group.members.values];
      const foundMemberIndex = membersListCopy.indexOf(foundMember);
      membersListCopy.splice(foundMemberIndex, 1);
      let foundMemberContactIndex = this.state.membersContacts.findIndex(
        (memberContact) => memberContact.value === selectedValue.value,
      );
      let membersContacts = [...this.state.membersContacts];
      if (foundMemberContactIndex > -1) {
        membersContacts.splice(foundMemberContactIndex, 1);
      }
      this.setState((prevState) => ({
        group: {
          ...prevState.group,
          members: {
            values: [...membersListCopy],
          },
        },
        // Remove member contact from list
        membersContacts: membersContacts,
      }));
    }
  };

  onSetLeader = (selectedValue) => {
    let leadersListCopy = this.state.group.leaders ? [...this.state.group.leaders.values] : [];
    const foundLeaderIndex = leadersListCopy.findIndex(
      (leader) => leader.value === selectedValue.value,
    );
    if (foundLeaderIndex > -1) {
      // 3 Remove leader 'deletion'
      if (leadersListCopy[foundLeaderIndex].delete) {
        leadersListCopy[foundLeaderIndex] = {
          ...selectedValue,
          delete: false,
        };
      } else {
        // 2 Delete leader
        leadersListCopy[foundLeaderIndex] = {
          ...selectedValue,
          delete: true,
        };
      }
    } else {
      // 1 Add leader
      leadersListCopy.push(selectedValue);
    }
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        leaders: {
          values: [...leadersListCopy],
        },
      },
    }));
  };

  getSelectizeValuesToSave = (dbData, selectedValues) => {
    const dbItems = [...dbData];
    let localItems = [...selectedValues];
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

  onSaveGroup = (quickAction = {}) => {
    this.setState(
      {
        nameRequired: false,
      },
      () => {
        Keyboard.dismiss();
        if (this.state.group.name && this.state.group.name.length > 0) {
          const { unmodifiedGroup } = this.state;
          let groupToSave = {
            ...this.state.group,
          };
          if (
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_meeting_scheduled') ||
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_meeting_postponed') ||
            Object.prototype.hasOwnProperty.call(quickAction, 'quick_button_meeting_complete')
          ) {
            groupToSave = {
              ...groupToSave,
              ...quickAction,
            };
          } else {
            // if property exist, get from json, otherwise, send empty array
            if (addMembersSelectizeRef) {
              groupToSave = {
                ...groupToSave,
                members: {
                  values: this.getSelectizeValuesToSave(
                    unmodifiedGroup.members ? unmodifiedGroup.members.values : [],
                    groupToSave.members ? groupToSave.members.values : [],
                  ),
                },
              };
            }
          }
          groupToSave = {
            ...sharedTools.diff(unmodifiedGroup, groupToSave),
            name: entities.encode(this.state.group.name),
          };
          //After 'sharedTools.diff()' method, ID is removed, then we add it again
          if (Object.prototype.hasOwnProperty.call(this.state.group, 'ID')) {
            groupToSave = {
              ...groupToSave,
              ID: this.state.group.ID,
            };
          }
          if (groupToSave.assigned_to) {
            groupToSave = {
              ...groupToSave,
              assigned_to: `user-${groupToSave.assigned_to.key}`,
            };
          }
          this.props.saveGroup(this.props.userData.domain, this.props.userData.token, groupToSave);
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

  onSaveComment = () => {
    const { comment } = this.state;
    if (!this.state.loadComments) {
      if (comment.length > 0) {
        Keyboard.dismiss();
        this.props.saveComment(
          this.props.userData.domain,
          this.props.userData.token,
          this.state.group.ID,
          {
            comment,
          },
        );
      }
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
      this.state.group.ID,
      commentData,
    );
    this.onCloseCommentDialog();
  }

  onDeleteComment(commentData) {
    this.props.deleteComment(
      this.props.userData.domain,
      this.props.userData.token,
      this.state.group.ID,
      commentData.ID,
    );
    this.onCloseCommentDialog();
  }

  goToGroupDetailScreen = (groupID, name) => {
    let { navigation } = this.props;
    /* eslint-disable */
    // Save new group in 'previousGroups' array
    if (!this.props.previousGroups.find((previousGroup) => previousGroup.groupId === groupID)) {
      // Add contact to 'previousGroups' array on creation
      this.props.updatePrevious([
        ...this.props.previousGroups,
        {
          groupId: groupID,
          onlyView: true,
          groupName: name,
        },
      ]);
    }
    navigation.push('GroupDetail', {
      groupId: groupID,
      onlyView: true,
      groupName: name,
      afterBack: () => this.afterBack(),
    });
    /* eslint-enable */
  };

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

  offlineBarRender = () => (
    <View style={[styles.offlineBar]}>
      <Text style={[styles.offlineBarText]}>{i18n.t('global.offline')}</Text>
    </View>
  );

  noCommentsRender = () => (
    <ScrollView
      style={styles.noCommentsContainer}
      refreshControl={
        <RefreshControl
          refreshing={this.state.loadComments || this.state.loadActivities}
          onRefresh={() => this.onRefreshCommentsActivities(this.state.group.ID, true)}
        />
      }>
      <Grid style={{ transform: [{ scaleY: -1 }] }}>
        <Col>
          <Row style={{ justifyContent: 'center' }}>
            <Image style={styles.noCommentsImage} source={dtIcon} />
          </Row>
          <Row>
            <Text style={styles.noCommentsText}>
              {i18n.t('groupDetailScreen.noGroupCommentPlacheHolder')}
            </Text>
          </Row>
          <Row>
            <Text style={styles.noCommentsText}>
              {i18n.t('groupDetailScreen.noGroupCommentPlacheHolder1')}
            </Text>
          </Row>
          {!this.props.isConnected && (
            <Row>
              <Text style={[styles.noCommentsText, { backgroundColor: '#fff2ac' }]}>
                {i18n.t('groupDetailScreen.noGroupCommentPlacheHolderOffline')}
              </Text>
            </Row>
          )}
        </Col>
      </Grid>
    </ScrollView>
  );

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
                  routeName: 'GroupList',
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
                commentsFlatListRef = flatList;
              }}
              data={this.getCommentsAndActivities()}
              extraData={!this.state.loadMoreComments || !this.state.loadMoreActivities}
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
                  onRefresh={() => this.onRefreshCommentsActivities(this.state.group.ID, true)}
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
                      this.getGroupComments(this.state.group.ID);
                      this.getGroupActivities(this.state.group.ID);
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

  flatListItemSeparator = () => (
    <View
      style={{
        height: 1,
        width: '100%',
        backgroundColor: '#dddddd',
      }}
    />
  );

  membersRow = (membersGroup) => (
    <View style={{ flex: 1 }}>
      {this.state.onlyView ? (
        <Grid style={{ marginTop: 10, marginBottom: 10 }}>
          <Col style={{ width: 20 }}>
            <Image
              source={footprint}
              style={[
                styles.membersLeaderIcon,
                this.state.group.leaders &&
                this.state.group.leaders.values.find(
                  (leader) => leader.value === membersGroup.value,
                )
                  ? styles.membersIconActive
                  : styles.membersIconInactive,
              ]}
            />
          </Col>
          <Col>
            <TouchableOpacity
              onPress={() => this.goToContactDetailScreen(membersGroup.value, membersGroup.name)}
              key={membersGroup.value}
              style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Text
                style={[
                  styles.linkingText,
                  { marginTop: 'auto', marginBottom: 'auto', padding: 5 },
                  this.props.isRTL
                    ? { textAlign: 'left', flex: 1, marginRight: 15 }
                    : { marginLeft: 15 },
                ]}>
                {membersGroup.name}
              </Text>
            </TouchableOpacity>
          </Col>
        </Grid>
      ) : (
        <Grid style={{ marginTop: 10, marginBottom: 10 }}>
          <Col style={{ width: 20 }}>
            <TouchableOpacity
              onPress={() => this.onSetLeader(membersGroup)}
              key={membersGroup.value}>
              <Image
                source={footprint}
                style={[
                  styles.membersLeaderIcon,
                  this.state.group.leaders &&
                  this.state.group.leaders.values.find(
                    (leader) => leader.value === membersGroup.value && !leader.delete,
                  )
                    ? styles.membersIconActive
                    : styles.membersIconInactive,
                ]}
              />
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity
              onPress={() => this.goToContactDetailScreen(membersGroup.value, membersGroup.name)}
              key={membersGroup.value}
              style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Text
                style={[
                  styles.linkingText,
                  { marginTop: 'auto', marginBottom: 'auto', padding: 5 },
                  this.props.isRTL
                    ? { textAlign: 'left', flex: 1, marginRight: 15 }
                    : { marginLeft: 15 },
                ]}>
                {membersGroup.name}
              </Text>
            </TouchableOpacity>
          </Col>
          <Col style={{ width: 20 }}>
            <TouchableOpacity
              onPress={() => this.onRemoveMember(membersGroup)}
              key={membersGroup.value}>
              <Icon type="MaterialCommunityIcons" name="close" style={styles.membersCloseIcon} />
            </TouchableOpacity>
          </Col>
        </Grid>
      )}
    </View>
  );

  renderHealthMilestones() {
    return (
      <Grid
        pointerEvents={this.state.onlyView ? 'none' : 'auto'}
        style={{ position: 'relative', left: -20 }}>
        <Row style={{ height: spacing }} />
        <Row style={{ height: sideSize }}>
          <Col style={{ width: spacing }} />
          <Col style={{ width: sideSize }}>
            <Image
              source={circleIcon}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                position: 'absolute',
                height: '95%',
                width: '95%',
                marginTop: '2%',
                marginRight: '2%',
                marginBottom: '2%',
                marginLeft: '2%',
                opacity: this.onCheckExistingHealthMetric('church_commitment') ? 1 : 0.15,
              }}
            />
            <Image
              source={dottedCircleIcon}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                position: 'absolute',
                height: '100%',
                width: '100%',
                opacity: this.onCheckExistingHealthMetric('church_commitment') ? 0.15 : 1,
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
                                  this.onHealthMetricChange('church_giving');
                                }}
                                activeOpacity={1}>
                                <Image
                                  source={givingIcon}
                                  style={
                                    this.onCheckExistingHealthMetric('church_giving')
                                      ? styles.activeImage
                                      : styles.inactiveImage
                                  }
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          <Row
                            size={40}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric('church_giving')
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}>
                              {
                                this.props.groupSettings.fields.health_metrics.values.church_giving
                                  .label
                              }
                            </Text>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col size={2} />
                    <Col size={3}>
                      <Row size={6}>
                        <Col size={100}>
                          <Row size={60}>
                            <Col>
                              <TouchableOpacity
                                onPress={() => {
                                  this.onHealthMetricChange('church_fellowship');
                                }}
                                activeOpacity={1}>
                                <Image
                                  source={fellowShipIcon}
                                  style={
                                    this.onCheckExistingHealthMetric('church_fellowship')
                                      ? styles.activeImage
                                      : styles.inactiveImage
                                  }
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          <Row
                            size={40}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric('church_fellowship')
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}>
                              {
                                this.props.groupSettings.fields.health_metrics.values
                                  .church_fellowship.label
                              }
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
                                  this.onHealthMetricChange('church_communion');
                                }}
                                activeOpacity={1}>
                                <Image
                                  source={communionIcon}
                                  style={
                                    this.onCheckExistingHealthMetric('church_communion')
                                      ? styles.activeImage
                                      : styles.inactiveImage
                                  }
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          <Row
                            size={40}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric('church_communion')
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}>
                              {
                                this.props.groupSettings.fields.health_metrics.values
                                  .church_communion.label
                              }
                            </Text>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col size={2} />
                  </Row>

                  <Row size={7}>
                    <Col size={3}>
                      <Row size={2} />
                      <Row size={6}>
                        <Col>
                          <Row size={60}>
                            <Col>
                              <TouchableOpacity
                                onPress={() => {
                                  this.onHealthMetricChange('church_baptism');
                                }}
                                activeOpacity={1}>
                                <Image
                                  source={baptismIcon}
                                  style={
                                    this.onCheckExistingHealthMetric('church_baptism')
                                      ? styles.activeImage
                                      : styles.inactiveImage
                                  }
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          <Row
                            size={40}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric('church_baptism')
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}>
                              {
                                this.props.groupSettings.fields.health_metrics.values.church_baptism
                                  .label
                              }
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
                                  this.onHealthMetricChange('church_prayer');
                                }}
                                activeOpacity={1}>
                                <Image
                                  source={prayerIcon}
                                  style={
                                    this.onCheckExistingHealthMetric('church_prayer')
                                      ? styles.activeImage
                                      : styles.inactiveImage
                                  }
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          <Row
                            size={40}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric('church_prayer')
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}>
                              {
                                this.props.groupSettings.fields.health_metrics.values.church_prayer
                                  .label
                              }
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
                                  this.onHealthMetricChange('church_leaders');
                                }}
                                activeOpacity={1}>
                                <Image
                                  source={leadersIcon}
                                  style={
                                    this.onCheckExistingHealthMetric('church_leaders')
                                      ? styles.activeImage
                                      : styles.inactiveImage
                                  }
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          <Row
                            size={40}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric('church_leaders')
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}>
                              {
                                this.props.groupSettings.fields.health_metrics.values.church_leaders
                                  .label
                              }
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
                                  this.onHealthMetricChange('church_bible');
                                }}
                                activeOpacity={1}>
                                <Image
                                  source={bibleStudyIcon}
                                  style={
                                    this.onCheckExistingHealthMetric('church_bible')
                                      ? styles.activeImage
                                      : styles.inactiveImage
                                  }
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          <Row
                            size={40}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric('church_bible')
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}>
                              {
                                this.props.groupSettings.fields.health_metrics.values.church_bible
                                  .label
                              }
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
                                  this.onHealthMetricChange('church_praise');
                                }}
                                activeOpacity={1}>
                                <Image
                                  source={praiseIcon}
                                  style={
                                    this.onCheckExistingHealthMetric('church_praise')
                                      ? styles.activeImage
                                      : styles.inactiveImage
                                  }
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          <Row
                            size={40}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric('church_praise')
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}>
                              {
                                this.props.groupSettings.fields.health_metrics.values.church_praise
                                  .label
                              }
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
                                  this.onHealthMetricChange('church_sharing');
                                }}
                                activeOpacity={1}>
                                <Image
                                  source={sharingTheGospelIcon}
                                  style={
                                    this.onCheckExistingHealthMetric('church_sharing')
                                      ? styles.activeImage
                                      : styles.inactiveImage
                                  }
                                />
                              </TouchableOpacity>
                            </Col>
                          </Row>
                          <Row
                            size={40}
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric('church_sharing')
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}>
                              {
                                this.props.groupSettings.fields.health_metrics.values.church_sharing
                                  .label
                              }
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
    );
  }

  renderCustomHealthMilestones() {
    const healthMetricsList = Object.keys(this.props.groupSettings.fields.health_metrics.values);
    const customHealthMetrics = healthMetricsList.filter(
      (milestoneItem) => defaultHealthMilestones.indexOf(milestoneItem) < 0,
    );
    const rows = [];
    let columnsByRow = [];
    customHealthMetrics.forEach((value, index) => {
      if ((index + 1) % 3 === 0 || index === customHealthMetrics.length - 1) {
        // every third milestone or last milestone
        columnsByRow.push(<Col key={columnsByRow.length} size={1} />);
        columnsByRow.push(
          <Col key={columnsByRow.length} size={5}>
            <TouchableOpacity
              onPress={() => {
                this.onHealthMetricChange(value);
              }}
              activeOpacity={1}
              underlayColor={
                this.onCheckExistingHealthMetric(value) ? Colors.tintColor : Colors.gray
              }
              style={{
                borderRadius: 10,
                backgroundColor: this.onCheckExistingHealthMetric(value)
                  ? Colors.tintColor
                  : Colors.gray,
                padding: 10,
              }}>
              <Text
                style={[
                  styles.progressIconText,
                  {
                    color: this.onCheckExistingHealthMetric(value) ? '#FFFFFF' : '#000000',
                  },
                ]}>
                {this.props.groupSettings.fields.health_metrics.values[value].label}
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
                this.onHealthMetricChange(value);
              }}
              activeOpacity={1}
              underlayColor={
                this.onCheckExistingHealthMetric(value) ? Colors.tintColor : Colors.gray
              }
              style={{
                borderRadius: 10,
                backgroundColor: this.onCheckExistingHealthMetric(value)
                  ? Colors.tintColor
                  : Colors.gray,
                padding: 10,
              }}>
              <Text
                style={[
                  styles.progressIconText,
                  {
                    color: this.onCheckExistingHealthMetric(value) ? '#FFFFFF' : '#000000',
                  },
                ]}>
                {this.props.groupSettings.fields.health_metrics.values[value].label}
              </Text>
            </TouchableHighlight>
          </Col>,
        );
      }
    });

    return (
      <Grid pointerEvents={this.state.onlyView ? 'none' : 'auto'} style={{ marginBottom: 50 }}>
        {rows}
      </Grid>
    );
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

  onSaveQuickAction = (quickActionPropertyName) => {
    /*let newActionValue = this.state.group[quickActionPropertyName]
      ? parseInt(this.state.group[quickActionPropertyName], 10) + 1
      : 1;
    if (this.props.isConnected) {
      // ONLINE mode
      this.onSaveGroup({
        [quickActionPropertyName]: newActionValue,
      });
    } else {
      // OFFLINE mode
    }
    */
    var comment = '';
    switch (quickActionPropertyName) {
      case 'quick_button_meeting_scheduled':
        comment = i18n.t('groupDetailScreen.fab.quick_button_meeting_scheduled');
        break;
      case 'quick_button_meeting_postponed':
        comment = i18n.t('groupDetailScreen.fab.quick_button_meeting_postponed');
        break;
      case 'quick_button_meeting_complete':
        comment = i18n.t('groupDetailScreen.fab.quick_button_meeting_complete');
        break;
      default:
        comment = '';
    }
    // TODO: temporarily save a Comment until supported by D.T as an Activity w/ count
    if (comment != '') {
      this.props.saveComment(
        this.props.userData.domain,
        this.props.userData.token,
        this.state.group.ID,
        {
          comment,
        },
      );
      // TODO: saveComment doesn't display Toast on normal `Comments and Activities` tabView, so we mock it
      toastSuccess.show(
        <View>
          <Text style={{ color: Colors.sucessText }}>{i18n.t('global.success.save')}</Text>
        </View>,
        3000,
      );
    }
  };

  onMeetingComplete = () => {
    // determine whether there is an existing 'meeting_complete' questionnaire,
    // if so, proxy from Attendance to Questionnaire, else back to GroupDetails
    var isQuestionnaireEnabled = false;
    var q_id = null;
    // loop thru all (active) questionnaires, and check whether 'group'->'meeting_complete' is enabled
    this.props.questionnaires.map((questionnaire) => {
      if (
        questionnaire.trigger_type == 'group' &&
        questionnaire.trigger_value == 'meeting_complete'
      ) {
        isQuestionnaireEnabled = true;
        q_id = questionnaire.id;
      }
    });
    this.props.navigation.navigate(
      NavigationActions.navigate({
        routeName: 'Attendance',
        action: NavigationActions.navigate({
          routeName: 'Attendance',
          params: {
            userData: this.props.userData,
            group: this.state.group,
            q_id,
          },
        }),
      }),
    );
    /*
    this.props.navigation.navigate(
      NavigationActions.navigate({
        routeName: 'Questionnaire',
        action: NavigationActions.navigate({
          routeName: 'Question',
          params: {
            userData: this.props.userData,
            group: this.state.group,
            title: this.state.group.title,
            q_id,
          },
        }),
      }),
    );
    */
  };

  renderStatusPickerItems = () =>
    Object.keys(this.props.groupSettings.fields.group_status.values).map((key) => {
      const optionData = this.props.groupSettings.fields.group_status.values[key];
      return <Picker.Item key={key} label={optionData.label} value={key} />;
    });

  onAddCommunicationField = (key) => {
    const communicationList = this.state.group[key] ? [...this.state.group[key]] : [];
    communicationList.push({
      value: '',
    });
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        [key]: communicationList,
      },
    }));
  };

  onCommunicationFieldChange = (key, value, index, dbIndex, component) => {
    const communicationList = [...component.state.group[key]];
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
      group: {
        ...prevState.group,
        [key]: communicationList,
      },
    }));
  };

  onRemoveCommunicationField = (key, index, component) => {
    const communicationList = [...component.state.group[key]];
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
      group: {
        ...prevState.group,
        [key]: communicationList,
      },
    }));
  };

  setFieldContentStyle(field) {
    let newStyles = {};
    if (field.type == 'key_select' || field.type == 'user_select') {
      newStyles = {
        ...styles.groupTextRoundField,
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
                onRefresh={() => this.onRefresh(this.state.group.ID)}
              />
            }>
            <View style={[styles.formContainer, { marginTop: 0 }]}>
              {fields.map((field, index) => (
                <View key={index.toString()}>
                  {field.name == 'group_status' ||
                  field.name == 'health_metrics' ||
                  field.name == 'members' ||
                  (field.type == 'connection' && field.post_type == 'groups') ? (
                    this.renderFieldValue(field)
                  ) : (
                    <View>
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
                      {field.name == 'group_status' ? null : <View style={styles.formDivider} />}
                    </View>
                  )}
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
                  {field.name == 'group_status' ||
                  field.name == 'health_metrics' ||
                  field.type == 'communication_channel' ? (
                    this.renderField(field)
                  ) : (
                    <View>
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
                              {i18n.t('groupDetailScreen.groupName.error')}
                            </Text>
                          </Col>
                        </Row>
                      ) : null}
                    </View>
                  )}
                </View>
              ))}
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );

  renderFieldValue = (field) => {
    let propExist = Object.prototype.hasOwnProperty.call(this.state.group, field.name);
    let mappedValue;
    let value = this.state.group[field.name],
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
        if (field.name === 'members') {
          mappedValue =
            propExist && value.values.length > 0 ? (
              <Col>
                <Text
                  style={[
                    {
                      color: Colors.tintColor,
                      fontSize: 12,
                      textAlign: 'left',
                      paddingBottom: 15,
                      paddingTop: 5,
                      marginTop: 10,
                    },
                  ]}>
                  {field.label}
                </Text>
                <FlatList
                  data={value.values.filter((member) => !member.delete)}
                  extraData={this.state.updateMembersList}
                  renderItem={(item) => this.membersRow(item.item)}
                  ItemSeparatorComponent={this.flatListItemSeparator}
                />
              </Col>
            ) : (
              <View>
                <Text style={styles.addMembersHyperlink} onPress={() => this.onEnableEdit()}>
                  {i18n.t('groupDetailScreen.noMembersMessage')}
                </Text>
              </View>
            );
        } else if (postType === 'groups') {
          mappedValue = (
            <Grid>
              <Row style={styles.formRow}>
                <Col style={styles.formIconLabel}>
                  <View style={styles.formIconLabelView}>
                    <Image source={groupParentIcon} style={styles.groupIcons} />
                  </View>
                </Col>
                <Col style={styles.formIconLabel}>
                  <Label style={styles.formLabel}>{field.label}</Label>
                </Col>
                <Col />
              </Row>
              <Row
                style={[
                  styles.groupCircleParentContainer,
                  { overflowX: 'auto', marginBottom: 10 },
                ]}>
                <ScrollView horizontal>
                  {propExist && value.values.length > 0
                    ? value.values.map((group, index) => (
                        <Col
                          key={index.toString()}
                          style={styles.groupCircleContainer}
                          onPress={() => this.goToGroupDetailScreen(group.value, group.name)}>
                          {Object.prototype.hasOwnProperty.call(group, 'is_church') &&
                          group.is_church ? (
                            <Image source={groupCircleIcon} style={styles.groupCircle} />
                          ) : (
                            <Image source={groupDottedCircleIcon} style={styles.groupCircle} />
                          )}
                          <Image source={swimmingPoolIcon} style={styles.groupCenterIcon} />
                          <Row style={styles.groupCircleName}>
                            <Text style={styles.groupCircleNameText}>{group.name}</Text>
                          </Row>
                          <Row style={styles.groupCircleCounter}>
                            <Text>{group.baptized_member_count}</Text>
                          </Row>
                          <Row style={[styles.groupCircleCounter, { marginTop: '5%' }]}>
                            <Text>{group.member_count}</Text>
                          </Row>
                        </Col>
                      ))
                    : null}
                </ScrollView>
              </Row>
              <View style={styles.formDivider} />
            </Grid>
          );
        } else if (propExist) {
          let collection = [],
            isGroup = false;
          switch (postType) {
            case 'contacts': {
              collection = [...this.state.usersContacts];
              break;
            }
            case 'groups': {
              collection = [...this.state.groups];
              isGroup = true;
              break;
            }
            default: {
              break;
            }
          }
          mappedValue = this.renderConnectionLink(value, collection, isGroup);
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
        } else if (field.name == 'health_metrics') {
          mappedValue = (
            <View>
              <Row style={[styles.formRow, { paddingTop: 10 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="MaterialCommunityIcons" name="church" style={[styles.formIcon, {}]} />
                </Col>
                <Col>
                  <Label style={[styles.formLabel, { fontWeight: 'bold' }]}>
                    {this.props.groupSettings.fields.health_metrics.name}
                  </Label>
                </Col>
              </Row>
              {this.renderHealthMilestones()}
              {this.renderCustomHealthMilestones()}
            </View>
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
        if (propExist) {
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
        break;
      }
      case 'key_select': {
        if (propExist) {
          if (field.name === 'group_status') {
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
                          fontSize: 14,
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
                          borderColor: this.state.groupStatusBackgroundColor,
                          backgroundColor: this.state.groupStatusBackgroundColor,
                        },
                      }),
                    ]}>
                    <Picker
                      selectedValue={value}
                      onValueChange={this.setGroupStatus}
                      style={Platform.select({
                        android: {
                          color: '#ffffff',
                          backgroundColor: 'transparent',
                        },
                        ios: {
                          backgroundColor: this.state.groupStatusBackgroundColor,
                        },
                      })}
                      textStyle={{
                        color: '#ffffff',
                      }}>
                      {this.renderStatusPickerItems()}
                    </Picker>
                  </Col>
                </Row>
              </Col>
            );
          } else {
            mappedValue = (
              <Text style={this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}}>
                {field.default[value].label}
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

  onMilestoneChange = (milestoneName, customProp) => {
    let list = this.state.group[customProp];
    let propName = customProp;
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
      group: {
        ...prevState.group,
        [propName]: {
          values: milestonesList,
        },
      },
    }));
  };

  onCheckExistingMilestone = (milestoneName, customProp) => {
    let list = this.state.group[customProp];
    const milestonesList = list ? [...list.values] : [];
    // Return 'boolean' acording to milestone existing in the 'milestonesList'
    return milestonesList.some(
      (milestone) => milestone.value === milestoneName && !milestone.delete,
    );
  };

  renderField = (field) => {
    let propExist = Object.prototype.hasOwnProperty.call(this.state.group, field.name);
    let mappedValue;
    let value = this.state.group[field.name],
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
              this.state.group[field.name],
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
                this.setGroupCustomFieldValue(field.name, dateValue, valueType)
              }
              defaultDate={
                this.state.group[field.name] && this.state.group[field.name].length > 0
                  ? sharedTools.formatDateToDatePicker(this.state.group[field.name] * 1000)
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
              onPress={() => this.setGroupCustomFieldValue(field.name, null, valueType)}
            />
          </Row>
        );
        break;
      }
      case 'connection': {
        if (field.name === 'members') {
          mappedValue = (
            <Col>
              <FlatList
                data={propExist ? value.values : []}
                extraData={this.state.updateMembersList}
                renderItem={(item) => this.membersRow(item.item)}
                ItemSeparatorComponent={this.flatListItemSeparator}
              />
              <Grid>
                <Row>
                  <Col
                    style={[
                      { width: 40, marginTop: 5, marginLeft: 0 },
                      this.props.isRTL ? { marginRight: 10 } : {},
                    ]}>
                    <Icon type="Entypo" name="add-user" style={{ color: '#CCCCCC' }} />
                  </Col>
                  <Col style={{ paddingBottom: 200 }}>
                    <Selectize
                      ref={(selectize) => {
                        addMembersSelectizeRef = selectize;
                      }}
                      itemId="value"
                      items={[...this.state.membersContacts, ...this.state.usersContacts].filter(
                        (userContact) => {
                          // Filter members to get only members no added to group
                          if (
                            propExist &&
                            value.values.find((member) => member.value === userContact.value) !==
                              undefined
                          ) {
                            return false;
                          } else {
                            return true;
                          }
                        },
                      )}
                      selectedItems={[]}
                      textInputProps={{
                        placeholder: i18n.t('groupDetailScreen.addMember'),
                        leftIcon: { type: 'Entypo', name: 'add-user' },
                      }}
                      renderRow={(id, onPress, item) => (
                        <TouchableOpacity
                          activeOpacity={0.6}
                          key={id}
                          onPress={() => this.onAddMember(item)}
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
                      keyboardShouldPersistTaps
                      inputContainerStyle={styles.selectizeField}
                    />
                  </Col>
                </Row>
              </Grid>
            </Col>
          );
        } else {
          let listItems = [],
            placeholder = '';
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
          mappedValue = (
            <Selectize
              itemId="value"
              items={listItems}
              selectedItems={this.getSelectizeItems(this.state.group[field.name], listItems)}
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
        }
        break;
      }
      case 'multi_select': {
        if (field.name == 'health_metrics') {
          mappedValue = (
            <View>
              <Row style={[styles.formRow, { paddingTop: 10 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="MaterialCommunityIcons" name="church" style={[styles.formIcon, {}]} />
                </Col>
                <Col>
                  <Label style={[styles.formLabel, { fontWeight: 'bold' }]}>
                    {this.props.groupSettings.fields.health_metrics.name}
                  </Label>
                </Col>
              </Row>
              {this.renderHealthMilestones()}
              {this.renderCustomHealthMilestones()}
            </View>
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
                        style={styles.groupTextField}
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
        if (field.name === 'group_status') {
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
                        fontSize: 14,
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
                        borderColor: this.state.groupStatusBackgroundColor,
                        backgroundColor: this.state.groupStatusBackgroundColor,
                      },
                    }),
                  ]}>
                  <Picker
                    selectedValue={value}
                    onValueChange={this.setGroupStatus}
                    style={Platform.select({
                      android: {
                        color: '#ffffff',
                        backgroundColor: 'transparent',
                      },
                      ios: {
                        backgroundColor: this.state.groupStatusBackgroundColor,
                      },
                    })}
                    textStyle={{
                      color: '#ffffff',
                    }}>
                    {this.renderStatusPickerItems()}
                  </Picker>
                </Col>
              </Row>
            </Col>
          );
        } else {
          mappedValue = (
            <Picker
              mode="dropdown"
              selectedValue={this.state.group[field.name]}
              onValueChange={(value) => this.setGroupCustomFieldValue(field.name, value)}
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
            onValueChange={(value) => this.setGroupCustomFieldValue(field.name, value)}
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
            onChangeText={(value) => this.setGroupCustomFieldValue(field.name, value)}
            style={[styles.groupTextField, this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}]}
          />
        );
        break;
      }
      case 'text': {
        mappedValue = (
          <Input
            value={value}
            onChangeText={(value) => this.setGroupCustomFieldValue(field.name, value)}
            style={[
              field.name == 'name' && this.state.nameRequired
                ? [styles.groupTextField, { borderBottomWidth: 0 }]
                : styles.groupTextField,
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

  onSelectizeValueChange = (propName, selectedItems) => {
    this.setState((prevState) => {
      if (propName == 'members') {
        return {
          group: {
            ...prevState.group,
            [propName]: {
              values: sharedTools.getSelectizeValuesToSave(
                [...this.state.membersContacts, ...this.state.usersContacts].filter(
                  (userContact) => {
                    // Filter members to get only members no added to group
                    if (
                      this.state.group.members &&
                      this.state.group.members.values.find(
                        (member) => member.value === userContact.value,
                      ) !== undefined
                    ) {
                      return false;
                    } else {
                      return true;
                    }
                  },
                ),
                selectedItems,
              ),
            },
          },
        };
      } else {
        return {
          group: {
            ...prevState.group,
            [propName]: {
              values: sharedTools.getSelectizeValuesToSave(
                prevState.group[propName] ? prevState.group[propName].values : [],
                selectedItems,
              ),
            },
          },
        };
      }
    });
  };

  setGroupCustomFieldValue = (fieldName, value, fieldType = null) => {
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
      group: {
        ...prevState.group,
        [fieldName]: value,
      },
    }));
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
            {this.groupIsCreated() ? (
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
                  this.state.tabViewConfig.index != this.state.tabViewConfig.routes.length - 1 && (
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
                        buttonColor={Colors.colorWait}
                        //title={this.props.groupSettings.fields.quick_button_meeting_scheduled.name}
                        title={i18n.t('groupDetailScreen.fab.quick_button_meeting_scheduled')}
                        onPress={() => {
                          this.onSaveQuickAction('quick_button_meeting_scheduled');
                        }}
                        size={40}
                        nativeFeedbackRippleColor="rgba(0,0,0,0)"
                        textStyle={{ color: Colors.tintColor, fontSize: 15 }}
                        textContainerStyle={{ height: 'auto' }}>
                        <Icon
                          type="MaterialCommunityIcons"
                          name="calendar-plus"
                          style={styles.groupFABIcon}
                        />
                      </ActionButton.Item>
                      <ActionButton.Item
                        buttonColor={Colors.colorYes}
                        //title={this.props.groupSettings.fields.quick_button_meeting_complete.name}
                        title={i18n.t('groupDetailScreen.fab.quick_button_meeting_complete')}
                        onPress={() => {
                          this.onMeetingComplete();
                        }}
                        size={40}
                        nativeFeedbackRippleColor="rgba(0,0,0,0)"
                        textStyle={{ color: Colors.tintColor, fontSize: 15 }}
                        textContainerStyle={{ height: 'auto' }}>
                        <Icon
                          type="MaterialCommunityIcons"
                          name="calendar-check"
                          style={styles.groupFABIcon}
                        />
                      </ActionButton.Item>
                      <ActionButton.Item
                        buttonColor={Colors.colorNo}
                        //title={this.props.groupSettings.fields.quick_button_meeting_postponed.name}
                        title={i18n.t('groupDetailScreen.fab.quick_button_meeting_postponed')}
                        onPress={() => {
                          this.onSaveQuickAction('quick_button_meeting_postponed');
                        }}
                        size={40}
                        nativeFeedbackRippleColor="rgba(0,0,0,0)"
                        textStyle={{ color: Colors.tintColor, fontSize: 15 }}
                        textContainerStyle={{ height: 'auto' }}>
                        <Icon
                          type="MaterialCommunityIcons"
                          name="calendar-minus"
                          style={styles.groupFABIcon}
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
                                        styles.groupTextField,
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
                              <Text>{i18n.t('groupDetailScreen.groupSharedWith')}:</Text>
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

GroupDetailScreen.propTypes = {
  userData: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  group: PropTypes.shape({
    ID: PropTypes.any,
    name: PropTypes.string,
    oldID: PropTypes.string,
  }),
  userReducerError: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.string,
  }),
  newComment: PropTypes.bool,
  groupsReducerError: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.string,
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        onlyView: PropTypes.any,
        groupId: PropTypes.any,
        groupName: PropTypes.string,
      }),
    }),
  }).isRequired,
  getById: PropTypes.func.isRequired,
  saveGroup: PropTypes.func.isRequired,
  getComments: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  getActivities: PropTypes.func.isRequired,
  saved: PropTypes.bool,
  getByIdEnd: PropTypes.func.isRequired,
  isConnected: PropTypes.bool,
  groupSettings: PropTypes.shape({
    health_metrics: PropTypes.shape({
      values: PropTypes.shape({
        church_giving: PropTypes.shape({
          label: PropTypes.string,
        }),
        church_fellowship: PropTypes.shape({
          label: PropTypes.string,
        }),
        church_communion: PropTypes.shape({
          label: PropTypes.string,
        }),
        church_baptism: PropTypes.shape({
          label: PropTypes.string,
        }),
        church_prayer: PropTypes.shape({
          label: PropTypes.string,
        }),
        church_leaders: PropTypes.shape({
          label: PropTypes.string,
        }),
        church_bible: PropTypes.shape({
          label: PropTypes.string,
        }),
        church_praise: PropTypes.shape({
          label: PropTypes.string,
        }),
        church_sharing: PropTypes.shape({
          label: PropTypes.string,
        }),
      }),
    }),
    group_status: PropTypes.shape({
      name: PropTypes.string,
      values: PropTypes.shape({}),
    }),
    assigned_to: PropTypes.shape({
      name: PropTypes.string,
    }),
    coaches: PropTypes.shape({
      name: PropTypes.string,
    }),
    location_grid: PropTypes.shape({
      name: PropTypes.string,
    }),
    people_groups: PropTypes.shape({
      name: PropTypes.string,
    }),
    start_date: PropTypes.shape({
      name: PropTypes.string,
    }),
    end_date: PropTypes.shape({
      name: PropTypes.string,
    }),
    group_type: PropTypes.shape({
      name: PropTypes.string,
      values: PropTypes.shape({}),
    }),
    parent_groups: PropTypes.shape({
      name: PropTypes.string,
    }),
    peer_groups: PropTypes.shape({
      name: PropTypes.string,
    }),
    child_groups: PropTypes.shape({
      name: PropTypes.string,
    }),
    members: PropTypes.shape({
      values: PropTypes.shape({}),
    }),
  }),
};

GroupDetailScreen.defaultProps = {
  group: null,
  userReducerError: null,
  newComment: null,
  groupsReducerError: null,
  saved: null,
  isConnected: null,
  groupSettings: null,
  questionnaires: [],
};

const mapStateToProps = (state) => ({
  userData: state.userReducer.userData,
  userReducerError: state.userReducer.error,
  group: state.groupsReducer.group,
  comments: state.groupsReducer.comments,
  totalComments: state.groupsReducer.totalComments,
  loadingComments: state.groupsReducer.loadingComments,
  activities: state.groupsReducer.activities,
  totalActivities: state.groupsReducer.totalActivities,
  loadingActivities: state.groupsReducer.loadingActivities,
  newComment: state.groupsReducer.newComment,
  groupsReducerError: state.groupsReducer.error,
  loading: state.groupsReducer.loading,
  saved: state.groupsReducer.saved,
  isConnected: state.networkConnectivityReducer.isConnected,
  groupSettings: state.groupsReducer.settings,
  foundGeonames: state.groupsReducer.foundGeonames,
  groupsList: state.groupsReducer.groups,
  contactsList: state.contactsReducer.contacts,
  isRTL: state.i18nReducer.isRTL,
  previousGroups: state.groupsReducer.previousGroups,
  previousContacts: state.contactsReducer.previousContacts,
  questionnaires: state.questionnaireReducer.questionnaires,
  loadingShare: state.groupsReducer.loadingShare,
  shareSettings: state.groupsReducer.shareSettings,
  savedShare: state.groupsReducer.savedShare,
  tags: state.contactsReducer.tags,
});

const mapDispatchToProps = (dispatch) => ({
  saveGroup: (domain, token, groupData) => {
    dispatch(saveGroup(domain, token, groupData));
  },
  getById: (domain, token, groupId) => {
    dispatch(getById(domain, token, groupId));
  },
  getComments: (domain, token, groupId, pagination) => {
    dispatch(getCommentsByGroup(domain, token, groupId, pagination));
  },
  saveComment: (domain, token, groupId, commentData) => {
    dispatch(saveComment(domain, token, groupId, commentData));
  },
  getActivities: (domain, token, groupId, pagination) => {
    dispatch(getActivitiesByGroup(domain, token, groupId, pagination));
  },
  getByIdEnd: () => {
    dispatch(getByIdEnd());
  },
  searchLocations: (domain, token, queryText) => {
    dispatch(searchLocations(domain, token, queryText));
  },
  deleteComment: (domain, token, groupId, commentId) => {
    dispatch(deleteComment(domain, token, groupId, commentId));
  },
  loadingFalse: () => {
    dispatch(loadingFalse());
  },
  updatePrevious: (previousGroups) => {
    dispatch(updatePrevious(previousGroups));
  },
  updatePreviousContacts: (previousContacts) => {
    dispatch(updatePreviousContacts(previousContacts));
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetailScreen);
