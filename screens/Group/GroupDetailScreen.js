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
const initialState = {
  group: {
    ID: null,
    contact_address: [],
    coaches: {
      values: [],
    },
    geonames: {
      values: [],
    },
    people_groups: {
      values: [],
    },
    parent_groups: {
      values: [],
    },
    peer_groups: {
      values: [],
    },
    child_groups: {
      values: [],
    },
  },
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

function formatDateToBackEnd(dateValue) {
  if (dateValue) {
    if (typeof dateValue.getMonth === 'function') {
      let date = dateValue;
      let month = date.getMonth();
      month = month + 1 < 10 ? `0${month + 1}` : month + 1;
      let day = date.getDate();
      day = day < 10 ? `0${day}` : day;
      date = `${date.getFullYear()}-${month}-${day}`;
      return date;
    }
    if (typeof dateValue === 'string') {
      return dateValue;
    }
  }
  return null;
}

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
      group: group || prevState.group,
      loading,
      comments: comments || prevState.comments,
      totalComments: totalComments || prevState.totalComments,
      loadComments: loadingComments,
      activities: activities || prevState.activities,
      totalActivities: totalActivities || prevState.totalActivities,
      loadActivities: loadingActivities,
    };

    // NEW COMMENT
    if (newComment) {
      newState.comments.unshift(newComment);
      newState = {
        ...newState,
        comments: newState.comments,
      };
    }

    // GET BY ID
    if (group) {
      // Update group status select color
      let newColor = '';
      if (group.group_status === 'inactive') {
        newColor = '#d9534f';
      } else if (group.group_status === 'active') {
        newColor = '#5cb85c';
      }
      newState = {
        ...newState,
        groupStatusBackgroundColor: newColor,
      };
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
      // Highlight Updates -> Compare prevState.contact with contact and show differences
      navigation.setParams({ groupName: group.title });
    }

    // GROUP SAVE
    if (saved && prevProps.saved !== saved) {
      this.onRefreshCommentsActivities(group.ID);
      toastSuccess.show(
        <View>
          <Text style={{ color: '#FFFFFF' }}>{i18n.t('global.success.save')}</Text>
        </View>,
        3000,
      );
      this.onDisableEdit();
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
    /* eslint-disable */
    const { groupId, onlyView, groupName } = navigation.state.params;
    if (groupId) {
      this.setState(prevState => ({
        group: {
          ...prevState.group,
          ID: groupId,
        },
      }));
      navigation.setParams({ groupName });
    }
    if (onlyView) {
      this.setState({
        onlyView,
      });
    }
    /* eslint-enable */
    this.getLists();
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
      this.getGroupActivities(groupId);
    });
  }

  setCurrentTabIndex(index) {
    // Timeout to resolve the "tab content no rendered" issue
    setTimeout(() => {
      this.setState({ currentTabIndex: index, groupsTabActive: false });
    }, 0);
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
      if (this.state.group.ID) {
        this.onRefresh(this.state.group.ID);
      }
    });
  };

  getGroupById(groupId) {
    this.props.getById(this.props.userData.domain, this.props.userData.token, groupId);
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
    const { currentTabIndex } = this.state;
    this.setState({
      onlyView: true,
      currentTabIndex: 0,
    }, () => {
      this.setCurrentTabIndex(currentTabIndex);
    });
    this.props.navigation.setParams({ hideTabBar: false });
  }

  setGroupName = (value) => {
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
        start_date: value,
      },
    }));
  };

  setEndDate = (value) => {
    this.setState(prevState => ({
      group: {
        ...prevState.group,
        end_date: value,
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
    const contactAddress = this.state.group.contact_address;
    contactAddress.push({
      value: '',
    });
    this.setState(prevState => ({
      group: {
        ...prevState.group,
        contact_address: contactAddress,
      },
    }));
  };

  onAddressFieldChange = (value, index, dbIndex, component) => {
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
      ...prevState,
      group: {
        ...prevState.group,
        contact_address: contactAddressList,
      },
    }));
  };

  onCheckExistingHealthMetric = (metricName) => {
    const healthMetrics = this.state.group.health_metrics
      ? this.state.group.health_metrics.values
      : [];
    const foundhealthMetric = healthMetrics.some(
      metric => metric.value === metricName,
    );
    return foundhealthMetric;
  };

  onHealthMetricChange = (metricName) => {
    const healthMetrics2 = this.state.group.health_metrics
      ? this.state.group.health_metrics.values
      : [];
    const foundhealthMetric = healthMetrics2.find(
      metric => metric.value === metricName,
    );
    if (foundhealthMetric) {
      const healthMetricIndex = healthMetrics2.indexOf(foundhealthMetric);
      healthMetrics2.splice(healthMetricIndex, 1);
    } else {
      healthMetrics2.push({
        value: metricName,
      });
    }
    this.setState(prevState => ({
      group: {
        ...prevState.group,
        health_metrics: {
          values: healthMetrics2,
        },
      },
    }));
  };

  setCoaches = () => {
    const dataBaseCoaches = [...this.state.group.coaches.values];

    const localCoaches = [];
    const selectedValues = coachesSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const coach = selectedValues.entities.item[itemValue];
      localCoaches.push(coach);
    });

    const coachToSave = localCoaches.filter((localCoach) => {
      const foundLocalInDataBase = dataBaseCoaches.find(dataBaseCoach => dataBaseCoach.value === localCoach.value);
      return foundLocalInDataBase === undefined;
    }).map(coach => ({ value: coach.value }));

    dataBaseCoaches.forEach((dataBaseCoach) => {
      const dataBaseInLocal = localCoaches.find(localCoach => dataBaseCoach.value === localCoach.value);
      if (!dataBaseInLocal) {
        coachToSave.push({ value: dataBaseCoach.value, delete: true });
      }
    });

    return coachToSave;
  };

  setGeonames = () => {
    const dataBaseGeonames = [...this.state.group.geonames.values];

    const localGeonames = [];
    const selectedValues = geonamesSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const geoname = selectedValues.entities.item[itemValue];
      localGeonames.push(geoname);
    });

    const geonamesToSave = localGeonames.filter((localGeoname) => {
      const foundLocalInDataBase = dataBaseGeonames.find(dataBaseGeoname => dataBaseGeoname.value === localGeoname.value);
      return foundLocalInDataBase === undefined;
    }).map(geoname => ({ value: geoname.value }));

    dataBaseGeonames.forEach((dataBaseGeoname) => {
      const dataBaseInLocal = localGeonames.find(localGeoname => dataBaseGeoname.value === localGeoname.value);
      if (!dataBaseInLocal) {
        geonamesToSave.push({ value: dataBaseGeoname.value, delete: true });
      }
    });

    return geonamesToSave;
  };

  setPeopleGroups = () => {
    const dataBasePeopleGroups = [...this.state.group.people_groups.values];

    const localPeopleGroups = [];
    const selectedValues = peopleGroupsSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const peopleGroup = selectedValues.entities.item[itemValue];
      localPeopleGroups.push(peopleGroup);
    });

    const peopleGroupsToSave = localPeopleGroups.filter((localPeopleGroup) => {
      const foundLocalInDataBase = dataBasePeopleGroups.find(dataBasePeopleGroup => dataBasePeopleGroup.value === localPeopleGroup.value);
      return foundLocalInDataBase === undefined;
    }).map(peopleGroup => ({ value: peopleGroup.value }));

    dataBasePeopleGroups.forEach((dataBasePeopleGroup) => {
      const dataBaseInLocal = localPeopleGroups.find(localPeopleGroup => dataBasePeopleGroup.value === localPeopleGroup.value);
      if (!dataBaseInLocal) {
        peopleGroupsToSave.push({ value: dataBasePeopleGroup.value, delete: true });
      }
    });

    return peopleGroupsToSave;
  };

  setComment = (value) => {
    this.setState({
      comment: value,
    });
  };

  setParentGroups = () => {
    const dataBasePeopleGroups = [...this.state.group.parent_groups.values];

    const localPeopleGroups = [];
    const selectedValues = parentGroupsSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const parentGroup = selectedValues.entities.item[itemValue];
      localPeopleGroups.push(parentGroup);
    });

    const parentGroupsToSave = localPeopleGroups.filter((localPeopleGroup) => {
      const foundLocalInDataBase = dataBasePeopleGroups.find(dataBasePeopleGroup => dataBasePeopleGroup.value === localPeopleGroup.value);
      return foundLocalInDataBase === undefined;
    }).map(parentGroup => ({ value: parentGroup.value }));

    dataBasePeopleGroups.forEach((dataBasePeopleGroup) => {
      const dataBaseInLocal = localPeopleGroups.find(localPeopleGroup => dataBasePeopleGroup.value === localPeopleGroup.value);
      if (!dataBaseInLocal) {
        parentGroupsToSave.push({ value: dataBasePeopleGroup.value, delete: true });
      }
    });

    return parentGroupsToSave;
  }

  setPeerGroups = () => {
    const dataBasePeopleGroups = [...this.state.group.peer_groups.values];

    const localPeopleGroups = [];
    const selectedValues = peerGroupsSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const peerGroup = selectedValues.entities.item[itemValue];
      localPeopleGroups.push(peerGroup);
    });

    const peerGroupsToSave = localPeopleGroups.filter((localPeopleGroup) => {
      const foundLocalInDataBase = dataBasePeopleGroups.find(dataBasePeopleGroup => dataBasePeopleGroup.value === localPeopleGroup.value);
      return foundLocalInDataBase === undefined;
    }).map(peerGroup => ({ value: peerGroup.value }));

    dataBasePeopleGroups.forEach((dataBasePeopleGroup) => {
      const dataBaseInLocal = localPeopleGroups.find(localPeopleGroup => dataBasePeopleGroup.value === localPeopleGroup.value);
      if (!dataBaseInLocal) {
        peerGroupsToSave.push({ value: dataBasePeopleGroup.value, delete: true });
      }
    });

    return peerGroupsToSave;
  }

  setChildGroups = () => {
    const dataBaseChildGroups = [...this.state.group.child_groups.values];

    const localChildGroups = [];
    const selectedValues = childGroupsSelectizeRef.getSelectedItems();
    Object.keys(selectedValues.entities.item).forEach((itemValue) => {
      const childGroup = selectedValues.entities.item[itemValue];
      localChildGroups.push(childGroup);
    });

    const childGroupsToSave = localChildGroups.filter((localChildGroup) => {
      const foundLocalInDataBase = dataBaseChildGroups.find(dataBaseChildGroup => dataBaseChildGroup.value === localChildGroup.value);
      return foundLocalInDataBase === undefined;
    }).map(childGroup => ({ value: childGroup.value }));

    dataBaseChildGroups.forEach((dataBaseChildGroup) => {
      const dataBaseInLocal = localChildGroups.find(localChildGroup => dataBaseChildGroup.value === localChildGroup.value);
      if (!dataBaseInLocal) {
        childGroupsToSave.push({ value: dataBaseChildGroup.value, delete: true });
      }
    });

    return childGroupsToSave;
  }

  onSaveGroup = () => {
    Keyboard.dismiss();
    const groupToSave = JSON.parse(JSON.stringify(this.state.group));
    if (Object.prototype.hasOwnProperty.call(groupToSave, 'start_date')) {
      groupToSave.start_date = formatDateToBackEnd(groupToSave.start_date);
    }
    if (Object.prototype.hasOwnProperty.call(groupToSave, 'end_date')) {
      groupToSave.end_date = formatDateToBackEnd(groupToSave.end_date);
    }
    if (Object.prototype.hasOwnProperty.call(groupToSave, 'coaches') && coachesSelectizeRef) {
      groupToSave.coaches.values = this.setCoaches();
    }
    if (Object.prototype.hasOwnProperty.call(groupToSave, 'geonames') && geonamesSelectizeRef) {
      groupToSave.geonames.values = this.setGeonames();
    }
    if (Object.prototype.hasOwnProperty.call(groupToSave, 'people_groups') && peopleGroupsSelectizeRef) {
      groupToSave.people_groups.values = this.setPeopleGroups();
    }
    if (Object.prototype.hasOwnProperty.call(groupToSave, 'parent_groups') && parentGroupsSelectizeRef) {
      groupToSave.parent_groups.values = this.setParentGroups();
    }
    if (Object.prototype.hasOwnProperty.call(groupToSave, 'peer_groups') && peerGroupsSelectizeRef) {
      groupToSave.peer_groups.values = this.setPeerGroups();
    }
    if (Object.prototype.hasOwnProperty.call(groupToSave, 'child_groups') && childGroupsSelectizeRef) {
      groupToSave.child_groups.values = this.setChildGroups();
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
    const foundUser = this.state.users.find(
      user => `user-${user.key}` === this.state.group.assigned_to,
    );
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
                              {i18n.t('groupDetailScreen.healthMetrics.giving')}
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
                              {i18n.t('groupDetailScreen.healthMetrics.fellowship')}
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
                              {i18n.t('groupDetailScreen.healthMetrics.communion')}
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
                              {i18n.t('groupDetailScreen.healthMetrics.baptism')}
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
                              {i18n.t('groupDetailScreen.healthMetrics.prayer')}
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
                              {i18n.t('groupDetailScreen.healthMetrics.leaders')}
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
                              {i18n.t('groupDetailScreen.healthMetrics.bibleStudy')}
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
                              {i18n.t('groupDetailScreen.healthMetrics.praise')}
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
                              {i18n.t('groupDetailScreen.healthMetrics.sharingGospel')}
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
                              {i18n.t('global.status')}
                            </Label>
                            <Row style={[styles.formRow, { paddingTop: 5 }]}>
                              <Col>
                                <Picker
                                  selectedValue={
                                    this.state.group.group_status
                                  }
                                  onValueChange={this.setGroupStatus}
                                  style={{
                                    color: '#ffffff',
                                    backgroundColor: this.state.groupStatusBackgroundColor,
                                  }}
                                >
                                  <Picker.Item label={i18n.t('global.groupStatus.active')} value="active" />
                                  <Picker.Item label={i18n.t('global.groupStatus.inactive')} value="inactive" />
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
                                  {i18n.t('global.assignedTo')}
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
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>{this.state.group.coaches.values.map(coach => `${coach.name}, `)}</Text>
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>
                                  {i18n.t('groupDetailScreen.groupCoach')}
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
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>{this.state.group.geonames.values.map(geoname => `${geoname.name}, `)}</Text>
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>
                                  {i18n.t('global.location')}
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
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>{this.state.group.people_groups.values.map(peopleGroup => `${peopleGroup.name}, `)}</Text>
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>
                                  {i18n.t('global.peopleGroup')}
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
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>{this.state.group.contact_address.map(contactAddress => `${contactAddress.value}, `)}</Text>
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
                                  {this.state.group.start_date}
                                </Text>
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>
                                  {i18n.t('groupDetailScreen.startDate')}
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
                                  {this.state.group.end_date}
                                </Text>
                              </Col>
                              <Col style={styles.formParentLabel}>
                                <Label style={styles.formLabel}>
                                  {i18n.t('groupDetailScreen.endDate')}
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
                                <Text style={{ marginTop: 'auto', marginBottom: 'auto' }}>{i18n.t(`global.groupType.${this.state.group.group_type}`)}</Text>
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
                                  {i18n.t('groupDetailScreen.parentGroup')}
                                </Label>
                              </Col>
                              <Col />
                            </Row>
                            <Row style={[styles.groupCircleParentContainer, { overflowX: 'auto' }]}>
                              <ScrollView horizontal>
                                {this.state.group.parent_groups.values.map((parentGroup, index) => (
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
                                        {parentGroup.name}
                                      </Text>
                                    </Row>
                                    <Row
                                      style={styles.groupCircleCounter}
                                    >
                                      <Text>{parentGroup.baptizedCount}</Text>
                                    </Row>
                                    <Row
                                      style={[styles.groupCircleCounter, { marginTop: '5%' }]}
                                    >
                                      <Text>{parentGroup.memberCount}</Text>
                                    </Row>
                                  </Col>
                                ))}
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
                                {this.state.group.child_groups.values.map((childGroup, index) => (
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
                                        {childGroup.name}
                                      </Text>
                                    </Row>
                                    <Row
                                      style={styles.groupCircleCounter}
                                    >
                                      <Text>{childGroup.baptizedCount}</Text>
                                    </Row>
                                    <Row
                                      style={[styles.groupCircleCounter, { marginTop: '5%' }]}
                                    >
                                      <Text>{childGroup.memberCount}</Text>
                                    </Row>
                                  </Col>
                                ))}
                              </ScrollView>
                            </Row>
                            <View style={[styles.formDivider, styles.formDivider2Margin]} />
                            <Row style={styles.formRow}>
                              <Col style={[styles.formIconLabel, styles.formIconLabelMarginLeft]}>
                                <Label style={styles.formLabel}>
                                  {i18n.t('groupDetailScreen.peerGroup')}
                                </Label>
                              </Col>
                              <Col />
                            </Row>
                            <Row style={[styles.groupCircleParentContainer, { overflowX: 'auto' }]}>
                              <ScrollView horizontal>
                                {this.state.group.peer_groups.values.map((peerGroup, index) => (
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
                                        {peerGroup.name}
                                      </Text>
                                    </Row>
                                    <Row
                                      style={styles.groupCircleCounter}
                                    >
                                      <Text>{peerGroup.baptizedCount}</Text>
                                    </Row>
                                    <Row
                                      style={[styles.groupCircleCounter, { marginTop: '5%' }]}
                                    >
                                      <Text>{peerGroup.memberCount}</Text>
                                    </Row>
                                  </Col>
                                ))}
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
                                        {i18n.t('global.assignedTo')}
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
                                      selectedItems={this.state.group.coaches.values}
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
                                      {i18n.t('global.location')}
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
                                      selectedItems={this.state.group.geonames.values}
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
                                      {i18n.t('global.peopleGroup')}
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
                                      selectedItems={this.state.group.people_groups.values}
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
                                {this.state.group.contact_address.map(
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
                                    <Label
                                      style={styles.formLabel}
                                    >
                                      {i18n.t('groupDetailScreen.startDate')}
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
                                      defaultDate={(this.state.group.start_date.length > 0) ? new Date(this.state.group.start_date) : ''}
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
                                      {i18n.t('groupDetailScreen.endDate')}
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
                                      defaultDate={(this.state.group.end_date.length > 0) ? new Date(this.state.group.end_date) : ''}
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
                                      {i18n.t('groupDetailScreen.groupType')}
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
                                      <Picker.Item label={i18n.t('global.groupType.pre-group')} value="pre-group" />
                                      <Picker.Item label={i18n.t('global.groupType.group')} value="group" />
                                      <Picker.Item label={i18n.t('global.groupType.church')} value="church" />
                                      <Picker.Item label={i18n.t('global.groupType.team')} value="team" />
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
                                      {i18n.t('groupDetailScreen.parentGroup')}
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
                                      selectedItems={this.state.group.parent_groups.values}
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
                                      {i18n.t('groupDetailScreen.childGroup')}
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
                                      selectedItems={this.state.group.child_groups.values}
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
                                      {i18n.t('groupDetailScreen.peerGroup')}
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
                                      selectedItems={this.state.group.peer_groups.values}
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
                        value={this.state.group.title}
                        onChangeText={this.setGroupName}
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
                        {i18n.t('global.requiredField')}
                      </Label>
                    </Row>
                    <Row>
                      <Picker
                        mode="dropdown"
                        selectedValue={this.state.group.group_type}
                        onValueChange={this.setGroupType}
                      >
                        <Picker.Item label={i18n.t('global.groupType.pre-group')} value="pre-group" />
                        <Picker.Item label={i18n.t('global.groupType.group')} value="group" />
                        <Picker.Item label={i18n.t('global.groupType.church')} value="church" />
                        <Picker.Item label={i18n.t('global.groupType.team')} value="team" />
                      </Picker>
                    </Row>
                  </Grid>
                  <Button block style={styles.saveButton} onPress={this.onSaveGroup}>
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Save</Text>
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
    ID: PropTypes.number,
    title: PropTypes.string,
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
  groupsReducerError: PropTypes.shape({
    code: PropTypes.string,
    message: PropTypes.string,
  }),
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
    setParams: PropTypes.func.isRequired,
  }).isRequired,
  getById: PropTypes.func.isRequired,
  saveGroup: PropTypes.func.isRequired,
  getComments: PropTypes.func.isRequired,
  saveComment: PropTypes.func.isRequired,
  getActivities: PropTypes.func.isRequired,
  saved: PropTypes.bool,
};

GroupDetailScreen.defaultProps = {
  group: null,
  userReducerError: null,
  newComment: null,
  groupsReducerError: null,
  saved: null,
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
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(GroupDetailScreen);
