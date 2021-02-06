import React from 'react';
import { connect } from 'react-redux';
import { View, FlatList, TouchableOpacity, RefreshControl, StyleSheet, Text } from 'react-native';
import { Fab, Container } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast';
import SearchBar from '../../components/SearchBar';

import PropTypes from 'prop-types';
import Colors from '../../constants/Colors';
import { getAll, updatePrevious } from '../../store/actions/contacts.actions';
import i18n from '../../languages';
import sharedTools from '../../shared';

const styles = StyleSheet.create({
  flatListItem: {
    height: 40 /* this needs auto sizing */,
    margin: 20,
    marginTop: 10,
    paddingBottom: 10,
  },
  contactSubtitle: {
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
  statusCircleSize = 15;

class ContactsScreen extends React.Component {
  state = {
    dataSourceContact: [],
    offset: 0,
    limit: sharedTools.paginationLimit,
    sort: '-last_modified',
    filtered: false,
    filterOption: null,
    filterText: null,
    fixFABIndex: false,
  };

  static navigationOptions = {
    title: i18n.t('contactsScreen.contacts'),
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
    const { contacts, filteredContacts } = nextProps;
    let { filtered } = prevState;

    let newState = {
      ...prevState,
    };

    if (filtered) {
      newState = {
        ...newState,
        dataSourceContact: [...filteredContacts],
      };
    } else {
      newState = {
        ...newState,
        dataSourceContact: [...contacts],
      };
    }

    return newState;
  }

  componentDidUpdate(prevProps) {
    const { error, filteredContacts, isConnected } = this.props;
    const { filtered } = this.state;

    if (
      filteredContacts &&
      filteredContacts !== prevProps.filteredContacts &&
      filteredContacts.length === 0 &&
      filtered &&
      !isConnected
    ) {
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
        {this.props.isConnected && this.state.offset + this.state.limit < this.props.totalContacts && (
          <TouchableOpacity
            onPress={() => {
              this.onRefresh(true);
            }}>
            <Text style={styles.loadMoreFooterText}>{i18n.t('notificationsScreen.loadMore')}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  renderRow = (contact) => (
    <TouchableOpacity
      onPress={() => this.goToContactDetailScreen(contact)}
      style={styles.flatListItem}
      key={contact.ID}>
      <View style={{ flexDirection: 'row', height: '100%' }}>
        <View style={{ flexDirection: 'column', flexGrow: 1 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={[{ textAlign: 'left', flex: 1, flexWrap: 'wrap', fontWeight: 'bold' }]}>
              {Object.prototype.hasOwnProperty.call(contact, 'name') ? contact.name : contact.title}
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[
                styles.contactSubtitle,
                {
                  textAlign: 'left',
                },
              ]}>
              {this.props.contactSettings.fields.overall_status.values[contact.overall_status]
                ? this.props.contactSettings.fields.overall_status.values[contact.overall_status]
                    .label
                : ''}
              {this.props.contactSettings.fields.overall_status.values[contact.overall_status] &&
              this.props.contactSettings.fields.seeker_path.values[contact.seeker_path]
                ? ' • '
                : ''}
              {this.props.contactSettings.fields.seeker_path.values[contact.seeker_path]
                ? this.props.contactSettings.fields.seeker_path.values[contact.seeker_path].label
                : ''}
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
              backgroundColor: sharedTools.getSelectorColor(contact.overall_status),
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
        marginTop: 5,
      }}
    />
  );

  onRefresh = (increasePagination = false, returnFromDetail = false) => {
    let newState = {
      offset: increasePagination ? this.state.offset + this.state.limit : 0,
    };
    this.setState(
      (prevState) => {
        return returnFromDetail ? prevState : newState;
      },
      () => {
        let filter = {};
        // Add pagination on ONLINE mode
        if (this.props.isConnected) {
          filter = {
            offset: this.state.offset,
            limit: this.state.limit,
            sort: this.state.sort,
          };
        }
        if (this.state.filtered) {
          filter = {
            ...filter,
            filtered: true,
          };
          if (this.state.filterOption) {
            filter = {
              ...filter,
              ...this.state.filterOption,
              filterOption: true,
            };
          } else if (this.state.filterText) {
            filter = {
              ...filter,
              name: this.state.filterText,
              sort: 'name',
              filterText: true,
            };
          }
        }
        this.props.getAllContacts(this.props.userData.domain, this.props.userData.token, filter);
      },
    );
  };

  goToContactDetailScreen = (contactData = null) => {
    if (contactData) {
      this.props.updatePrevious([
        {
          contactId: parseInt(contactData.ID),
          onlyView: true,
          contactName: contactData.title,
        },
      ]);
      // Detail
      this.props.navigation.navigate('ContactDetail', {
        contactId: contactData.ID,
        onlyView: true,
        contactName: contactData.title,
        onGoBack: () => this.onRefresh(false, true),
      });
    } else {
      this.props.updatePrevious([]);
      // Create
      this.props.navigation.navigate('ContactDetail', {
        onlyView: true,
        onGoBack: () => this.onRefresh(false, true),
      });
    }
  };

  selectOptionFilter = (selectedFilter) => {
    this.setState(
      {
        filtered: true,
        filterText: null,
        filterOption: selectedFilter,
      },
      () => {
        this.onRefresh(false);
      },
    );
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
          this.onRefresh(false);
        },
      );
    } else {
      this.setState(
        {
          filtered: false,
          filterText: null,
          filterOption: null,
        },
        () => {
          this.onRefresh();
        },
      );
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
            filterConfig={this.props.contactFilters}
            onSelectFilter={this.selectOptionFilter}
            onTextFilter={this.filterByText}
            onClearTextFilter={this.filterByText}
            onLayout={this.onLayout}></SearchBar>
          <FlatList
            data={this.state.dataSourceContact}
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
            onPress={() => this.goToContactDetailScreen()}>
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

ContactsScreen.propTypes = {
  isConnected: PropTypes.bool,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  userData: PropTypes.shape({
    domain: PropTypes.string,
    token: PropTypes.string,
  }).isRequired,
  getAllContacts: PropTypes.func.isRequired,
  /* eslint-disable */
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.number,
    }),
  ).isRequired,
  /* eslint-enable */
  error: PropTypes.shape({
    code: PropTypes.any,
    message: PropTypes.string,
  }),
  loading: PropTypes.bool,
  contactSettings: PropTypes.shape({
    fields: PropTypes.shape({
      overall_status: PropTypes.shape({
        values: PropTypes.shape({}),
      }),
      seeker_path: PropTypes.shape({
        values: PropTypes.shape({}),
      }),
      labelPlural: PropTypes.string,
    }),
  }),
};
ContactsScreen.defaultProps = {
  error: null,
  loading: false,
  contactSettings: null,
  isConnected: null,
  contacts: [],
};

const mapStateToProps = (state) => ({
  userData: state.userReducer.userData,
  contacts: state.contactsReducer.contacts,
  loading: state.contactsReducer.loading,
  error: state.contactsReducer.error,
  contactSettings: state.contactsReducer.settings,
  isConnected: state.networkConnectivityReducer.isConnected,
  contactFilters: state.usersReducer.contactFilters,
  totalContacts: state.contactsReducer.total,
  filteredContacts: state.contactsReducer.filteredContacts,
});
const mapDispatchToProps = (dispatch) => ({
  getAllContacts: (domain, token, offset, limit, sort) => {
    dispatch(getAll(domain, token, offset, limit, sort));
  },
  updatePrevious: (previousContacts) => {
    dispatch(updatePrevious(previousContacts));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsScreen);
