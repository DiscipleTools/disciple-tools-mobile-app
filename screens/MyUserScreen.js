import React, { useLayoutEffect } from "react";
import { Image, Pressable, Switch, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
//import { useIsFocused } from "@react-navigation/native";

import {
  ChevronForwardIcon,
  ChevronBackIcon,
  CommentActivityIcon,
  ActivityIcon,
  LogsIcon,
  DarkModeIcon,
  FlashIcon,
  HelpIcon,
  LoginIcon,
  LogoutIcon,
  OnePasswordIcon,
  SecurityIcon,
} from "components/Icon";
import { HeaderRight } from "components/Header/Header";
import OfflineBar from "components/OfflineBar";
import LanguagePicker from "components/Picker/LanguagePicker";
import ListItem from "components/ListItem";
import AppVersion from "components/AppVersion";

import { useAuth } from "hooks/use-auth";
import useApp from "hooks/use-app";
import useNetwork from "hooks/use-network";
import useI18N from "hooks/use-i18n";
import useMyUser from "hooks/use-my-user";
import usePIN from "hooks/use-pin";
import useUsers from "hooks/use-users";
import useStyles from "hooks/use-styles";
import useTheme from "hooks/use-theme";

import gravatar from "assets/gravatar-default.png";

import { ScreenConstants, TypeConstants, SubTypeConstants } from "constants";

import { localStyles } from "./MyUserScreen.styles";

const MyUserScreen = ({ navigation }) => {
  // NOTE: invoking this hook causes the desired re-render onBack()
  //useIsFocused();

  const { styles, globalStyles } = useStyles(localStyles);
  const { isConnected, toggleNetwork } = useNetwork();
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
  const { isDarkMode, toggleMode } = useTheme();
  const { data: userData } = useMyUser();
  const { data: users } = useUsers();
  const myUser = users?.find((user) => user?.ID === userData?.ID);
  const id = myUser?.contact_id;
  const name = userData?.display_name ?? "";
  const role = userData?.ID ?? "";
  const domain = user?.domain ?? "";

  useLayoutEffect(() => {
    const kebabItems = [
      {
        label: i18n.t("global.viewOnWeb"),
        urlPath: "settings",
      },
      {
        label: i18n.t("global.documentation"),
        url: `https://disciple.tools/user-docs/disciple-tools-mobile-app/how-to-use/settings-screen/`,
      },
    ];
    navigation.setOptions({
      title: i18n.t("global.user"),
      headerRight: (props) => (
        <HeaderRight
          kebabItems={kebabItems}
          renderStartIcons={() => (
            <>
              <Pressable
                onPress={() => {
                  navigation.push(ScreenConstants.COMMENTS_ACTIVITY, {
                    id,
                    name,
                    type: TypeConstants.CONTACT,
                    subtype: SubTypeConstants.COMMENTS_ACTIVITY,
                  });
                }}
                style={styles.commentActivityIcon}
              >
                <CommentActivityIcon />
              </Pressable>
            </>
          )}
          props
        />
      ),
    });
  }, []);

  const Header = () => (
    <View style={[globalStyles.rowContainer, styles.headerContainer]}>
      <Image
        defaultSource={gravatar}
        source={gravatar}
        resizeMethod="scale"
        resizeMode="cover"
        style={styles.avatar}
      />
      <View style={[globalStyles.columnContainer]}>
        {id ? (
          <Pressable
            onPress={() => {
              navigation.push(ScreenConstants.DETAILS, {
                id,
                name,
                type: TypeConstants.CONTACT,
              });
            }}
          >
            <Text
              style={[styles.headerText, globalStyles.title, globalStyles.link]}
            >
              {name}
            </Text>
          </Pressable>
        ) : (
          <Text style={[styles.headerText, globalStyles.title]}>{name}</Text>
        )}
        {/*<Text style={styles.headerText2}>{role}</Text>*/}
        <Text style={styles.headerText}>{domain}</Text>
      </View>
      {/*
      <Pressable
        onPress={() => {
          //todo: add logs screen
        }}
        style={styles.commentActivityIcon}
      >
        <LogsIcon style={globalStyles.placeholder} />
      </Pressable>
      */}
    </View>
  );

  const OnlineToggle = () => (
    <ListItem
      startComponent={<FlashIcon />}
      label={i18n.t("global.online")}
      endComponent={
        <Switch
          trackColor={{ true: styles.switch.color }}
          thumbColor={styles.switch}
          value={isConnected}
          onChange={() => toggleNetwork(!isConnected)}
          disabled={false}
        />
      }
    />
  );

  const DarkModeToggle = () => (
    <ListItem
      startComponent={
        <DarkModeIcon
          style={[
            globalStyles.icon,
            { transform: isRTL ? [] : [{ scaleX: -1 }] },
          ]}
        />
      }
      label={i18n.t("global.darkMode")}
      endComponent={
        <Switch
          trackColor={{ true: styles.switch.color }}
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
      label={i18n.t("global.autoLogin")}
      endComponent={
        <Switch
          trackColor={{ true: styles.switch.color }}
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
      label={i18n.t("global.rememberLoginDetails")}
      endComponent={
        <Switch
          trackColor={{ true: styles.switch.color }}
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
        label={i18n.t("global.pinCode")}
        endComponent={
          <Switch
            trackColor={{ true: styles.switch.color }}
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
        label={i18n.t("global.support")}
        onPress={draftNewSupportEmail}
      />
    );
  };

  const LogoutButton = () => (
    <ListItem
      startComponent={<LogoutIcon />}
      label={i18n.t("global.logout")}
      endComponent={
        isRTL ? (
          <ChevronBackIcon style={globalStyles.icon} />
        ) : (
          <ChevronForwardIcon style={globalStyles.icon} />
        )
      }
      onPress={signOut}
    />
  );

  return (
    <ScrollView style={globalStyles.screenContainer}>
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
    </ScrollView>
  );
};
export default MyUserScreen;
