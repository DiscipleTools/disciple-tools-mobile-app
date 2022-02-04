import React, { useEffect, useState } from "react";
import { Linking, Pressable, Text, TextInput, View } from "react-native";
// TODO: remove
import { Icon } from "native-base";
import { Col, Row } from "react-native-easy-grid";

import { EditIcon } from "components/Icon";

import useDebounce from "hooks/useDebounce";
import useStyles from "hooks/useStyles";

import { FieldConstants } from "constants";

import { localStyles } from "./CommunicationChannelField.styles";

const CommunicationChannelField = ({ editing, field, values, onChange }) => {

  const { styles, globalStyles } = useStyles(localStyles);

  const [_editing, _setEditing] = useState(editing);

  if (!values) values = [];

  const _onAdd = () => {
    /*
     * NOTE: This key prefix is necessary or React to distinguish between multiple new TextInputs.
     * This key is removed (in Field.js '_onSave') before API request is made (in order to create new)
     */
    onChange([
      {
        key: `${ FieldConstants.TMP_KEY_PREFIX }_${ values.length + 1 }`,
        value: ''
      },
      ...values,
    ]);
  };

  const _onRemove = (key) => {
    // ref: https://developers.disciple.tools/theme-core/api-posts/post-types-fields-format#communication_channel
    const newValues = values?.map(prevValue =>
      prevValue?.key === key ? { key, delete: true } : prevValue
    );
    onChange(newValues);
  };

  const _onChange = (newValue) => {
    const newValues = values?.map(prevValue =>
      prevValue?.key === newValue?.key ?  (newValue?.key !== '' ? newValue : { value: newValue?.value }) : prevValue
    );
    if (JSON.stringify(newValues) !== JSON.stringify(values)) {
      onChange(newValues);
    };
  };

  // TODO: validate input per field type (eg, email, phone, etc)?
  const renderTextInput = (value, idx) => {

    const [_text, _setText] = useState(value?.value);
    // TODO: 1000 too slow and user may click plus sign, but less is too fast for entries like email
    const debouncedText = useDebounce(_text, 750);

    useEffect(() => {
      if (debouncedText !== value?.value) {
        _onChange({
          key: value?.key,
          value: debouncedText
        });
      };
      return;
    }, [debouncedText]);

    const getKeyboardType = () => {
      if (field?.name?.includes("phone")) return "phone-pad";
      if (field?.name?.includes("email")) return "email-address";
      return "default";
    };
    const keyboardType = getKeyboardType();

    return(
      <TextInput
        key={idx}
        value={_text}
        onChangeText={_setText}
        style={styles.field}
        keyboardType={keyboardType}
      />
    );
  };

  const CommunicationChannelFieldEdit = () => {
    return (
      <Col>
        <Row style={styles.formFieldMargin}>
          <Col style={styles.formIconLabel}>
            <Icon
              android="md-add"
              ios="ios-add"
              style={[styles.addRemoveIcons, styles.addIcons]}
              onPress={() => _onAdd()}
            />
          </Col>
        </Row>
        {values?.map((value, idx) => {
          if (value?.delete === true) return null;
          return(
            <Row
              key={value?.key ?? idx}
              style={{ marginBottom: 10 }}
            >
              <Col>
                {renderTextInput(value)}
              </Col>
              <Col style={styles.formIconLabel}>
                <Icon
                  android="md-remove"
                  ios="ios-remove"
                  style={[
                    styles.formIcon,
                    styles.addRemoveIcons,
                    styles.removeIcons,
                  ]}
                  onPress={() => _onRemove(value?.key)
                  }
                />
              </Col>
            </Row>
          )}
        )}
      </Col>
    );
  };

  const CommunicationLink = ({ key, url, value }) => (
    <Pressable key={key} onPress={() => Linking.openURL(url)}>
      <Text
        style={[
          globalStyles.rowContainer,
          styles.linkingText,
          { marginTop: "auto", marginBottom: "auto" },
        ]}
      >
        {value}
      </Text>
    </Pressable>
  );

  const isValidHttp = (communicationChannelValue) => {
    return communicationChannelValue?.toLowerCase()?.includes("http");
  };

  const isValidTLD = (communicationChannelValue) => {
    const lowercaseValue = communicationChannelValue?.toLowerCase();
    return (
      lowercaseValue?.includes(".com") ||
      lowercaseValue?.includes(".net") ||
      lowercaseValue?.includes(".org") ||
      lowercaseValue?.includes(".me")
    );
  };

  const isValidPhone = (communicationChannelValue) => {
    // TODO: phone regex
    return field?.name?.includes("phone");
  };

  const isValidEmail = (communicationChannelValue) => {
    // TODO: email regex
    return field?.name?.includes("email");
  };

  const isValidURL = (communicationChannelValue) => {
    // TODO: URL regex
    return (
      isValidHttp(communicationChannelValue) ||
      isValidTLD(communicationChannelValue)
    );
  };

  const CommunicationChannelFieldView = () => {
    return values?.map((communicationChannel, idx) => {
      const communicationChannelValue = communicationChannel?.value;
      // TODO: perform validation INSIDE CommunicationLink component
      if (isValidPhone(communicationChannelValue)) {
        return (
          <CommunicationLink
            key={communicationChannel?.key ?? idx}
            url={"tel:" + communicationChannelValue}
            value={communicationChannelValue}
          />
        );
      } else if (isValidEmail(communicationChannelValue)) {
        return (
          <CommunicationLink
            key={communicationChannel?.key ?? idx}
            url={"mailto:" + communicationChannelValue}
            value={communicationChannelValue}
          />
        );
      } else if (isValidURL(communicationChannelValue)) {
        const url = isValidHttp(communicationChannelValue)
          ? communicationChannelValue
          : `https://${communicationChannelValue}`;
        return (
          <CommunicationLink
            key={communicationChannel?.key ?? idx}
            url={url}
            value={communicationChannelValue}
          />
        );
      } else {
        return (
          <View style={globalStyles.postDetailsContainer}>
            <Text>
              {JSON.stringify(communicationChannelValue)}
            </Text>
          </View>
        );
      }
    });
  };

  if (_editing) return <CommunicationChannelFieldEdit />;
  return <CommunicationChannelFieldView />;
};
export default CommunicationChannelField;
