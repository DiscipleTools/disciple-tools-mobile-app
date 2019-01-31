import React from 'react';
import { ScrollView, StyleSheet, View, Text, FlatList, TouchableHighlight } from 'react-native';
import { ExpoLinksView } from '@expo/samples';

export default class ContactsScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      contactData: [ {name: 'Zohour', key: 'item1', location: 'Amman, Jordan'},
                      {name: 'Ravi', key: 'item2', location: 'Cairo, Egypt'},
                      {name: 'Saladin', key: 'item3', location: 'Beirut, Lebanon'},
                 ],
    }
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
      <FlatList
          ItemSeparatorComponent = {this.FlatListItemSeparator}
          data={this.state.contactData}
          renderItem={({item, separators}) => this.renderRow(item, separators)}
      />
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
  }
});
