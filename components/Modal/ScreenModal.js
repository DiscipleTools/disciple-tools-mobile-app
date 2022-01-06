import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Icon } from "native-base";

import { styles } from "./ScreenModal.styles";

const ScreenModal = ({ children, modalVisible, setModalVisible, title }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
      statusBarTranslucent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 5 }}>
              <Text style={styles.textHeader}>{title}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Pressable
                style={styles.buttonClose}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Icon type="MaterialIcons" name="close" />
              </Pressable>
            </View>
          </View>
          <View style={styles.modalContent}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

export default ScreenModal;
