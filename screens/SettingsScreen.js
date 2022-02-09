import React, { useCallback, useMemo, useReducer, useRef, useState } from "react";
import { Image, Pressable, Switch, Text, View } from "react-native";
// TODO: remove
import { Icon } from "native-base";

// TODO: hide expo imports in hooks
import * as MailComposer from "expo-mail-composer";

import OfflineBar from "components/OfflineBar";
//import LanguagePicker from "components/LanguagePicker";
import AppVersion from "components/AppVersion";
//import SelectSheet from "components/Sheets/SelectSheet";

import { useAuth } from "hooks/useAuth";
import useApp from "hooks/useApp";
import useNetworkStatus from "hooks/useNetworkStatus";
import useI18N from "hooks/useI18N";
import usePIN from "hooks/usePIN";
import useStyles from "hooks/useStyles";
import useToast from "hooks/useToast";

import { localStyles } from "./SettingsScreen.styles";
import gravatar from "assets/gravatar-default.png";

const SettingsScreen = ({ navigation }) => {
  const { isConnected, toggleNetwork } = useNetworkStatus();
  const { i18n, isRTL, locale } = useI18N();
  const { PINConstants, hasPIN } = usePIN();
  const { styles, globalStyles } = useStyles(localStyles);
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
      <View style={[
        globalStyles.rowContainer,
        styles.headerContainer
      ]}>
        <Image
          source={gravatar}
          style={styles.avatar}
        />
        <View style={globalStyles.columnContainer}>
          <Text style={globalStyles.title}>
            {username}
          </Text>
          <Text style={styles.headerDomain}>
            {domain}
          </Text>
        </View>
      </View>
    );
  };

  const SettingsOption = ({
    pressable,
    onPress,
    iconType,
    iconName,
    label,
    component,
  }) => (
    <Pressable
      disabled={!pressable}
      onPress={onPress}
    >
      <View style={[
        globalStyles.rowContainer,
        styles.optionContainer,
      ]}>
        <View style={globalStyles.columnContainer}>
          <Icon
            type={iconType}
            name={iconName}
            style={[
              globalStyles.icon,
              iconName === "theme-light-dark" ? { transform: [{ scaleX: -1 }]} : null
            ]}
          />
        </View>
        <View style={[
          globalStyles.columnContainer,
          globalStyles.body,
        ]}>
          <Text>
            {label}
          </Text>
        </View>
        <View style={globalStyles.columnContainer}>
          {component}
        </View>
      </View>
    </Pressable>
  );

  /*
  const StorybookButton = () => (
    <SettingsOption
      onPress={() => navigation.navigate('Storybook')}
      iconName="flask"
      label={i18n.t('settingsScreen.storybook', { locale })}
    />
  );
  */

  const [dmvalue, setDMValue] = useState(true);
  const DarkModeToggle = () => (
    <SettingsOption
      iconType="MaterialCommunityIcons"
      iconName="theme-light-dark"
      // TODO: translate
      label={"Light/Dark Mode"}
      component={
        <Switch
          trackColor={{ true: styles.switch.color}}
          thumbColor={styles.switch}
          value={dmvalue}
          onChange={() => setDMValue(!dmvalue)}
        />
      }
    />
  );

  const OnlineToggle = () => (
    <SettingsOption
      iconName="ios-flash"
      label={i18n.t("global.online", { locale })}
      component={
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

  const LanguagePicker = () => {
    const endonym = i18n?.translations[locale]?.endonym;
    return(
      <SettingsOption
        iconName="language"
        label={i18n.t("global.language", { locale })}
        component={
          <Pressable onPress={() => showLangSheet(true)}>
            <View>
              <Text>{endonym}</Text>
            </View>
          </Pressable>
        }
        //component={
        //  <Switch value={isConnected} onChange={toggleNetwork} disabled={false} />
        //}
      />
    );
  };

  const AutoLoginToggle = () => (
    <SettingsOption
      iconType="MaterialCommunityIcons"
      iconName="login-variant"
      label={i18n.t("settingsScreen.autoLogin", { locale })}
      component={
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
    <SettingsOption
      iconType="MaterialCommunityIcons"
      iconName="onepassword"
      label={i18n.t("settingsScreen.rememberLoginDetails", { locale })}
      component={
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
      <SettingsOption
        iconType="MaterialCommunityIcons"
        iconName="security"
        label={i18n.t("settingsScreen.pinCode", { locale })}
        component={
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
    const { version } = useApp();
    const draftNewSupportEmail = () => {
      MailComposer.composeAsync({
        recipients: ["appsupport@disciple.tools"],
        subject: `DT App Support: v${version}`,
        body: "",
      }).catch((error) => {
        toast(error.toString(), true);
      });
    };
    return (
      <SettingsOption
        pressable  
        onPress={draftNewSupportEmail}
        iconType="MaterialCommunityIcons"
        iconName="help-circle"
        label={i18n.t("settingsScreen.helpSupport", { locale })}
      />
    );
  };

  const LogoutButton = () => (
    <SettingsOption
      pressable  
      onPress={signOut}
      iconName="log-out"
      label={i18n.t("settingsScreen.logout", { locale })}
      component={<Icon name={isRTL ? "arrow-back" : "arrow-forward"} style={globalStyles.icon} />}
    />
  );

  const LanguageSheet = () => {

    const SortConstants = {
      LAST_MOD_ASC: "sort_last_mod_asc",
      LAST_MOD_DESC: "sort_last_mod_desc",
      CREATED_ASC: "sort_created_asc",
      CREATED_DESC: "sort_created_desc",
    };

    // post_date
    // last_modified
    const onDismiss = () => langSheetRef.current.close();
    const onDone = (item) => {
      console.log('**** onDone');
      console.log(`items: ${JSON.stringify(item)}`);
    };
    const onSnap = useCallback((index) => {
      console.log('handleSheetChanges', index);
    }, []);
    const snapPoints = useMemo(() => ['50%', '95%'], []);
    const sections = useMemo(() => 
      [
        {
          title: "Endonym (Locale)",
          data: [
          {
            key: SortConstants.LAST_MOD_ASC,
            // TODO: translate
            label: "English (en-US)",
            locale: "en-US",
            selected: true,
          },
          {
            key: SortConstants.LAST_MOD_DESC,
            // TODO: translate
            label: "French (fr-FR)",
            locale: "fr-FR",
            selected: false,
          },
        ]
      },
    ]
    , []);

    return null;
    /*
    return(
      <SelectSheet
        ref={langSheetRef}
        snapPoints={snapPoints}
        onSnap={onSnap}
        // TODO: translate
        title={"Language"}
        sections={sections}
        //renderSection={renderSection}
        //renderItem={renderItem}
        onDismiss={onDismiss}
        onDone={onDone}
      />
    );
    */
  };

  const langSheetRef = useRef(null);
  const showLangSheet = () => langSheetRef.current.expand();

  return (
    <View style={globalStyles.screenContainer}>
      <OfflineBar />
      <Header />
      {/*__DEV__ && <StorybookButton />*/}
      <OnlineToggle />
      <DarkModeToggle />
      <LanguagePicker />
      <AutoLoginToggle />
      <RememberLoginDetailsToggle />
      <PINCodeToggle />
      <HelpSupportButton />
      <LogoutButton />
      <AppVersion />
    </View>
  );
};
export default SettingsScreen;
