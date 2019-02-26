import React from 'react';
import { ScrollView, StyleSheet, View, Text, FlatList, TouchableHighlight } from 'react-native';
import { ExpoLinksView } from '@expo/samples';
import DataStore from '../bus/DataStore';
import Colors from '../constants/Colors';

export default class ContactsScreen extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      contactData: [],
      errorMsg: "",
    }

    this.token = "";
    this.username = "xxxx";
    this.password = "123456";
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
    var success = await this.getToken();
    if (success) { 
        this.fetchContacts();
    }

  }

  async getToken() {
    console.log('getting token...');

    var token = "";
    try {
      token = await DataStore.getTokenAsync({
          username: this.username,
          password: this.password
      });
    } catch (error) {
      console.log(error);
      this.setState({errorMsg: error.toString()});
      return false;
    }

    console.log('token is: '+token);
    this.token = token;
  }

  fetchContacts() {
    console.log('fetching contacts...');

    DataStore.getAllContactsAsync(this.state.token)
    .then(result => {
      this.setState({contactData: result})
      console.log('contacts is: '+result)
      }
    );
  }

  renderRow(item, separators) {
    return ( 
      <TouchableHighlight
        onPress={() => this.onSelectItem(item)}
        onShowUnderlay={separators.highlight}
        onHideUnderlay={separators.unhighlight}
        style={styles.contactContainer}>
        <View style={styles.contactItem}>
          <Text style={{fontWeight: 'bold'}}>{item.name}</Text>
          <Text style={{fontWeight: '200'}}>{item.location}</Text>
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <View>
    { !!!this.state.errorMsg ? 
      <FlatList
          ItemSeparatorComponent = {this.FlatListItemSeparator}
          data={this.state.contactData}
          renderItem={({item, separators}) => this.renderRow(item, separators)}
      />
      :
      <Text style={styles.errorText} > {this.state.errorMsg} </Text>
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
    backgroundColor: '#fff',
  },
  contactContainer: {
  },
  contactItem: {
    height: 60,
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  errorText: {
    textAlign: 'center',
    height:100,
    padding: 20,
    color: 'rgba(0,0,0,0.4)',
  }
});
