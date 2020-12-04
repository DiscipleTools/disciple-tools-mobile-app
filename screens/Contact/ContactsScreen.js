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
  statusCircleSize = 15,
  searchBarRef;

class ContactsScreen extends React.Component {
  state = {
    dataSourceContact: [],
    dataSourceContactsFiltered: [],
    offset: 0,
    limit: sharedTools.paginationLimit,
    sort: '-last_modified',
    filtered: false,
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
      this.selectFilter(customFilter);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { contacts } = nextProps;

    let newState = {
      ...prevState,
    };

    if (contacts) {
      if (prevState.filtered) {
        newState = {
          ...newState,
          dataSourceContact: prevState.dataSourceContactsFiltered,
        };
      } else {
        newState = {
          ...newState,
          dataSourceContact: contacts,
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
        {this.props.isConnected && !this.state.filtered && (
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
              {contact.title}
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
      filtered: false,
    };
    if (returnFromDetail) {
      // Execute filter again to update render of current filter!
      searchBarRef.refreshFilter();
    } else {
      // Only clean filters on refresh
      searchBarRef.resetFilters();
    }
    this.setState(
      (prevState) => {
        return returnFromDetail ? prevState : newState;
      },
      () => {
        this.props.getAllContacts(
          this.props.userData.domain,
          this.props.userData.token,
          this.state.offset,
          this.state.limit,
          this.state.sort,
        );
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

  selectFilter = (selectedFilter) => {
    this.setState({
      dataSourceContactsFiltered: sharedTools.contactsByFilter(
        [...this.props.contacts],
        selectedFilter,
      ),
      filtered: true,
    });
  };

  filterByText = (text) => {
    if (text.length > 0) {
      let itemsFiltered = this.props.contacts.filter((item) => {
        let filterByPhone = false;
        let filterByEmail = false;
        const textData = text
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const itemDataTitle = item.title
          .toUpperCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        const filterByTitle = itemDataTitle.includes(textData);

        if (item.contact_phone !== undefined) {
          item.contact_phone.forEach((elements) => {
            const itemDataPhone = elements.value.toUpperCase();
            if (filterByPhone === false) {
              filterByPhone = itemDataPhone.includes(textData);
            }
          });
        }

        if (item.contact_email !== undefined) {
          item.contact_email.forEach((elements) => {
            const itemDataEmail = elements.value.toUpperCase();
            if (filterByEmail === false) {
              filterByEmail = itemDataEmail.includes(textData);
            }
          });
        }
        return filterByTitle || filterByPhone || filterByEmail;
      });
      this.setState({
        dataSourceContactsFiltered: itemsFiltered,
        filtered: true,
      });
    } else {
      this.setState({
        dataSourceContactsFiltered: [],
        filtered: false,
      });
    }
  };

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
            filterConfig={this.props.contactFilters}
            onSelectFilter={this.selectFilter}
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
            positionValue={210}
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
