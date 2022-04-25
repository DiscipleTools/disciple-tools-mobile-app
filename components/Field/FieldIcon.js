import React from "react";

import { Icon } from "components/Icon";
import ParentIcon from "assets/icons/parent.svg";
import PeerIcon from "assets/icons/peer.svg";
import ChildIcon from "assets/icons/child.svg";
import PeopleGroupsIcon from "assets/icons/people-groups.svg";
import TypeIcon from "assets/icons/type.svg";

import useStyles from "hooks/use-styles";

import { FieldTypes } from "constants";

import { localStyles } from "./FieldIcon.styles";

const FieldIcon = ({ field, hide }) => {
  const { styles, globalStyles } = useStyles(localStyles);
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
      case FieldTypes.LOCATION:
        iconType = "MaterialCommunityIcons";
        iconName = "map-marker-outline";
        break;
    case FieldTypes.TEXTAREA: //TODO: why does this not work?
      if (name.includes("list")) {
        iconType = "MaterialCommunityIcons";
        iconName = "notification-clear-all";
      } else if (name.includes("description")) {
        iconType = "MaterialCommunityIcons";
        iconName = "text";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "text-short";
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
    case FieldTypes.DATETIME_SERIES:
      if (name.includes("meeting")) {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-clock";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-clock";
      }
      break;
    case FieldTypes.CONNECTION:
      if (name.includes("subassigned")) {
        iconType = "MaterialCommunityIcons";
        iconName = "briefcase-account-outline";
      } else if (name.includes("parent")) {
        iconType = "MaterialCommunityIcons";
        iconName = "gamepad-circle-up";
      } else if (name.includes("peer")) {
        iconType = "MaterialCommunityIcons";
        iconName = "ray-start-end";
      } else if (name.includes("child")) {
        iconType = "MaterialCommunityIcons";
        iconName = "sitemap";
      } else if (name.includes("relation")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-switch";
      } else if ((name.includes("people_groups") || name.includes("peoplegroups")) ) {
        iconType = "MaterialCommunityIcons";
        iconName = "earth";
      } else if (name.includes("reporter")) {
        iconType = "MaterialCommunityIcons";
        iconName = "teach";
        iconStyle = { transform: [{ scaleX: -1 }] }
      } else if (name.includes("coaching")) {
        iconType = "MaterialCommunityIcons";
        iconName = "teach";
        iconStyle = { transform: [{ scaleX: -1 }] }
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
      } else if (name.includes("trainings")) {
        iconType = "MaterialCommunityIcons";
        iconName = "school";
      } else if (name.includes("group_leader") || name.includes("leaders")) {
        iconType = "MaterialCommunityIcons";
        iconName = "foot-print";
      } else if (name.includes("leader")) {
        iconType = "MaterialCommunityIcons";
        iconName = "shield-account";
        iconStyle = { transform: [{ scaleX: -1 }] }
      } else if (name.includes("group")) {
        iconType = "MaterialCommunityIcons";
        iconName = "gamepad-circle";
      } else if (name.includes("train")) {
        iconType = "MaterialCommunityIcons";
        iconName = "teach";
      } else if (name.includes("members")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-group-outline";
      } else if (name.includes("contacts")) {
        iconType = "MaterialCommunityIcons";
        iconName = "human";
      } else if (name.includes("disciple")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-star-outline";
        iconStyle = { transform: [{ scaleX: -1 }] }
      } else if (name.includes("meetings")) {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-text";
        iconStyle = { transform: [{ scaleX: -1 }] }
      } else if (name.includes("streams")) {
        iconType = "MaterialCommunityIcons";
        iconName = "axis-arrow";
        iconStyle = { transform: [{ scaleX: -1 }] }
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "axis";
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
        iconName = "map-marker-outline";
      } else if (name.includes("other")) {
        iconType = "MaterialCommunityIcons";
        iconName = "link";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "chat";
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
    case FieldTypes.TASK:
      if (name.includes("task")) {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-clock";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-clock";
      }
      break;
    case FieldTypes.TEXT:
      if (name.includes("nickname")) {
        iconType = "MaterialCommunityIcons";
        iconName = "tag-faces";
      } else if (name.includes("name")) {
        iconType = "MaterialCommunityIcons";
        iconName = "sign-text";
      } else if (name.includes("notes")) {
        iconType = "MaterialCommunityIcons";
        iconName = "note-text";
      } else if (name.includes("four_fields_unbelievers")) {
        iconType = "MaterialCommunityIcons";
        iconName = "crosshairs-off";
      } else if (name.includes("four_fields_believers")) {
        iconType = "MaterialCommunityIcons";
        iconName = "crosshairs-gps";
      } else if (name.includes("four_fields_accountable")) {
        iconType = "MaterialCommunityIcons";
        iconName = "crosshairs-question";
      } else if (name.includes("four_fields_church_commitment")) {
        iconType = "MaterialCommunityIcons";
        iconName = "shield-cross";
      } else if (name.includes("four_fields_multiplying")) {
        iconType = "MaterialCommunityIcons";
        iconName = "shield-cross-outline";
      } else if (name.includes("four_fields")) {
        iconType = "MaterialCommunityIcons";
        iconName = "crosshairs";      
      } else if (name.includes("video_link")) {
          iconType = "MaterialCommunityIcons";
          iconName = "video-image";
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
  if (type === FieldTypes.CONNECTION) {
    if (name.includes("parent")) {
      return (
        <ParentIcon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    };
    if (name.includes("peer")) {
      return (
        <PeerIcon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    };
    if (name.includes("child")) {
      return (
        <ChildIcon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    };
    if ((name.includes("people_groups") || name.includes("peoplegroups")) ) {
      return (
        <PeopleGroupsIcon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    };
  };
  if (type === FieldTypes.KEY_SELECT) {
    if (name.includes("type")) {
      return (
        <TypeIcon
        height={globalStyles.icon.fontSize}
        width={globalStyles.icon.fontSize}
        style={styles.svgIcon}
        fill={globalStyles.text.color}
      />
      );
    };
  };
  return (
    <Icon
      type={iconType}
      name={iconName}
      style={[globalStyles.icon, iconStyle]}
    />
  );
};
export default FieldIcon;
