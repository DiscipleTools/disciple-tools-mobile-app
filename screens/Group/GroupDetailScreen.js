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
import { TabView, TabBar } from 'react-native-tab-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationActions, StackActions } from 'react-navigation';
import MentionsTextInput from 'react-native-mentions';
import ParsedText from 'react-native-parsed-text';
//import * as Sentry from 'sentry-expo';
import { BlurView } from 'expo-blur';

import moment from '../../languages/moment';
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
} from '../../store/actions/groups.actions';
import Colors from '../../constants/Colors';
import statusIcon from '../../assets/icons/status.png';
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
import swimmingPoolIcon from '../../assets/icons/swimming-pool.png';
import groupCircleIcon from '../../assets/icons/group-circle.png';
import groupDottedCircleIcon from '../../assets/icons/group-dotted-circle.png';
import groupChildIcon from '../../assets/icons/group-child.png';
import groupParentIcon from '../../assets/icons/group-parent.png';
import groupPeerIcon from '../../assets/icons/group-peer.png';
import groupTypeIcon from '../../assets/icons/group-type.png';
import footprint from '../../assets/icons/footprint.png';
import dtIcon from '../../assets/images/dt-icon.png';
import dateIcon from '../../assets/icons/date.png';
import dateSuccessIcon from '../../assets/icons/date-success.png';
import dateEndIcon from '../../assets/icons/date-end.png';
import i18n from '../../languages';

let toastSuccess;
let toastError;
const containerPadding = 35;
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
let commentsFlatList,
  coachesSelectizeRef,
  geonamesSelectizeRef,
  peopleGroupsSelectizeRef,
  addMembersSelectizeRef,
  parentGroupsSelectizeRef,
  peerGroupsSelectizeRef,
  childGroupsSelectizeRef;
/* eslint-enable */
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
const tabViewRoutes = [
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
    key: 'members',
    title: 'global.membersActivity',
  },
  {
    key: 'groups',
    title: 'global.groups',
  },
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
  // Comments Section
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    height: 16,
    marginTop: 10,
    width: 16,
  },
  content: {
    backgroundColor: '#F3F3F3',
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
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  commentMessage: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  activityMessage: {
    paddingLeft: 10,
    paddingRight: 10,
    color: '#B4B4B4',
    fontStyle: 'italic',
  },
  // Form
  formContainer: {
    paddingTop: 10,
    paddingBottom: 10,
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
    routes: [...tabViewRoutes],
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
        <Text style={{ color: '#FFFFFF', marginTop: 'auto', marginBottom: 'auto' }}>
          {i18n.t('global.save')}
        </Text>
        <Icon
          type="Feather"
          name="check"
          style={[
            { color: '#FFFFFF', marginTop: 'auto', marginBottom: 'auto' },
            self && self.props.isRTL ? { paddingLeft: 16 } : { paddingRight: 16 },
          ]}
        />
      </Row>
    );
    let headerLeft;

    if (params) {
      if (params.onEnableEdit && params.groupId && params.onlyView) {
        headerRight = () => (
          <Row onPress={params.onEnableEdit}>
            <Text style={{ color: '#FFFFFF', marginTop: 'auto', marginBottom: 'auto' }}>
              {i18n.t('global.edit')}
            </Text>
            <Icon
              type="MaterialCommunityIcons"
              name="pencil"
              style={[
                { color: '#FFFFFF', marginTop: 'auto', marginBottom: 'auto' },
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
            onPress={() => {
              params.backButtonTap();
            }}
            style={[{ paddingLeft: 16, color: '#FFFFFF', paddingRight: 16 }]}
          />
        );
      } else {
        headerLeft = () => (
          <Row onPress={params.onDisableEdit}>
            <Icon
              type="AntDesign"
              name="close"
              style={[
                { color: '#FFFFFF', marginTop: 'auto', marginBottom: 'auto' },
                self && self.props.isRTL ? { paddingRight: 16 } : { paddingLeft: 16 },
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
    navigation.setParams({
      onEnableEdit: this.onEnableEdit,
      onDisableEdit: this.onDisableEdit,
      onSaveGroup: this.onSaveGroup,
      backButtonTap: this.backButtonTap,
    });
    keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow.bind(this),
    );
    keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide.bind(this),
    );
    focusListener = navigation.addListener('didFocus', () => {
      if (
        typeof this.props.navigation.state.params.groupId !== 'undefined' &&
        this.state.loadedLocal
      ) {
        this.setState(
          {
            loading: false,
          },
          () => {
            this.onRefresh(this.props.navigation.state.params.groupId);
          },
        );
      }
    });
    hardwareBackPressListener = BackHandler.addEventListener('hardwareBackPress', () => {
      sharedTools.onlyExecuteLastCall(
        null,
        () => {
          this.backButtonTap();
        },
        1000,
      );
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
      group,
      loading,
      comments,
      loadingComments,
      activities,
      loadingActivities,
      newComment,
      foundGeonames,
      isConnected,
    } = nextProps;
    let newState = {
      ...prevState,
      loading,
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
      if (newState.group.oldID) {
        delete newState.group.oldID;
      }
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
      if (newState.group.members) {
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
      if (newState.group.ID && Object.prototype.hasOwnProperty.call(comments, newState.group.ID)) {
        // NEW COMMENTS (PAGINATION)
        if (comments[newState.group.ID].pagination.offset > 0) {
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
            ...comments[newState.group.ID],
          },
        };
      }
    }

    // GET ACTIVITITES
    if (activities) {
      if (
        newState.group.ID &&
        Object.prototype.hasOwnProperty.call(activities, newState.group.ID)
      ) {
        // NEW ACTIVITIES (PAGINATION)
        if (activities[newState.group.ID].pagination.offset > 0) {
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
            ...activities[newState.group.ID],
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
      group,
      navigation,
      newComment,
      groupsReducerError,
      saved,
    } = this.props;

    // NEW COMMENT
    if (newComment && prevProps.newComment !== newComment) {
      commentsFlatList.scrollToOffset({ animated: true, offset: 0 });
      this.setComment('');
    }

    // GROUP SAVE / GET BY ID
    if (group && prevProps.group !== group) {
      // Update group data only in these conditions:
      // Same group created (offline/online)
      // Same group updated (offline/online)
      // Sane offline group created in DB (AutoID to DBID)
      if (
        (typeof group.ID !== 'undefined' && typeof this.state.group.ID === 'undefined') ||
        group.ID.toString() === this.state.group.ID.toString() ||
        (group.oldID && group.oldID.toString() === this.state.group.ID.toString())
      ) {
        // Highlight Updates -> Compare this.state.group with group and show differences
        navigation.setParams({ groupName: group.title, groupId: group.ID });
        this.getGroupByIdEnd();
      }
    }

    // GROUP SAVE
    if (saved && prevProps.saved !== saved) {
      // Update group data only in these conditions:
      // Same group created (offline/online)
      // Same group updated (offline/online)
      // Sane offline group created in DB (AutoID to DBID)
      if (
        (typeof group.ID !== 'undefined' && typeof this.state.group.ID === 'undefined') ||
        group.ID.toString() === this.state.group.ID.toString() ||
        (group.oldID && group.oldID.toString() === this.state.group.ID.toString())
      ) {
        // Highlight Updates -> Compare this.state.contact with contact and show differences
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

    if (prevProps.navigation.state.params.hideTabBar !== navigation.state.params.hideTabBar) {
      if (!navigation.state.params.hideTabBar && this.state.executingBack) {
        setTimeout(() => {
          this.executeBack(navigation, navigation.state.params);
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
      this.executeBack(navigation, params);
    }
  };

  executeBack = (navigation, params) => {
    if (params.previousList.length > 0) {
      navigation.goBack();
      params.onBackFromSameScreen();
    } else if (params.fromNotificationView) {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'GroupList' })],
      });
      navigation.dispatch(resetAction);
      navigation.navigate('NotificationList');
    } else {
      navigation.goBack();
      // Prevent error when view loaded from ContactDetailScreen.js
      if (typeof params.onGoBack === 'function') {
        params.onGoBack();
      }
    }
  };

  onLoad() {
    const { navigation } = this.props;
    const { groupId, onlyView, groupName } = navigation.state.params;
    let newState = {};
    if (groupId) {
      newState = {
        group: {
          ...this.state.group,
          ID: groupId,
          title: groupName,
          group_type: 'group',
        },
      };
      navigation.setParams({ groupName });
    } else {
      newState = {
        group: {
          title: null,
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
    this.setState(
      {
        ...newState,
      },
      () => {
        this.getLists(groupId || null);
      },
    );
  }

  onBackFromSameScreen = () => {
    const { navigation } = this.props;
    const { params } = navigation.state;
    const newPreviousList = params.previousList;
    const previousParams = newPreviousList[newPreviousList.length - 1];
    newPreviousList.pop();
    navigation.setParams({
      ...previousParams,
      previousList: newPreviousList,
    });
    this.setState(initialState, () => {
      this.onLoad();
    });
  };

  onRefresh(groupId) {
    this.getGroupById(groupId);
    this.onRefreshCommentsActivities(groupId, true);
  }

  onRefreshCommentsActivities(groupId, resetPagination = false) {
    this.getGroupComments(groupId, resetPagination);
    this.getGroupActivities(groupId, resetPagination);
  }

  getLists = async (groupId) => {
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
      if (groupId) {
        this.onRefresh(groupId);
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
      groupName: this.state.group.title,
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
    this.setState((state) => {
      // Set correct index in Tab position according to view mode and current tab position
      const indexFix =
        state.tabViewConfig.index > 1 && !state.onlyView
          ? state.tabViewConfig.index + 1
          : state.tabViewConfig.index;
      return {
        onlyView: true,
        group: {
          ...unmodifiedGroup,
        },
        groupStatusBackgroundColor: sharedTools.getSelectorColor(unmodifiedGroup.group_status),
        tabViewConfig: {
          ...state.tabViewConfig,
          index: indexFix,
          routes: [...tabViewRoutes],
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

  setGroupTitle = (value) => {
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        title: value,
      },
    }));
  };

  setGroupType = (value) => {
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        group_type: value,
      },
    }));
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

  setGroupStartDate = (value) => {
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        start_date: sharedTools.formatDateToBackEnd(value),
      },
    }));
  };

  setEndDate = (value) => {
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        end_date: sharedTools.formatDateToBackEnd(value),
      },
    }));
  };

  setChurchStartDate = (value) => {
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        church_start_date: sharedTools.formatDateToBackEnd(value),
      },
    }));
  };

  getCommentsAndActivities() {
    const { comments, activities } = this.state;
    const list = comments.data.concat(activities.data);
    return list
      .filter((item, index) => list.indexOf(item) === index)
      .sort((a, b) => new Date(a.date).getTime() < new Date(b.date).getTime());
  }

  showMembersCount = () => (
    <View>
      <Row style={{ paddingBottom: 10 }}>
        <Text
          style={[
            { color: Colors.tintColor, fontSize: 13, textAlign: 'left', fontWeight: 'bold' },
          ]}>
          {i18n.t('global.membersActivity')}:
        </Text>
        {this.state.group.member_count ? (
          <Text
            style={{
              color: Colors.tintColor,
              fontSize: 13,
              textAlign: 'left',
              fontWeight: 'bold',
            }}>
            {' '}
            {this.state.group.member_count}
          </Text>
        ) : (
          <Text
            style={{
              color: Colors.tintColor,
              fontSize: 13,
              textAlign: 'left',
              fontWeight: 'bold',
            }}>
            {' '}
            0{' '}
          </Text>
        )}
      </Row>
      {!this.state.group.member_count || parseInt(this.state.group.member_count) === 0 ? (
        <View>
          <Text style={styles.addMembersHyperlink} onPress={() => this.onEnableEdit()}>
            {i18n.t('groupDetailScreen.noMembersMessage')}
          </Text>
        </View>
      ) : (
        <View></View>
      )}
    </View>
  );

  goToContactDetailScreen = (contactID) => {
    this.props.navigation.navigate('ContactDetail', {
      contactId: contactID,
      onlyView: true,
      contactName: safeFind(
        this.state.usersContacts.find((user) => user.value === contactID),
        'name',
      ),
      previousList: [],
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
      <Image style={styles.image} source={{ uri: commentOrActivity.gravatar }} />
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          {
            // Comment
            Object.prototype.hasOwnProperty.call(commentOrActivity, 'content') && (
              <Grid>
                <Row>
                  <Col>
                    <Text
                      style={[styles.name, this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
                      {commentOrActivity.author}
                    </Text>
                  </Col>
                  <Col style={{ width: 110 }}>
                    <Text
                      style={[styles.time, this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
                      {this.onFormatDateToView(commentOrActivity.date)}
                    </Text>
                  </Col>
                </Row>
              </Grid>
            )
          }
          {
            // Activity
            Object.prototype.hasOwnProperty.call(commentOrActivity, 'object_note') && (
              <Grid>
                <Row>
                  <Col>
                    <Text
                      style={[styles.name, this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
                      {commentOrActivity.name}
                    </Text>
                  </Col>
                  <Col style={{ width: 110 }}>
                    <Text
                      style={[styles.time, this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
                      {this.onFormatDateToView(commentOrActivity.date)}
                    </Text>
                  </Col>
                </Row>
              </Grid>
            )
          }
        </View>
        <ParsedText
          style={
            commentOrActivity.content
              ? [styles.commentMessage, this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}]
              : [styles.activityMessage, this.props.isRTL ? { textAlign: 'left', flex: 1 } : {}]
          }
          parse={[
            {
              pattern: sharedTools.mentionPattern,
              style: { color: Colors.primary },
              renderText: sharedTools.renderMention,
            },
          ]}>
          {Object.prototype.hasOwnProperty.call(commentOrActivity, 'content')
            ? commentOrActivity.content
            : this.formatActivityDate(commentOrActivity.object_note)}
        </ParsedText>
        {
          // Comment and its their own comment
          Object.prototype.hasOwnProperty.call(commentOrActivity, 'content') &&
            commentOrActivity.author === this.props.userData.username && (
              <Grid style={{ marginTop: 20 }}>
                <Row>
                  <Row
                    onPress={() => {
                      this.openCommentDialog(commentOrActivity);
                    }}>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="pencil"
                      style={{ color: Colors.primary, fontSize: 25, marginLeft: 'auto' }}
                    />
                    <Text
                      style={{
                        color: Colors.primary,
                        fontSize: 14,
                        marginRight: 'auto',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                      }}>
                      {i18n.t('global.edit')}
                    </Text>
                  </Row>
                  <Row
                    onPress={() => {
                      this.openCommentDialog(commentOrActivity, true);
                    }}>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="delete"
                      style={{ color: Colors.primary, fontSize: 25, marginLeft: 'auto' }}
                    />
                    <Text
                      style={{
                        color: Colors.primary,
                        fontSize: 14,
                        marginRight: 'auto',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                      }}>
                      {i18n.t('settingsScreen.remove')}
                    </Text>
                  </Row>
                </Row>
              </Grid>
            )
        }
      </View>
    </View>
  );

  updateShowAssignedToModal = (value) => {
    this.setState({
      showAssignedToModal: value,
    });
  };

  onSelectAssignedTo = (value) => {
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        assigned_to: {
          key: value,
          label: [...this.state.users, ...this.state.assignedToContacts].find(
            (user) => user.key === value,
          ).label,
        },
      },
      showAssignedToModal: false,
      assignedToContacts: [], // Clear non existing assignedToContacts list
    }));
  };

  onCancelAssignedTo = () => {
    this.setState({
      showAssignedToModal: false,
    });
  };

  onAddAddressField = () => {
    const contactAddressList = this.state.group.contact_address
      ? [...this.state.group.contact_address]
      : [];
    contactAddressList.push({
      value: '',
    });
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        contact_address: contactAddressList,
      },
    }));
  };

  onAddressFieldChange = (value, index, dbIndex, component) => {
    const contactAddressList = [...component.state.group.contact_address];
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
      group: {
        ...prevState.group,
        contact_address: contactAddressList,
      },
    }));
  };

  onRemoveAddressField = (index, component) => {
    const contactAddressList = [...component.state.group.contact_address];
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
      group: {
        ...prevState.group,
        contact_address: contactAddressList,
      },
    }));
  };

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
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        members: {
          values: [
            ...prevState.group.members.values,
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
    }));
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

  getSelectizeValuesToSave = (dbData, selectizeRef, selectedValues = null) => {
    const dbItems = [...dbData];
    let localItems = [];
    if (selectedValues) {
      localItems = [...selectedValues];
    } else {
      selectedValues = selectizeRef.getSelectedItems();
      Object.keys(selectedValues.entities.item).forEach((itemValue) => {
        const item = selectedValues.entities.item[itemValue];
        localItems.push(item);
      });
    }
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

  transformGroupObject = (group) => {
    let transformedGroup = {
      ...group,
    };
    // if property exist, get from json, otherwise, send empty array
    if (coachesSelectizeRef) {
      transformedGroup = {
        ...transformedGroup,
        coaches: {
          values: this.getSelectizeValuesToSave(
            transformedGroup.coaches ? transformedGroup.coaches.values : [],
            coachesSelectizeRef,
          ),
        },
      };
    }
    if (geonamesSelectizeRef) {
      transformedGroup = {
        ...transformedGroup,
        location_grid: {
          values: this.getSelectizeValuesToSave(
            transformedGroup.location_grid ? transformedGroup.location_grid.values : [],
            geonamesSelectizeRef,
          ),
        },
      };
    }
    if (peopleGroupsSelectizeRef) {
      transformedGroup = {
        ...transformedGroup,
        people_groups: {
          values: this.getSelectizeValuesToSave(
            transformedGroup.people_groups ? transformedGroup.people_groups.values : [],
            peopleGroupsSelectizeRef,
          ),
        },
      };
    }
    if (parentGroupsSelectizeRef) {
      transformedGroup = {
        ...transformedGroup,
        parent_groups: {
          values: this.getSelectizeValuesToSave(
            transformedGroup.parent_groups ? transformedGroup.parent_groups.values : [],
            parentGroupsSelectizeRef,
          ),
        },
      };
    }
    if (peerGroupsSelectizeRef) {
      transformedGroup = {
        ...transformedGroup,
        peer_groups: {
          values: this.getSelectizeValuesToSave(
            transformedGroup.peer_groups ? transformedGroup.peer_groups.values : [],
            peerGroupsSelectizeRef,
          ),
        },
      };
    }
    if (childGroupsSelectizeRef) {
      transformedGroup = {
        ...transformedGroup,
        child_groups: {
          values: this.getSelectizeValuesToSave(
            transformedGroup.child_groups ? transformedGroup.child_groups.values : [],
            childGroupsSelectizeRef,
          ),
        },
      };
    }
    if (addMembersSelectizeRef) {
      transformedGroup = {
        ...transformedGroup,
        members: {
          values: this.getSelectizeValuesToSave(
            this.state.unmodifiedGroup.members ? this.state.unmodifiedGroup.members.values : [],
            null,
            transformedGroup.members ? transformedGroup.members.values : [],
          ),
        },
      };
    }
    return transformedGroup;
  };

  onSaveGroup = () => {
    this.setState(
      {
        nameRequired: false,
      },
      () => {
        Keyboard.dismiss();
        if (this.state.group.title) {
          const { unmodifiedGroup } = this.state;
          const group = this.transformGroupObject(this.state.group);
          let groupToSave = {
            ...sharedTools.diff(unmodifiedGroup, group),
            title: this.state.group.title,
          };
          if (this.state.group.ID) {
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

  showAssignedUser = () => {
    const foundUser = [...this.state.users, ...this.state.assignedToContacts].find(
      (user) => user.key === this.state.group.assigned_to.key,
    );
    return (
      <Text
        style={[
          { marginTop: 'auto', marginBottom: 'auto', fontSize: 15 },
          this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
        ]}>
        {foundUser.label}
      </Text>
    );
  };

  goToGroupDetailScreen = (groupData) => {
    const { navigation } = this.props;
    /* eslint-disable */
    const { params } = navigation.state;
    const { ID, title } = this.state.group;
    params.previousList.push({
      groupId: ID,
      onlyView: true,
      groupName: title,
    });
    navigation.push('GroupDetail', {
      ...params, // previousList, onGoBack()
      groupId: groupData.value,
      onlyView: true,
      groupName: groupData.name,
      backButtonTap: this.backButtonTap.bind(this),
      onBackFromSameScreen: this.onBackFromSameScreen.bind(this),
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

  detailView = () => (
    /*_viewable_*/
    <View style={{ flex: 1 }}>
      {this.state.onlyView ? (
        <View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={() => this.onRefresh(this.state.group.ID)}
              />
            }>
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
                        fontSize: 14,
                        fontWeight: 'bold',
                        marginTop: 'auto',
                        marginBottom: 'auto',
                      },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.props.groupSettings.fields.group_status.name}
                  </Label>
                </Col>
              </Row>
              <Row style={[styles.formRow, { paddingTop: 5 }]} pointerEvents="none">
                <Col
                  style={[
                    styles.statusFieldContainer,
                    Platform.select({
                      default: { borderColor: this.state.groupStatusBackgroundColor },
                      ios: {},
                    }),
                  ]}>
                  <Picker
                    selectedValue={this.state.group.group_status}
                    onValueChange={this.setGroupStatus}
                    style={[
                      Platform.select({
                        android: {
                          color: '#ffffff',
                          backgroundColor: this.state.groupStatusBackgroundColor,
                          width: '100%',
                        },
                        default: {
                          backgroundColor: this.state.groupStatusBackgroundColor,
                        },
                      }),
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}
                    textStyle={{
                      color: '#ffffff',
                    }}>
                    {Object.keys(this.props.groupSettings.fields.group_status.values).map((key) => {
                      const optionData = this.props.groupSettings.fields.group_status.values[key];
                      return <Picker.Item key={key} label={optionData.label} value={key} />;
                    })}
                  </Picker>
                </Col>
              </Row>
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="user-circle" style={styles.formIcon} />
                </Col>
                <Col>{this.state.group.assigned_to ? this.showAssignedUser() : null}</Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.groupSettings.fields.assigned_to.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <View style={styles.formIconLabelView}>
                    <Icon
                      type="FontAwesome"
                      name="black-tie"
                      style={[styles.formIcon, { marginTop: 0 }]}
                    />
                  </View>
                </Col>
                <Col>
                  <View
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.group.coaches ? (
                      this.state.group.coaches.values.map((contact, index) => (
                        <TouchableOpacity
                          key={index.toString()}
                          activeOpacity={0.5}
                          onPress={() => this.goToContactDetailScreen(contact.value)}>
                          <Text style={styles.linkingText}>{contact.name}</Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <Text></Text>
                    )}
                  </View>
                </Col>
                <Col style={{ width: 100 }}>
                  <Label style={[styles.formLabel, { textAlign: 'right' }]}>
                    {this.props.groupSettings.fields.coaches.name}
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
                    {this.state.group.location_grid
                      ? this.state.group.location_grid.values
                          .map(
                            (location) =>
                              this.state.geonames.find(
                                (geoname) => geoname.value === location.value,
                              ).name,
                          )
                          .filter(String)
                          .join(', ')
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.groupSettings.fields.location_grid.name}
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
                    {this.state.group.people_groups
                      ? this.state.group.people_groups.values
                          .map(
                            (peopleGroup) =>
                              this.state.peopleGroups.find(
                                (person) => person.value === peopleGroup.value,
                              ).name,
                          )
                          .filter(String)
                          .join(', ')
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.groupSettings.fields.people_groups.name}
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
                    {this.state.group.contact_address
                      ? this.state.group.contact_address.map((address) => address.value).join(', ')
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.groupSettings.channels.address.label}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Image source={dateIcon} style={styles.dateIcons} />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.group.start_date
                      ? moment(new Date(this.state.group.start_date * 1000))
                          .utc()
                          .format('LL')
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.groupSettings.fields.start_date.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Image source={dateSuccessIcon} style={styles.dateIcons} />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.group.church_start_date
                      ? moment(new Date(this.state.group.church_start_date * 1000))
                          .utc()
                          .format('LL')
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.groupSettings.fields.church_start_date.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Image source={dateEndIcon} style={styles.dateIcons} />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.group.end_date
                      ? moment(new Date(this.state.group.end_date * 1000))
                          .utc()
                          .format('LL')
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.groupSettings.fields.end_date.name}
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
            <Row style={[styles.formRow, { paddingTop: 15 }]}>
              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                <Image source={statusIcon} style={[styles.fieldsIcons, {}]} />
              </Col>
              <Col>
                <Label
                  style={{
                    color: Colors.tintColor,
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginTop: 0,
                  }}>
                  {this.props.groupSettings.fields.group_status.name}
                </Label>
              </Col>
            </Row>
            <Row style={{ paddingBottom: 30 }}>
              <Col
                style={[
                  styles.statusFieldContainer,
                  Platform.select({
                    default: { borderColor: this.state.groupStatusBackgroundColor },
                    ios: {},
                  }),
                ]}>
                <Picker
                  selectedValue={this.state.group.group_status}
                  onValueChange={this.setGroupStatus}
                  style={[
                    Platform.select({
                      android: {
                        color: '#ffffff',
                        backgroundColor: this.state.groupStatusBackgroundColor,
                        width: '100%',
                      },
                      default: {
                        backgroundColor: this.state.groupStatusBackgroundColor,
                      },
                    }),
                    this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                  ]}
                  textStyle={{
                    color: '#ffffff',
                  }}>
                  {Object.keys(this.props.groupSettings.fields.group_status.values).map((key) => {
                    const optionData = this.props.groupSettings.fields.group_status.values[key];
                    return <Picker.Item key={key} label={optionData.label} value={key} />;
                  })}
                </Picker>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="FontAwesome" name="users" style={styles.formIcon} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {i18n.t('groupDetailScreen.groupName.label')}
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
                    value={this.state.group.title}
                    onChangeText={this.setGroupTitle}
                    style={
                      this.state.nameRequired
                        ? [styles.groupTextField, { borderBottomWidth: 0 }]
                        : styles.groupTextField
                    }
                  />
                </Col>
                {this.state.nameRequired ? (
                  <Text style={styles.validationErrorMessage}>
                    {i18n.t('groupDetailScreen.groupName.error')}
                  </Text>
                ) : null}
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
                    {this.props.groupSettings.fields.assigned_to.name}
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
                <Col style={[styles.groupTextRoundField, { paddingRight: 10 }]}>
                  <Picker
                    selectedValue={
                      this.state.group.assigned_to ? this.state.group.assigned_to.key : null
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
            <Row style={styles.formFieldPadding}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="FontAwesome" name="black-tie" style={styles.formIcon} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {this.props.groupSettings.fields.coaches.name}
                </Label>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon
                    type="FontAwesome"
                    name="black-tie"
                    style={[styles.formIcon, { opacity: 0 }]}
                  />
                </View>
              </Col>
              <Col>
                <Selectize
                  ref={(selectize) => {
                    coachesSelectizeRef = selectize;
                  }}
                  itemId="value"
                  items={[...this.state.groupCoachContacts, ...this.state.usersContacts]}
                  selectedItems={this.getSelectizeItems(this.state.group.coaches, [
                    ...this.state.groupCoachContacts,
                    ...this.state.usersContacts,
                  ])}
                  textInputProps={{
                    placeholder: i18n.t('groupDetailScreen.selectCoaches'),
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
                        let foundCoachIndex = this.state.groupCoachContacts.findIndex(
                          (coach) => coach.value === id,
                        );
                        if (foundCoachIndex > -1) {
                          // Remove coach from list
                          const groupCoachContacts = [...this.state.groupCoachContacts];
                          groupCoachContacts.splice(foundCoachIndex, 1);
                          this.setState({
                            groupCoachContacts: [...groupCoachContacts],
                          });
                        }
                        onClose(props);
                      }}
                      text={item.name}
                      style={style}
                    />
                  )}
                  filterOnKey="name"
                  keyboardShouldPersistTaps
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
            <Row style={styles.formFieldPadding}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="FontAwesome" name="map-marker" style={styles.formIcon} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {this.props.groupSettings.fields.location_grid.name}
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
                    this.state.group.location_grid,
                    this.state.geonames,
                  )}
                  textInputProps={{
                    placeholder: i18n.t('groupDetailScreen.selectLocations'),
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
                  inputContainerStyle={styles.selectizeField}
                  textInputProps={{
                    onChangeText: this.searchLocationsDelayed,
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
                  {this.props.groupSettings.fields.people_groups.name}
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
                    this.state.group.people_groups,
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
                  keyboardShouldPersistTaps
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
            <Row style={styles.formFieldPadding}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="Entypo" name="home" style={styles.formIcon} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {this.props.groupSettings.channels.address.label}
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
            {this.state.group.contact_address ? (
              this.state.group.contact_address.map((address, index) =>
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
                        style={styles.groupTextField}
                      />
                    </Col>
                    <Col style={styles.formIconLabel}>
                      <Icon
                        android="md-remove"
                        ios="ios-remove"
                        style={[styles.addRemoveIcons, styles.removeIcons]}
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
                  <Image source={dateIcon} style={styles.dateIcons} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {this.props.groupSettings.fields.start_date.name}
                </Label>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Image source={dateIcon} style={[styles.dateIcons, { opacity: 0 }]} />
                </View>
              </Col>
              <Col>
                <DatePicker
                  onDateChange={this.setGroupStartDate}
                  defaultDate={
                    this.state.group.start_date ? new Date(this.state.group.start_date * 1000) : ''
                  }
                />
              </Col>
            </Row>
            <Row style={styles.formFieldPadding}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Image source={dateSuccessIcon} style={styles.dateIcons} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {this.props.groupSettings.fields.church_start_date.name}
                </Label>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Image source={dateSuccessIcon} style={[styles.dateIcons, { opacity: 0 }]} />
                </View>
              </Col>
              <Col>
                <DatePicker
                  onDateChange={this.setChurchStartDate}
                  defaultDate={
                    this.state.group.church_start_date
                      ? new Date(this.state.group.church_start_date * 1000)
                      : ''
                  }
                />
              </Col>
            </Row>
            <Row style={styles.formFieldPadding}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Image source={dateEndIcon} style={styles.dateIcons} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {this.props.groupSettings.fields.end_date.name}
                </Label>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Image source={dateEndIcon} style={[styles.dateIcons, { opacity: 0 }]} />
                </View>
              </Col>
              <Col>
                <DatePicker
                  onDateChange={this.setEndDate}
                  defaultDate={
                    this.state.group.end_date ? new Date(this.state.group.end_date * 1000) : ''
                  }
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
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={() => this.onRefresh(this.state.group.ID)}
              />
            }>
            <View style={[styles.formContainer, { marginTop: 10 }]}>
              <Row style={[styles.formRow, { paddingTop: 15 }]}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Image source={groupTypeIcon} style={styles.groupIcons} />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      this.props.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.group.group_type
                      ? this.props.groupSettings.fields.group_type.values[
                          this.state.group.group_type
                        ].label
                      : ''}
                  </Text>
                </Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.groupSettings.fields.group_type.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
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
            </View>
            {this.renderHealthMilestones()}
            {this.renderCustomHealthMilestones()}
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
            <Row style={styles.formFieldPadding}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Image source={groupTypeIcon} style={styles.groupIcons} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {this.props.groupSettings.fields.group_type.name}
                </Label>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon
                    android="md-people"
                    ios="ios-people"
                    style={[styles.formIcon, { opacity: 0 }]}
                  />
                </View>
              </Col>
              <Col style={[styles.groupTextRoundField, { paddingRight: 10 }]}>
                <Picker
                  mode="dropdown"
                  selectedValue={this.state.group.group_type}
                  onValueChange={this.setGroupType}>
                  {Object.keys(this.props.groupSettings.fields.group_type.values).map((key) => {
                    const optionData = this.props.groupSettings.fields.group_type.values[key];
                    return <Picker.Item key={key} label={optionData.label} value={key} />;
                  })}
                </Picker>
              </Col>
            </Row>
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
          </View>
          {this.renderHealthMilestones()}
          {this.renderCustomHealthMilestones()}
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

  commentsView = () => (
    /*_viewable_*/
    <View style={{ flex: 1, paddingBottom: this.state.footerHeight + this.state.footerLocation }}>
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
      <View style={{ backgroundColor: '#FFFFFF' }}>
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
            width: windowWidth - 80,
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
            {
              borderRadius: 80,
              height: 40,
              width: 40,
              paddingTop: 7,
              marginRight: 10,
              marginBottom: 10,
              position: 'absolute',
              right: 0,
              bottom: 0,
            },
            this.state.loadComments
              ? { backgroundColor: '#e6e6e6' }
              : { backgroundColor: Colors.tintColor },
            this.props.isRTL ? { paddingRight: 10 } : { paddingLeft: 10 },
          ]}>
          <Icon android="md-send" ios="ios-send" style={[{ color: 'white', fontSize: 25 }]} />
        </TouchableOpacity>
      </View>
    </View>
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
              onPress={() => this.goToContactDetailScreen(membersGroup.value)}
              key={membersGroup.value}
              style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Text
                style={[
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
              onPress={() => this.goToContactDetailScreen(membersGroup.value)}
              key={membersGroup.value}
              style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 15, padding: 5 }}>
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

  membersView = () => {
    /*_viewable_*/
    return this.state.onlyView ? (
      <View style={[styles.formContainer, { flex: 1, marginTop: 10, marginBottom: 10 }]}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={() => this.onRefresh(this.state.group.ID)}
            />
          }>
          {this.showMembersCount()}
          <FlatList
            data={(this.state.group.members ? this.state.group.members.values : []).filter(
              (member) => !member.delete,
            )}
            extraData={this.state.updateMembersList}
            renderItem={(item) => this.membersRow(item.item)}
            ItemSeparatorComponent={this.flatListItemSeparator}
          />
        </ScrollView>
      </View>
    ) : (
      <KeyboardAwareScrollView /*_editable_*/
        enableAutomaticScroll
        enableOnAndroid
        keyboardOpeningTime={0}
        extraScrollHeight={150}
        keyboardShouldPersistTaps="handled">
        <View style={[styles.formContainer, { flex: 1, marginTop: 10, marginBottom: 10 }]}>
          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={{ color: Colors.tintColor, fontSize: 15, textAlign: 'left' }}>
              {i18n.t('global.membersActivity')}
            </Text>
            <FlatList
              data={this.state.group.members ? this.state.group.members.values : []}
              extraData={this.state.updateMembersList}
              renderItem={(item) => this.membersRow(item.item)}
              ItemSeparatorComponent={this.flatListItemSeparator}
            />
            <Grid>
              <Row>
                <Col style={{ width: 40, marginTop: 5, marginLeft: 0 }}>
                  <Icon type="Entypo" name="add-user" style={{ color: '#CCCCCC' }} />
                </Col>
                <Col style={{ paddingBottom: 200 }}>
                  <Selectize
                    ref={(selectize) => {
                      addMembersSelectizeRef = selectize;
                    }}
                    itemId="value"
                    items={[...this.state.membersContacts, ...this.state.usersContacts].filter(
                      (userContact) =>
                        this.state.group.members &&
                        !this.state.group.members.values.find(
                          (member) => member.value === userContact.value,
                        ),
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
          </ScrollView>
        </View>
      </KeyboardAwareScrollView>
    );
  };

  groupsView = () => (
    /*_viewable_*/
    <View style={{ flex: 1 }}>
      {this.state.onlyView ? (
        <View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl
                refreshing={this.state.loading}
                onRefresh={() => this.onRefresh(this.state.group.ID)}
              />
            }>
            <Grid style={[styles.formContainer, styles.formContainerNoPadding]}>
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, styles.formIconLabelMarginLeft]}>
                  <View style={styles.formIconLabelView}>
                    <Image source={groupParentIcon} style={styles.groupIcons} />
                  </View>
                </Col>
                <Col style={styles.formIconLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.groupSettings.fields.parent_groups.name}
                  </Label>
                </Col>
                <Col />
              </Row>
              <Row style={[styles.groupCircleParentContainer, { overflowX: 'auto' }]}>
                <ScrollView horizontal>
                  {this.state.group.parent_groups ? (
                    this.state.group.parent_groups.values.map((parentGroup, index) => (
                      <Col
                        key={index.toString()}
                        style={styles.groupCircleContainer}
                        onPress={() => this.goToGroupDetailScreen(parentGroup)}>
                        {Object.prototype.hasOwnProperty.call(parentGroup, 'is_church') &&
                        parentGroup.is_church ? (
                          <Image source={groupCircleIcon} style={styles.groupCircle} />
                        ) : (
                          <Image source={groupDottedCircleIcon} style={styles.groupCircle} />
                        )}
                        <Image source={swimmingPoolIcon} style={styles.groupCenterIcon} />
                        <Row style={styles.groupCircleName}>
                          <Text style={styles.groupCircleNameText}>{parentGroup.name}</Text>
                        </Row>
                        <Row style={styles.groupCircleCounter}>
                          <Text>{parentGroup.baptized_member_count}</Text>
                        </Row>
                        <Row style={[styles.groupCircleCounter, { marginTop: '5%' }]}>
                          <Text>{parentGroup.member_count}</Text>
                        </Row>
                      </Col>
                    ))
                  ) : (
                    <Text />
                  )}
                </ScrollView>
              </Row>
              <View style={[styles.formDivider, styles.formDivider2Margin]} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, styles.formIconLabelMarginLeft]}>
                  <View style={styles.formIconLabelView}>
                    <Image source={groupPeerIcon} style={styles.groupIcons} />
                  </View>
                </Col>
                <Col style={styles.formIconLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.groupSettings.fields.peer_groups.name}
                  </Label>
                </Col>
                <Col />
              </Row>
              <Row style={[styles.groupCircleParentContainer, { overflowX: 'auto' }]}>
                <ScrollView horizontal>
                  {this.state.group.peer_groups ? (
                    this.state.group.peer_groups.values.map((peerGroup, index) => (
                      <Col
                        key={index.toString()}
                        style={styles.groupCircleContainer}
                        onPress={() => this.goToGroupDetailScreen(peerGroup)}>
                        {Object.prototype.hasOwnProperty.call(peerGroup, 'is_church') &&
                        peerGroup.is_church ? (
                          <Image source={groupCircleIcon} style={styles.groupCircle} />
                        ) : (
                          <Image source={groupDottedCircleIcon} style={styles.groupCircle} />
                        )}
                        <Image source={swimmingPoolIcon} style={styles.groupCenterIcon} />
                        <Row style={styles.groupCircleName}>
                          <Text style={styles.groupCircleNameText}>{peerGroup.name}</Text>
                        </Row>
                        <Row style={styles.groupCircleCounter}>
                          <Text>{peerGroup.baptized_member_count}</Text>
                        </Row>
                        <Row style={[styles.groupCircleCounter, { marginTop: '5%' }]}>
                          <Text>{peerGroup.member_count}</Text>
                        </Row>
                      </Col>
                    ))
                  ) : (
                    <Text />
                  )}
                </ScrollView>
              </Row>
              <View style={[styles.formDivider, styles.formDivider2Margin]} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, styles.formIconLabelMarginLeft]}>
                  <View style={styles.formIconLabelView}>
                    <Image source={groupChildIcon} style={styles.groupIcons} />
                  </View>
                </Col>
                <Col style={styles.formIconLabel}>
                  <Label style={styles.formLabel}>{i18n.t('groupDetailScreen.childGroup')}</Label>
                </Col>
                <Col />
              </Row>
              <Row style={[styles.groupCircleParentContainer, { overflowX: 'auto' }]}>
                <ScrollView horizontal>
                  {this.state.group.child_groups ? (
                    this.state.group.child_groups.values.map((childGroup, index) => (
                      <Col
                        key={index.toString()}
                        style={styles.groupCircleContainer}
                        onPress={() => this.goToGroupDetailScreen(childGroup)}>
                        {Object.prototype.hasOwnProperty.call(childGroup, 'is_church') &&
                        childGroup.is_church ? (
                          <Image source={groupCircleIcon} style={styles.groupCircle} />
                        ) : (
                          <Image source={groupDottedCircleIcon} style={styles.groupCircle} />
                        )}
                        <Image source={swimmingPoolIcon} style={styles.groupCenterIcon} />
                        <Row style={styles.groupCircleName}>
                          <Text style={styles.groupCircleNameText}>{childGroup.name}</Text>
                        </Row>
                        <Row style={styles.groupCircleCounter}>
                          <Text>{childGroup.baptized_member_count}</Text>
                        </Row>
                        <Row style={[styles.groupCircleCounter, { marginTop: '5%' }]}>
                          <Text>{childGroup.member_count}</Text>
                        </Row>
                      </Col>
                    ))
                  ) : (
                    <Text />
                  )}
                </ScrollView>
              </Row>
              <View style={[styles.formDivider, styles.formDivider2Margin]} />
            </Grid>
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
            <Row style={styles.formFieldPadding}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Image source={groupParentIcon} style={styles.groupIcons} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {this.props.groupSettings.fields.parent_groups.name}
                </Label>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="FontAwesome" name="users" style={[styles.formIcon, { opacity: 0 }]} />
                </View>
              </Col>
              <Col>
                <Selectize
                  ref={(selectize) => {
                    parentGroupsSelectizeRef = selectize;
                  }}
                  itemId="value"
                  items={[...this.state.groups, ...this.state.parentGroups]}
                  selectedItems={this.getSelectizeItems(this.state.group.parent_groups, [
                    ...this.state.groups,
                    ...this.state.parentGroups,
                  ])}
                  textInputProps={{
                    placeholder: i18n.t('groupDetailScreen.searchGroups'),
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
                        let foundParentGroupIndex = this.state.parentGroups.findIndex(
                          (parentGroup) => parentGroup.value === id,
                        );
                        if (foundParentGroupIndex > -1) {
                          // Remove parent group from list
                          const parentGroups = [...this.state.parentGroups];
                          parentGroups.splice(foundParentGroupIndex, 1);
                          this.setState({
                            parentGroups: [...parentGroups],
                          });
                        }
                        onClose(props);
                      }}
                      text={item.name}
                      style={style}
                    />
                  )}
                  filterOnKey="name"
                  keyboardShouldPersistTaps
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
            <Row style={styles.formFieldPadding}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Image source={groupPeerIcon} style={styles.groupIcons} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {this.props.groupSettings.fields.peer_groups.name}
                </Label>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="FontAwesome" name="users" style={[styles.formIcon, { opacity: 0 }]} />
                </View>
              </Col>
              <Col>
                <Selectize
                  ref={(selectize) => {
                    peerGroupsSelectizeRef = selectize;
                  }}
                  itemId="value"
                  items={[...this.state.groups, this.state.peerGroups]}
                  selectedItems={this.getSelectizeItems(this.state.group.peer_groups, [
                    ...this.state.groups,
                    this.state.peerGroups,
                  ])}
                  textInputProps={{
                    placeholder: i18n.t('groupDetailScreen.searchPeerGroups'),
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
                        let foundPeerGroupIndex = this.state.peerGroups.findIndex(
                          (peerGroup) => peerGroup.value === id,
                        );
                        if (foundPeerGroupIndex > -1) {
                          // Remove peer group from list
                          const peerGroups = [...this.state.peerGroups];
                          peerGroups.splice(foundPeerGroupIndex, 1);
                          this.setState({
                            peerGroups: [...peerGroups],
                          });
                        }
                        onClose(props);
                      }}
                      text={item.name}
                      style={style}
                    />
                  )}
                  filterOnKey="name"
                  keyboardShouldPersistTaps
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
            <Row style={styles.formFieldPadding}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Image source={groupChildIcon} style={styles.groupIcons} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>
                  {this.props.groupSettings.fields.child_groups.name}
                </Label>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="FontAwesome" name="users" style={[styles.formIcon, { opacity: 0 }]} />
                </View>
              </Col>
              <Col>
                <Selectize
                  ref={(selectize) => {
                    childGroupsSelectizeRef = selectize;
                  }}
                  itemId="value"
                  items={[...this.state.groups, ...this.state.childGroups]}
                  selectedItems={this.getSelectizeItems(this.state.group.child_groups, [
                    ...this.state.groups,
                    ...this.state.childGroups,
                  ])}
                  textInputProps={{
                    placeholder: i18n.t('groupDetailScreen.searchChildGroups'),
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
                        let foundChildGroupIndex = this.state.childGroups.findIndex(
                          (childGroup) => childGroup.value === id,
                        );
                        if (foundChildGroupIndex > -1) {
                          // Remove child group from list
                          const childGroups = [...this.state.childGroups];
                          childGroups.splice(foundChildGroupIndex, 1);
                          this.setState({
                            childGroups: [...childGroups],
                          });
                        }
                        onClose(props);
                      }}
                      text={item.name}
                      style={style}
                    />
                  )}
                  filterOnKey="name"
                  keyboardShouldPersistTaps
                  inputContainerStyle={styles.selectizeField}
                />
              </Col>
            </Row>
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );

  renderHealthMilestones() {
    return (
      <Grid pointerEvents={this.state.onlyView ? 'none' : 'auto'}>
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

  renderPickerItems = (items) =>
    items.map((item) => {
      return (
        <Picker.Item key={item.key} label={item.label + ' (#' + item.key + ')'} value={item.key} />
      );
    });

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
            {this.state.group.ID ? (
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
                        case 'members':
                          return this.membersView();
                        case 'groups':
                          return this.groupsView();
                        default:
                          return null;
                      }
                    }}
                    onIndexChange={this.tabChanged}
                    initialLayout={{ width: windowWidth }}
                  />
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
                                      {i18n.t('global.deleteComment')}
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
                                        {i18n.t('global.editComment')}
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
                                  {i18n.t('settingsScreen.close')}
                                </Text>
                              </Button>
                              {this.state.commentDialog.delete ? (
                                <Button
                                  block
                                  style={[styles.dialogButton, { backgroundColor: '#d9534f' }]}
                                  onPress={() => {
                                    this.onDeleteComment(this.state.commentDialog.data);
                                  }}>
                                  <Text style={{ color: '#FFFFFF' }}>
                                    {i18n.t('settingsScreen.remove')}
                                  </Text>
                                </Button>
                              ) : (
                                <Button
                                  block
                                  style={styles.dialogButton}
                                  onPress={() => {
                                    this.onUpdateComment(this.state.commentDialog.data);
                                  }}>
                                  <Text style={{ color: '#FFFFFF' }}>{i18n.t('global.save')}</Text>
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
              <ScrollView /*_addnew_ _editable_*/>
                {!this.props.isConnected && this.offlineBarRender()}
                <View style={styles.formContainer}>
                  <Grid>
                    <Row style={styles.formRow}>
                      <Col style={styles.formIconLabelCol}>
                        <View style={styles.formIconLabelView}>
                          <Icon type="FontAwesome" name="users" style={styles.formIcon} />
                        </View>
                      </Col>
                      <Col>
                        <Label style={[styles.formLabel, {}]}>
                          {i18n.t('groupDetailScreen.groupName.label')}
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
                        onChangeText={this.setGroupTitle}
                        style={
                          this.state.nameRequired
                            ? [styles.groupTextField, { borderBottomWidth: 0 }]
                            : styles.groupTextField
                        }
                      />
                    </Row>
                    {this.state.nameRequired ? (
                      <Text style={styles.validationErrorMessage}>
                        {i18n.t('groupDetailScreen.groupName.error')}
                      </Text>
                    ) : null}
                    <Row style={styles.formRow}>
                      <Col style={styles.formIconLabelCol}>
                        <View style={styles.formIconLabelView}>
                          <Image source={groupTypeIcon} style={styles.groupIcons} />
                        </View>
                      </Col>
                      <Col>
                        <Label style={[styles.formLabel, {}]}>
                          {this.props.groupSettings.fields.group_type.name}
                        </Label>
                      </Col>
                    </Row>
                    <Row style={[styles.groupTextRoundField, { paddingRight: 10 }]}>
                      <Picker
                        mode="dropdown"
                        selectedValue={this.state.group.group_type}
                        onValueChange={this.setGroupType}>
                        {Object.keys(this.props.groupSettings.fields.group_type.values).map(
                          (key) => {
                            const optionData = this.props.groupSettings.fields.group_type.values[
                              key
                            ];
                            return <Picker.Item key={key} label={optionData.label} value={key} />;
                          },
                        )}
                      </Picker>
                    </Row>
                  </Grid>
                </View>
              </ScrollView>
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
    title: PropTypes.string,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetailScreen);
