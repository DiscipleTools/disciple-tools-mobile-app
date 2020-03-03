import React from 'react';
import { connect } from 'react-redux';
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
  TextInput,
  RefreshControl,
  Platform,
  TouchableHighlight,
  SafeAreaView,
} from 'react-native';
import PropTypes from 'prop-types';
import ExpoFileSystemStorage from 'redux-persist-expo-filesystem';
import { Label, Input, Icon, Picker, DatePicker } from 'native-base';
import Toast from 'react-native-easy-toast';
import { Col, Row, Grid } from 'react-native-easy-grid';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import { Chip, Selectize } from 'react-native-material-selectize';
import { TabView, TabBar } from 'react-native-tab-view';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { NavigationActions, StackActions } from 'react-navigation';
import sharedTools from '../../shared';
import {
  saveGroup,
  getById,
  getCommentsByGroup,
  saveComment,
  getActivitiesByGroup,
  getByIdEnd,
  searchLocations,
} from '../../store/actions/groups.actions';
import Colors from '../../constants/Colors';
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
import i18n from '../../languages';

let toastSuccess;
let toastError;
const containerPadding = 35;
const windowWidth = Dimensions.get('window').width;
const spacing = windowWidth * 0.025;
const sideSize = windowWidth - 2 * spacing;
const circleSideSize = windowWidth / 3 + 20;
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
  addRemoveIcons: {
    fontSize: 30,
    marginRight: 0,
  },
  // Comments Section
  root: {
    backgroundColor: '#ffffff',
    flex: 1,
    marginBottom: 60,
  },
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
    paddingTop: 20,
    paddingBottom: 20,
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
    textAlignVertical: 'top',
    textAlign: 'center',
    height: 300,
  },
  noCommentsImage: {
    opacity: 0.5,
    height: 70,
    width: 70,
    padding: 10,
  },
  noCommentsText: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#A8A8A8',
    padding: 5,
  },
  noCommentsTextOffilne: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#A8A8A8',
    backgroundColor: '#fff2ac',
    padding: 5,
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
  comments: [],
  loadComments: false,
  loadMoreComments: false,
  totalComments: 0,
  commentsOffset: 0,
  commentsLimit: 10,
  activities: [],
  loadActivities: false,
  loadMoreActivities: false,
  totalActivities: 0,
  activitiesOffset: 0,
  activitiesLimit: 10,
  showAssignedToModal: false,
  groupStatusBackgroundColor: '#ffffff',
  loading: false,
  groupsTabActive: false,
  currentTabIndex: 0,
  isMemberEdit: false,
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
        key: 'members',
        title: i18n.t('global.membersActivity'),
      },
      {
        key: 'groups',
        title: i18n.t('global.groups'),
      },
    ],
  },
  updateMembersList: false,
  foundGeonames: [],
};

const safeFind = (found, prop) => {
  if (typeof found === 'undefined') return '';
  return found[prop];
};

class GroupDetailScreen extends React.Component {
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
            i18n.isRTL ? { paddingLeft: 16 } : { paddingRight: 16 },
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
                i18n.isRTL ? { paddingLeft: 16 } : { paddingRight: 16 },
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
              if (params.previousList.length > 0) {
                const newPreviousList = params.previousList;
                const previousParams = newPreviousList[newPreviousList.length - 1];
                newPreviousList.pop();
                navigation.state.params.onBackFromSameScreen({
                  ...previousParams,
                  previousList: newPreviousList,
                });
              } else if (params.fromNotificationView) {
                const resetAction = StackActions.reset({
                  index: 0,
                  actions: [NavigationActions.navigate({ routeName: 'GroupList' })],
                });
                navigation.dispatch(resetAction);
                navigation.navigate('NotificationList');
              } else {
                if (typeof params.onGoBack === 'function') {
                  params.onGoBack();
                }
                navigation.goBack();
              }
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
                i18n.isRTL ? { paddingRight: 16 } : { paddingLeft: 16 },
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
        marginLeft: params.onlyView
          ? undefined
          : Platform.select({
              android: 21,
              ios: 25,
            }),
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
    });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      group,
      loading,
      comments,
      totalComments,
      loadingComments,
      activities,
      totalActivities,
      loadingActivities,
      newComment,
      foundGeonames,
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
      group: prevState.group,
      unmodifiedGroup: prevState.unmodifiedGroup,
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
    if (group) {
      // Update group data only in these conditions:
      // Same group created (offline/online)
      // Same group updated (offline/online)
      // Same offline group created in DB (AutoID to DBID)
      if (
        (typeof group.ID !== 'undefined' && typeof prevState.group.ID === 'undefined') ||
        group.ID.toString() === prevState.group.ID.toString() ||
        (group.oldID && group.oldID.toString() === prevState.group.ID.toString())
      ) {
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
          newState = {
            ...newState,
            updateMembersList: !newState.updateMembersList,
          };
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
          loadMoreComments: false,
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
          loadMoreActivities: false,
        };
      }
      newState = {
        // UPDATE OFFSET
        ...newState,
        activitiesOffset: prevState.activitiesOffset + prevState.activitiesLimit,
      };
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
        this.onRefreshCommentsActivities(group.ID);
        if (!this.state.isMemberEdit) {
          toastSuccess.show(
            <View>
              <Text style={{ color: Colors.sucessText }}>{i18n.t('global.success.save')}</Text>
            </View>,
            3000,
          );
          this.onDisableEdit();
        }
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
  }

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
          group_status: 'active',
        },
      };
      navigation.setParams({ groupName });
    } else {
      this.props.navigation.setParams({ hideTabBar: true });
      newState = {
        group: {
          title: null,
          group_type: 'group',
          group_status: 'active',
        },
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
        this.getLists(groupId || null);
      },
    );
  }

  onBackFromSameScreen(previousData) {
    const { navigation } = this.props;
    navigation.setParams(previousData);
    this.setState(initialState, () => {
      this.onLoad();
    });
  }

  onRefresh(groupId) {
    this.getGroupById(groupId);
    this.onRefreshCommentsActivities(groupId);
  }

  onRefreshCommentsActivities(groupId) {
    this.setState(
      {
        comments: [],
        activities: [],
        commentsOffset: 0,
        activitiesOffset: 0,
      },
      () => {
        this.getGroupComments(groupId);
        if (this.props.isConnected) {
          this.getGroupActivities(groupId);
        }
      },
    );
  }

  setCurrentTabIndex(index) {
    // Timeout to resolve the "tab content no rendered" issue
    setTimeout(() => {
      this.setState({ currentTabIndex: index, groupsTabActive: false });
    }, 0);
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

    newState = {
      ...newState,
      geonames: [...this.props.geonames],
    };

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

  getGroupComments(groupId) {
    this.props.getComments(
      this.props.userData.domain,
      this.props.userData.token,
      groupId,
      this.state.commentsOffset,
      this.state.commentsLimit,
    );
  }

  getGroupActivities(groupId) {
    this.props.getActivities(
      this.props.userData.domain,
      this.props.userData.token,
      groupId,
      this.state.activitiesOffset,
      this.state.activitiesLimit,
    );
  }

  onEnableEdit = () => {
    this.setState((state) => {
      let indexFix;
      if (state.tabViewConfig.index === 4) {
        indexFix = 3;
      } else if (state.tabViewConfig.index >= 2) {
        indexFix = 2;
      } else {
        indexFix = state.tabViewConfig.index;
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
    const { unmodifiedGroup } = this.state;
    this.setState((state) => {
      const indexFix =
        state.tabViewConfig.index >= 2 ? state.tabViewConfig.index + 1 : state.tabViewConfig.index;
      return {
        onlyView: true,
        group: {
          ...unmodifiedGroup,
        },
        groupStatusBackgroundColor: sharedTools.getSelectorColor(unmodifiedGroup.group_status),
        tabViewConfig: {
          ...state.tabViewConfig,
          index: indexFix,
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
              key: 'members',
              title: i18n.t('global.membersActivity'),
            },
            {
              key: 'groups',
              title: '',
            },
          ],
        },
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
    // (event, value) => {
    this.setState((prevState) => ({
      group: {
        ...prevState.group,
        start_date: sharedTools.formatDateToBackEnd(value),
      },
    }));
  };

  setEndDate = (value) => {
    // (event, value) => {
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
    const list = comments.concat(activities);
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

  goToContactDetailScreen = (contactData = null) => {
    if (contactData) {
      this.props.navigation.navigate('ContactDetail', {
        contactId: contactData.value,
        onlyView: true,
        contactName: contactData.name,
        fromGroupDetail: true,
      });
    }
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
          {Object.prototype.hasOwnProperty.call(commentOrActivity, 'content') && (
            <Grid>
              <Row>
                <Col>
                  <Text style={[styles.name, i18n.isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
                    {commentOrActivity.author}
                  </Text>
                </Col>
                <Col style={{ width: 110 }}>
                  <Text style={[styles.time, i18n.isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
                    {this.onFormatDateToView(commentOrActivity.date)}
                  </Text>
                </Col>
              </Row>
            </Grid>
          )}
          {Object.prototype.hasOwnProperty.call(commentOrActivity, 'object_note') && (
            <Grid>
              <Row>
                <Col>
                  <Text style={[styles.name, i18n.isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
                    {commentOrActivity.name}
                  </Text>
                </Col>
                <Col style={{ width: 110 }}>
                  <Text style={[styles.time, i18n.isRTL ? { textAlign: 'left', flex: 1 } : {}]}>
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
              ? [styles.commentMessage, i18n.isRTL ? { textAlign: 'left', flex: 1 } : {}]
              : [styles.activityMessage, i18n.isRTL ? { textAlign: 'left', flex: 1 } : {}]
          }>
          {Object.prototype.hasOwnProperty.call(commentOrActivity, 'content')
            ? commentOrActivity.content
            : commentOrActivity.object_note}
        </Text>
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
        assigned_to: `user-${value}`,
      },
      showAssignedToModal: false,
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

  transformGroupObject = (group, membersAction = {}) => {
    let transformedGroup = {
      ...group,
    };
    if (Object.prototype.hasOwnProperty.call(membersAction, 'members')) {
      this.setState({ isMemberEdit: true });
      transformedGroup = {
        ...transformedGroup,
        leaders: {
          values: [
            ...transformedGroup.leaders.values,
            {
              value: membersAction.members.value,
            },
          ],
        },
      };
    } else if (Object.prototype.hasOwnProperty.call(membersAction, 'leaders')) {
      this.setState({ isMemberEdit: true });
      transformedGroup = {
        ...transformedGroup,
        leaders: {
          values: [
            ...transformedGroup.leaders.values,
            {
              value: membersAction.leaders.value,
              delete: true,
            },
          ],
        },
      };
    } else if (Object.prototype.hasOwnProperty.call(membersAction, 'remove')) {
      this.setState({ isMemberEdit: true });
      transformedGroup = {
        ...transformedGroup,
        members: {
          values: [
            ...transformedGroup.members.values,
            {
              value: membersAction.remove.value,
              delete: true,
            },
          ],
        },
      };
      if (this.state.group.leaders.values) {
        if (
          this.state.group.leaders.values.find(
            (leader) => leader.value === membersAction.remove.value,
          )
        ) {
          transformedGroup = {
            ...transformedGroup,
            leaders: {
              values: [
                ...transformedGroup.leaders.values,
                {
                  value: membersAction.remove.value,
                  delete: true,
                },
              ],
            },
          };
        }
      }
    } else if (Object.prototype.hasOwnProperty.call(membersAction, 'addNewMember')) {
      this.setState({ isMemberEdit: true });
      transformedGroup = {
        ...transformedGroup,
        members: {
          values: [
            ...transformedGroup.members.values,
            {
              value: membersAction.addNewMember.value,
            },
          ],
        },
      };
    } else {
      this.setState({ isMemberEdit: false });
    }
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

    return transformedGroup;
  };

  onSaveGroup = (membersAction = {}) => {
    Keyboard.dismiss();
    const { unmodifiedGroup } = this.state;
    const group = this.transformGroupObject(this.state.group, membersAction);

    let groupToSave = {
      ...sharedTools.diff(unmodifiedGroup, group),
    };

    if (this.state.group.title) {
      groupToSave = {
        ...groupToSave,
        title: this.state.group.title,
      };
    } else {
      groupToSave = {
        ...groupToSave,
        title: '',
      };
    }
    if (this.state.group.ID) {
      groupToSave = {
        ...groupToSave,
        ID: this.state.group.ID,
      };
    }
    this.props.saveGroup(this.props.userData.domain, this.props.userData.token, groupToSave);
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

  tabChanged = (event) => {
    this.props.navigation.setParams({ hideTabBar: event.i === 2 });
    this.setState({
      groupsTabActive: event.i === 3,
      currentTabIndex: event.i,
    });
  };

  showAssignedUser = () => {
    const foundUser = this.state.group.assigned_to
      ? this.state.users.find((user) => `user-${user.key}` === this.state.group.assigned_to)
      : null;
    return (
      <Text
        style={[
          { marginTop: 'auto', marginBottom: 'auto', fontSize: 15 },
          i18n.isRTL ? { textAlign: 'left', flex: 1 } : {},
        ]}>
        {foundUser ? foundUser.label : ''}
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
      groupId: groupData.value,
      onlyView: true,
      groupName: groupData.name,
      previousList: params.previousList,
      onBackFromSameScreen: this.onBackFromSameScreen.bind(this),
    });
    /* eslint-enable */
  };

  tabChanged = (index) => {
    this.props.navigation.setParams({ hideTabBar: index === 2 });
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
    <View style={styles.noCommentsContainer}>
      <Row style={{ justifyContent: 'center' }}>
        <Image style={styles.noCommentsImage} source={dtIcon} />
      </Row>
      <Text style={styles.noCommentsText}>
        {i18n.t('groupDetailScreen.noGroupCommentPlacheHolder')}
      </Text>
      <Text style={styles.noCommentsText}>
        {i18n.t('groupDetailScreen.noGroupCommentPlacheHolder1')}
      </Text>
      {!this.props.isConnected && (
        <Text style={styles.noCommentsTextOffilne}>
          {i18n.t('groupDetailScreen.noGroupCommentPlacheHolderOffline')}
        </Text>
      )}
    </View>
  );

  detailView = () => (
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
            <View
              style={[styles.formContainer, { marginTop: 10, paddingTop: 0 }]}
              pointerEvents="none">
              <Label
                style={[
                  {
                    color: Colors.tintColor,
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginTop: 10,
                  },
                  i18n.isRTL ? { textAlign: 'left', flex: 1 } : {},
                ]}>
                {this.props.groupSettings.fields.group_status.name}
              </Label>
              <Row style={[styles.formRow, { paddingTop: 5 }]}>
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
                      i18n.isRTL ? { textAlign: 'left', flex: 1 } : {},
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
                <Col>{this.showAssignedUser()}</Col>
                <Col style={styles.formParentLabel}>
                  <Label style={styles.formLabel}>
                    {this.props.groupSettings.fields.assigned_to.name}
                  </Label>
                </Col>
              </Row>
              <View style={styles.formDivider} />
              <Row style={styles.formRow}>
                <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                  <Icon type="FontAwesome" name="black-tie" style={styles.formIcon} />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      i18n.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.group.coaches
                      ? this.state.group.coaches.values
                          .map(
                            function(coach) {
                              return safeFind(
                                this.state.usersContacts.find((user) => user.value === coach.value),
                                'name',
                              );
                            }.bind(this),
                          )
                          .filter(String)
                          .join()
                      : ''}
                  </Text>
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
                      i18n.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.group.location_grid
                      ? this.state.group.location_grid.values
                          .map(
                            (location) =>
                              this.state.geonames.find(
                                (geoname) => geoname.value === location.value,
                              ).name,
                          )
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
                      i18n.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.group.people_groups
                      ? this.state.group.people_groups.values
                          .map(
                            (peopleGroup) =>
                              this.state.peopleGroups.find(
                                (person) => person.value === peopleGroup.value,
                              ).name,
                          )
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
                      i18n.isRTL ? { textAlign: 'left', flex: 1 } : {},
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
                  <Icon
                    type="MaterialCommunityIcons"
                    name="calendar-import"
                    style={styles.formIcon}
                  />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      i18n.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.group.start_date ? this.state.group.start_date : ''}
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
                  <Icon
                    type="MaterialCommunityIcons"
                    name="calendar-import"
                    style={styles.formIcon}
                  />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      i18n.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.group.church_start_date ? this.state.group.church_start_date : ''}
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
                  <Icon
                    type="MaterialCommunityIcons"
                    name="calendar-export"
                    style={styles.formIcon}
                  />
                </Col>
                <Col>
                  <Text
                    style={[
                      { marginTop: 'auto', marginBottom: 'auto' },
                      i18n.isRTL ? { textAlign: 'left', flex: 1 } : {},
                    ]}>
                    {this.state.group.end_date ? this.state.group.end_date : ''}
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
        <KeyboardAwareScrollView
          enableAutomaticScroll
          enableOnAndroid
          keyboardOpeningTime={0}
          extraScrollHeight={150}
          keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <Label
              style={{
                color: Colors.tintColor,
                fontSize: 12,
                fontWeight: 'bold',
                marginTop: 10,
              }}>
              {this.props.groupSettings.fields.group_status.name}
            </Label>
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
                    i18n.isRTL ? { textAlign: 'left', flex: 1 } : {},
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
                  <Icon type="FontAwesome" name="user" style={styles.formIcon} />
                </View>
              </Col>
              <Col>
                <Label style={styles.formLabel}>{i18n.t('groupDetailScreen.groupName')}</Label>
              </Col>
            </Row>
            <Row>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon type="FontAwesome" name="user" style={[styles.formIcon, { opacity: 0 }]} />
                </View>
              </Col>
              <Col>
                <Input
                  value={this.state.group.title}
                  onChangeText={this.setGroupTitle}
                  style={styles.groupTextField}
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
                      this.state.group.assigned_to
                        ? parseInt(this.state.group.assigned_to.replace('user-', ''))
                        : ''
                    }
                    onValueChange={this.onSelectAssignedTo}>
                    {this.renderPickerItems(this.state.users)}
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
                  items={this.state.usersContacts}
                  selectedItems={this.getSelectizeItems(
                    this.state.group.coaches,
                    this.state.usersContacts,
                  )}
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
                  style={[styles.formIcon, { fontSize: 30, marginRight: 0 }]}
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
                        style={[styles.formIcon, styles.addRemoveIcons, { marginRight: 10 }]}
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
                  <Icon
                    type="MaterialCommunityIcons"
                    name="calendar-import"
                    style={styles.formIcon}
                  />
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
                  <Icon
                    type="MaterialCommunityIcons"
                    name="calendar-import"
                    style={[styles.formIcon, { opacity: 0 }]}
                  />
                </View>
              </Col>
              <Col>
                <DatePicker
                  onDateChange={this.setGroupStartDate}
                  defaultDate={
                    this.state.group.start_date ? new Date(this.state.group.start_date) : ''
                  }
                />
              </Col>
            </Row>
            <Row style={styles.formFieldPadding}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="calendar-import"
                    style={styles.formIcon}
                  />
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
                  <Icon
                    type="MaterialCommunityIcons"
                    name="calendar-export"
                    style={[styles.formIcon, { opacity: 0 }]}
                  />
                </View>
              </Col>
              <Col>
                <DatePicker
                  onDateChange={this.setChurchStartDate}
                  defaultDate={
                    this.state.group.church_start_date
                      ? new Date(this.state.group.church_start_date)
                      : ''
                  }
                />
              </Col>
            </Row>
            <Row style={styles.formFieldPadding}>
              <Col style={styles.formIconLabelCol}>
                <View style={styles.formIconLabelView}>
                  <Icon
                    type="MaterialCommunityIcons"
                    name="calendar-export"
                    style={styles.formIcon}
                  />
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
                  <Icon
                    type="MaterialCommunityIcons"
                    name="calendar-export"
                    style={[styles.formIcon, { opacity: 0 }]}
                  />
                </View>
              </Col>
              <Col>
                <DatePicker
                  onDateChange={this.setEndDate}
                  defaultDate={this.state.group.end_date ? new Date(this.state.group.end_date) : ''}
                />
              </Col>
            </Row>
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );

  progressView = () => (
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
                      i18n.isRTL ? { textAlign: 'left', flex: 1 } : {},
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
              <Label
                style={[styles.formLabel, { fontWeight: 'bold', marginBottom: 10, marginTop: 20 }]}>
                {this.props.groupSettings.fields.health_metrics.name}
              </Label>
            </View>
            {this.renderHealthMilestones()}
            {this.renderCustomHealthMilestones()}
          </ScrollView>
        </View>
      ) : (
        <KeyboardAwareScrollView
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
            <Label
              style={[styles.formLabel, { fontWeight: 'bold', marginBottom: 10, marginTop: 20 }]}>
              {this.props.groupSettings.fields.health_metrics.name}
            </Label>
          </View>
          {this.renderHealthMilestones()}
          {this.renderCustomHealthMilestones()}
        </KeyboardAwareScrollView>
      )}
    </View>
  );

  commentsView = () => (
    <View style={{ flex: 1 }}>
      {this.state.comments.length <= 0 &&
        this.state.activities.length <= 0 &&
        this.noCommentsRender()}
      <FlatList
        style={styles.root}
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
            onRefresh={() => this.onRefreshCommentsActivities(this.state.group.ID)}
          />
        }
        onScroll={({ nativeEvent }) => {
          const {
            loadMoreComments,
            commentsOffset,
            loadMoreActivities,
            activitiesOffset,
          } = this.state;
          const fL = nativeEvent;
          const contentOffsetY = fL.contentOffset.y;
          const layoutMeasurementHeight = fL.layoutMeasurement.height;
          const contentSizeHeight = fL.contentSize.height;
          const heightOffsetSum = layoutMeasurementHeight + contentOffsetY;
          const distanceToStart = contentSizeHeight - heightOffsetSum;

          if (distanceToStart < 100) {
            if (!loadMoreComments) {
              if (commentsOffset < this.state.totalComments) {
                this.setState(
                  {
                    loadMoreComments: true,
                  },
                  () => {
                    this.getGroupComments(this.state.group.ID);
                  },
                );
              }
            }
            if (!loadMoreActivities) {
              if (activitiesOffset < this.state.totalActivities) {
                this.setState(
                  {
                    loadMoreActivities: true,
                  },
                  () => {
                    this.getGroupActivities(this.state.group.ID);
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
            <View
              style={{
                backgroundColor: 'white',
                flexDirection: 'row',
                height: this.state.heightContainer,
              }}>
              <TextInput
                placeholder={i18n.t('global.writeYourCommentNoteHere')}
                value={this.state.comment}
                onChangeText={this.setComment}
                onContentSizeChange={this.setHeight}
                editable={!this.state.loadComments}
                multiline
                style={[
                  {
                    borderColor: '#B4B4B4',
                    borderRadius: 5,
                    borderWidth: 1,
                    flex: 1,
                    margin: 10,
                    paddingLeft: 5,
                    paddingRight: 5,
                    height: this.state.height,
                  },
                  i18n.isRTL ? { textAlign: 'right', flex: 1 } : {},
                  this.state.loadComments
                    ? { backgroundColor: '#e6e6e6' }
                    : { backgroundColor: 'white' },
                ]}
              />
              <TouchableOpacity
                onPress={() => this.onSaveComment()}
                style={[
                  {
                    borderRadius: 80,
                    height: 40,
                    margin: 10,
                    paddingTop: 7,
                    width: 40,
                  },
                  this.state.loadComments
                    ? { backgroundColor: '#e6e6e6' }
                    : { backgroundColor: Colors.tintColor },
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
              onPress={() => this.goToContactDetailScreen(membersGroup)}
              key={membersGroup.value}
              style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Text
                style={[
                  { marginTop: 'auto', marginBottom: 'auto', padding: 5 },
                  i18n.isRTL ? { textAlign: 'left', flex: 1, marginRight: 15 } : { marginLeft: 15 },
                ]}>
                {membersGroup.name}
              </Text>
            </TouchableOpacity>
          </Col>
        </Grid>
      ) : (
        <Grid style={{ marginTop: 10, marginBottom: 10 }}>
          <Col style={{ width: 20 }}>
            <TouchableOpacity onPress={() => this.addLeader(membersGroup)} key={membersGroup.value}>
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
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity
              onPress={() => this.goToContactDetailScreen(membersGroup)}
              key={membersGroup.value}
              style={{ marginTop: 'auto', marginBottom: 'auto' }}>
              <Text style={{ marginTop: 'auto', marginBottom: 'auto', marginLeft: 15, padding: 5 }}>
                {membersGroup.name}
              </Text>
            </TouchableOpacity>
          </Col>
          <Col style={{ width: 20 }}>
            <TouchableOpacity
              onPress={() => this.onSaveGroup({ remove: { value: membersGroup.value } })}
              key={membersGroup.value}>
              <Icon type="MaterialCommunityIcons" name="close" style={styles.membersCloseIcon} />
            </TouchableOpacity>
          </Col>
        </Grid>
      )}
    </View>
  );

  membersView = () =>
    this.state.onlyView ? (
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
            data={this.state.group.members ? this.state.group.members.values : []}
            extraData={this.state.updateMembersList}
            renderItem={(item) => this.membersRow(item.item)}
            ItemSeparatorComponent={this.flatListItemSeparator}
          />
        </ScrollView>
      </View>
    ) : (
      <KeyboardAwareScrollView
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
                    items={this.state.usersContacts}
                    selectedItems={[]}
                    textInputProps={{
                      placeholder: i18n.t('groupDetailScreen.addMember'),
                      leftIcon: { type: 'Entypo', name: 'add-user' },
                    }}
                    renderRow={(id, onPress, item) => (
                      <TouchableOpacity
                        activeOpacity={0.6}
                        key={id}
                        onPress={() => this.onSaveGroup({ addNewMember: { value: id } })}
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

  groupsView = () => (
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
                        {index % 2 === 0 ? (
                          <Image source={groupCircleIcon} style={styles.groupCircle} />
                        ) : (
                          <Image source={groupDottedCircleIcon} style={styles.groupCircle} />
                        )}
                        <Image source={swimmingPoolIcon} style={styles.groupCenterIcon} />
                        <Row style={styles.groupCircleName}>
                          <Text style={styles.groupCircleNameText}>{parentGroup.post_title}</Text>
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
                        {index % 2 === 0 ? (
                          <Image source={groupCircleIcon} style={styles.groupCircle} />
                        ) : (
                          <Image source={groupDottedCircleIcon} style={styles.groupCircle} />
                        )}
                        <Image source={swimmingPoolIcon} style={styles.groupCenterIcon} />
                        <Row style={styles.groupCircleName}>
                          <Text style={styles.groupCircleNameText}>{peerGroup.post_title}</Text>
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
                        {index % 2 === 0 ? (
                          <Image source={groupCircleIcon} style={styles.groupCircle} />
                        ) : (
                          <Image source={groupDottedCircleIcon} style={styles.groupCircle} />
                        )}
                        <Image source={swimmingPoolIcon} style={styles.groupCenterIcon} />
                        <Row style={styles.groupCircleName}>
                          <Text style={styles.groupCircleNameText}>{childGroup.post_title}</Text>
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
        <KeyboardAwareScrollView
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
                  items={this.state.groups}
                  selectedItems={this.getSelectizeItems(
                    this.state.group.parent_groups,
                    this.state.groups,
                  )}
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
                  items={this.state.groups}
                  selectedItems={this.getSelectizeItems(
                    this.state.group.peer_groups,
                    this.state.groups,
                  )}
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
                  items={this.state.groups}
                  selectedItems={this.getSelectizeItems(
                    this.state.group.child_groups,
                    this.state.groups,
                  )}
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
          </View>
        </KeyboardAwareScrollView>
      )}
    </View>
  );

  addLeader(member) {
    if (this.state.group.leaders) {
      if (this.state.group.leaders.values.find((leader) => leader.value === member.value)) {
        this.onSaveGroup({ leaders: { value: member.value } });
      } else {
        this.onSaveGroup({ members: { value: member.value } });
      }
    } else {
      this.onSaveGroup({ members: { value: member.value } });
    }
  }

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
      return <Picker.Item key={item.key} label={item.label} value={item.key} />;
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
    if (queryText.length > 0) {
      this.searchLocations(queryText);
    } else if (this.state.foundGeonames.length > 0) {
      this.setState({
        foundGeonames: [],
      });
    }
  }, 500);

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
                </View>
              </View>
            ) : (
              <ScrollView>
                <View style={styles.formContainer}>
                  <Grid>
                    <Row>
                      <Label style={[styles.formLabel, { marginTop: 10, marginBottom: 5 }]}>
                        {i18n.t('groupDetailScreen.groupName')}
                      </Label>
                    </Row>
                    <Row>
                      <Input
                        placeholder={i18n.t('global.requiredField')}
                        onChangeText={this.setGroupTitle}
                        style={styles.groupTextField}
                      />
                    </Row>
                    <Row>
                      <Label style={[styles.formLabel, { marginTop: 10, marginBottom: 5 }]}>
                        {this.props.groupSettings.fields.group_type.name}
                      </Label>
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
  newComment: PropTypes.shape({
    ID: PropTypes.string,
    author: PropTypes.string,
    content: PropTypes.string,
    date: PropTypes.string,
    gravatar: PropTypes.string,
  }),
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
  geonames: state.groupsReducer.geonames,
  foundGeonames: state.groupsReducer.foundGeonames,
});

const mapDispatchToProps = (dispatch) => ({
  saveGroup: (domain, token, groupData) => {
    dispatch(saveGroup(domain, token, groupData));
  },
  getById: (domain, token, groupId) => {
    dispatch(getById(domain, token, groupId));
  },
  getComments: (domain, token, groupId, offset, limit) => {
    dispatch(getCommentsByGroup(domain, token, groupId, offset, limit));
  },
  saveComment: (domain, token, groupId, commentData) => {
    dispatch(saveComment(domain, token, groupId, commentData));
  },
  getActivities: (domain, token, groupId, offset, limit) => {
    dispatch(getActivitiesByGroup(domain, token, groupId, offset, limit));
  },
  getByIdEnd: () => {
    dispatch(getByIdEnd());
  },
  searchLocations: (domain, token, queryText) => {
    dispatch(searchLocations(domain, token, queryText));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupDetailScreen);
