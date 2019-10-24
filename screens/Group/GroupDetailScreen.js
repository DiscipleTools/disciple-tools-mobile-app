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
  AsyncStorage,
  RefreshControl,
  Platform,
} from 'react-native';
import PropTypes from 'prop-types';

import {
  Container,
  Content,
  Footer,
  FooterTab,
  Label,
  Input,
  Icon,
  Picker,
  Tabs,
  Tab,
  ScrollableTab,
  DatePicker,
  Button,
} from 'native-base';
import Toast from 'react-native-easy-toast';
import { Col, Row, Grid } from 'react-native-easy-grid';
import KeyboardAccessory from 'react-native-sticky-keyboard-accessory';
import ModalFilterPicker from 'react-native-modal-filter-picker';
import { Chip, Selectize } from 'react-native-material-selectize';

import KeyboardShift from '../../components/KeyboardShift';
import {
  saveGroup,
  getById,
  getCommentsByGroup,
  saveComment,
  getActivitiesByGroup,
  getByIdEnd,
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

import i18n from '../../languages';

let toastSuccess;
let toastError;
const containerPadding = 35;
const windowWidth = Dimensions.get('window').width;
const spacing = windowWidth * 0.025;
const sideSize = windowWidth - 2 * spacing;
const circleSideSize = (windowWidth / 3) + 20;
/* eslint-disable */
let commentsFlatList, coachesSelectizeRef, geonamesSelectizeRef, peopleGroupsSelectizeRef, parentGroupsSelectizeRef, peerGroupsSelectizeRef, childGroupsSelectizeRef;
/* eslint-enable */
const styles = StyleSheet.create({
  toggleButton: {
    borderRadius: 5,
    height: '100%',
    margin: 5,
  },
  inputContactAddress: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#D9D5DC',
    marginRight: 10,
    marginBottom: 5,
  },
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
    borderBottomWidth: 3,
    borderBottomColor: Colors.tintColor,
  },
  tabStyle: { backgroundColor: '#FFFFFF' },
  textStyle: { color: 'gray' },
  activeTabStyle: { backgroundColor: '#FFFFFF' },
  activeTextStyle: { color: Colors.tintColor, fontWeight: 'bold' },
  label: {
    color: Colors.tintColor,
    fontSize: 15,
  },
  addRemoveIcons: {
    fontSize: 30,
    marginRight: 0,
  },
  icons: {
    color: Colors.tintColor,
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
  formIconLabel: { width: 'auto' },
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
  saveButton: {
    backgroundColor: Colors.tintColor,
    borderRadius: 5,
    marginTop: 40,
  },
});
const diff = (obj1, obj2) => {
  // Make sure an object to compare is provided
  if (!obj2 || Object.prototype.toString.call(obj2) !== '[object Object]') {
    return obj1;
  }

  //
  // Variables
  //

  const diffs = {};
  // let key;


  //
  // Methods
  //

  /**
   * Check if two arrays are equal
   * @param  {Array}   arr1 The first array
   * @param  {Array}   arr2 The second array
   * @return {Boolean}      If true, both arrays are equal
   */
  const arraysMatch = (value, other) => {
    // Get the value type
    const type = Object.prototype.toString.call(value);

    // If the two objects are not the same type, return false
    if (type !== Object.prototype.toString.call(other)) return false;

    // If items are not an object or array, return false
    if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false;

    // Compare the length of the length of the two items
    const valueLen = type === '[object Array]' ? value.length : Object.keys(value).length;
    const otherLen = type === '[object Array]' ? other.length : Object.keys(other).length;
    if (valueLen !== otherLen) return false;

    // Compare two items
    const compare = (item1, item2) => {
      // Get the object type
      const itemType = Object.prototype.toString.call(item1);

      // If an object or array, compare recursively
      if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
        if (!arraysMatch(item1, item2)) return false;
      } else {
        // Otherwise, do a simple comparison
        // If the two items are not the same type, return false
        if (itemType !== Object.prototype.toString.call(item2)) return false;

        // Else if it's a function, convert to a string and compare
        // Otherwise, just compare
        if (itemType === '[object Function]') {
          if (item1.toString() !== item2.toString()) return false;
        } else if (item1 !== item2) return false;
      }
      return true;
    };

    // Compare properties
    if (type === '[object Array]') {
      for (let i = 0; i < valueLen; i++) {
        if (compare(value[i], other[i]) === false) return false;
      }
    } else {
      for (const key in value) {
        if (Object.prototype.hasOwnProperty.call(value, key)) {
          if (compare(value[key], other[key]) === false) return false;
        }
      }
    }

    // If nothing failed, return true
    return true;
  };

  /**
   * Compare two items and push non-matches to object
   * @param  {*}      item1 The first item
   * @param  {*}      item2 The second item
   * @param  {String} key   The key in our object
   */
  const compare = (item1, item2, key) => {
    // Get the object type
    const type1 = Object.prototype.toString.call(item1);
    const type2 = Object.prototype.toString.call(item2);

    // If type2 is undefined it has been removed
    if (type2 === '[object Undefined]') {
      diffs[key] = null;
      return;
    }

    // If items are different types
    if (type1 !== type2) {
      diffs[key] = item2;
      return;
    }

    // If an object, compare recursively
    if (type1 === '[object Object]') {
      const objDiff = diff(item1, item2);
      if (Object.keys(objDiff).length > 0) {
        diffs[key] = objDiff;
      }
      return;
    }

    // If an array, compare
    if (type1 === '[object Array]') {
      if (!arraysMatch(item1, item2)) {
        diffs[key] = item2;
      }
      return;
    }

    // Else if it's a function, convert to a string and compare
    // Otherwise, just compare
    if (type1 === '[object Function]') {
      if (item1.toString() !== item2.toString()) {
        diffs[key] = item2;
      }
    } else if (item1 !== item2) {
      diffs[key] = item2;
    }
  };


  //
  // Compare our objects
  //

  // Loop through the first object
  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      compare(obj1[key], obj2[key], key);
    }
  }

  // Loop through the second object and find missing items
  for (const key in obj2) {
    if (Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (!obj1[key] && obj1[key] !== obj2[key]) {
        diffs[key] = obj2[key];
      }
    }
  }

  // Return the object of differences
  return diffs;
};
const formatDateToBackEnd = (dateString) => {
  const dateObject = new Date(dateString);
  const year = dateObject.getFullYear();
  const month = (dateObject.getMonth() + 1) < 10 ? `0${dateObject.getMonth() + 1}` : (dateObject.getMonth() + 1);
  const day = (dateObject.getDate()) < 10 ? `0${dateObject.getDate()}` : (dateObject.getDate());
  const newDate = `${year}-${month}-${day}`;
  return newDate;
};
const getStatusSelectorColor = (groupStatus) => {
  let newColor;
  if (groupStatus === 'inactive') {
    newColor = '#d9534f';
  } else if (groupStatus === 'active') {
    newColor = '#5cb85c';
  }
  return newColor;
};

const initialState = {
  group: {},
  unmodifiedGroup: {},
  groupTypes: [
    {
      name: 'Pre-Group',
      value: 'pre-group',
    },
    {
      name: 'Group',
      value: 'group',
    },
    {
      name: 'Church',
      value: 'church',
    },
    {
      name: 'Team',
      value: 'team',
    },
  ],
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
};

class GroupDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    let navigationTitle = i18n.t('groupDetailScreen.addNewGroup');

    if (params) {
      if (params.groupName) {
        navigationTitle = params.groupName;
      }
    }

    return {
      title: navigationTitle,
      headerLeft: (
        <Icon
          type="MaterialIcons"
          name="arrow-back"
          onPress={() => {
            if (params.previousList.length > 0) {
              const newPreviousList = params.previousList;
              const previousParams = newPreviousList[newPreviousList.length - 1];
              newPreviousList.pop();
              navigation.state.params.onBackFromSameScreen({
                ...previousParams,
                previousList: newPreviousList,
              });
            } else {
              params.onGoBack();
            }
            navigation.goBack();
          }}
          style={[{ paddingLeft: 16, color: '#FFFFFF' }]}
        />
      ),
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
    ...initialState,
  };

  componentDidMount() {
    this.onLoad();
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
      if ((typeof group.ID !== 'undefined' && typeof prevState.group.ID === 'undefined')
        || (group.ID.toString() === prevState.group.ID.toString())
        || (group.oldID && group.oldID.toString() === prevState.group.ID.toString())) {
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
            groupStatusBackgroundColor: getStatusSelectorColor(newState.group.group_status),
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

    return newState;
  }

  componentDidUpdate(prevProps) {
    const {
      userReducerError, group, navigation, newComment, groupsReducerError, saved,
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
      if ((typeof group.ID !== 'undefined' && typeof this.state.group.ID === 'undefined')
        || (group.ID.toString() === this.state.group.ID.toString())
        || (group.oldID && group.oldID.toString() === this.state.group.ID.toString())) {
        // Highlight Updates -> Compare this.state.group with group and show differences
        navigation.setParams({ groupName: group.title });
        this.getGroupByIdEnd();
      }
    }

    // GROUP SAVE
    if (saved && prevProps.saved !== saved) {
      // Update group data only in these conditions:
      // Same group created (offline/online)
      // Same group updated (offline/online)
      // Sane offline group created in DB (AutoID to DBID)
      if ((typeof group.ID !== 'undefined' && typeof this.state.group.ID === 'undefined')
        || (group.ID.toString() === this.state.group.ID.toString())
        || (group.oldID && group.oldID.toString() === this.state.group.ID.toString())) {
        // Highlight Updates -> Compare this.state.contact with contact and show differences
        this.onRefreshCommentsActivities(group.ID);
        toastSuccess.show(
          <View>
            <Text style={{ color: '#FFFFFF' }}>{i18n.t('global.success.save')}</Text>
          </View>,
          3000,
        );
        this.onDisableEdit();
      }
    }

    // ERROR
    const usersError = (prevProps.userReducerError !== userReducerError && userReducerError);
    let groupsError = (prevProps.groupsReducerError !== groupsReducerError);
    groupsError = (groupsError && groupsReducerError);
    if (usersError || groupsError) {
      const error = userReducerError || groupsReducerError;
      toastError.show(
        <View>
          <Text style={{ fontWeight: 'bold' }}>{i18n.t('global.error.code')}</Text>
          <Text>{error.code}</Text>
          <Text style={{ fontWeight: 'bold' }}>{i18n.t('global.error.message')}</Text>
          <Text>{error.message}</Text>
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
    this.setState({
      ...newState,
    }, () => {
      this.getLists((groupId) || null);
    });
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
    this.setState({
      comments: [],
      activities: [],
      commentsOffset: 0,
      activitiesOffset: 0,
    }, () => {
      this.getGroupComments(groupId);
      if (this.props.isConnected) {
        this.getGroupActivities(groupId);
      }
    });
  }

  setCurrentTabIndex(index) {
    // Timeout to resolve the "tab content no rendered" issue
    setTimeout(() => {
      this.setState({ currentTabIndex: index, groupsTabActive: false });
    }, 0);
  }

  getLists = async (groupId) => {
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
    this.setState({
      onlyView: false,
    });
    this.props.navigation.setParams({ hideTabBar: true });
  };

  onDisableEdit = () => {
    const { currentTabIndex, unmodifiedGroup } = this.state;
    this.setState({
      onlyView: true,
      currentTabIndex: 0,
      group: {
        ...unmodifiedGroup,
      },
      groupStatusBackgroundColor: getStatusSelectorColor(unmodifiedGroup.group_status),
    }, () => {
      this.setCurrentTabIndex(currentTabIndex);
    });
    this.props.navigation.setParams({ hideTabBar: false });
  }

  setGroupTitle = (value) => {
    this.setState(prevState => ({
      group: {
        ...prevState.group,
        title: value,
      },
    }));
  };

  setGroupType = (value) => {
    this.setState(prevState => ({
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
    this.setState(prevState => ({
      group: {
        ...prevState.group,
        group_status: value,
      },
      groupStatusBackgroundColor: newColor,
    }));
  };

  setGroupStartDate = (value) => {
    this.setState(prevState => ({
      group: {
        ...prevState.group,
        start_date: formatDateToBackEnd(value),
      },
    }));
  };

  setEndDate = (value) => {
    this.setState(prevState => ({
      group: {
        ...prevState.group,
        end_date: formatDateToBackEnd(value),
      },
    }));
  };

  getCommentsAndActivities() {
    const { comments, activities } = this.state;
    const list = comments.concat(activities);
    return list.filter((item, index) => list.indexOf(item) === index).sort(
      (a, b) => new Date(a.date).getTime() < new Date(b.date).getTime(),
    );
  }

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
            'content',
          ) && (
          <Grid>
            <Row>
              <Col>
                <Text style={styles.name}>{commentOrActivity.author}</Text>
              </Col>
              <Col style={{ width: 110 }}>
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
              <Col style={{ width: 110 }}>
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

  onSelectAssignedTo = (key) => {
    this.setState(prevState => ({
      group: {
        ...prevState.group,
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

  onAddAddressField = () => {
    const contactAddressList = (this.state.group.contact_address) ? [...this.state.group.contact_address] : [];
    contactAddressList.push({
      value: '',
    });
    this.setState(prevState => ({
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
    component.setState(prevState => ({
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
    component.setState(prevState => ({
      group: {
        ...prevState.group,
        contact_address: contactAddressList,
      },
    }));
  };

  onCheckExistingHealthMetric = (metricName) => {
    const healthMetrics = this.state.group.health_metrics ? [...this.state.group.health_metrics.values] : [];
    // get healthMetrics that exist in the list and are not deleted
    const foundhealthMetric = healthMetrics.some(
      healthMetric => (healthMetric.value === metricName && !healthMetric.delete),
    );
    return foundhealthMetric;
  };

  onHealthMetricChange = (metricName) => {
    const healthMetrics = this.state.group.health_metrics ? [...this.state.group.health_metrics.values] : [];
    const foundhealthMetric = healthMetrics.find(metric => metric.value === metricName);
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
    this.setState(prevState => ({
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

  getSelectizeValuesToSave = (dbData, selectizeRef) => {
    const dbItems = [...dbData];
    const localItems = [];

    const selectedValues = selectizeRef.getSelectedItems();

    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const item = selectedValues.entities.item[itemValue];
      localItems.push(item);
    });

    const itemsToSave = localItems.filter((localItem) => {
      const foundLocalInDatabase = dbItems.find(dbItem => dbItem.value === localItem.value);
      return foundLocalInDatabase === undefined;
    }).map(localItem => ({ value: localItem.value }));

    dbItems.forEach((dbItem) => {
      const foundDatabaseInLocal = localItems.find(localItem => dbItem.value === localItem.value);
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
          values: this.getSelectizeValuesToSave((transformedGroup.coaches) ? transformedGroup.coaches.values : [], coachesSelectizeRef),
        },
      };
    }
    if (geonamesSelectizeRef) {
      transformedGroup = {
        ...transformedGroup,
        location_grid: {
          values: this.getSelectizeValuesToSave((transformedGroup.location_grid) ? transformedGroup.location_grid.values : [], geonamesSelectizeRef),
        },
      };
    }
    if (peopleGroupsSelectizeRef) {
      transformedGroup = {
        ...transformedGroup,
        people_groups: {
          values: this.getSelectizeValuesToSave((transformedGroup.people_groups) ? transformedGroup.people_groups.values : [], peopleGroupsSelectizeRef),
        },
      };
    }
    if (parentGroupsSelectizeRef) {
      transformedGroup = {
        ...transformedGroup,
        parent_groups: {
          values: this.getSelectizeValuesToSave((transformedGroup.parent_groups) ? transformedGroup.parent_groups.values : [], parentGroupsSelectizeRef),
        },
      };
    }
    if (peerGroupsSelectizeRef) {
      transformedGroup = {
        ...transformedGroup,
        peer_groups: {
          values: this.getSelectizeValuesToSave((transformedGroup.peer_groups) ? transformedGroup.peer_groups.values : [], peerGroupsSelectizeRef),
        },
      };
    }
    if (childGroupsSelectizeRef) {
      transformedGroup = {
        ...transformedGroup,
        child_groups: {
          values: this.getSelectizeValuesToSave((transformedGroup.child_groups) ? transformedGroup.child_groups.values : [], childGroupsSelectizeRef),
        },
      };
    }

    return transformedGroup;
  }

  onSaveGroup = () => {
    Keyboard.dismiss();
    const { unmodifiedGroup } = this.state;
    const group = this.transformGroupObject(this.state.group);
    let groupToSave = {
      ...diff(unmodifiedGroup, group),
    };
    if (this.state.group.title) {
      groupToSave = {
        ...groupToSave,
        title: this.state.group.title,
      };
    }
    if (this.state.group.ID) {
      groupToSave = {
        ...groupToSave,
        ID: this.state.group.ID,
      };
    }
    this.props.saveGroup(
      this.props.userData.domain,
      this.props.userData.token,
      groupToSave,
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
  };

  tabChanged = (event) => {
    this.props.navigation.setParams({ hideTabBar: event.i === 2 });
    this.setState({
      groupsTabActive: event.i === 3,
      currentTabIndex: event.i,
    });
  };

  showAssignedUser = () => {
    const foundUser = (this.state.group.assigned_to) ? this.state.users.find(
      user => `user-${user.key}` === this.state.group.assigned_to,
    ) : null;
    return <Text style={{ marginTop: 'auto', marginBottom: 'auto', fontSize: 15 }}>{foundUser ? foundUser.label : ''}</Text>;
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
                                    'church_giving',
                                  );
                                }}
                                activeOpacity={1}
                              >
                                <Image
                                  source={givingIcon}
                                  style={
                                    this.onCheckExistingHealthMetric(
                                      'church_giving',
                                    )
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
                            }}
                          >
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric(
                                  'church_giving',
                                )
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}
                            >
                              {this.props.groupSettings.health_metrics.values.church_giving.label}
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
                                  this.onHealthMetricChange(
                                    'church_fellowship',
                                  );
                                }}
                                activeOpacity={1}
                              >
                                <Image
                                  source={fellowShipIcon}
                                  style={
                                    this.onCheckExistingHealthMetric(
                                      'church_fellowship',
                                    )
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
                            }}
                          >
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric(
                                  'church_fellowship',
                                )
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}
                            >
                              {this.props.groupSettings.health_metrics.values.church_fellowship.label}
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
                                    'church_communion',
                                  );
                                }}
                                activeOpacity={1}
                              >
                                <Image
                                  source={communionIcon}
                                  style={
                                    this.onCheckExistingHealthMetric(
                                      'church_communion',
                                    )
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
                            }}
                          >
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric(
                                  'church_communion',
                                )
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}
                            >
                              {this.props.groupSettings.health_metrics.values.church_communion.label}
                            </Text>
                          </Row>
                        </Col>
                      </Row>
                    </Col>
                    <Col size={2} />
                  </Row>

                  <Row size={7} style={{ backgroundColor: 'white' }}>
                    <Col size={3}>
                      <Row
                        size={2}
                        style={{ backgroundColor: 'white' }}
                      />
                      <Row size={6}>
                        <Col>
                          <Row size={60}>
                            <Col>
                              <TouchableOpacity
                                onPress={() => {
                                  this.onHealthMetricChange(
                                    'church_baptism',
                                  );
                                }}
                                activeOpacity={1}
                              >
                                <Image
                                  source={baptismIcon}
                                  style={
                                    this.onCheckExistingHealthMetric(
                                      'church_baptism',
                                    )
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
                            }}
                          >
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric(
                                  'church_baptism',
                                )
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}
                            >
                              {this.props.groupSettings.health_metrics.values.church_baptism.label}
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
                                    'church_prayer',
                                  );
                                }}
                                activeOpacity={1}
                              >
                                <Image
                                  source={prayerIcon}
                                  style={
                                    this.onCheckExistingHealthMetric(
                                      'church_prayer',
                                    )
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
                            }}
                          >
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric(
                                  'church_prayer',
                                )
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}
                            >
                              {this.props.groupSettings.health_metrics.values.church_prayer.label}
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
                                    'church_leaders',
                                  );
                                }}
                                activeOpacity={1}
                              >
                                <Image
                                  source={leadersIcon}
                                  style={
                                    this.onCheckExistingHealthMetric(
                                      'church_leaders',
                                    )
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
                            }}
                          >
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric(
                                  'church_leaders',
                                )
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}
                            >
                              {this.props.groupSettings.health_metrics.values.church_leaders.label}
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
                                    'church_bible',
                                  );
                                }}
                                activeOpacity={1}
                              >
                                <Image
                                  source={bibleStudyIcon}
                                  style={
                                    this.onCheckExistingHealthMetric(
                                      'church_bible',
                                    )
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
                            }}
                          >
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric(
                                  'church_bible',
                                )
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}
                            >
                              {this.props.groupSettings.health_metrics.values.church_bible.label}
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
                                    'church_praise',
                                  );
                                }}
                                activeOpacity={1}
                              >
                                <Image
                                  source={praiseIcon}
                                  style={
                                    this.onCheckExistingHealthMetric(
                                      'church_praise',
                                    )
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
                            }}
                          >
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric(
                                  'church_praise',
                                )
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}
                            >
                              {this.props.groupSettings.health_metrics.values.church_praise.label}
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
                                    'church_sharing',
                                  );
                                }}
                                activeOpacity={1}
                              >
                                <Image
                                  source={sharingTheGospelIcon}
                                  style={
                                    this.onCheckExistingHealthMetric(
                                      'church_sharing',
                                    )
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
                            }}
                          >
                            <Text
                              style={[
                                styles.toggleText,
                                this.onCheckExistingHealthMetric(
                                  'church_sharing',
                                )
                                  ? styles.activeToggleText
                                  : styles.inactiveToggleText,
                              ]}
                            >
                              {this.props.groupSettings.health_metrics.values.church_sharing.label}
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

  render() {
    const successToast = (
      <Toast
        ref={(toast) => {
          toastSuccess = toast;
        }}
        style={{ backgroundColor: 'green' }}
        position="center"
      />
    );
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
      <View style={{ flex: 1 }}>
        {this.state.loadedLocal && (
          <View style={{ flex: 1 }}>
            {this.state.group.ID ? (
              <View style={{ flex: 1 }}>
                {this.state.onlyView && (
                  <View style={{ flex: 1 }}>
                    <Tabs
                      renderTabBar={() => <ScrollableTab />}
                      tabBarUnderlineStyle={styles.tabBarUnderlineStyle}
                      onChangeTab={this.tabChanged}
                      locked={this.state.groupsTabActive && this.state.onlyView}
                      page={this.state.currentTabIndex}
                      scrollWithoutAnimation
                    >
                      <Tab
                        heading={i18n.t('global.details')}
                        tabStyle={styles.tabStyle}
                        textStyle={styles.textStyle}
                        activeTabStyle={styles.activeTabStyle}
                        activeTextStyle={styles.activeTextStyle}
                      >
                        <ScrollView
                          keyboardShouldPersistTaps="handled"
                          refreshControl={(
                            <RefreshControl
                              refreshing={this.state.loading}
                              onRefresh={() => this.onRefresh(this.state.group.ID)}
                            />
                          )}
                        >
                          <Grid style={[styles.formContainer, { marginTop: 10, paddingBottom: 0 }]}>
                            <Row>
                              <Col />
                              <Col>
                                <Text style={{ color: Colors.tintColor, fontSize: 15, textAlign: 'right' }} onPress={() => this.onEnableEdit()}>
                                  {i18n.t('global.edit')}
                                </Text>
                              </Col>
                            </Row>
                          </Grid>
                          <View
                            style={[styles.formContainer, { paddingTop: 0 }]}
                            pointerEvents="none"
                          >
                            <Label
                              style={{
                                color: Colors.tintColor, fontSize: 12, fontWeight: 'bold', marginTop: 10,
                              }}
                            >
                              {this.props.groupSettings.group_status.name}
                            </Label>
                            <Row style={[styles.formRow, { paddingTop: 5 }]}>
                              <Col>
                                <Picker
                                  selectedValue={
                                    this.state.group.group_status
                                  }
                                  onValueChange={this.setGroupStatus}
                                  style={Platform.OS === 'android' ? {
                                    color: '#ffffff',
                                    backgroundColor: this.state.groupStatusBackgroundColor,
                                  } : {
                                    backgroundColor: this.state.groupStatusBackgroundColor,
                                  }}
                                >
                                  {Object.keys(this.props.groupSettings.group_status.values).map((key) => {
                                    const optionData = this.props.groupSettings.group_status.values[key];
                                    return (
                                      <Picker.Item
                                        key={key}
                                        label={optionData.label}
                                        value={key}
                                      />
                                    );
                                  })}
                                </Picker>
                              </Col>
                            </Row>
                            <Row style={styles.formRow}>
                              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                                <Icon
                                  type="FontAwesome"
                                  name="user-circle"
                                  style={styles.formIcon}
                                />
                              </Col>
                              <Col>
                                {this.showAssignedUser()}
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>
                                  {this.props.groupSettings.assigned_to.name}
                                </Label>
                              </Col>
                            </Row>
                            <View style={styles.formDivider} />
                            <Row style={styles.formRow}>
                              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                                <Icon
                                  type="FontAwesome"
                                  name="black-tie"
                                  style={styles.formIcon}
                                />
                              </Col>
                              <Col>
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                  {this.state.group.coaches ? this.state.group.coaches.values.map(coach => this.state.usersContacts.find(user => user.value === coach.value).name).join(', ') + (this.state.group.coaches.values.length > 0 ? '.' : '') : ''}
                                </Text>
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>
                                  {this.props.groupSettings.coaches.name}
                                </Label>
                              </Col>
                            </Row>
                            <View style={styles.formDivider} />
                            <Row style={styles.formRow}>
                              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                                <Icon
                                  type="FontAwesome"
                                  name="map-marker"
                                  style={styles.formIcon}
                                />
                              </Col>
                              <Col>
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                  {this.state.group.location_grid ? this.state.group.location_grid.values.map(location => this.state.geonames.find(geoname => geoname.value === location.value).name).join(', ') + (this.state.group.location_grid.values.length > 0 ? '.' : '') : ''}
                                </Text>
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>
                                  {this.props.groupSettings.location_grid.name}
                                </Label>
                              </Col>
                            </Row>
                            <View style={styles.formDivider} />
                            <Row style={styles.formRow}>
                              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                                <Icon
                                  type="FontAwesome"
                                  name="globe"
                                  style={styles.formIcon}
                                />
                              </Col>
                              <Col>
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                  {this.state.group.people_groups ? this.state.group.people_groups.values.map(peopleGroup => this.state.peopleGroups.find(person => person.value === peopleGroup.value).name).join(', ') + (this.state.group.people_groups.values.length > 0 ? '.' : '') : ''}
                                </Text>
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>
                                  {this.props.groupSettings.people_groups.name}
                                </Label>
                              </Col>
                            </Row>
                            <View style={styles.formDivider} />
                            <Row style={styles.formRow}>
                              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                                <Icon
                                  type="Entypo"
                                  name="home"
                                  style={styles.formIcon}
                                />
                              </Col>
                              <Col>
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                  {this.state.group.contact_address ? this.state.group.contact_address.map(address => address.value).join(', ') + (this.state.group.contact_address.length > 0 ? '.' : '') : ''}
                                </Text>
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>
                                  {i18n.t('global.address')}
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
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                  {(this.state.group.start_date) ? this.state.group.start_date : ''}
                                </Text>
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>
                                  {this.props.groupSettings.start_date.name}
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
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>
                                  {(this.state.group.end_date) ? this.state.group.end_date : ''}
                                </Text>
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>
                                  {this.props.groupSettings.end_date.name}
                                </Label>
                              </Col>
                            </Row>
                            <View style={styles.formDivider} />
                          </View>
                        </ScrollView>
                      </Tab>
                      <Tab
                        heading={i18n.t('global.progress')}
                        tabStyle={styles.tabStyle}
                        textStyle={styles.textStyle}
                        activeTabStyle={styles.activeTabStyle}
                        activeTextStyle={styles.activeTextStyle}
                      >
                        <ScrollView
                          keyboardShouldPersistTaps="handled"
                          refreshControl={(
                            <RefreshControl
                              refreshing={this.state.loading}
                              onRefresh={() => this.onRefresh(this.state.group.ID)}
                            />
                          )}
                        >
                          <View
                            style={[styles.formContainer, { marginTop: 10 }]}
                          >
                            <Grid>
                              <Row>
                                <Col />
                                <Col>
                                  <Text style={{ color: Colors.tintColor, fontSize: 15, textAlign: 'right' }} onPress={() => this.onEnableEdit()}>
                                    {i18n.t('global.edit')}
                                  </Text>
                                </Col>
                              </Row>
                            </Grid>
                            <Row style={[styles.formRow, { paddingTop: 15 }]}>
                              <Col style={[styles.formIconLabel, { marginRight: 10 }]}>
                                <Icon
                                  android="md-people"
                                  ios="ios-people"
                                  style={styles.formIcon}
                                />
                              </Col>
                              <Col>
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>{(this.state.group.group_type) ? this.props.groupSettings.group_type.values[this.state.group.group_type].label : ''}</Text>
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>{i18n.t('groupDetailScreen.groupType')}</Label>
                              </Col>
                            </Row>
                            <View style={styles.formDivider} />
                            <Label
                              style={[
                                styles.formLabel,
                                { fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
                              ]}
                            >
                              {i18n.t('groupDetailScreen.churchHealth')}
                            </Label>
                          </View>
                          {this.renderHealthMilestones()}
                        </ScrollView>
                      </Tab>
                      <Tab
                        heading={i18n.t('global.commentsActivity')}
                        tabStyle={[styles.tabStyle]}
                        textStyle={styles.textStyle}
                        activeTabStyle={styles.activeTabStyle}
                        activeTextStyle={styles.activeTextStyle}
                      >
                        <View style={{ flex: 1 }}>
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
                              return this.renderActivityOrCommentRow(
                                commentOrActivity,
                              );
                            }}
                            refreshControl={(
                              <RefreshControl
                                refreshing={(this.state.loadComments || this.state.loadActivities)}
                                onRefresh={() => this.onRefreshCommentsActivities(this.state.group.ID)}
                              />
                            )}
                            onScroll={({ nativeEvent }) => {
                              const {
                                loadMoreComments, commentsOffset, loadMoreActivities, activitiesOffset,
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
                                    this.setState({
                                      loadMoreComments: true,
                                    }, () => {
                                      this.getGroupComments(this.state.group.ID);
                                    });
                                  }
                                }
                                if (!loadMoreActivities) {
                                  if (activitiesOffset < this.state.totalActivities) {
                                    this.setState({
                                      loadMoreActivities: true,
                                    }, () => {
                                      this.getGroupActivities(this.state.group.ID);
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
                                placeholder={i18n.t('global.writeYourCommentNoteHere')}
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
                        heading={i18n.t('global.groups')}
                        tabStyle={styles.tabStyle}
                        textStyle={styles.textStyle}
                        activeTabStyle={styles.activeTabStyle}
                        activeTextStyle={styles.activeTextStyle}
                      >
                        <ScrollView
                          keyboardShouldPersistTaps="handled"
                          refreshControl={(
                            <RefreshControl
                              refreshing={this.state.loading}
                              onRefresh={() => this.onRefresh(this.state.group.ID)}
                            />
                          )}
                        >
                          <Grid style={[styles.formContainer, { marginTop: 10, paddingBottom: 0 }]}>
                            <Row>
                              <Col />
                              <Col>
                                <Text style={{ color: Colors.tintColor, fontSize: 15, textAlign: 'right' }} onPress={() => this.onEnableEdit()}>
                                  {i18n.t('global.edit')}
                                </Text>
                              </Col>
                            </Row>
                          </Grid>
                          <Grid style={[styles.formContainer, styles.formContainerNoPadding]}>
                            <Row style={styles.formRow}>
                              <Col style={[styles.formIconLabel, styles.formIconLabelMarginLeft]}>
                                <Label style={styles.formLabel}>
                                  {this.props.groupSettings.parent_groups.name}
                                </Label>
                              </Col>
                              <Col />
                            </Row>
                            <Row style={[styles.groupCircleParentContainer, { overflowX: 'auto' }]}>
                              <ScrollView horizontal>
                                {(this.state.group.parent_groups) ? this.state.group.parent_groups.values.map((parentGroup, index) => (
                                  <Col
                                    key={index.toString()}
                                    style={styles.groupCircleContainer}
                                    onPress={() => this.goToGroupDetailScreen(parentGroup)}
                                  >
                                    {(index % 2 === 0) ? (
                                      <Image
                                        source={groupCircleIcon}
                                        style={styles.groupCircle}
                                      />
                                    ) : (
                                      <Image
                                        source={groupDottedCircleIcon}
                                        style={styles.groupCircle}
                                      />
                                    )}
                                    <Image
                                      source={swimmingPoolIcon}
                                      style={styles.groupCenterIcon}
                                    />
                                    <Row
                                      style={styles.groupCircleName}
                                    >
                                      <Text style={styles.groupCircleNameText}>
                                        {parentGroup.post_title}
                                      </Text>
                                    </Row>
                                    <Row
                                      style={styles.groupCircleCounter}
                                    >
                                      <Text>{parentGroup.baptized_member_count}</Text>
                                    </Row>
                                    <Row
                                      style={[styles.groupCircleCounter, { marginTop: '5%' }]}
                                    >
                                      <Text>{parentGroup.member_count}</Text>
                                    </Row>
                                  </Col>
                                )) : (<Text />)}
                              </ScrollView>
                            </Row>
                            <View style={[styles.formDivider, styles.formIconLabelMargin]} />
                            <Row style={styles.formRow}>
                              <Col style={[styles.formIconLabel, styles.formIconLabelMarginLeft]}>
                                <Label style={styles.formLabel}>
                                  {i18n.t('groupDetailScreen.childGroup')}
                                </Label>
                              </Col>
                              <Col />
                            </Row>
                            <Row style={[styles.groupCircleParentContainer, { overflowX: 'auto' }]}>
                              <ScrollView horizontal>
                                {(this.state.group.child_groups) ? this.state.group.child_groups.values.map((childGroup, index) => (
                                  <Col
                                    key={index.toString()}
                                    style={styles.groupCircleContainer}
                                    onPress={() => this.goToGroupDetailScreen(childGroup)}
                                  >
                                    {(index % 2 === 0) ? (
                                      <Image
                                        source={groupCircleIcon}
                                        style={styles.groupCircle}
                                      />
                                    ) : (
                                      <Image
                                        source={groupDottedCircleIcon}
                                        style={styles.groupCircle}
                                      />
                                    )}
                                    <Image
                                      source={swimmingPoolIcon}
                                      style={styles.groupCenterIcon}
                                    />
                                    <Row
                                      style={styles.groupCircleName}
                                    >
                                      <Text style={styles.groupCircleNameText}>
                                        {childGroup.post_title}
                                      </Text>
                                    </Row>
                                    <Row
                                      style={styles.groupCircleCounter}
                                    >
                                      <Text>{childGroup.baptized_member_count}</Text>
                                    </Row>
                                    <Row
                                      style={[styles.groupCircleCounter, { marginTop: '5%' }]}
                                    >
                                      <Text>{childGroup.member_count}</Text>
                                    </Row>
                                  </Col>
                                )) : (<Text />)}
                              </ScrollView>
                            </Row>
                            <View style={[styles.formDivider, styles.formDivider2Margin]} />
                            <Row style={styles.formRow}>
                              <Col style={[styles.formIconLabel, styles.formIconLabelMarginLeft]}>
                                <Label style={styles.formLabel}>
                                  {this.props.groupSettings.peer_groups.name}
                                </Label>
                              </Col>
                              <Col />
                            </Row>
                            <Row style={[styles.groupCircleParentContainer, { overflowX: 'auto' }]}>
                              <ScrollView horizontal>
                                {(this.state.group.peer_groups) ? this.state.group.peer_groups.values.map((peerGroup, index) => (
                                  <Col
                                    key={index.toString()}
                                    style={styles.groupCircleContainer}
                                    onPress={() => this.goToGroupDetailScreen(peerGroup)}
                                  >
                                    {(index % 2 === 0) ? (
                                      <Image
                                        source={groupCircleIcon}
                                        style={styles.groupCircle}
                                      />
                                    ) : (
                                      <Image
                                        source={groupDottedCircleIcon}
                                        style={styles.groupCircle}
                                      />
                                    )}
                                    <Image
                                      source={swimmingPoolIcon}
                                      style={styles.groupCenterIcon}
                                    />
                                    <Row
                                      style={styles.groupCircleName}
                                    >
                                      <Text style={styles.groupCircleNameText}>
                                        {peerGroup.post_title}
                                      </Text>
                                    </Row>
                                    <Row
                                      style={styles.groupCircleCounter}
                                    >
                                      <Text>{peerGroup.baptized_member_count}</Text>
                                    </Row>
                                    <Row
                                      style={[styles.groupCircleCounter, { marginTop: '5%' }]}
                                    >
                                      <Text>{peerGroup.member_count}</Text>
                                    </Row>
                                  </Col>
                                )) : (<Text />)}
                              </ScrollView>
                            </Row>
                            <View style={[styles.formDivider, styles.formDivider2Margin]} />
                          </Grid>
                        </ScrollView>
                      </Tab>
                    </Tabs>
                  </View>
                )}
                {!this.state.onlyView && (
                  <KeyboardShift>
                    {() => (
                      <Container>
                        <Content>
                          <ScrollView keyboardShouldPersistTaps="handled">
                            {this.state.currentTabIndex === 0 && (
                              <View style={styles.formContainer}>
                                <Label
                                  style={{
                                    color: Colors.tintColor, fontSize: 12, fontWeight: 'bold', marginTop: 10,
                                  }}
                                >
                                  {this.props.groupSettings.group_status.name}
                                </Label>
                                <Row style={{ paddingBottom: 30 }}>
                                  <Col>
                                    <Picker
                                      selectedValue={
                                        this.state.group.group_status
                                      }
                                      onValueChange={this.setGroupStatus}
                                      style={Platform.OS === 'android' ? {
                                        color: '#ffffff',
                                        backgroundColor: this.state.groupStatusBackgroundColor,
                                      } : {
                                        backgroundColor: this.state.groupStatusBackgroundColor,
                                      }}
                                    >
                                      {Object.keys(this.props.groupSettings.group_status.values).map((key) => {
                                        const optionData = this.props.groupSettings.group_status.values[key];
                                        return (
                                          <Picker.Item
                                            key={key}
                                            label={optionData.label}
                                            value={key}
                                          />
                                        );
                                      })}
                                    </Picker>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col style={styles.formIconLabelCol}>
                                    <View style={styles.formIconLabelView}>
                                      <Icon
                                        type="FontAwesome"
                                        name="user"
                                        style={styles.formIcon}
                                      />
                                    </View>
                                  </Col>
                                  <Col>
                                    <Label
                                      style={styles.formLabel}
                                    >
                                      {i18n.t('groupDetailScreen.groupName')}
                                    </Label>
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
                                      value={this.state.group.title}
                                      onChangeText={this.setGroupTitle}
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
                                  }}
                                >
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
                                      <Label
                                        style={styles.formLabel}
                                      >
                                        {this.props.groupSettings.assigned_to.name}
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
                                      <Icon
                                        type="FontAwesome"
                                        name="black-tie"
                                        style={styles.formIcon}
                                      />
                                    </View>
                                  </Col>
                                  <Col>
                                    <Label
                                      style={styles.formLabel}
                                    >
                                      {i18n.t('groupDetailScreen.groupCoach')}
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
                                      ref={(selectize) => { coachesSelectizeRef = selectize; }}
                                      itemId="value"
                                      items={this.state.usersContacts}
                                      selectedItems={(this.state.group.coaches) ? this.state.group.coaches.values.map(coach => ({ name: this.state.usersContacts.find(user => user.value === coach.value).name, value: coach.value })) : []}
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
                                <Row style={styles.formFieldPadding}>
                                  <Col style={styles.formIconLabelCol}>
                                    <View style={styles.formIconLabelView}>
                                      <Icon
                                        type="FontAwesome"
                                        name="map-marker"
                                        style={styles.formIcon}
                                      />
                                    </View>
                                  </Col>
                                  <Col>
                                    <Label
                                      style={styles.formLabel}
                                    >
                                      {this.props.groupSettings.location_grid.name}
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
                                      ref={(selectize) => { geonamesSelectizeRef = selectize; }}
                                      itemId="value"
                                      items={this.state.geonames}
                                      selectedItems={(this.state.group.location_grid) ? this.state.group.location_grid.values.map(location => ({ name: this.state.geonames.find(geoname => geoname.value === location.value).name, value: location.value })) : []}
                                      textInputProps={{
                                        placeholder: i18n.t('groupDetailScreen.selectGeonames'),
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
                                <Row style={styles.formFieldPadding}>
                                  <Col style={styles.formIconLabelCol}>
                                    <View style={styles.formIconLabelView}>
                                      <Icon
                                        type="FontAwesome"
                                        name="globe"
                                        style={styles.formIcon}
                                      />
                                    </View>
                                  </Col>
                                  <Col>
                                    <Label
                                      style={styles.formLabel}
                                    >
                                      {this.props.groupSettings.people_groups.name}
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
                                      ref={(selectize) => { peopleGroupsSelectizeRef = selectize; }}
                                      itemId="value"
                                      items={this.state.peopleGroups}
                                      selectedItems={(this.state.group.people_groups) ? this.state.group.people_groups.values.map(peopleGroup => ({ name: this.state.peopleGroups.find(person => person.value === peopleGroup.value).name, value: peopleGroup.value })) : []}
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
                                <Row style={styles.formFieldPadding}>
                                  <Col style={styles.formIconLabelCol}>
                                    <View style={styles.formIconLabelView}>
                                      <Icon
                                        type="Entypo"
                                        name="home"
                                        style={styles.formIcon}
                                      />
                                    </View>
                                  </Col>
                                  <Col>
                                    <Label
                                      style={styles.formLabel}
                                    >
                                      {i18n.t('global.address')}
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
                                {(this.state.group.contact_address) ? this.state.group.contact_address.map(
                                  (address, index) => (!address.delete ? (
                                    <Row
                                      key={index.toString()}
                                    >
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
                                          style={styles.addRemoveIcons}
                                          onPress={() => {
                                            this.onRemoveAddressField(
                                              index,
                                              this,
                                            );
                                          }}
                                        />
                                      </Col>
                                    </Row>
                                  ) : null),
                                ) : (<Text />)}
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
                                    <Label
                                      style={styles.formLabel}
                                    >
                                      {this.props.groupSettings.start_date.name}
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
                                      defaultDate={(this.state.group.start_date) ? new Date(this.state.group.start_date) : ''}
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
                                    <Label
                                      style={styles.formLabel}
                                    >
                                      {this.props.groupSettings.end_date.name}
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
                                      defaultDate={(this.state.group.end_date) ? new Date(this.state.group.end_date) : ''}
                                    />
                                  </Col>
                                </Row>
                              </View>
                            )}
                            {this.state.currentTabIndex === 1 && (
                              <View style={styles.formContainer}>
                                <Row style={styles.formFieldPadding}>
                                  <Col style={styles.formIconLabelCol}>
                                    <View style={styles.formIconLabelView}>
                                      <Icon
                                        android="md-people"
                                        ios="ios-people"
                                        style={styles.formIcon}
                                      />
                                    </View>
                                  </Col>
                                  <Col>
                                    <Label
                                      style={styles.formLabel}
                                    >
                                      {this.props.groupSettings.group_type.name}
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
                                  <Col>
                                    <Picker
                                      mode="dropdown"
                                      selectedValue={this.state.group.group_type}
                                      onValueChange={this.setGroupType}
                                    >
                                      {Object.keys(this.props.groupSettings.group_type.values).map((key) => {
                                        const optionData = this.props.groupSettings.group_type.values[key];
                                        return (
                                          <Picker.Item
                                            key={key}
                                            label={optionData.label}
                                            value={key}
                                          />
                                        );
                                      })}
                                    </Picker>
                                  </Col>
                                </Row>
                                <Label
                                  style={[
                                    styles.formLabel,
                                    { fontWeight: 'bold', marginBottom: 10, marginTop: 20 },
                                  ]}
                                >
                                  {i18n.t('groupDetailScreen.churchHealth')}
                                </Label>
                              </View>
                            )}
                            {this.state.currentTabIndex === 1 && this.renderHealthMilestones()}
                            {this.state.currentTabIndex === 3 && (
                              <View style={styles.formContainer}>
                                <Row style={styles.formFieldPadding}>
                                  <Col style={styles.formIconLabelCol}>
                                    <View style={styles.formIconLabelView}>
                                      <Icon
                                        type="FontAwesome"
                                        name="users"
                                        style={styles.formIcon}
                                      />
                                    </View>
                                  </Col>
                                  <Col>
                                    <Label
                                      style={styles.formLabel}
                                    >
                                      {this.props.groupSettings.parent_groups.name}
                                    </Label>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col style={styles.formIconLabelCol}>
                                    <View style={styles.formIconLabelView}>
                                      <Icon
                                        type="FontAwesome"
                                        name="users"
                                        style={[styles.formIcon, { opacity: 0 }]}
                                      />
                                    </View>
                                  </Col>
                                  <Col>
                                    <Selectize
                                      ref={(selectize) => { parentGroupsSelectizeRef = selectize; }}
                                      itemId="value"
                                      items={this.state.groups}
                                      selectedItems={(this.state.group.parent_groups) ? this.state.group.parent_groups.values.map(group => ({ name: this.state.groups.find(groupItem => groupItem.value === group.value).name, value: group.value })) : []}
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
                                <Row style={styles.formFieldPadding}>
                                  <Col style={styles.formIconLabelCol}>
                                    <View style={styles.formIconLabelView}>
                                      <Icon
                                        type="FontAwesome"
                                        name="users"
                                        style={styles.formIcon}
                                      />
                                    </View>
                                  </Col>
                                  <Col>
                                    <Label
                                      style={styles.formLabel}
                                    >
                                      {this.props.groupSettings.child_groups.name}
                                    </Label>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col style={styles.formIconLabelCol}>
                                    <View style={styles.formIconLabelView}>
                                      <Icon
                                        type="FontAwesome"
                                        name="users"
                                        style={[styles.formIcon, { opacity: 0 }]}
                                      />
                                    </View>
                                  </Col>
                                  <Col>
                                    <Selectize
                                      ref={(selectize) => { childGroupsSelectizeRef = selectize; }}
                                      itemId="value"
                                      items={this.state.groups}
                                      selectedItems={(this.state.group.child_groups) ? this.state.group.child_groups.values.map(group => ({ name: this.state.groups.find(groupItem => groupItem.value === group.value).name, value: group.value })) : []}
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
                                <Row style={styles.formFieldPadding}>
                                  <Col style={styles.formIconLabelCol}>
                                    <View style={styles.formIconLabelView}>
                                      <Icon
                                        type="FontAwesome"
                                        name="users"
                                        style={styles.formIcon}
                                      />
                                    </View>
                                  </Col>
                                  <Col>
                                    <Label
                                      style={styles.formLabel}
                                    >
                                      {this.props.groupSettings.peer_groups.name}
                                    </Label>
                                  </Col>
                                </Row>
                                <Row>
                                  <Col style={styles.formIconLabelCol}>
                                    <View style={styles.formIconLabelView}>
                                      <Icon
                                        type="FontAwesome"
                                        name="users"
                                        style={[styles.formIcon, { opacity: 0 }]}
                                      />
                                    </View>
                                  </Col>
                                  <Col>
                                    <Selectize
                                      ref={(selectize) => { peerGroupsSelectizeRef = selectize; }}
                                      itemId="value"
                                      items={this.state.groups}
                                      selectedItems={(this.state.group.peer_groups) ? this.state.group.peer_groups.values.map(group => ({ name: this.state.groups.find(groupItem => groupItem.value === group.value).name, value: group.value })) : []}
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
                              </View>
                            )}
                          </ScrollView>
                        </Content>
                        <Footer>
                          <FooterTab>
                            <Button
                              onPress={() => this.onDisableEdit()}
                              style={{
                                height: 60,
                                width: '50%',
                                backgroundColor: '#FFFFFF',
                                shadowColor: 'black',
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                shadowOffset: { width: 1, height: 1 },
                              }}
                              elevation={10}
                            >
                              <Text style={{ color: Colors.tintColor, fontWeight: 'bold' }}>{i18n.t('global.cancel')}</Text>
                            </Button>
                            <Button
                              onPress={this.onSaveGroup}
                              style={{
                                height: 60,
                                width: '50%',
                                backgroundColor: Colors.tintColor,
                              }}
                            >
                              <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{i18n.t('global.save')}</Text>
                            </Button>
                          </FooterTab>
                        </Footer>
                      </Container>
                    )}
                  </KeyboardShift>
                )}
              </View>
            ) : (
              <ScrollView>
                <View style={styles.formContainer}>
                  <Grid>
                    <Row>
                      <Label
                        style={[
                          styles.formLabel,
                          { marginTop: 10, marginBottom: 5 },
                        ]}
                      >
                        {i18n.t('groupDetailScreen.groupName')}
                      </Label>
                    </Row>
                    <Row>
                      <Input
                        placeholder={i18n.t('global.requiredField')}
                        onChangeText={this.setGroupTitle}
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
                        {this.props.groupSettings.group_type.name}
                      </Label>
                    </Row>
                    <Row>
                      <Picker
                        mode="dropdown"
                        selectedValue={this.state.group.group_type}
                        onValueChange={this.setGroupType}
                      >
                        {Object.keys(this.props.groupSettings.group_type.values).map((key) => {
                          const optionData = this.props.groupSettings.group_type.values[key];
                          return (
                            <Picker.Item
                              key={key}
                              label={optionData.label}
                              value={key}
                            />
                          );
                        })}
                      </Picker>
                    </Row>
                  </Grid>
                  <Button block style={styles.saveButton} onPress={this.onSaveGroup}>
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>{i18n.t('global.save')}</Text>
                  </Button>
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

const mapStateToProps = state => ({
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
});

const mapDispatchToProps = dispatch => ({
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupDetailScreen);
