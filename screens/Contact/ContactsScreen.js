import React from 'react';
import { connect } from 'react-redux';
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  Text,
} from 'react-native';
import { Fab, Container } from 'native-base';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-easy-toast';
import PropTypes from 'prop-types';
import { SearchBar } from 'react-native-elements';
import Colors from '../../constants/Colors';
import { getAll } from '../../store/actions/contacts.actions';
import i18n from '../../languages';


const styles = StyleSheet.create({
  flatListItem: {
    height: 90,
    backgroundColor: 'white',
    padding: 20,
  },
  contactSubtitle: {
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
    borderTopColor: '#FFF',
    borderBottomColor: '#FFF',
    borderColor: '#F2F2F2',
    paddingBottom: 10,
    marginBottom: 1,
    elevation: 5,
  },
  searchBarInput: {
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'white',
    borderColor: '#DDDDDD',
    borderBottomWidth: 1,
    borderWidth: 1
  },
  offlineBar:{
    height: 20,
    backgroundColor: '#FCAB10',
  },
  offlineBarText:{
    fontSize: 14,
    color: 'white',
    textAlignVertical: 'center',
    textAlign: 'center'
  }
});
let firstloader = 0
let toastError;

class ContactsScreen extends React.Component {

  /* eslint-enable react/sort-comp */
  state = {
    refresh: false,
    search: '',
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

  
  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      contacts,
    } = nextProps;
    const newState = {
      ...prevState,
        dataSourceContact: contacts,
    }

    firstloader += 1
    if(firstloader < 5){
      return newState
    }
      return null
    
  }

  renderRow = contact => (
    <TouchableOpacity
      onPress={() => this.goToContactDetailScreen(contact)}
      style={styles.flatListItem}
      key={contact.ID}
    >
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={{ fontWeight: 'bold' }}>{contact.title}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          {this.props.contactSettings.fields.overall_status.values[contact.overall_status] ? (
            <Text style={styles.contactSubtitle}>
              {this.props.contactSettings.fields.overall_status.values[contact.overall_status].label}
            </Text>
          ) : <Text />}
          {this.props.contactSettings.fields.overall_status.values[contact.overall_status] && this.props.contactSettings.fields.seeker_path.values[contact.seeker_path] ? (
            <Text style={styles.contactSubtitle}>
              •
            </Text>
          ) : <Text />}
          {this.props.contactSettings.fields.seeker_path.values[contact.seeker_path] ? (
            <Text style={styles.contactSubtitle}>
              {this.props.contactSettings.fields.seeker_path.values[contact.seeker_path].label}
            </Text>
          ) : <Text />}
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

  onRefresh = () => {
    this.props.getAllContacts(this.props.userData.domain, this.props.userData.token);
    this.setState({
      refresh: true,
    }, () => {
      this.setState({
        dataSourceContact: this.props.contacts,
        refresh: false
      })
    })
  };

  goToContactDetailScreen = (contactData = null) => {
    if (contactData) {
      // Detail
      this.props.navigation.push('ContactDetail', {
        contactId: contactData.ID,
        onlyView: true,
        contactName: contactData.title,
        onGoBack: () => this.onRefresh(),
      });
    } else {
      // Create
      this.props.navigation.push('ContactDetail', {
        onGoBack: () => this.onRefresh(),
      });
    }
  };


  SearchFilterFunction(text) {
    const itemsFiltered = []
    this.props.contacts.filter(function (item) {
      let filterByPhone = false
      let filterByEmail = false
      const textData = text.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const itemDataTitle = item.title.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const filterByTitle = itemDataTitle.includes(textData)

      if (item.contact_phone != undefined) {
        item.contact_phone.forEach((elements) => {
          const itemDataPhone = elements.value.toUpperCase()          
          filterByPhone == false ? filterByPhone = itemDataPhone.includes(textData) : null
        })
      }

      if (item.contact_email != undefined) {
        item.contact_email.forEach((elements) => {
          const itemDataEmail = elements.value.toUpperCase()
          filterByEmail = itemDataEmail.includes(textData)
          filterByEmail == false ? filterByEmail = itemDataEmail.includes(textData) : null
        })
      }

      filterByTitle == true ? itemsFiltered.push(item) : filterByPhone == true ? itemsFiltered.push(item) : filterByEmail == true ? itemsFiltered.push(item) : null
      return itemsFiltered
    })
    this.setState({
      refresh: true,
    }, () => {
      this.setState({
        dataSourceContact: itemsFiltered,
        search: text,
        refresh: false
      })
    })
  }

  renderHeader = () => {
    return (
      <View>        
        <SearchBar
          placeholder={i18n.t('global.search')}
          onChangeText={text => this.SearchFilterFunction(text)}
          autoCorrect={false}
          value={this.state.search}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInput}
        />
        {!this.props.isConnected && this.offlineBarRender()}
      </View>
    );
  };

  offlineBarRender = () =>{
    return (
      <View style={[styles.offlineBar]}>
        <Text style={[styles.offlineBarText]}>{i18n.t('global.offline')}</Text>
      </View>
    ) 
  }

  static navigationOptions = {
    title: i18n.t('contactsScreen.contacts'),
    headerLeft: null,
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
          <FlatList
            ListHeaderComponent={this.renderHeader}
            data={this.state.dataSourceContact}
            extraData={this.state.refresh}
            renderItem={item => this.renderRow(item.item)}
            ItemSeparatorComponent={this.flatListItemSeparator}
            refreshControl={(
              <RefreshControl
                refreshing={this.props.loading}
                onRefresh={this.onRefresh}
              />
            )}
            keyExtractor={item => item.ID.toString()}
          />
          <Fab
            style={{ backgroundColor: Colors.tintColor }}
            position="bottomRight"
            onPress={() => this.goToContactDetailScreen()}
          >
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
      key: PropTypes.number
    })
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
    }),
  }),
};
ContactsScreen.defaultProps = {
  error: null,
  loading: false,
  contactSettings: null,
  isConnected: null,
};

const mapStateToProps = state => ({
  userData: state.userReducer.userData,
  contacts: state.contactsReducer.contacts,
  loading: state.contactsReducer.loading,
  error: state.contactsReducer.error,
  contactSettings: state.contactsReducer.settings,
  isConnected: state.networkConnectivityReducer.isConnected,
});
const mapDispatchToProps = dispatch => ({
  getAllContacts: (domain, token) => {
    dispatch(getAll(domain, token));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ContactsScreen);
