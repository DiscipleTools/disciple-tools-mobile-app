import React from 'react';
import { connect } from 'react-redux';
import { View, FlatList, TouchableOpacity, RefreshControl, StyleSheet, Text } from 'react-native';
import { Fab, Container } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast';
import PropTypes from 'prop-types';
import SearchBar from '../../components/SearchBar';

import Colors from '../../constants/Colors';
import { getAll, searchGroupsByText, updatePrevious } from '../../store/actions/groups.actions';
import i18n from '../../languages';
import sharedTools from '../../shared';

const styles = StyleSheet.create({
  flatListItem: {
    height: 40 /* this needs auto sizing */,
    margin: 20,
    marginTop: 10,
    paddingBottom: 10,
  },
  groupSubtitle: {
    flex: 1,
    flexWrap: 'wrap',
    paddingTop: 6,
    fontWeight: '200',
    color: 'rgba(0,0,0,0.6)',
  },
  errorText: {
    textAlign: 'center',
    height: 100,
    padding: 20,
    color: 'rgba(0,0,0,0.4)',
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
  loadMoreFooterText: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    color: '#3f729b',
  },
});

let toastError,
  statusCircleSize = 15,
  searchBarRef;

class GroupsScreen extends React.Component {
  state = {
    dataSourceGroups: [],
    dataSourceGroupsFiltered: [],
    offset: 0,
    limit: sharedTools.paginationLimit,
    sort: '-last_modified',
    filtered: false,
    filterOption: null,
    filterText: null,
    fixFABIndex: false,
    isConnected: false,
  };

  static navigationOptions = {
    title: i18n.t('global.groups'),
    headerStyle: {
      backgroundColor: Colors.tintColor,
    },
    headerTintColor: '#FFFFFF',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  componentDidMount() {
    // Recieve custom filters (tag) as param
    const { params } = this.props.navigation.state;
    if (params) {
      const { customFilter } = params;
      this.selectOptionFilter(customFilter);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { groups, isConnected } = nextProps;
    let { filtered, filterOption, filterText } = prevState;

    let newState = {
      ...prevState,
      isConnected,
    };

    if (groups) {
      if (filtered) {
        if (filterOption) {
          // Filter data and set to 'dataSourceGroups'
          newState = {
            ...newState,
            dataSourceGroups: sharedTools.groupsByFilter([...groups], filterOption),
          };
        } else if (filterText) {
          newState = {
            ...newState,
            dataSourceGroups: groups.filter(function (item) {
              const textData = filterText
                .toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
              const itemDataTitle = item.title
                .toUpperCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');
              return itemDataTitle.includes(textData);
            }),
          };
          if (newState.dataSourceGroups.length === 0 && !isConnected) {
            toastError.show(
              <View>
                <Text style={{ fontWeight: 'bold', color: Colors.errorText }}>
                  {i18n.t('global.error.text')}
                </Text>
                <Text style={{ color: Colors.errorText }}>{i18n.t('global.error.noRecords')}</Text>
              </View>,
              6000,
            );
          }
        }
      } else {
        newState = {
          ...newState,
          dataSourceGroups: groups,
        };
      }
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    const { error } = this.props;
    if (prevProps.error !== error && error) {
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

  renderFooter = () => {
    return (
      <View style={styles.loadMoreFooterText}>
        {this.props.isConnected &&
          !this.state.filtered &&
          this.state.offset + this.state.limit < this.props.totalGroups && (
            <TouchableOpacity
              onPress={() => {
                this.onRefresh(true);
              }}>
              <Text style={styles.loadMoreFooterText}>
                {i18n.t('notificationsScreen.loadMore')}
              </Text>
            </TouchableOpacity>
          )}
      </View>
    );
  };

  renderRow = (group) => (
    <TouchableOpacity
      onPress={() => this.goToGroupDetailScreen(group)}
      style={styles.flatListItem}
      key={group.ID}>
      <View style={{ flexDirection: 'row', height: '100%' }}>
        <View style={{ flexDirection: 'column', flexGrow: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ textAlign: 'left', flex: 1, flexWrap: 'wrap', fontWeight: 'bold' }}>
              {Object.prototype.hasOwnProperty.call(group, 'name') ? group.name : group.title}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[
                styles.groupSubtitle,
                {
                  textAlign: 'left',
                },
              ]}>
              {this.props.groupSettings.fields.group_status.values[group.group_status]
                ? this.props.groupSettings.fields.group_status.values[group.group_status].label
                : ''}
              {this.props.groupSettings.fields.group_status.values[group.group_status] &&
              this.props.groupSettings.fields.group_type.values[group.group_type]
                ? ' • '
                : ''}
              {this.props.groupSettings.fields.group_type.values[group.group_type]
                ? this.props.groupSettings.fields.group_type.values[group.group_type].label
                : ''}
              {this.props.groupSettings.fields.group_type.values[group.group_type] &&
              group.member_count
                ? ' • '
                : ''}
              {group.member_count ? group.member_count : ''}
            </Text>
          </View>
        </View>
        <View
          style={[
            {
              flexDirection: 'column',
              width: statusCircleSize,
              paddingTop: 0,
              marginTop: 'auto',
              marginBottom: 'auto',
            },
            this.props.isRTL ? { marginRight: 5 } : { marginLeft: 5 },
          ]}>
          <View
            style={{
              width: statusCircleSize,
              height: statusCircleSize,
              borderRadius: statusCircleSize / 2,
              backgroundColor: sharedTools.getSelectorColor(group.group_status),
              marginTop: 'auto',
              marginBottom: 'auto',
            }}></View>
        </View>
      </View>
    </TouchableOpacity>
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

  onRefresh = (increasePagination = false, returnFromDetail = false) => {
    let newState = {
      offset: increasePagination ? this.state.offset + this.state.limit : 0,
    };
    // Execute filter again to update render of current filter!
    searchBarRef.refreshFilter();
    this.setState(
      (prevState) => {
        return returnFromDetail ? prevState : newState;
      },
      () => {
        this.props.getAllGroups(
          this.props.userData.domain,
          this.props.userData.token,
          this.state.offset,
          this.state.limit,
          this.state.sort,
        );
      },
    );
  };

  goToGroupDetailScreen = (groupData = null) => {
    if (groupData) {
      this.props.updatePrevious([
        {
          groupId: parseInt(groupData.ID),
          onlyView: true,
          groupName: groupData.title,
        },
      ]);
      // Detail
      this.props.navigation.navigate('GroupDetail', {
        groupId: groupData.ID,
        onlyView: true,
        groupName: groupData.title,
        onGoBack: () => this.onRefresh(false, true),
      });
    } else {
      this.props.updatePrevious([]);
      // Create
      this.props.navigation.navigate('GroupDetail', {
        onlyView: true,
        onGoBack: () => this.onRefresh(false, true),
      });
    }
  };

  selectOptionFilter = (selectedFilter) => {
    this.setState({
      filtered: true,
      filterText: null,
      filterOption: selectedFilter,
    });
  };

  filterByText = sharedTools.debounce((queryText) => {
    if (queryText.length > 0) {
      this.setState(
        {
          filtered: true,
          filterText: queryText,
          filterOption: null,
        },
        () => {
          // Only do request if phone is ONLINE
          if (this.props.isConnected) {
            this.props.searchGroupsByText(
              this.props.userData.domain,
              this.props.userData.token,
              queryText,
              this.state.sort,
            );
          }
        },
      );
    } else {
      this.setState({
        filtered: false,
        filterText: null,
        filterOption: null,
      });
    }
  }, 750);

  onLayout = (fabIndexFix) => {
    if (fabIndexFix !== this.state.fixFABIndex) {
      this.setState({
        fixFABIndex: fabIndexFix,
      });
    }
  };

  offlineBarRender = () => (
    <View style={[styles.offlineBar]}>
      <Text style={[styles.offlineBarText]}>{i18n.t('global.offline')}</Text>
    </View>
  );

  render() {
    return (
      <Container>
        <View style={{ flex: 1 }}>
          {!this.props.isConnected && this.offlineBarRender()}
          <SearchBar
            ref={(ref) => {
              searchBarRef = ref;
            }}
            filterConfig={this.props.groupFilters}
            onSelectFilter={this.selectOptionFilter}
            onTextFilter={this.filterByText}
            onClearTextFilter={this.filterByText}
            onLayout={this.onLayout}></SearchBar>
          <FlatList
            data={this.state.dataSourceGroups}
            renderItem={(item) => this.renderRow(item.item)}
            ItemSeparatorComponent={this.flatListItemSeparator}
            keyboardShouldPersistTaps="always"
            refreshControl={
              <RefreshControl refreshing={this.props.loading} onRefresh={this.onRefresh} />
            }
            ListFooterComponent={this.renderFooter}
            keyExtractor={(item) => item.ID.toString()}
            style={{ backgroundColor: Colors.mainBackgroundColor }}
          />
          <Fab
            style={[
              { backgroundColor: Colors.tintColor },
              this.state.fixFABIndex ? { zIndex: -1 } : {},
            ]}
            position="bottomRight"
            onPress={() => this.goToGroupDetailScreen()}>
            <Icon name="md-add" />
          </Fab>
          <Toast
            ref={(toast) => {
              toastError = toast;
            }}
            style={{ backgroundColor: Colors.errorBackground }}
            positionValue={290}
          />
        </View>
      </Container>
    );
  }
}

GroupsScreen.propTypes = {
  isConnected: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  userData: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  getAllGroups: PropTypes.func.isRequired,
  /* eslint-disable */
  groups: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ),
  /* eslint-enable */
  error: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.string,
  }),
  loading: PropTypes.bool,
  groupSettings: PropTypes.shape({
    group_status: PropTypes.shape({
      values: PropTypes.shape({}),
    }),
    group_type: PropTypes.shape({
      values: PropTypes.shape({}),
    }),
    labelPlural: PropTypes.string,
  }),
};
GroupsScreen.defaultProps = {
  error: null,
  loading: false,
  groupSettings: null,
  isConnected: null,
};

const mapStateToProps = (state) => ({
  userData: state.userReducer.userData,
  groups: state.groupsReducer.groups,
  loading: state.groupsReducer.loading,
  error: state.groupsReducer.error,
  groupSettings: state.groupsReducer.settings,
  isConnected: state.networkConnectivityReducer.isConnected,
  groupFilters: state.usersReducer.groupFilters,
  totalGroups: state.groupsReducer.total,
});
const mapDispatchToProps = (dispatch) => ({
  getAllGroups: (domain, token, offset, limit, sort) => {
    dispatch(getAll(domain, token, offset, limit, sort));
  },
  updatePrevious: (previousGroups) => {
    dispatch(updatePrevious(previousGroups));
  },
  searchGroupsByText: (domain, token, text, sort) => {
    dispatch(searchGroupsByText(domain, token, text, sort));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupsScreen);
