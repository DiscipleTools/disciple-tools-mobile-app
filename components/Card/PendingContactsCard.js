import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import Card from "components/Card/Card";
import ExpandableCard from "components/Card/ExpandableCard";

import useList from "hooks/use-list";
import useStyles from "hooks/use-styles";

import { TypeConstants } from "constants";

import { localStyles } from './PendingContactsCard.styles';

const PendingContactsCard = ({ refreshing }) => {
  const { styles, globalStyles } = useStyles(localStyles);

  const filter = {
    ID: "contacts_pending",
    // TODO: translate
    name: "Pending Contacts",
    query: {
      "assigned_to":["me"],
      "overall_status":["assigned"],
      "type":["access"],
      //"sort":"seeker_path"
    }
  };
  const { data: contacts, error, isLoading, isValidating, mutate } = useList({ filter, type: TypeConstants.CONTACT });

  // force data refresh on reload
  useEffect(() => {
    if (refreshing && mutate) mutate();
  }, [refreshing]);

  const renderContactAccept = (contact, idx) => (
    <View style={[
      globalStyles.columnContainer,
      styles.container(idx)
    ]}>
      <Text style={styles.title}>
        {contact?.title}
      </Text>
      <View style={[
        globalStyles.rowContainer,
        styles.buttonRowContainer
      ]}>
        <Pressable
          onPress={() => console.log(`*** ACCEPT: ${ JSON.stringify(contact)} `)}
          style={[
            styles.buttonContainer,
            { backgroundColor: "green" }
          ]}
        >
          <Text style={styles.buttonText}>Accept</Text>
        </Pressable>
        <Pressable
          onPress={() => console.log(`*** DECLINE: ${ JSON.stringify(contact)} `)}
          style={[
            styles.buttonContainer,
            { backgroundColor: "red" }
          ]}
        >
          <Text style={styles.buttonText}>Decline</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderExpandedCard = () => (
    <ScrollView>
      {contacts?.map((contact, idx) => renderContactAccept(contact, idx))}
    </ScrollView>
  );

  const renderPartialCard = () => (
    <>
      <View>
        {contacts?.slice(0,1)?.map((contact, idx) => renderContactAccept(contact, idx))}
      </View>
      { contacts?.length > 1 && (
        <Text>...</Text>
      )}
    </>
  );

  // TODO: translate
  const title = "Pending Contacts";
  //const title = "جهات الاتصال المعلقة";
  return (
    <>
      { contacts?.length > 2 ? (
        <ExpandableCard
          border
          center
          title={title}
          count={contacts?.length}
          renderPartialCard={renderPartialCard}
          renderExpandedCard={renderExpandedCard}
        />
      ) : (
        <Card
          border
          center
          title={title}
          body={<Text>All caught up!</Text>}
        />
      )}
    </>
  );
};
export default PendingContactsCard;