import React from "react";
import { useNavigation } from "@react-navigation/native";

import {
  AddIcon,
  ClearIcon,
  CommentPlusIcon,
  MaterialCommunityIcon,
} from "components/Icon";
import ActionButton from "react-native-action-button";

import useI18N from "hooks/use-i18n";
import useType from "hooks/use-type.js";
import useDetails from "hooks/use-details";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";
import useAPI from "hooks/use-api";

import {
  QuickActionButtonConstants,
  TypeConstants,
  ScreenConstants,
} from "constants";

import { localStyles } from "./FAB.styles";

const FAB = ({ offsetX, offsetY }) => {
  const navigation = useNavigation();

  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n, locale } = useI18N();

  const { isList, isPost, isContact, getTabScreenFromType } = useType();

  const {
    data: post,
    error: postError,
    isLoading,
    isValidating,
    mutate,
    postId,
    postType,
  } = useDetails();

  const { updatePost } = useAPI();

  const { settings } = useSettings();
  if (!settings) return null;

  const onSaveQuickAction = (quickActionPropertyName) => {
    const newActionValue = post[quickActionPropertyName]
      ? Number(post[quickActionPropertyName]) + 1
      : 1;
    updatePost({ fields: { [quickActionPropertyName]: newActionValue } });
  };

  // TODO: merge with onSaveQuickAction
  const onMeetingComplete = () => {
    onSaveQuickAction("quick_button_meeting_complete");
    var isQuestionnaireEnabled = false;
    var q_id = null;
    // loop thru all (active) questionnaires, and check whether 'contact'->'meeting_complete' is enabled
    questionnaires.map((questionnaire) => {
      if (
        questionnaire.trigger_type == "contact" &&
        questionnaire.trigger_value == "meeting_complete"
      ) {
        isQuestionnaireEnabled = true;
        q_id = questionnaire.id;
      }
    });
    /* TODO
    if (isQuestionnaireEnabled) {
      navigation.navigate(
        NavigationActions.navigate({
          routeName: 'Questionnaire',
          action: NavigationActions.navigate({
            routeName: 'Question',
            params: {
              userData: userData,
              contact: post,
              q_id,
            },
          }),
        }),
      );
    }
    */
  };

  const filterQuickButtonFields = () => {
    if (isList && isContact)
      return ["quick_button_new", "quick_button_import_contacts"];
    if (isPost && settings?.fields) {
      const quickButtonFields = [];
      Object.keys(settings.fields).forEach((field) => {
        if (field.startsWith("quick_button")) quickButtonFields.push(field);
      });
      //if (quickButtonFields.length === 0 && isGroup) return ["quick_button_contact_established"];
      return quickButtonFields;
    }
    return [];
  };

  const quickButtonFields = filterQuickButtonFields();

  const mapItem = (field) => {
    const defaultIconConfig = {
      title: settings?.fields?.[field]?.name ?? "",
      count: (post && post?.[field]) ?? 0,
      name: "check",
      bgColor: styles.item.backgroundColor,
      fgColor: styles.item.color,
      callback: () => onSaveQuickAction(field),
    };
    if (field === QuickActionButtonConstants.NO_ANSWER)
      return {
        ...defaultIconConfig,
        name: "account-voice-off",
        //bgColor: "red", //Colors.colorNo,
      };
    if (field === QuickActionButtonConstants.CONTACT_ESTABLISHED)
      return {
        ...defaultIconConfig,
        name: "account-voice",
        //bgColor: "green", //TODO
      };
    if (field === QuickActionButtonConstants.MEETING_SCHEDULED)
      return {
        ...defaultIconConfig,
        name: "calendar-plus",
        //bgColor: "orange", //TODO
      };
    if (field === QuickActionButtonConstants.MEETING_COMPLETE)
      return {
        ...defaultIconConfig,
        name: "calendar-check",
        //bgColor: "green", //TODO
      };
    if (field === QuickActionButtonConstants.MEETING_POSTPONED)
      return {
        ...defaultIconConfig,
        name: "calendar-minus",
        //bgColor: "orange", //TODO
      };
    if (field === QuickActionButtonConstants.NO_SHOW)
      return {
        ...defaultIconConfig,
        name: "calendar-remove",
        //bgColor: "red", //TODO
      };
    if (field === QuickActionButtonConstants.NEW)
      return {
        ...defaultIconConfig,
        title: i18n.t("global.addNew"),
        count: null,
        name: "account-plus",
        //bgColor: "green", //TODO
        callback: () => {
          navigation.navigate(ScreenConstants.CREATE, {
            type: TypeConstants.CONTACT,
          });
        },
      };
    if (field === QuickActionButtonConstants.IMPORT)
      return {
        ...defaultIconConfig,
        title: i18n.t("global.importContact"),
        count: null,
        name: "card-account-phone",
        //bgColor: "orange", //TODO
        callback: () => {
          navigation.navigate(ScreenConstants.IMPORT, {
            type: TypeConstants.CONTACT,
          });
        },
      };
    return defaultIconConfig;
  };

  if (!isContact && !isList) return null;
  if (isList || isPost) {
    return (
      <ActionButton
        offsetX={offsetX}
        offsetY={offsetY}
        buttonColor={globalStyles.buttonColor.backgroundColor}
        shadowStyle={globalStyles.buttonShadow}
        renderIcon={(active) => {
          if (active) return <ClearIcon style={styles.iconLg} />;
          if (isList) return <AddIcon style={styles.iconLg} />;
          return <CommentPlusIcon style={styles.iconLg} />;
        }}
        degrees={0}
        activeOpacity={0}
        // TODO: style
        bgColor="rgba(0,0,0,0.5)"
        nativeFeedbackRippleColor="rgba(0,0,0,0)"
        onPress={() => {
          if (!isContact) {
            const tabScreen = getTabScreenFromType(postType);
            navigation.jumpTo(tabScreen, {
              screen: ScreenConstants.CREATE,
              type: postType,
            });
          }
        }}
      >
        {quickButtonFields?.length > 0 &&
          quickButtonFields.map((field) => {
            const { title, count, name, bgColor, fgColor, callback } =
              mapItem(field);
            return (
              <ActionButton.Item
                key={count}
                title={count !== null ? `${title} (${count})` : title}
                onPress={() => callback()}
                size={35}
                buttonColor={bgColor}
                nativeFeedbackRippleColor="rgba(0,0,0,0)"
                textStyle={styles.itemText}
                textContainerStyle={{ height: "auto" }}
              >
                <MaterialCommunityIcon
                  name={name}
                  style={[globalStyles.icon, styles.icon]}
                />
              </ActionButton.Item>
            );
          })}
      </ActionButton>
    );
  }
  return null;
};
export default FAB;
