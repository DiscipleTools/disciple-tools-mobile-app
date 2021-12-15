import React from "react";
import { Text } from "react-native";
import PropTypes from "prop-types";

import {
  Body,
  Button as NbButton,
  Container,
  Icon,
  Left,
  ListItem,
  Right,
  Switch,
  Thumbnail,
} from "native-base";

// TODO: hide Expo APIs in Hooks like Redux
import Constants from "expo-constants";
import * as MailComposer from "expo-mail-composer";

import { useAuth } from "hooks/useAuth";
import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";
import usePIN from "hooks/usePIN";
import useToast from "hooks/useToast";

import OfflineBar from "components/OfflineBar";
import LanguagePicker from "components/LanguagePicker";

import { styles } from "./SettingsScreen.styles";
import gravatar from "assets/gravatar-default.png";

const SettingsScreen = ({ navigation }) => {
  const { isConnected, toggleNetwork } = useNetworkStatus();
  const { i18n, isRTL } = useI18N();
  const { PINConstants, hasPIN } = usePIN();
  const {
    user,
    isAutoLogin,
    rememberLoginDetails,
    toggleAutoLogin,
    toggleRememberLoginDetails,
    signOut,
  } = useAuth();
  const toast = useToast();


  const Header = () => {
    const username = user?.username ?? "";
    const domain = user?.domain ?? "";
    return (
      <ListItem itemHeader first avatar style={styles.header}>
        <Left>
          <Thumbnail source={gravatar} />
        </Left>
        <Body style={styles.headerBody}>
          <Text
            style={[
              {
                writingDirection: isRTL ? "rtl" : "ltr",
                textAlign: isRTL ? "right" : "left",
              },
              styles.username,
            ]}
          >
            {username}
          </Text>
          <Text
            style={[
              {
                writingDirection: isRTL ? "rtl" : "ltr",
                textAlign: isRTL ? "right" : "left",
              },
              styles.domain,
            ]}
          >
            {domain}
          </Text>
        </Body>
      </ListItem>
    );
  };

  const SettingsOption = ({
    onPress,
    iconType,
    iconName,
    label,
    component,
  }) => (
    <ListItem icon onPress={onPress ?? null}>
      <Left>
        <NbButton style={styles.button} onPress={onPress ?? null}>
          <Icon type={iconType} name={iconName} />
        </NbButton>
      </Left>
      <Body style={styles.body}>
        <Text
          style={{
            writingDirection: isRTL ? "rtl" : "ltr",
            textAlign: isRTL ? "right" : "left",
          }}
        >
          {label}
        </Text>
      </Body>
      <Right>{component}</Right>
    </ListItem>
  );

  /*
  const StorybookButton = () => (
    <SettingsOption
      onPress={() => navigation.navigate('Storybook')}
      iconName="flask"
      label={i18n.t('settingsScreen.storybook')}
    />
  );
  */

  const OnlineToggle = () => (
    <SettingsOption
      iconName="ios-flash"
      label={i18n.t("global.online")}
      component={
        <Switch value={isConnected} onChange={toggleNetwork} disabled={false} />
      }
    />
  );

  const AutoLoginToggle = () => (
    <SettingsOption
      iconType="MaterialCommunityIcons"
      iconName="login-variant"
      label={i18n.t("settingsScreen.autoLogin")}
      component={<Switch value={isAutoLogin} onChange={toggleAutoLogin} />}
    />
  );

  const RememberLoginDetailsToggle = () => (
    <SettingsOption
      iconType="MaterialCommunityIcons"
      iconName="onepassword"
      label={i18n.t("settingsScreen.rememberLoginDetails")}
      component={
        <Switch
          value={rememberLoginDetails}
          onChange={toggleRememberLoginDetails}
        />
      }
    />
  );

  const PINCodeToggle = () => {
    const togglePIN = () => {
      const type = hasPIN ? PINConstants.DELETE : PINConstants.SET;
      navigation.navigate(PINConstants.SCREEN, {
        type,
        code: null,
      });
    };
    console.log("~~~~~~~~~ hasPIN", hasPIN);
    return (
      <SettingsOption
        iconType="MaterialCommunityIcons"
        iconName="security"
        label={i18n.t("settingsScreen.pinCode")}
        component={<Switch value={hasPIN} onChange={togglePIN} />}
      />
    );
  };

  const HelpSupportButton = () => {
    const draftNewSupportEmail = () => {
      MailComposer.composeAsync({
        recipients: ["appsupport@disciple.tools"],
        subject: `DT App Support: v${Constants.manifest.version}`,
        body: "",
      }).catch((error) => {
        toast(error.toString(), true);
      });
    };
    return (
      <SettingsOption
        onPress={draftNewSupportEmail}
        iconType="MaterialCommunityIcons"
        iconName="help-circle"
        label={i18n.t("settingsScreen.helpSupport")}
      />
    );
  };

  const LogoutButton = () => (
    <SettingsOption
      onPress={signOut}
      iconName="log-out"
      label={i18n.t("settingsScreen.logout")}
      component={<Icon active name={isRTL ? "arrow-back" : "arrow-forward"} />}
    />
  );

  const AppVersionText = () => (
    <Text style={styles.versionText}>{Constants.manifest.version}</Text>
  );

  return (
    <Container style={styles.container}>
      {!isConnected && <OfflineBar />}
      <Header />
      {/*__DEV__ && <StorybookButton />*/}
      <OnlineToggle />
      <LanguagePicker dropdown={true} />
      <AutoLoginToggle />
      <RememberLoginDetailsToggle />
      <PINCodeToggle />
      <HelpSupportButton />
      <LogoutButton />
      <AppVersionText />
    </Container>
  );
};
SettingsScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
};
export default SettingsScreen;
