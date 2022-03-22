import React, { useCallback } from "react";
import { Image, Switch, Text, View } from "react-native";
import { useIsFocused } from '@react-navigation/native';

import {
  ChevronForwardIcon,
  ChevronBackIcon,
  DarkModeIcon,
  FlashIcon,
  HelpIcon,
  LoginIcon,
  LogoutIcon,
  OnePasswordIcon,
  SecurityIcon
} from "components/Icon";
import ListItem from "components/ListItem";
import OfflineBar from "components/OfflineBar";
import LanguagePicker from "components/Picker/LanguagePicker";
import AppVersion from "components/AppVersion";

import { useAuth } from "hooks/use-auth";
import useApp from "hooks/use-app";
import useNetwork from "hooks/use-network";
import useI18N from "hooks/use-i18n";
import usePIN from "hooks/use-pin";
import useStyles from "hooks/use-styles";
import useTheme from "hooks/use-theme";

import { localStyles } from "./SettingsScreen.styles";
import gravatar from "assets/gravatar-default.png";

const SettingsScreen = ({ navigation }) => {

  // NOTE: invoking this hook causes the desired re-render onBack()
  useIsFocused();

  const { styles, globalStyles } = useStyles(localStyles);
  const { isConnected, toggleNetwork } = useNetwork();
  const { i18n, isRTL, locale } = useI18N();
  const { PINConstants, hasPIN } = usePIN();
  const {
    user,
    isAutoLogin,
    rememberLoginDetails,
    toggleAutoLogin,
    toggleRememberLoginDetails,
    signOut,
  } = useAuth();
  const { isDarkMode, toggleMode } = useTheme();

  const Header = () => {
    const username = user?.username ?? "";
    const domain = user?.domain ?? "";
    return (
      <View style={[
        globalStyles.rowContainer,
        styles.headerContainer
      ]}>
        <Image
          source={gravatar}
          style={styles.avatar}
        />
        <View style={globalStyles.columnContainer}>
          <Text style={[
            styles.headerText,
            globalStyles.title,
          ]}>
            {username}
          </Text>
          <Text style={styles.headerText}>
            {domain}
          </Text>
        </View>
      </View>
    );
  };

  //const StorybookButton = () => null;

  const OnlineToggle = () => (
    <ListItem
      startComponent={<FlashIcon />}
      label={i18n.t("global.online", { locale })}
      endComponent={
        <Switch
          trackColor={{ true: styles.switch.color}}
          thumbColor={styles.switch}
          value={isConnected}
          onChange={toggleNetwork}
          disabled={false}
        />
      }
    />
  );

  const DarkModeToggle = () => (
    <ListItem
      startComponent={<DarkModeIcon style={[globalStyles.icon, { transform: isRTL ? [] : [{ scaleX: -1 }]}]} />}
      label={i18n.t("global.darkMode", { locale })}
      endComponent={
        <Switch
          trackColor={{ true: styles.switch.color}}
          thumbColor={styles.switch}
          value={isDarkMode}
          onChange={() => toggleMode()}
        />
      }
    />
  );

  const AutoLoginToggle = () => (
    <ListItem
      startComponent={<LoginIcon />}
      label={i18n.t("settingsScreen.autoLogin", { locale })}
      endComponent={
        <Switch
          trackColor={{ true: styles.switch.color}}
          thumbColor={styles.switch}
          value={isAutoLogin}
          onChange={toggleAutoLogin}
        />
      }
    />
  );

  const RememberLoginDetailsToggle = () => (
    <ListItem
      startComponent={<OnePasswordIcon />}
      label={i18n.t("settingsScreen.rememberLoginDetails", { locale })}
      endComponent={
        <Switch
          trackColor={{ true: styles.switch.color}}
          thumbColor={styles.switch}
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
    return (
      <ListItem
        startComponent={<SecurityIcon />}
        label={i18n.t("settingsScreen.pinCode", { locale })}
        endComponent={
          <Switch
            trackColor={{ true: styles.switch.color}}
            thumbColor={styles.switch}
            value={hasPIN}
            onChange={togglePIN}
          />
        }
      />
    );
  };

  const HelpSupportButton = () => {
    const { draftNewSupportEmail } = useApp();
    return (
      <ListItem
        startComponent={<HelpIcon />}
        label={i18n.t("settingsScreen.helpSupport", { locale })}
        onPress={draftNewSupportEmail}
      />
    );
  };

  const LogoutButton = () => (
    <ListItem
      startComponent={<LogoutIcon />}
      label={i18n.t("settingsScreen.logout", { locale })}
      endComponent={
        isRTL ? <ChevronBackIcon style={globalStyles.icon} /> : <ChevronForwardIcon style={globalStyles.icon} />
      }
      onPress={signOut}
    />
  );

  return (
    <View style={globalStyles.screenContainer}>
      <OfflineBar />
      <Header />
      {/*__DEV__ && <StorybookButton />*/}
      <OnlineToggle />
      <DarkModeToggle />
      <AutoLoginToggle />
      <RememberLoginDetailsToggle />
      <PINCodeToggle />
      <HelpSupportButton />
      <LogoutButton />
      <View style={styles.formContainer}>
        <LanguagePicker />
        <AppVersion />
      </View>
    </View>
  );
};
export default SettingsScreen;