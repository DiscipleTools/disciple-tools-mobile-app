import React, { useState } from 'react';
import { connect } from 'react-redux';
import { View, FlatList, TouchableOpacity, RefreshControl, StyleSheet, Text } from 'react-native';
import { Container, Icon } from 'native-base';
import * as Contacts from 'expo-contacts';
import ActionButton from 'react-native-action-button';
import Toast from 'react-native-easy-toast';
import SearchBar from '../../components/SearchBar';
import ScreenModal from '../../components/ScreenModal';

import PropTypes from 'prop-types';
import Colors from '../../constants/Colors';
import { getAll, updatePrevious } from '../../store/actions/contacts.actions';
import i18n from '../../languages';
import sharedTools from '../../shared';

import { styles } from './ContactsScreen.styles';

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
    modalVisible: false,
    importContactsList: [],
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

  truncateRowChars = (displayValue) => {
    const threshold = 40;
    if (displayValue.length > threshold) {
      return displayValue.substring(0, threshold) + '...';
    }
    return displayValue;
  };

  renderImportContactsRow = (contact) => {
    let contactExists = contact.exists ? true : false;
    let contactPhoneDisplay = '';
    if (contact.contact_phone) {
      contactPhoneDisplay = contact.contact_phone[0].value;
      if (contact.contact_phone.length > 1) {
        contactPhoneDisplay = contactPhoneDisplay + ', ' + contact.contact_phone[1].value;
      }
    }
    let contactEmailDisplay = '';
    if (contact.contact_email) {
      contactEmailDisplay = contact.contact_email[0].value;
      if (contact.contact_email.length > 1) {
        contactEmailDisplay = contactEmailDisplay + ', ' + contact.contact_email[1].value;
      }
    }
    return (
      <TouchableOpacity
        onPress={() => {
          this.setState({ modalVisible: false });
          this.goToContactDetailScreen(contact, !contactExists);
        }}
        style={styles.flatListItem}
        key={contact.idx}>
        <View style={{ flexDirection: 'row', height: '100%' }}>
          <View style={{ flexDirection: 'column', flexGrow: 1 }}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ textAlign: 'left', flex: 1, flexWrap: 'wrap', fontWeight: 'bold' }}>
                {Object.prototype.hasOwnProperty.call(contact, 'name')
                  ? contact.name
                  : contact.title}
              </Text>
            </View>
            {contactPhoneDisplay.length > 0 && (
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.contactSubtitle,
                    {
                      textAlign: 'left',
                    },
                  ]}>
                  {this.truncateRowChars(contactPhoneDisplay)}
                </Text>
              </View>
            )}
            {contactEmailDisplay.length > 0 && (
              <View style={{ flexDirection: 'row' }}>
                <Text
                  style={[
                    styles.contactSubtitle,
                    {
                      textAlign: 'left',
                    },
                  ]}>
                  {this.truncateRowChars(contactEmailDisplay)}
                </Text>
              </View>
            )}
          </View>
          <View
            style={[
              {
                flexDirection: 'column',
                width: 35,
                paddingTop: 0,
                marginTop: 'auto',
                marginBottom: 'auto',
              },
              this.props.isRTL ? { marginRight: 5 } : { marginLeft: 5 },
            ]}>
            <Icon
              style={{ color: contactExists ? Colors.gray : Colors.tintColor }}
              type="MaterialIcons"
              name={contactExists ? 'playlist-add-check' : 'person-add'}
            />
          </View>
        </View>
      </TouchableOpacity>
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

  goToContactDetailScreen = (contactData = null, isPhoneImport = false) => {
    if (contactData && isPhoneImport) {
      this.props.updatePrevious([]);
      this.props.navigation.navigate('ContactDetail', {
        onlyView: true,
        importContact: contactData,
        onGoBack: () => this.onRefresh(false, true),
      });
    } else if (contactData) {
      this.props.updatePrevious([
        {
          contactId: parseInt(contactData.ID),
          onlyView: true,
          contactName: contactData.title,
          importContact: null,
        },
      ]);
      // Detail
      this.props.navigation.navigate('ContactDetail', {
        contactId: contactData.ID,
        onlyView: true,
        contactName: contactData.title,
        importContact: null,
        onGoBack: () => this.onRefresh(false, true),
      });
    } else {
      this.props.updatePrevious([]);
      // Create
      this.props.navigation.navigate('ContactDetail', {
        onlyView: true,
        importContact: null,
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

  cleansePhone = (phone) => {
    if (phone.length < 1) return null;
    // remove all non-numeric chars
    return phone.replace(/\D/g, '');
  };

  cleanseEmail = (email) => {
    if (email.length < 1) return null;
    return email;
  };

  importContactsRender = () => {
    // NOTE: Contacts are already indexed by most recently modified,
    // so we only need to reverse the array. If this ever changes,
    // then just sort by idx (id)
    const importContactsList = this.state.importContactsList.reverse();
    const existingContactsList = [];
    this.state.dataSourceContact.map((existingContact) => {
      const existingContactPhoneList = existingContact?.contact_phone
        ?.map((phone) => {
          return this.cleansePhone(phone?.value);
        })
        .filter((x) => x);
      const existingContactEmailList = existingContact?.contact_email
        ?.map((email) => {
          return this.cleanseEmail(email?.value);
        })
        .filter((x) => x);
      importContactsList.map((importContact) => {
        const importContactPhoneList = importContact?.contact_phone
          ?.map((phone) => {
            return this.cleansePhone(phone?.value);
          })
          .filter((x) => x);
        const importContactEmailList = importContact?.contact_email
          ?.map((email) => {
            return this.cleanseEmail(email?.value);
          })
          .filter((x) => x);
        if (
          (existingContact.title &&
            importContact.title &&
            existingContact.title === importContact.title) ||
          (existingContact.title &&
            importContact.name &&
            existingContact.title === importContact.name) ||
          (existingContact.name &&
            importContact.name &&
            existingContact.name === importContact.name) ||
          (existingContact.name &&
            importContact.title &&
            existingContact.name === importContact.title) ||
          existingContactPhoneList?.some((item) => importContactPhoneList?.includes(item)) ||
          existingContactEmailList?.some((item) => importContactEmailList?.includes(item))
        ) {
          importContact['ID'] = existingContact.ID;
          importContact['exists'] = true;
          existingContactsList.push(importContact);
        }
      });
    });
    const importContactsFilters = {
      tabs: [
        {
          key: 'default',
          label: 'Default Filters',
          order: 1,
        },
      ],
      filters: [
        {
          ID: 'all_my_contacts',
          labels: [
            {
              id: 'all',
              name: 'All Contacts',
            },
          ],
          name: 'All Contacts',
          query: {
            sort: '-last_modified',
          },
          tab: 'default',
        },
        {
          ID: 'not_yet_imported',
          labels: [
            {
              id: 'notyet',
              name: 'Not Yet Imported',
            },
          ],
          name: 'Not Yet Imported',
          query: {
            sort: '-last_modified',
          },
          tab: 'default',
        },
        {
          ID: 'already_imported',
          labels: [
            {
              id: 'already',
              name: 'Already Imported',
            },
          ],
          name: 'Already Imported',
          query: {
            sort: '-last_modified',
          },
          tab: 'default',
        },
      ],
    };
    return (
      <>
        {/*
        <SearchBar
          filterConfig={importContactsFilters}
          onSelectFilter={this.selectOptionFilter}
          onTextFilter={this.filterByText}
          onClearTextFilter={this.filterByText}
          onLayout={this.onLayout}
          count={importContactsList.length}
        />
        */}
        <FlatList
          data={importContactsList}
          renderItem={(item) => this.renderImportContactsRow(item.item)}
          ItemSeparatorComponent={this.flatListItemSeparator}
          keyboardShouldPersistTaps="always"
          keyExtractor={(item) => item.index}
        />
      </>
    );
  };

  render() {
    return (
      <Container>
        <View style={{ flex: 1 }}>
          {this.state.modalVisible && (
            <ScreenModal
              modalVisible={this.state.modalVisible}
              setModalVisible={(modalVisible) => this.setState({ modalVisible })}
              title={i18n.t('contactDetailScreen.importContact')}>
              {this.importContactsRender()}
            </ScreenModal>
          )}
          {!this.props.isConnected && this.offlineBarRender()}
          <SearchBar
            filterConfig={this.props.contactFilters}
            onSelectFilter={this.selectOptionFilter}
            onTextFilter={this.filterByText}
            onClearTextFilter={this.filterByText}
            onLayout={this.onLayout}
            count={
              this.state.dataSourceContact.length % 100 === 0
                ? `${this.state.dataSourceContact.length}+`
                : this.state.dataSourceContact.length
            }
          />
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
          <ActionButton
            style={[this.state.fixFABIndex ? { zIndex: -1 } : {}]}
            buttonColor={Colors.primaryRGBA}
            renderIcon={(active) =>
              active ? (
                <Icon type="MaterialIcons" name="close" style={{ color: 'white', fontSize: 22 }} />
              ) : (
                <Icon type="MaterialIcons" name="add" style={{ color: 'white', fontSize: 25 }} />
              )
            }
            degrees={0}
            activeOpacity={0}
            bgColor="rgba(0,0,0,0.5)"
            nativeFeedbackRippleColor="rgba(0,0,0,0)">
            <ActionButton.Item
              title={i18n.t('contactDetailScreen.addNewContact')}
              onPress={() => {
                this.goToContactDetailScreen();
              }}
              size={40}
              buttonColor={Colors.tintColor}
              nativeFeedbackRippleColor="rgba(0,0,0,0)"
              textStyle={{ color: Colors.tintColor, fontSize: 15 }}
              textContainerStyle={{ height: 'auto' }}>
              <Icon type="MaterialIcons" name="add" style={styles.contactFABIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              title={i18n.t('contactDetailScreen.importContact')}
              onPress={() => {
                (async () => {
                  const { status } = await Contacts.requestPermissionsAsync();
                  if (status === 'granted') {
                    const importContactsList = [];
                    const { data } = await Contacts.getContactsAsync({});
                    data.map((contact) => {
                      const contactData = {};
                      if (contact.contactType === 'person') {
                        contactData['idx'] = contact.id;
                        contactData['title'] = contact.name;
                        contactData['name'] = contact.name;
                        if (contact.hasOwnProperty('emails') && contact.emails.length > 0) {
                          contactData['contact_email'] = [];
                          contact.emails.map((email, idx) => {
                            contactData['contact_email'].push({
                              key: `contact_email_${idx}`,
                              value: email.email,
                            });
                          });
                        }
                        if (
                          contact.hasOwnProperty('phoneNumbers') &&
                          contact.phoneNumbers.length > 0
                        ) {
                          contactData['contact_phone'] = [];
                          contact.phoneNumbers.map((phoneNumber, idx) => {
                            contactData['contact_phone'].push({
                              key: `contact_phone_${idx}`,
                              value: phoneNumber.number,
                            });
                          });
                        }
                        importContactsList.push(contactData);
                      }
                    });
                    this.setState({
                      modalVisible: true,
                      importContactsList,
                    });
                  }
                })();
              }}
              size={40}
              buttonColor={Colors.colorYes}
              nativeFeedbackRippleColor="rgba(0,0,0,0)"
              textStyle={{ color: Colors.tintColor, fontSize: 15 }}
              textContainerStyle={{ height: 'auto' }}>
              <Icon type="MaterialIcons" name="contact-phone" style={styles.contactFABIcon} />
            </ActionButton.Item>
          </ActionButton>
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
