import React from "react";
import { connect } from "react-redux";
import { ScrollView, StyleSheet, Text } from "react-native";
import Toast from "react-native-easy-toast";
import {
  Container,
  Content,
  Form,
  Item,
  Label,
  Input,
  Icon,
  List,
  ListItem,
  Body,
  Right
} from "native-base";
import Colors from "../constants/Colors";

const styles = StyleSheet.create({
  inputContactPhone: {
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#D9D5DC",
    margin: 5
  },
  label: {
    color: Colors.tintColor,
    fontSize: 15
  },
  addRemoveIcons: {
    fontSize: 30,
    color: "black"
  }
});

let toastSuccess;
let toastError;

class ContactDetailScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const contactId = navigation.getParam("contactId");
    const onlyView = navigation.getParam("onlyView");
    let headerRight;
    if (onlyView) {
      headerRight = (
        <Icon
          android="md-create"
          ios="ios-create"
          onPress={navigation.getParam("onEnableEdit")}
          style={[
            {
              paddingRight: 16,
              color: "#FFFFFF"
            }
          ]}
        />
      );
    } else {
      headerRight = (
        <Icon
          android="md-checkmark"
          ios="ios-checkmark"
          onPress={navigation.getParam("onSaveContact")}
          style={[
            {
              paddingRight: 16,
              color: "#FFFFFF"
            }
          ]}
        />
      );
    }
    return {
      title: contactId ? "Contact Details" : "Add New Contact",
      headerLeft: (
        <Icon
          android="md-arrow-back"
          ios="ios-arrow-back"
          onPress={() => navigation.push("Contacts")}
          style={[{ paddingLeft: 16, color: "#FFFFFF" }]}
        />
      ),
      headerRight,
      headerStyle: {
        backgroundColor: Colors.tintColor
      },
      headerTintColor: "#FFFFFF",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    };
  };

  state = {
    contact: {
      contact_phone: []
    }
  };

  constructor(props) {
    super(props);
  }

  setContactTitle = value => {
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        title: value
      }
    }));
  };

  setContactPhone = value => {
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        contact_phone: [
          {
            value: value
          }
        ]
      }
    }));
  };

  setContactEmail = value => {
    this.setState(prevState => ({
      ...prevState,
      contact: {
        ...prevState.contact,
        contact_email: [
          {
            value: value
          }
        ]
      }
    }));
  }

  render() {
    const successToast = (
      <Toast
        ref={toast => {
          toastSuccess = toast;
        }}
        style={{ backgroundColor: "green" }}
        position="center"
      />
    );
    const errorToast = (
      <Toast
        ref={toast => {
          toastError = toast;
        }}
        style={{ backgroundColor: "red" }}
        position="center"
      />
    );

    if (this.state.contact.ID) {
    } else {
      return (
        <ScrollView>
          <Container>
            <Content>
              <List>
                <Item stackedLabel>
                  <Label>Full Name</Label>
                  <Input onChangeText={this.setContactTitle} />
                </Item>
                <Item stackedLabel>
                  <Label>Phone Number</Label>
                  <Input onChangeText={this.setContactPhone} />
                </Item>
                <Item stackedLabel>
                  <Label>Email</Label>
                  <Input onChangeText={this.setContactEmail} />
                </Item>
              </List>
            </Content>
          </Container>
        </ScrollView>
      );
    }
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactDetailScreen);
