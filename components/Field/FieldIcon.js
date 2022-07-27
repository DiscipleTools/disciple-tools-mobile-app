import React from "react";

import { Icon } from "components/Icon";
import TypeIcon from "assets/icons/type.svg";
import ParentIcon from "assets/icons/parent.svg";
import PeerIcon from "assets/icons/peer.svg";
import ChildIcon from "assets/icons/child.svg";
import PeopleGroupsIcon from "assets/icons/people-groups.svg";
import BaptizeIcon from "assets/icons/baptize.svg";
import Baptize2Icon from "assets/icons/baptize2.svg";

import useStyles from "hooks/use-styles";

import { FieldTypes } from "constants";

import { localStyles } from "./FieldIcon.styles";

const FieldIcon = ({ field, hide }) => {
  const { styles, globalStyles } = useStyles(localStyles);
  const type = field.type;
  const name = field.name;
  let iconType = "MaterialCommunityIcons";
  let iconName = "";
  let iconStyle = {};
  switch (type) {
    case FieldTypes.LOCATION_META:
      iconName = "map-marker";
      break;
    case FieldTypes.LOCATION:
      iconName = "map-marker-outline";
      break;
    case FieldTypes.TEXTAREA: //TODO: why does this not work?
      if (name.includes("list")) {
        iconName = "format-list-group";
      } else if (name.includes("description")) {
        iconName = "text-long";
      } else {
        iconName = "text";
      }
      break;
    case FieldTypes.DATE:
      if (name.includes("dob")) {
        iconName = "calendar-account";
      } else if (name.includes("church_start_date")) {
        iconName = "calendar-check";
      } else if (name.includes("post_date")) {
        iconName = "calendar-clock";
      } else if (name.includes("start")) {
        iconName = "calendar-plus";
      } else if (name.includes("end")) {
        iconName = "calendar-remove";
      } else if (name.includes("baptism_date")) {
        iconName = "calendar-heart";
      } else {
        iconName = "calendar";
      }
      break;
    case FieldTypes.DATETIME_SERIES:
      if (name.includes("meeting")) {
        iconName = "calendar-clock";
      } else {
        iconName = "calendar-clock-outline";
      }
      break;
    case FieldTypes.CONNECTION:
      if (name.includes("subassigned")) {
        iconName = "briefcase-account-outline";
      } else if (name.includes("parent")) {
        iconName = "gamepad-circle-up";
      } else if (name.includes("peer")) {
        iconName = "ray-start-end";
      } else if (name.includes("child")) {
        iconName = "sitemap";
      } else if (name.includes("relation")) {
        iconName = "account-switch";
      } else if (
        name.includes("people_groups") ||
        name.includes("peoplegroups")
      ) {
        iconName = "earth";
      } else if (name.includes("reporter")) {
        iconName = "human-male-board";
        iconStyle = { transform: [{ scaleX: -1 }] };
      } else if (name.includes("coaching")) {
        iconName = "human-male-board";
        iconStyle = { transform: [{ scaleX: -1 }] };
      } else if (name.includes("coached_by")) {
        iconName = "human-male-board";
      } else if (name.includes("coaches")) {
        iconName = "human-male-board";
      } else if (name.includes("baptizing")) {
        iconName = "waves";
      } else if (name.includes("bapti")) {
        iconName = "waves";
      } else if (name.includes("trainings")) {
        iconName = "school";
      } else if (name === "group_leader" || name.includes("leaders")) {
        iconName = "foot-print";
      } else if (name.includes("leader")) {
        iconName = "shield-account";
      } else if (name.includes("group")) {
        iconName = "gamepad-circle";
      } else if (name.includes("train")) {
        iconName = "school-outline";
      } else if (name.includes("members")) {
        iconName = "account-group-outline";
      } else if (name.includes("contacts")) {
        iconName = "account";
      } else if (name.includes("disciple")) {
        iconName = "account-star-outline";
      } else if (name.includes("meetings")) {
        iconName = "calendar-multiselect";
      } else if (name.includes("streams")) {
        iconName = "axis-arrow";
      } else {
        iconName = "axis";
      }
      break;
    case FieldTypes.MULTI_SELECT:
      if (name.includes("email")) {
        iconName = "email";
      } else if (name.includes("sources")) {
        iconName = "arrow-collapse-all";
      } else if (name.includes("languages")) {
        iconName = "translate";
      } else if (name.includes("health_metrics")) {
        iconName = "gauge";
      } else if (name.includes("milestones")) {
        iconName = "routes";
      } else {
        iconName = "format-list-bulleted";
      }
      break;
    case FieldTypes.COMMUNICATION_CHANNEL:
      if (name.includes("phone")) {
        iconName = "phone";
      } else if (name.includes("email")) {
        iconName = "email";
      } else if (name.includes("twitter")) {
        iconName = "twitter";
      } else if (name.includes("facebook")) {
        iconName = "facebook";
      } else if (name.includes("instagram")) {
        iconName = "instagram";
      } else if (name.includes("whatsapp")) {
        iconName = "whatsapp";
      } else if (name.includes("address")) {
        iconName = "map-marker-outline";
      } else if (name.includes("other")) {
        iconName = "link";
      } else {
        iconName = "chat";
      }
      break;
    case FieldTypes.KEY_SELECT:
      if (name.includes("faith_status")) {
        iconName = "cross-celtic";
      } else if (name.includes("seeker_path")) {
        iconName = "sign-direction";
      } else if (name.includes("gender")) {
        iconName = "gender-male-female";
      } else if (name === "age") {
        iconName = "account-clock";
      } else if (name.includes("status")) {
        iconName = "traffic-light";
      } else if (name.includes("type")) {
        iconName = "shape";
      } else if (name.includes("group")) {
        iconName = "group";

        // Contact type icons
      } else if (name.includes("user")) {
        iconName = "account-box";
      } else if (name.includes("personal")) {
        iconName = "account-lock";
      } else if (name.includes("placeholder")) {
        iconName = "account-lock-outline";
      } else if (name.includes("access")) {
        iconName = "account-network";
      } else if (name.includes("access_placeholder")) {
        iconName = "account-network-outline";

        // Plugins
      } else if (name.includes("timezone") || name === "campaign_timezone") {
        iconName = "map-clock";
      } else if (name.includes("min_time_duration")) {
        iconName = "timer-outline";
      } else if (name.includes("duration_options")) {
        iconName = "timer";
      } else if (name === "languages") {
        iconName = "translate";
      } else {
        iconName = "format-list-checks";
      }
      break;
    case FieldTypes.USER_SELECT:
      if (name.includes("assigned_to")) {
        iconName = "briefcase-account";
      } else {
        iconName = "briefcase-account-outline";
      }
      break;
    case FieldTypes.TAGS:
      if (name.includes("campaigns")) {
        iconName = "bullhorn";
      } else {
        iconName = "tag-multiple";
      }
      break;
    case FieldTypes.TASK:
      if (name.includes("task")) {
        iconName = "calendar-check";
      } else {
        iconName = "calendar-check-outline";
      }
      break;
    case FieldTypes.TEXT:
      if (name.includes("nickname")) {
        iconName = "tag-faces";
      } else if (name.includes("name")) {
        iconName = "sign-text";
      } else if (name.includes("note")) {
        iconName = "note-text";
      } else if (name === "four_fields_unbelievers") {
        iconName = "crosshairs-off";
      } else if (name === "four_fields_believers") {
        iconName = "target-account";
      } else if (name === "four_fields_accountable") {
        iconName = "crosshairs-question";
      } else if (name === "four_fields_church_commitment") {
        iconName = "shield-check";
      } else if (name === "four_fields_multiplying") {
        iconName = "shield-plus";
      } else if (name.includes("four_fields")) {
        iconName = "crosshairs";
      } else if (name === "video_link") {
        iconName = "video-image";
      } else {
        iconName = "text-short";
      }
      break;
    case FieldTypes.NUMBER:
      if (name.includes("leader_count")) {
        iconName = "pound-box";
      } else if (name.includes("member_count")) {
        iconName = "pound-box-outline";
      } else {
        iconName = "pound";
      }
      break;
    case FieldTypes.BOOLEAN:
      if (name.includes("favorite")) {
        iconName = "star";
      } else if (name === "receive_prayer_time_notifications") {
        iconName = "bell-ring-outline";
      } else {
        iconName = "toggle-switch";
      }
      break;
    default:
      iconName = "square-small";
      break;
  }
  if (type === FieldTypes.CONNECTION || type === FieldTypes.KEY_SELECT) {
    if (name.includes("parent")) {
      return (
        <ParentIcon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    }
    if (name.includes("peer")) {
      return (
        <PeerIcon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    }
    if (name.includes("child")) {
      return (
        <ChildIcon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    }
    if (name.includes("people_groups") || name.includes("peoplegroups")) {
      return (
        <PeopleGroupsIcon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    }
    if (name.includes("groups")) {
      return (
        <TypeIcon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    }
    if (name === "baptized") {
      return (
        <Baptize2Icon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    }
    if (name === "baptized_by" || name.includes("bapti")) {
      return (
        <BaptizeIcon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    }
  }
  // if (type === FieldTypes.KEY_SELECT) {
  //   if (name === ("group_type")) {
  //     return (
  //       <TypeIcon
  //       height={globalStyles.icon.fontSize}
  //       width={globalStyles.icon.fontSize}
  //       style={styles.svgIcon}
  //       fill={globalStyles.text.color}
  //     />
  //     );
  //   };
  // };
  return (
    <Icon
      type={iconType}
      name={iconName}
      style={[globalStyles.icon, iconStyle]}
    />
  );
};
export default FieldIcon;
