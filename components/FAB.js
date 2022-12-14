import { useNavigation } from "@react-navigation/native";

import {
  AddIcon,
  ClearIcon,
  CommentPlusIcon,
  MaterialCommunityIcon,
} from "components/Icon";
import ActionButton from "react-native-action-button";

import useAPI from "hooks/use-api";
//import useCache from "hooks/use-cache";
import useI18N from "hooks/use-i18n";
import useType from "hooks/use-type.js";
import useDetails from "hooks/use-details";
import useSettings from "hooks/use-settings";
import useStyles from "hooks/use-styles";

import {
  QuickActionButtonConstants,
  TypeConstants,
  ScreenConstants,
} from "constants";

import { localStyles } from "./FAB.styles";

const ListFAB = ({ offsetX, offsetY }) => {
  const navigation = useNavigation();
  const { styles, globalStyles } = useStyles(localStyles);
  const { i18n } = useI18N();
  const { isContact, postType, getTabScreenFromType } = useType();
  return (
    <ActionButton
      offsetX={offsetX}
      offsetY={offsetY}
      buttonColor={globalStyles.buttonColor.backgroundColor}
      shadowStyle={globalStyles.buttonShadow}
      renderIcon={(active) => {
        if (active) {
          return <ClearIcon style={styles.iconLg} />;
        }
        return <AddIcon style={styles.iconLg} />;
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
      <ActionButton.Item
        key={"new"}
        title={i18n.t("global.addNew")}
        onPress={() => {
          navigation.navigate(ScreenConstants.CREATE, {
            type: TypeConstants.CONTACT,
          });
        }}
        size={35}
        buttonColor={styles.item.backgroundColor}
        nativeFeedbackRippleColor="rgba(0,0,0,0)"
        textStyle={styles.itemText}
        textContainerStyle={{ height: "auto" }}
      >
        <MaterialCommunityIcon
          name="account-plus"
          style={[globalStyles.icon, styles.icon]}
        />
      </ActionButton.Item>
      <ActionButton.Item
        key={"import"}
        title={i18n.t("global.importContact")}
        onPress={() => {
          navigation.navigate(ScreenConstants.IMPORT, {
            type: TypeConstants.CONTACT,
          });
        }}
        size={35}
        buttonColor={styles.item.backgroundColor}
        nativeFeedbackRippleColor="rgba(0,0,0,0)"
        textStyle={styles.itemText}
        textContainerStyle={{ height: "auto" }}
      >
        <MaterialCommunityIcon
          name="card-account-phone"
          style={[globalStyles.icon, styles.icon]}
        />
      </ActionButton.Item>
    </ActionButton>
  );
};

const PostFAB = ({ offsetX, offsetY }) => {
  const navigation = useNavigation();

  const { styles, globalStyles } = useStyles(localStyles);
  //const { cache } = useCache():
  const { updatePost } = useAPI();

  const { isList, isPost, isContact, postType, getTabScreenFromType } =
    useType();

  const { data: post } = useDetails();

  const { settings } = useSettings();
  if (!settings) return null;
  const fields = settings?.post_types?.[post?.post_type]?.fields;

  const onSaveQuickAction = (quickActionPropertyName) => {
    const newActionValue = post[quickActionPropertyName]
      ? Number(post[quickActionPropertyName]) + 1
      : 1;
    const data = { [quickActionPropertyName]: newActionValue };
    updatePost({ data });
  };

  const filterQuickButtonFields = () => {
    if (isPost && fields) {
      const quickButtonFields = [];
      Object.keys(fields).forEach((field) => {
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
      title: fields?.[field]?.name ?? "",
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
      };
    if (field === QuickActionButtonConstants.MEETING_SCHEDULED)
      return {
        ...defaultIconConfig,
        name: "calendar-plus",
      };
    if (field === QuickActionButtonConstants.MEETING_COMPLETE)
      return {
        ...defaultIconConfig,
        name: "calendar-check",
      };
    if (field === QuickActionButtonConstants.MEETING_POSTPONED)
      return {
        ...defaultIconConfig,
        name: "calendar-minus",
      };
    if (field === QuickActionButtonConstants.NO_SHOW)
      return {
        ...defaultIconConfig,
        name: "calendar-remove",
      };
    return defaultIconConfig;
  };
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
};

const FAB = ({ offsetX, offsetY }) => {
  const { isList, isContact } = useType();
  if (isList) {
    return <ListFAB offsetX={offsetX} offsetY={offsetY} />;
  }
  // Groups (and other Post Types) are not supported yet
  if (isContact) {
    return <PostFAB offsetX={offsetX} offsetY={offsetY} />;
  }
  return null;
};
export default FAB;
