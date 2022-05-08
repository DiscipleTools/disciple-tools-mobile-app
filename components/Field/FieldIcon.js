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
        iconName = "format-list-group";
      } else if (name.includes("description")) {
        iconType = "MaterialCommunityIcons";
        iconName = "text-long";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "text";
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
        iconName = "calendar-heart";
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
        iconName = "calendar-clock-outline";
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
        iconName = "human-male-board";
        iconStyle = { transform: [{ scaleX: -1 }] }
      } else if (name.includes("coaching")) {
        iconType = "MaterialCommunityIcons";
        iconName = "human-male-board";
        iconStyle = { transform: [{ scaleX: -1 }] }
      } else if (name.includes("coached_by")) {
        iconType = "MaterialCommunityIcons";
        iconName = "human-male-board";
      } else if (name.includes("coaches")) {
        iconType = "MaterialCommunityIcons";
        iconName = "human-male-board";
      } else if (name.includes("baptizing")) {
        iconType = "MaterialCommunityIcons";
        iconName = "waves"; 
      } else if (name.includes("bapti")) {
        iconType = "MaterialCommunityIcons";
        iconName = "waves";
      } else if (name.includes("trainings")) {
        iconType = "MaterialCommunityIcons";
        iconName = "school";
      } else if (name === ("group_leader") || name.includes("leaders")) {
        iconType = "MaterialCommunityIcons";
        iconName = "foot-print";
      } else if (name.includes("leader")) {
        iconType = "MaterialCommunityIcons";
        iconName = "shield-account";
      } else if (name.includes("group")) {
        iconType = "MaterialCommunityIcons";
        iconName = "gamepad-circle";
      } else if (name.includes("train")) {
        iconType = "MaterialCommunityIcons";
        iconName = "school-outline";
      } else if (name.includes("members")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-group-outline";
      } else if (name.includes("contacts")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account";
      } else if (name.includes("disciple")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-star-outline";
      } else if (name.includes("meetings")) {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-multiselect";
      } else if (name.includes("streams")) {
        iconType = "MaterialCommunityIcons";
        iconName = "axis-arrow";
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
        iconName = "cross-celtic";
      } else if (name.includes("seeker_path")) {
        iconType = "MaterialCommunityIcons";
        iconName = "sign-direction";
      } else if (name.includes("gender")) {
        iconType = "MaterialCommunityIcons";
        iconName = "gender-male-female";
      } else if (name === ("age")) {
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

        // Contact type icons
      } else if (name.includes("user")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-box";
      } else if (name.includes("personal")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-lock";
      } else if (name.includes("placeholder")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-lock-outline";
      } else if (name.includes("access")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-network";
      } else if (name.includes("access_placeholder")) {
        iconType = "MaterialCommunityIcons";
        iconName = "account-network-outline";
        
        // Plugins
      } else if (name.includes("timezone") || (name === ("campaign_timezone"))) {
        iconType = "MaterialCommunityIcons";
        iconName = "map-clock";
      } else if (name.includes("min_time_duration")) {
        iconType = "MaterialCommunityIcons";
        iconName = "timer-outline";
      } else if (name.includes("duration_options")) {
        iconType = "MaterialCommunityIcons";
        iconName = "timer";
      } else if (name === ("languages")) {
        iconType = "MaterialCommunityIcons";
        iconName = "translate";
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
        iconName = "calendar-check";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "calendar-check-outline";
      }
      break;
    case FieldTypes.TEXT:
      if (name.includes("nickname")) {
        iconType = "MaterialCommunityIcons";
        iconName = "tag-faces";
      } else if (name.includes("name")) {
        iconType = "MaterialCommunityIcons";
        iconName = "sign-text";
      } else if (name.includes("note")) {
        iconType = "MaterialCommunityIcons";
        iconName = "note-text";
      } else if (name === ("four_fields_unbelievers")) {
        iconType = "MaterialCommunityIcons";
        iconName = "crosshairs-off";
      } else if (name === ("four_fields_believers")) {
        iconType = "MaterialCommunityIcons";
        iconName = "target-account";
      } else if (name === ("four_fields_accountable")) {
        iconType = "MaterialCommunityIcons";
        iconName = "crosshairs-question";
      } else if (name === ("four_fields_church_commitment")) {
        iconType = "MaterialCommunityIcons";
        iconName = "shield-check";
      } else if (name === ("four_fields_multiplying")) {
        iconType = "MaterialCommunityIcons";
        iconName = "shield-plus";
      } else if (name.includes("four_fields")) {
        iconType = "MaterialCommunityIcons";
        iconName = "crosshairs";      
      } else if (name === ("video_link")) {
          iconType = "MaterialCommunityIcons";
          iconName = "video-image";
      } else {
        iconType = "MaterialCommunityIcons";
        iconName = "text-short";
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
      case FieldTypes.BOOLEAN:
        if (name.includes("favorite")) {
          iconType = "MaterialCommunityIcons";
          iconName = "star";
        } else if (name === ("receive_prayer_time_notifications")) {
          iconType = "MaterialCommunityIcons";
          iconName = "bell-ring-outline";
        } else {
          iconType = "MaterialCommunityIcons";
          iconName = "toggle-switch";
        }
        break;
    default:
      iconType = "MaterialCommunityIcons";
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
    if (name.includes("groups")) {
      return (
        <TypeIcon
        height={globalStyles.icon.fontSize}
        width={globalStyles.icon.fontSize}
        style={styles.svgIcon}
        fill={globalStyles.text.color}
      />
      );
    };
    if (name === ("baptized")) {
      return (
        <Baptize2Icon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    };
    if (name === ("baptized_by") || name.includes("bapti")) {
      return (
        <BaptizeIcon
          height={globalStyles.icon.fontSize}
          width={globalStyles.icon.fontSize}
          style={styles.svgIcon}
          fill={globalStyles.text.color}
        />
      );
    };
  };
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
