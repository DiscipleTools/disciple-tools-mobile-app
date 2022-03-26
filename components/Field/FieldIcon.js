import React from "react";

import { Icon } from "components/Icon";

import useStyles from "hooks/use-styles";

import { FieldTypes } from "constants";

const FieldIcon = ({ field, hide }) => {
  const { globalStyles } = useStyles();
  const type = field.type;
  const name = field.name;
  let iconType = "";
  let iconName = "";
  let iconStyle = {};
  switch (type) {
    case FieldTypes.LOCATION_META:
      iconType = "MaterialCommunityIcons";
      iconName = "map-marker";
      break;
    case FieldTypes.TEXTAREA: //TODO: why does this not work?
      if (name.includes("list")) {
        iconType = "MaterialCommunityIcons";
        iconName = "notification-clear-all";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "text-long";
      }
      break;
    case FieldTypes.DATE:
      if (name.includes("dob")) {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-account";
      } else if (name.includes("church_start_date")) {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-check";
      } else if (name.includes("post_date")) {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-clock";
      } else if (name.includes("start")) {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-plus";
      } else if (name.includes("end")) {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-remove";
      } else if (name.includes("baptism_date")) {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-star";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar";
      }
      break;
    case FieldTypes.CONNECTION:
      if (name.includes("subassigned")) {
        iconType = "MaterialCommunityIcons";
        iconName = "briefcase-account-outline";
      } else if (name.includes("parent")) {
        iconType = "MaterialCommunityIcons";
        iconName = "drawing-box";
      } else if (name.includes("peer")) {
        iconType = "MaterialCommunityIcons";
        iconName = "ray-start-end";
      } else if (name.includes("child")) {
        iconType = "MaterialCommunityIcons";
        iconName = "sitemap";
      } else if (name.includes("relation")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-switch";
      } else if (name.includes("people_groups")) {
        iconType = "MaterialCommunityIcons";
        iconName = "earth";
      } else if (name.includes("coaching")) {
        iconType = "MaterialCommunityIcons";
        iconName = "teach";
        iconStyle = { scaleX: -1 };
      } else if (name.includes("coached_by")) {
        iconType = "MaterialCommunityIcons";
        iconName = "teach";
      } else if (name.includes("coaches")) {
        iconType = "MaterialCommunityIcons";
        iconName = "teach";
      } else if (name.includes("baptized_by")) {
        iconType = "MaterialCommunityIcons";
        iconName = "water";
      } else if (name.includes("baptized")) {
        iconType = "MaterialCommunityIcons";
        iconName = "water-outline";
      } else if (name.includes("group_leader")) {
        iconType = "MaterialCommunityIcons";
        iconName = "foot-print";
      } else if (name.includes("group")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-group";
      } else if (name.includes("train")) {
        iconType = "MaterialCommunityIcons";
        iconName = "chalkboard-teacher";
      } else if (name.includes("members")) {
        iconType = "MaterialCommunityIcons";
        iconName = "format-list-bulleted";
      } else if (name.includes("leaders")) {
        iconType = "MaterialCommunityIcons";
        iconName = "shoe-print";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "axis-arrow";
      }
      break;
    case FieldTypes.MULTI_SELECT:
      if (name.includes("email")) {
        iconType = "MaterialCommunityIcons";
        iconName = "email";
      } else if (name.includes("sources")) {
        iconType = "MaterialCommunityIcons";
        iconName = "arrow-collapse-all";
      } else if (name.includes("languages")) {
        iconType = "MaterialCommunityIcons";
        iconName = "translate";
      } else if (name.includes("health_metrics")) {
        iconType = "MaterialCommunityIcons";
        iconName = "gauge";
      } else if (name.includes("milestones")) {
        iconType = "MaterialCommunityIcons";
        iconName = "routes";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "format-list-bulleted";
      }
      break;
    case FieldTypes.COMMUNICATION_CHANNEL:
      if (name.includes("phone")) {
        iconType = "MaterialCommunityIcons";
        iconName = "phone";
      } else if (name.includes("email")) {
        iconType = "MaterialCommunityIcons";
        iconName = "email";
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
        iconType = "MaterialCommunityIcons";
        iconName = "directions";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "pound";
      }
      break;
    case FieldTypes.KEY_SELECT:
      if (name.includes("faith_status")) {
        iconType = "MaterialCommunityIcons";
        iconName = "celtic-cross";
      } else if (name.includes("seeker_path")) {
        iconType = "MaterialCommunityIcons";
        iconName = "map-marker-path";
      } else if (name.includes("gender")) {
        iconType = "MaterialCommunityIcons";
        iconName = "gender-male-female";
      } else if (name.includes("age")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-clock";
      } else if (name.includes("status")) {
        iconType = "MaterialCommunityIcons";
        iconName = "traffic-light";
      } else if (name.includes("type")) {
        iconType = "MaterialCommunityIcons";
        iconName = "shape";
      } else if (name.includes("group")) {
        iconType = "MaterialCommunityIcons";
        iconName = "group";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "format-list-checks";
      }
      break;
    case FieldTypes.USER_SELECT:
      if (name.includes("assigned_to")) {
        iconType = "MaterialCommunityIcons";
        iconName = "briefcase-account";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "briefcase-account-outline";
      }
      break;
    case FieldTypes.TAGS:
      if (name.includes("campaigns")) {
        iconType = "MaterialCommunityIcons";
        iconName = "bullhorn";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "tag-multiple";
      }
      break;
    case FieldTypes.TEXT:
      if (name.includes("nickname")) {
        iconType = "MaterialCommunityIcons";
        iconName = "tag-faces";
      } else if (name.includes("name")) {
        iconType = "MaterialCommunityIcons";
        iconName = "sign-text";
      } else if (name.includes("four_fields")) {
        iconType = "MaterialCommunityIcons";
        iconName = "dice-4";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "text";
      }
      break;
    case FieldTypes.NUMBER:
      if (name.includes("leader_count")) {
        iconType = "MaterialCommunityIcons";
        iconName = "pound-box";
      } else if (name.includes("member_count")) {
        iconType = "MaterialCommunityIcons";
        iconName = "pound-box-outline";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "pound";
      }
      break;
    default:
      iconType = "MaterialCommunityIcons";
      iconName = "square-small";
      break;
  }
  return (
    <Icon
      type={iconType}
      name={iconName}
      style={[globalStyles.icon, iconStyle]}
    />
  );
};
export default FieldIcon;
