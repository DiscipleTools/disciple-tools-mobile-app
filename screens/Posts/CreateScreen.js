import React from "react";
import { View, Text } from "react-native";

import { Container } from "native-base";

import OfflineBar from "components/OfflineBar";

import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";

import { styles } from "./CreateScreen.styles";

const CreateScreen = ({ navigation }) => {

  const isConnected = useNetworkStatus();
  const { i18n, isRTL } = useI18N();

  return (
    <Container style={styles.container}>
      {!isConnected && <OfflineBar />}
      <Text>
        Create Post
      </Text>
    </Container>
  );
};
export default CreateScreen;