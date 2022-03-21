import React from "react";
// TODO: swap out for React Native Icon
import { Icon } from "native-base";

import useStyles from "hooks/use-styles";

import { FieldConstants, FieldTypes, FieldNames } from "constants";

const FieldIcon = ({ field, hide }) => {
  const { globalStyles } = useStyles();
  const type = field.type;
  const name = field.name;
  let iconType = "";
  let iconName = "";
  // TODO: use constants for case stmts
  switch (type) {
    case FieldTypes.LOCATION_META:
      iconType = "FontAwesome";
      iconName = "map-marker";
      break;
    case FieldTypes.DATE:
      if (name.includes("church_start_date")) {
        iconType = "FontAwesome";
        iconName = "calendar-check-o";
      } else if (name.includes("post_date")) {
        iconType = "FontAwesome";
        iconName = "calendar-o";
      } else if (name.includes("start")) {
        iconType = "FontAwesome";
        iconName = "calendar-plus-o";
      } else if (name.includes("end")) {
        iconType = "FontAwesome";
        iconName = "calendar-times-o";
      } else {
        iconType = "FontAwesome";
        iconName = "calendar";
      }
      break;
    case FieldTypes.CONNECTION:
      if (name.includes("subassigned")) {
        iconType = "MaterialCommunityIcons";
        iconName = "briefcase-account-outline";
      } else if (name.includes("relation")) {
        iconType = "FontAwesome5";
        iconName = "people-arrows";
      } else if (name.includes("people_groups")) {
        iconType = "FontAwesome";
        iconName = "globe";
      } else if (name.includes("coach")) {
        iconType = "MaterialCommunityIcons";
        iconName = "teach";
      } else if (name.includes("bapti")) {
        iconType = "FontAwesome5";
        iconName = "water";
      } else if (name.includes("group")) {
        iconType = "MaterialIcons";
        iconName = "groups";
      } else if (name.includes("train")) {
        iconType = "FontAwesome5";
        iconName = "chalkboard-teacher";
      } else if (name.includes("members")) {
        iconType = "FontAwesome5";
        iconName = "list-ol";
      } else if (name.includes("leaders")) {
        iconType = "FontAwesome";
        iconName = "globe";
      } else {
        iconType = "MaterialIcons";
        iconName = "group-work";
      }
      break;
    case FieldTypes.MULTI_SELECT:
      if (name.includes("email")) {
        iconType = "FontAwesome";
        iconName = "envelope";
      } else if (name.includes("sources")) {
        iconType = "FontAwesome5";
        iconName = "compress-arrows-alt";
      } else if (name.includes("health_metrics")) {
        iconType = "FontAwesome5";
        iconName = "tachometer-alt";
      } else {
        iconType = "Ionicons";
        iconName = "list-circle";
      }
      break;
    case FieldTypes.COMMUNICATION_CHANNEL:
      if (name.includes("phone")) {
        iconType = "FontAwesome";
        iconName = "phone";
      } else if (name.includes("email")) {
        iconType = "FontAwesome";
        iconName = "envelope";
      } else if (name.includes("twitter")) {
        iconType = "MaterialCommunityIcons";
        iconName = "twitter";
      } else if (name.includes("facebook")) {
        iconType = "MaterialCommunityIcons";
        iconName = "facebook";
      } else if (name.includes("instagram")) {
        iconType = "MaterialCommunityIcons";
        iconName = "instagram";
      } else if (name.includes("whatsapp")) {
        iconType = "MaterialCommunityIcons";
        iconName = "whatsapp";
      } else if (name.includes("address")) {
        iconType = "FontAwesome5";
        iconName = "directions";
      } else {
        iconType = "Feather";
        iconName = "hash";
      }
      break;
    case FieldTypes.KEY_SELECT:
      if (name.includes("faith_status")) {
        iconType = "FontAwesome5";
        iconName = "cross";
      } else if (name.includes("seeker_path")) {
        iconType = "MaterialCommunityIcons";
        iconName = "map-marker-path";
      } else if (name.includes("gender")) {
        iconType = "FontAwesome5";
        iconName = "transgender";
      } else if (name.includes("age")) {
        iconType = "FontAwesome5";
        iconName = "user-clock";
      } else if (name.includes("group_status")) {
        iconType = "FontAwesome5";
        iconName = "crosshairs";
      } else if (name.includes("group_type")) {
        iconType = "Entypo";
        iconName = "hair-cross";
      } else if (name.includes("group")) {
        iconType = "FontAwesome";
        iconName = "crosshairs";
      } else {
        iconType = "Ionicons";
        iconName = "list-circle";
      }
      break;
    case FieldTypes.USER_SELECT:
      if (name.includes("assigned_to")) {
        iconType = "MaterialCommunityIcons";
        iconName = "briefcase-account";
      } else {
        iconType = "FontAwesome";
        iconName = "user";
      }
      break;
    case FieldTypes.TAGS:
      iconType = "AntDesign";
      iconName = "tags";
      break;
    case FieldTypes.TEXT:
      if (name.includes("nickname")) {
        iconType = "FontAwesome5";
        iconName = "user-tag";
      } else if (name.includes("four_fields")) {
        iconType = "FontAwesome5";
        iconName = "dice-four";
      } else if (name.includes("name")) {
        iconType = "FontAwesome5";
        iconName = "user-alt";
      } else {
        iconType = "Entypo";
        iconName = "text";
      }
      break;
    case FieldTypes.NUMBER:
      if (name.includes("leader")) {
        iconType = "FontAwesome5";
        iconName = "hashtag";
      } else {
        iconType = "Feather";
        iconName = "hash";
      }
      break;
    default:
      iconType = "MaterialCommunityIcons";
      iconName = "square-small";
      break;
  };
  return (
    <Icon
      type={iconType}
      name={iconName}
      style={globalStyles.icon}
    />
  );
};
export default FieldIcon;
