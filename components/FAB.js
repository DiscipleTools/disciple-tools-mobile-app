import React from "react";
import { Icon } from "native-base";
import { useNavigation } from "@react-navigation/native";

import ActionButton from "react-native-action-button";

import useI18N from "hooks/useI18N";
import useNetworkStatus from "hooks/useNetworkStatus.js";
import useType from "hooks/useType.js";
import useDetails from "hooks/useDetails";
import useSettings from "hooks/useSettings";

import Colors from "constants/Colors";
import { styles } from "./FAB.styles";

const FAB = () => {
  const navigation = useNavigation();

  const { i18n, isRTL, locale } = useI18N();
  const isConnected = useNetworkStatus();

  const { TypeConstants, isList, isPost, isContact, isGroup } = useType();

  const {
    data: post,
    error: postError,
    isLoading,
    isValidating,
    mutate,
    postId,
    postType
  } = useDetails();

  const { settings } = useSettings();
  if (!settings) return null;

  const onSaveQuickAction = (quickActionPropertyName) => {
    let newActionValue = post[quickActionPropertyName]
      ? parseInt(post[quickActionPropertyName], 10) + 1
      : 1;
    if (isConnected) {
      /* TODO
      onSaveContact({
        [quickActionPropertyName]: newActionValue,
      });
      */
    } else {
      // Update Seeker Path in OFFLINE mode
      let seekerPathValue = null;
      let quickActionName = quickActionPropertyName.replace(
        "quick_button_",
        ""
      );
      switch (quickActionName) {
        case "no_answer": {
          seekerPathValue = "attempted";
          break;
        }
        case "contact_established": {
          seekerPathValue = "established";
          break;
        }
        case "meeting_scheduled": {
          seekerPathValue = "scheduled";
          break;
        }
        case "meeting_complete": {
          seekerPathValue = "met";
          break;
        }
      }
      if (seekerPathValue && post.seeker_path != "met") {
        setState(
          (prevState) => ({
            ...state,
            contact: {
              ...prevpost,
              seeker_path: seekerPathValue,
            },
          }),
          () => {
            /*TODO
            onSaveContact({
              [quickActionPropertyName]: newActionValue,
            });
            */
          }
        );
      } else {
        /*TODO
        onSaveContact({
          [quickActionPropertyName]: newActionValue,
        });
        */
      }
    }
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

  // TODO: explanation
  const filterQuickButtonFields = () => {
    const quickButtonFields = [];
    if (isList && isContact) return ["quick_button_new", "quick_button_import_contacts"];
    if (isList && isGroup) return [];
    if (isPost) {
      Object.keys(settings.fields).forEach((field) => {
        if (field.startsWith("quick_button")) {
          quickButtonFields.push(field);
        };
      });
      return quickButtonFields;
    }
    return [];
  };

  const quickButtonFields = filterQuickButtonFields();

  const mapIcon = (field) => {
    const defaultIconConfig = {
      title: settings.fields[field]?.name ?? "",
      count: (post && post[field]) ?? 0,
      type: "Feather",
      name: "check",
      bgColor: Colors.primary,
      fgColor: Colors.buttonText,
      callback: () => onSaveQuickAction(field),
    };
    if (field === "quick_button_no_answer")
      return {
        ...defaultIconConfig,
        name: "phone-off",
        bgColor: Colors.colorNo,
      };
    if (field === "quick_button_contact_established")
      return {
        ...defaultIconConfig,
        type: "MaterialCommunityIcons",
        name: "phone-in-talk",
      };
    if (field === "quick_button_meeting_scheduled")
      return {
        ...defaultIconConfig,
        type: "MaterialCommunityIcons",
        name: "calendar-plus",
      };
    if (field === "quick_button_meeting_complete")
      return {
        ...defaultIconConfig,
        type: "MaterialCommunityIcons",
        name: "calendar-check",
      };
    if (field === "quick_button_meeting_postponed")
      return {
        ...defaultIconConfig,
        type: "MaterialCommunityIcons",
        name: "calendar-minus",
      };
    if (field === "quick_button_no_show")
      return {
        ...defaultIconConfig,
        type: "MaterialCommunityIcons",
        name: "calendar-remove",
      };
    if (field === "quick_button_new")
      return {
        ...defaultIconConfig,
        title: i18n.t("contactDetailScreen.addNewContact", { locale }), // TODO: group translate
        count: null,
        name: "plus",
        callback: () => {
          navigation.navigate('CreateContact', {
            type: TypeConstants.CONTACT_CREATE, 
          });
        },
      };
    if (field === "quick_button_import_contacts")
      return {
        ...defaultIconConfig,
        title: i18n.t("contactDetailScreen.importContact", { locale }),
        count: null,
        type: "MaterialIcons",
        //name: "user-check",
        name: "contact-phone",
        bgColor: Colors.colorYes,
        callback: () => {
          navigation.navigate('ImportContacts', {
            type: TypeConstants.CONTACT_IMPORT, 
          });
        },
      };
    return null;
  };

  return (
    <ActionButton
      buttonColor={Colors.primary}
      renderIcon={(active) =>
        active ? (
          <Icon
            type={"Feather"}
            name={"x"}
            style={[styles.FABIcon, { fontSize: 25 }]}
          />
        ) : (
          <Icon
            type={isList ? "Feather" : "MaterialCommunityIcons"}
            name={isList ? "plus" : "comment-plus"}
            style={[styles.FABIcon, { fontSize: 30 }]}
          />
        )
      }
      degrees={0}
      activeOpacity={0}
      bgColor="rgba(0,0,0,0.5)"
      nativeFeedbackRippleColor="rgba(0,0,0,0)"
    >
      {quickButtonFields.map((field) => {
        const { title, count, type, name, bgColor, fgColor, callback } =
          mapIcon(field);
        return (
          <ActionButton.Item
            key={count}
            title={count !== null ? `${title} (${count})` : title}
            onPress={() => {
              callback();
            }}
            size={40}
            buttonColor={bgColor}
            nativeFeedbackRippleColor="rgba(0,0,0,0)"
            textStyle={{ color: Colors.primary, fontSize: 15 }}
            textContainerStyle={{ height: "auto" }}
          >
            <Icon
              type={type}
              name={name}
              style={[styles.FABIcon, { color: fgColor }]}
            />
          </ActionButton.Item>
        );
      })}
    </ActionButton>
  );
};
export default FAB;
