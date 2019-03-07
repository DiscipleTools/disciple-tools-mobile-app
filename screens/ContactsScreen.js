import React from 'react';
import { ScrollView, StyleSheet, View, Text, 
  FlatList, TouchableHighlight, AsyncStorage,
  ActivityIndicator } from 'react-native';
import DataStore from '../bus/DataStore';
import Colors from '../constants/Colors';

export default class ContactsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      contactData: [],
      errorMsg: "",
      isLoading: true,
    }

    this.token = "";
  }

  static navigationOptions = {
    title: 'Contacts',
  };

  FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "100%",
          backgroundColor: "#dddddd",
        }}
      />
    );
  }

  async componentDidMount() {

    //get contacts
    this.token = await AsyncStorage.getItem('@KeyStore:token');
    if (this.token) { 
        this.fetchContacts();
    } else {
      console.log('error, no token')
    }

  }

  fetchContacts() {
    console.log('fetching contacts...');

    DataStore.getAllContactsAsync(this.token)
    .then(result => {
      this.setState({contactData: result, isLoading: false})
      console.log('contacts is: '+result)
      }
    );
  }

  renderRow(contact, separators) {
    return ( 
      <TouchableHighlight
        onPress={() => this.onSelectItem(contact)}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
        style={styles.contactContainer}>
        <View style={styles.contactItem}>
          <Text style={{fontWeight: 'bold'}}>{contact.name}</Text>
          { this.makeSubtitle(contact) }
        </View>
      </TouchableHighlight>
    );
  }

  makeSubtitle(contact) {
        // + 
        // " • "+contact.faithMilestones+ 
        // " • "+contact.assignedTo+ 
        // " • "+contact.locations}</Text>
    return (
      <View style={{flexDirection:'row', flexWrap:'wrap'}}>
        <Text style={styles.contactSubtitle}>{contact.status}</Text>
        { !!contact.status && 
          <Text style={styles.contactSubtitle}>{" • "+contact.status}</Text>
        }
        { !!contact.seekerPath && 
          <Text style={styles.contactSubtitle}>{" • "+contact.seekerPath}</Text>
        }
        { !!contact.faithMilestones && 
          <Text style={styles.contactSubtitle}>{" • "+contact.faithMilestones}</Text>
        }
        { !!contact.assignedTo && 
          <Text style={styles.contactSubtitle}>{" • "+contact.assignedTo}</Text>
        }
        { contact.locations.length>1 && 
          <Text style={styles.contactSubtitle}>{" • "+contact.locations}</Text>
        }
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        { !!!this.state.errorMsg ? 
          <FlatList
              ItemSeparatorComponent = {this.FlatListItemSeparator}
              data={this.state.contactData}
              renderItem={({item, separators}) => this.renderRow(item, separators)}
          />
          :
          <Text style={styles.errorText} > {this.state.errorMsg} </Text>
        }
        { !!this.state.isLoading &&
          <ActivityIndicator style={styles.loading} size='small' />
        }
    </View>
    );
  }

  onSelectItem(item) {

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  contactContainer: {
  },
  contactItem: {
    height: 90,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
  },
  contactSubtitle: {
    paddingTop:6,
    fontWeight: "200",
    color: 'rgba(0,0,0,0.6)',
  },
  errorText: {
    textAlign: 'center',
    height:100,
    padding: 20,
    color: 'rgba(0,0,0,0.4)',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
