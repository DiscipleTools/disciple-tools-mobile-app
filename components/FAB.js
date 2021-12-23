import React from "react";
import { Icon } from "native-base";
import { useNavigation, useRoute } from "@react-navigation/native";

// 3rd-party Components
import ActionButton from "react-native-action-button";

import useI18N from "hooks/useI18N";
import useNetworkStatus from "hooks/useNetworkStatus.js";
import useType from "hooks/useType.js";
import useSettings from "hooks/useSettings";

// Styles, Constants, Icons, Assets, etc...
import Colors from "constants/Colors";
import { styles } from "./FAB.styles";

const FAB = ({ post }) => {
  const navigation = useNavigation();

  const { i18n, isRTL, locale } = useI18N();
  const isConnected = useNetworkStatus();

  const { isContact, isGroup } = useType();

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
    if (post) {
      Object.keys(settings.fields).forEach((field) => {
        if (field.startsWith("quick_button")) {
          //console.log(`field: ${ field }`);
          quickButtonFields.push(field);
        }
      });
      return quickButtonFields;
    }
    if (isContact) {
      return ["quick_button_new", "quick_button_import_contacts"];
    }
    return [];
  };

  const quickButtonFields = filterQuickButtonFields();
  //console.log(quickButtonFields);

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
          // TODO: constants
          navigation.navigate('CreateContact', {
            type: 'import'
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
          // TODO: constants
          navigation.navigate('ImportContacts', {
            type: 'import'
          });
        },
      };
    return null;
  };
  /*
            (async () => {
            })();
*/

  return (
    <>
      {quickButtonFields.length < 1 ? (
        <ActionButton
          buttonColor={Colors.primary}
          onPress={() => {
            // TODO: add new
            console.log("*** ADD NEW ***");
          }}
          renderIcon={() => (
            <Icon
              type={"Feather"}
              name={"plus"}
              style={[styles.FABIcon, { fontSize: 30 }]}
            />
          )}
        />
      ) : (
        <ActionButton
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
          }}
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
                type={post ? "MaterialCommunityIcons" : "Feather"}
                name={post ? "comment-plus" : "plus"}
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
      )}
    </>
  );
};
export default FAB;
