import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Text,
  Image,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Fab, Container, Item, Input } from 'native-base';
import { Row } from 'react-native-easy-grid';
import { MaterialIcons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast';
import Accordion from 'react-native-collapsible/Accordion';
import { CheckBox } from 'react-native-elements';

import PropTypes from 'prop-types';
import Colors from '../../constants/Colors';
import { getAll, updatePrevious } from '../../store/actions/contacts.actions';
import dtIcon from '../../assets/images/dt-icon.png';
import i18n from '../../languages';
import sharedTools from '../../shared';

const styles = StyleSheet.create({
  flatListItem: {
    height: 40 /* this needs auto sizing */,
    backgroundColor: 'white',
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
  searchBarContainer: {
    borderBottomWidth: 1,
    backgroundColor: Colors.tabBar,
    borderBottomColor: '#FFF',
  },
  searchBarScrollView: {
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 9,
    minHeight: 60,
  },
  searchBarItem: {
    borderColor: '#DDDDDD',
    borderRadius: 3,
    borderWidth: 10,
  },
  searchBarIcons: {
    fontSize: 20,
    color: 'gray',
    padding: 10,
  },
  searchBarInput: {
    color: 'gray',
    height: 41,
    fontSize: 18,
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
  noContactsContainer: {
    padding: 20,
    paddingTop: 50,
    textAlignVertical: 'top',
    textAlign: 'center',
  },
  noContactsImage: {
    opacity: 0.5,
    height: 70,
    width: 70,
    padding: 10,
  },
  noContactsText: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#A8A8A8',
    padding: 5,
  },
  noContactsTextOffilne: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#A8A8A8',
    backgroundColor: '#fff2ac',
    padding: 5,
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
const windowHeight = Dimensions.get('window').height;

class ContactsScreen extends React.Component {
  state = {
    refresh: false,
    search: '',
    dataSourceContact: [],
    dataSourceContactsFiltered: [],
    haveContacts: true,
    offset: 0,
    limit: 5000,
    sort: '-last_modified',
    contacts: [],
    searchBarFilter: {
      toggle: false,
      options: {},
      currentFilter: '',
    },
    activeSections: [],
  };

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

  static getDerivedStateFromProps(nextProps, prevState) {
    const { contacts } = nextProps;
    let newState = {
      ...prevState,
      contacts: contacts || prevState.contacts,
    };
    if (contacts) {
      if (prevState.filtered) {
        newState = {
          ...prevState,
          dataSourceContact: prevState.dataSourceContactsFiltered,
          haveContacts: true,
          refresh: false,
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
      search: '',
      searchBarFilter: {
        ...this.state.searchBarFilter,
        toggle: false,
        currentFilter: '',
      },
    };
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

  showFiltersPanel = () => {
    this.setState((previousState) => ({
      searchBarFilter: {
        ...previousState.searchBarFilter,
        toggle: !previousState.searchBarFilter.toggle,
      },
    }));
  };

  renderSectionHeader = (section, index, isActive, sections) => {
    return (
      <View
        style={[
          {
            backgroundColor: isActive ? Colors.primary : '#FFFFFF',
            height: 50,
            paddingLeft: 15,
            paddingRight: 15,
            flexDirection: 'row',
            borderWidth: 1,
            borderColor: Colors.grayLight,
          },
        ]}>
        <Text
          style={{
            color: isActive ? '#FFFFFF' : Colors.primary,
            marginTop: 'auto',
            marginBottom: 'auto',
            fontWeight: 'bold',
          }}>
          {section.label}
        </Text>
        {section.count ? (
          <Text
            style={{
              color: isActive ? '#FFFFFF' : Colors.primary,
              marginTop: 'auto',
              marginBottom: 'auto',
            }}>
            {` (${section.count})`}
          </Text>
        ) : null}
        <Text
          style={{
            color: isActive ? '#FFFFFF' : Colors.primary,
            marginTop: 'auto',
            marginBottom: 'auto',
            marginLeft: 'auto',
          }}>
          {isActive ? '-' : '+'}
        </Text>
      </View>
    );
  };

  renderSectionContent = (section, index, isActive, sections) => {
    let content = this.props.contactFilters.filters.filter(
      (filter) => filter.tab === section.key && !filter.type,
    );
    return (
      <View
        key={index}
        style={{
          borderWidth: 1,
          borderColor: Colors.grayLight,
          padding: 15,
        }}>
        {content.map((filter) => (
          <TouchableOpacity
            key={filter.ID}
            activeOpacity={0.5}
            onPress={() => {
              this.setState(
                (prevState) => ({
                  searchBarFilter: {
                    ...prevState.searchBarFilter,
                    currentFilter: filter.ID,
                    dataSourceContactsFiltered: [],
                  },
                  // Set input search filters as initial value
                  refresh: false,
                  filtered: false,
                  search: '',
                }),
                () => {
                  let queryFilter = {
                    ...filter.query,
                  };
                  let contactList = [...this.props.contacts];
                  //filter prop does not exist in any object of collection
                  Object.keys(filter.query).forEach((key) => {
                    if (
                      contactList.filter((contact) =>
                        Object.prototype.hasOwnProperty.call(contact, key),
                      ).length === 0
                    ) {
                      delete queryFilter[key];
                    }
                  });
                  let queryFilterTwo = {};
                  // Map json to got 'key: String/Boolean' format
                  Object.keys(queryFilter).forEach((key) => {
                    let value = queryFilter[key];
                    let valueType = Object.prototype.toString.call(value);
                    if (valueType === '[object Array]') {
                      //queryFilterTwo[key] = contact => contact[key] == value[0];
                      queryFilterTwo[key] = value[0];
                    }
                    if (queryFilterTwo[key] === 'me') {
                      if (key == 'assigned_to') {
                        queryFilterTwo[key] = this.props.userData.id;
                      } else {
                        queryFilterTwo[key] = this.props.userData.id.toString();
                      }
                    }
                  });
                  // Remove subassigned query because contacts does not have this value
                  if (Object.prototype.hasOwnProperty.call(queryFilterTwo, 'subassigned')) {
                    delete queryFilterTwo.subassigned;
                  }
                  // Filter contacts according to 'queryFilterTwo' filters
                  let itemsFiltered = contactList.filter((contact) => {
                    let resp = [];
                    for (let key in queryFilterTwo) {
                      let result = false;
                      //Property exist in object
                      if (Object.prototype.hasOwnProperty.call(contact, key)) {
                        // Value is to 'omit' contacts (-closed)
                        if (queryFilterTwo[key].toString().startsWith('-')) {
                          if (contact[key] !== queryFilterTwo[key].replace('-', '')) {
                            result = true;
                          }
                          // Same value as filter
                        } else if (queryFilterTwo[key] === contact[key]) {
                          result = true;
                        } else if (key == 'assigned_to') {
                          if (queryFilterTwo[key] === contact[key].key) {
                            result = true;
                          }
                        }
                      }
                      resp.push(result);
                    }
                    return resp.every((respValue) => respValue);
                  });
                  this.setState({
                    refresh: true,
                    dataSourceContactsFiltered: itemsFiltered,
                    filtered: true,
                    activeSections: [], //Close accordeon (removing open acordeon indexes from array)
                  });
                },
              );
            }}>
            <View
              style={{
                flexDirection: 'row',
                height: 50,
                paddingLeft: filter.subfilter ? 20 : 0,
              }}>
              <CheckBox
                checked={filter.ID === this.state.searchBarFilter.currentFilter}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                containerStyle={{
                  padding: 0,
                  margin: 0,
                }}
              />
              <Text
                style={{
                  paddingTop: Platform.OS === 'ios' ? 4 : 0,
                }}>
                {filter.name}
              </Text>
              <Text
                style={{
                  marginLeft: 'auto',
                  paddingTop: Platform.OS === 'ios' ? 4 : 0,
                }}>
                {filter.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  updateSections = (activeSections) => {
    this.setState({ activeSections });
  };

  renderHeader = () => {
    return (
      <View
        style={[
          styles.searchBarContainer,
          Platform.OS == 'ios'
            ? { borderBottomColor: Colors.grayLight, borderBottomWidth: 1 }
            : { elevation: 5 },
          {},
        ]}>
        <ScrollView style={styles.searchBarScrollView}>
          <Item regular style={styles.searchBarItem}>
            <MaterialIcons name="search" style={styles.searchBarIcons} />
            <Input
              placeholder={i18n.t('global.search')}
              onChangeText={(text) => this.filterContactsByText(text)}
              autoCorrect={false}
              value={this.state.search}
              style={styles.searchBarInput}
            />
            {this.state.search.length > 0 ? (
              <MaterialIcons
                name="clear"
                style={[styles.searchBarIcons, { marginRight: 10 }]}
                onPress={() =>
                  this.setState({
                    // Set input search filters as initial value
                    refresh: false,
                    filtered: false,
                    search: '',
                  })
                }
              />
            ) : null}
            <MaterialIcons
              name="filter-list"
              style={styles.searchBarIcons}
              onPress={() => this.showFiltersPanel()}
            />
          </Item>
          {this.state.searchBarFilter.toggle ? (
            <View style={{ marginTop: 20, marginBottom: 20 }}>
              <Accordion
                activeSections={this.state.activeSections}
                sections={this.props.contactFilters.tabs.filter(
                  (filter) => filter.key !== 'custom',
                )}
                renderHeader={this.renderSectionHeader}
                renderContent={this.renderSectionContent}
                onChange={this.updateSections}
              />
            </View>
          ) : null}
        </ScrollView>
      </View>
    );
  };

  offlineBarRender = () => (
    <View style={[styles.offlineBar]}>
      <Text style={[styles.offlineBarText]}>{i18n.t('global.offline')}</Text>
    </View>
  );

  noContactsRender = () => (
    <View style={styles.noContactsContainer}>
      <Row style={{ justifyContent: 'center' }}>
        <Image style={styles.noContactsImage} source={dtIcon} />
      </Row>
      <Text style={styles.noContactsText}>{i18n.t('contactsScreen.noContactPlacheHolder')}</Text>
      <Text style={styles.noContactsText}>{i18n.t('contactsScreen.noContactPlacheHolder1')}</Text>
      {!this.props.isConnected && (
        <Text style={styles.noContactsTextOffilne}>
          {i18n.t('contactsScreen.noContactPlacheHolderOffline')}
        </Text>
      )}
    </View>
  );

  filterContactsByText(text) {
    const itemsFiltered = [];
    if (text.length > 0) {
      this.props.contacts.filter(function (item) {
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
        if (filterByTitle === true) {
          itemsFiltered.push(item);
        } else if (filterByPhone === true) {
          itemsFiltered.push(item);
        } else if (filterByEmail === true) {
          itemsFiltered.push(item);
        }

        return itemsFiltered;
      });
      if (itemsFiltered.length > 0) {
        this.setState((prevState) => ({
          refresh: true,
          dataSourceContactsFiltered: itemsFiltered,
          filtered: true,
          search: text,
          searchBarFilter: {
            ...prevState.searchBarFilter,
            currentFilter: '',
          },
        }));
      } else {
        this.setState((prevState) => ({
          refresh: true,
          filtered: true,
          search: text,
          searchBarFilter: {
            ...prevState.searchBarFilter,
            currentFilter: '',
          },
        }));
      }
    } else {
      this.setState((prevState) => ({
        refresh: false,
        filtered: false,
        search: '',
        dataSourceContactsFiltered: [],
        searchBarFilter: {
          ...prevState.searchBarFilter,
          currentFilter: '',
        },
      }));
    }
  }

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

  render() {
    return (
      <Container>
        <View style={{ flex: 1 }}>
          {!this.props.isConnected && this.offlineBarRender()}
          {this.renderHeader()}
          {
            <FlatList
              data={this.state.dataSourceContact}
              extraData={this.state.loading}
              renderItem={(item) => this.renderRow(item.item)}
              ItemSeparatorComponent={this.flatListItemSeparator}
              keyboardShouldPersistTaps="always"
              refreshControl={
                <RefreshControl refreshing={this.props.loading} onRefresh={this.onRefresh} />
              }
              ListFooterComponent={this.renderFooter}
              keyExtractor={(item) => item.ID.toString()}
            />
          }
          <Fab
            style={{ backgroundColor: Colors.tintColor }}
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
};

const mapStateToProps = (state) => ({
  userData: state.userReducer.userData,
  contacts: state.contactsReducer.contacts,
  loading: state.contactsReducer.loading,
  error: state.contactsReducer.error,
  contactSettings: state.contactsReducer.settings,
  isConnected: state.networkConnectivityReducer.isConnected,
  offset: state.contactsReducer.offset,
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
