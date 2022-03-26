import {
  primaryBrand,
  secondaryBrand,
  tertiaryBrand,
  offDark,
  offLight,
  highlight,
  systemGray,
  systemGray2Light,
  systemGray3Light,
  systemGray4Light,
  systemGray5Light,
  systemGray6Light,
  systemRedLight,
  systemYellowLight,
  systemCyanLight,
  systemBlueLight,
  systemGray2Dark,
  systemGray3Dark,
  systemGray4Dark,
  systemGray5Dark,
  systemGray6Dark,
  systemRedDark,
  systemYellowDark,
  systemCyanDark,
  systemBlueDark,
  facebook,
  whatsapp,
} from "constants/colors";
// TODO: rename

export const defaultFaithMilestones = [
  "milestone_has_bible",
  "milestone_reading_bible",
  "milestone_belief",
  "milestone_can_share",
  "milestone_sharing",
  "milestone_baptized",
  "milestone_baptizing",
  "milestone_in_group",
  "milestone_planting",
];

export const defaultHealthMilestones = [
  "church_baptism",
  "church_bible",
  "church_communion",
  "church_fellowship",
  "church_giving",
  "church_leaders",
  "church_praise",
  "church_prayer",
  "church_sharing",
];

export const AppConstants = Object.freeze({
  NAME: "D.T",
  PROTOCOL: "https",
  TIMEOUT: 15000, // 15 secs
  REFRESH_INTERVAL: 0, //10 secs
});

export const HTTP = Object.freeze({
  METHODS: {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
  },
  HEADERS: {
    DEFAULT: {
      "Content-Type": "application/json",
    },
  },
});

export const FieldConstants = Object.freeze({
  TMP_KEY_PREFIX: "tmp_",
});

export const FieldTypes = Object.freeze({
  BOOLEAN: "boolean",
  COMMUNICATION_CHANNEL: "communication_channel",
  CONNECTION: "connection",
  DATE: "date",
  KEY_SELECT: "key_select",
  LOCATION: "location",
  LOCATION_GRID: "location_grid",
  LOCATION_META: "location_meta",
  MULTI_SELECT: "multi_select",
  NUMBER: "number",
  POST_USER_META: "post_user_meta",
  TAGS: "tags",
  TASK: "task",
  TEXT: "text",
  TEXTAREA: "textarea",
  USER_SELECT: "user_select",
});

export const FieldNames = Object.freeze({
  NAME: "name",
  OVERALL_STATUS: "overall_status",
  GROUP_STATUS: "group_status",
  COACHES: "coaches",
  PARENT_GROUPS: "parent_groups",
  PEER_GROUPS: "peer_groups",
  CHILD_GROUPS: "child_groups",
  PEOPLE_GROUPS: "people_groups",
  BAPTISM_DATE: "baptism_date",
  MEMBER_COUNT: "member_count",
  MEMBERS: "members",
  GROUPS: "groups",
  TRAININGS: "trainings",
  LOCATION_GRID_META: "location_grid_meta",
  LOCATION_GRID: "location_grid",
});

export const ThemeConstants = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
});

export const defaultThemeLight = Object.freeze({
  mode: ThemeConstants.LIGHT,
  brand: {
    primary: primaryBrand,
    secondary: secondaryBrand,
    tertiary: tertiaryBrand,
  },
  offLight,
  offDark,
  systemGray,
  error: systemRedLight,
  warning: systemYellowLight,
  info: systemCyanLight,
  success: systemGray6Dark,
  text: {
    primary: offDark,
    secondary: "rgba(0, 0, 0, 0.6)",
    inverse: offLight,
    disabled: "rgba(0, 0, 0, 0.38)",
    link: systemBlueLight,
  },
  buttons: {
    primaryBrand,
  },
  background: {
    primary: offLight,
    secondary: systemGray3Light, //systemGray6Light,
  },
  surface: {
    primary: systemGray5Light,
    secondary: systemGray4Light,
    input: "#FFF", //systemGray5Light,
  },
  divider: systemGray4Light, //systemGray,
  disabled: systemGray4Light,
  placeholder: systemGray,
  highlight,
  facebook,
  whatsapp,
});

export const defaultThemeDark = Object.freeze({
  mode: ThemeConstants.DARK,
  brand: {
    primary: primaryBrand,
    secondary: secondaryBrand,
    tertiary: tertiaryBrand,
  },
  primaryBrand,
  secondaryBrand,
  offLight,
  offDark,
  systemGray,
  error: systemRedDark,
  warning: systemYellowDark,
  info: systemCyanDark,
  success: systemGray6Light,
  text: {
    primary: offLight,
    secondary: "rgba(255, 255, 255, 0.7)",
    inverse: offDark,
    disabled: "rgba(255, 255, 255, 0.5)",
    link: highlight,
  },
  buttons: {
    primaryBrand,
  },
  background: {
    primary: offDark,
    secondary: systemGray6Dark,
  },
  surface: {
    primary: systemGray5Dark,
    secondary: systemGray4Dark,
    input: offDark,
  },
  divider: systemGray,
  disabled: systemGray4Dark,
  placeholder: systemGray,
  highlight,
  facebook,
  whatsapp,
});

// NOTE: lowercase constants bc used in D.T API requests
export const TypeConstants = Object.freeze({
  CONTACT: "contacts",
  GROUP: "groups",
  TRAINING: "trainings",
  QUESTIONNAIRE: "questionnaires",
  NOTIFICATION: "notifications",
});

export const SubTypeConstants = Object.freeze({
  CREATE: "CREATE",
  IMPORT: "IMPORT",
  COMMENTS_ACTIVITY: "COMMENTS_ACTIVITY",
});

export const TabScreenConstants = Object.freeze({
  HOME: "HOME",
  POST: "POST",
  CONTACTS: "CONTACTS",
  GROUPS: "GROUPS",
  MORE: "MORE",
});

export const ScreenConstants = Object.freeze({
  LIST: "LIST",
  DETAILS: "DETAILS",
  CREATE: "CREATE",
  IMPORT: "IMPORT",
  NOTIFICATIONS: "NOTIFICATIONS",
  SETTINGS: "SETTINGS",
  PIN: "PIN",
});

export const NotificationActionConstants = Object.freeze({
  ALERT: "alert",
  COMMENT: "comment",
  MENTION: "mentioned",
});

export const BottomSheetConstants = Object.freeze({
  PORTAL_HOST_NAME: "bottomSheet",
});

export const NetworkConstants = Object.freeze({
  NETWORK_TEST_URL: "https://8.8.8.8",
});

export const SortConstants = Object.freeze({
  LAST_MOD_ASC: "-last_modified",
  LAST_MOD_DESC: "last_modified",
  CREATED_ASC: "-post_date",
  CREATED_DESC: "post_date",
});

export default {
  STATUS_CIRCLE_SIZE: 15,
  SWIPE_BTN_WIDTH: 80,
  LIST_ITEM_HEIGHT: 80,
  FIELD_HEIGHT: 50,
};
