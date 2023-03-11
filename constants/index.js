import Constants from "expo-constants";

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
  systemGreenLight,
  systemCyanLight,
  systemBlueLight,
  systemGray2Dark,
  systemGray3Dark,
  systemGray4Dark,
  systemGray5Dark,
  systemGray6Dark,
  systemRedDark,
  systemYellowDark,
  systemGreenDark,
  systemCyanDark,
  systemBlueDark,
  facebook,
  whatsapp,
  primaryDark,
  primaryLight,
  secondaryDark,
  secondaryLight,
  tertiaryDark,
  tertiaryLight,
  errorDark,
  errorLight,
  warningDark,
  warningLight,
  infoDark,
  infoLight,
  successLight,
  successDark,
} from "constants/colors";

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

export const ChurchHealthConstants = Object.freeze({
  BAPTISM: "church_baptism",
  BIBLE: "church_bible",
  COMMUNION: "church_communion",
  FELLOWSHIP: "church_fellowship",
  GIVING: "church_giving",
  LEADERS: "church_leaders",
  PRAISE: "church_praise",
  PRAYER: "church_prayer",
  SHARING: "church_sharing",
  CHURCH_COMMITMENT: "church_commitment",
});

export const AppConstants = Object.freeze({
  NAME: "D.T",
  PROTOCOL: "https",
  CONTENT_TYPE_JSON: "application/json",
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
  TMP_ID_PREFIX: "tmp_",
});

export const FieldDefaultValues = Object.freeze({
  COMMUNICATION_CHANNEL: { value: "" },
});

export const FieldTypes = Object.freeze({
  BOOLEAN: "boolean",
  COMMUNICATION_CHANNEL: "communication_channel",
  CONNECTION: "connection",
  DATE: "date",
  DATETIME_SERIES: "datetime_series",
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
  ID: "ID",
  POST_TITLE: "post_title",
  POST_TYPE: "post_type",
  POST_DATE: "post_date",
  LAST_MODIFIED: "last_modified",
  TITLE: "title",
  NAME: "name",
  NICKNAME: "nickname",
  OVERALL_STATUS: "overall_status",
  REASON_CLOSED: "reason_closed",
  REASON_PAUSED: "reason_paused",
  REASON_UNASSIGNABLE: "reason_unassignable",
  GROUP_STATUS: "group_status",
  GROUP_TYPE: "group_type",
  COACHES: "coaches",
  PARENT_GROUPS: "parent_groups",
  PEER_GROUPS: "peer_groups",
  CHILD_GROUPS: "child_groups",
  PEOPLE_GROUPS: "people_groups",
  BAPTISM_DATE: "baptism_date",
  DATE_OF_BIRTH: "dob",
  LEADERS: "leaders",
  MEMBER_COUNT: "member_count",
  MEMBERS: "members",
  GROUPS: "groups",
  TRAININGS: "trainings",
  LOCATION_GRID_META: "location_grid_meta",
  LOCATION_GRID: "location_grid",
  FAITH_MILESTONES: "milestones",
  FAITH_STATUS: "faith_status",
  CHURCH_HEALTH: "health_metrics",
  INFLUENCE: "influence",
  INFLUENCE_SLIDER: "influence_slider",
  TYPE: "type",
  SOURCES: "sources",
  CONTACT_PHONE: "contact_phone",
  CONTACT_EMAIL: "contact_email",
  OFFLINE: "offline",
});

export const TileNames = Object.freeze({
  STATUS: "status",
  DETAILS: "details",
  RELATIONSHIPS: "relationships",
  HEALTH_METRICS: "health-metrics",
  FAITH: "faith",
  FOLLOWUP: "followup",
  GROUPS: "groups",
  OTHER: "other",
});

export const ThemeConstants = Object.freeze({
  LIGHT: "light",
  DARK: "dark",
});

export const defaultThemeLight = Object.freeze({
  mode: ThemeConstants.LIGHT,
  brand: {
    primary: primaryLight,
    secondary: secondaryLight,
    tertiary: tertiaryLight,
  },
  offLight,
  offDark,
  systemGray,
  systemGreen: systemGreenLight,
  error: errorLight,
  warning: warningLight,
  info: infoLight,
  success: successLight,
  text: {
    primary: offDark,
    secondary: "rgba(0, 0, 0, 0.6)",
    inverse: offLight,
    disabled: "rgba(0, 0, 0, 0.38)",
    //link: systemBlueLight,
    link: primaryBrand,
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
  sliderThumb: systemBlueDark,
});

export const defaultThemeDark = Object.freeze({
  mode: ThemeConstants.DARK,
  brand: {
    primary: primaryDark,
    secondary: secondaryDark,
    tertiary: tertiaryDark,
  },
  primaryBrand,
  secondaryBrand,
  offLight,
  offDark,
  systemGray,
  systemGreen: systemGreenDark,
  error: errorDark,
  warning: warningDark,
  info: infoDark,
  success: successDark,
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
  sliderThumb: systemBlueDark,
});

// NOTE: lowercase constants bc used in D.T API requests
export const TypeConstants = Object.freeze({
  CONTACT: "contacts",
  GROUP: "groups",
  NOTIFICATION: "notifications",
  TRAINING: "trainings",
  PEOPLE_GROUP: "peoplegroups",
  MY_USER: "myuser",
});

export const SubTypeConstants = Object.freeze({
  CREATE: "CREATE",
  IMPORT: "IMPORT",
  COMMENTS_ACTIVITY: "COMMENTS_ACTIVITY",
});

export const TabScreenConstants = Object.freeze({
  HOME: "HOME",
  CONTACTS: "CONTACTS",
  GROUPS: "GROUPS",
  NOTIFICATIONS: "NOTIFICATIONS",
  MORE: "MORE",
  MY_USER: "MY_USER",
});

export const ScreenConstants = Object.freeze({
  LAUNCH: "LAUNCH",
  LIST: "LIST",
  DETAILS: "DETAILS",
  CREATE: "CREATE",
  IMPORT: "IMPORT",
  COMMENTS_ACTIVITY: "COMMENTS_ACTIVITY",
  MY_USER: "MY_USER",
  NOTIFICATIONS: "NOTIFICATIONS",
  PIN: "PIN",
  ALL_ACTIVITY_LOGS: "ALL_ACTIVITY_LOGS",
  STORAGE: "STORAGE",
});

export const NotificationActionConstants = Object.freeze({
  ALERT: "alert",
  COMMENT: "comment",
  MENTION: "mentioned",
});

export const NotificationPermissionConstants = Object.freeze({
  GRANTED: "granted",
  UNDETERMINED: "undetermined",
  DENIED: "denied",
});

export const QuickActionButtonConstants = Object.freeze({
  NO_ANSWER: "quick_button_no_answer",
  CONTACT_ESTABLISHED: "quick_button_contact_established",
  MEETING_SCHEDULED: "quick_button_meeting_scheduled",
  MEETING_COMPLETE: "quick_button_meeting_complete",
  MEETING_POSTPONED: "quick_button_meeting_postponed",
  NO_SHOW: "quick_button_no_show",
  NEW: "quick_button_new",
  IMPORT: "quick_button_import_contacts",
});

export const BottomSheetConstants = Object.freeze({
  PORTAL_HOST_NAME: "bottomSheet",
});

export const NetworkConstants = Object.freeze({
  NETWORK_TEST_URL: "https://8.8.8.8",
});

export const SortConstants = Object.freeze({
  LAST_MOD_DESC: "-last_modified",
  LAST_MOD_ASC: "last_modified",
  CREATED_DESC: "-post_date",
  CREATED_ASC: "post_date",
});

export const AppStateConstants = Object.freeze({
  ACTIVE: "active",
  BACKGROUND: "background",
  INACTIVE: "inactive",
});

export const AuthConstants = Object.freeze({
  ACCESS_TOKEN: "ACCESS_TOKEN",
  BASE_URL: "BASE_URL",
  USER: "USER",
  CNONCE_PERSISTED: "cnonceLogin",
  CNONCE: "CNONCE_LOGIN",
  CNONCE_DATETIME: "CNONCE_LOGIN_DATETIME",
  CNONCE_THRESHOLD: 2, // seconds
});

export const PINConstants = Object.freeze({
  DISTRESS_CODE: "000000",
  CODE: "CODE",
  DELETE: "DELETE",
  SCREEN: "PIN",
  SET: "SET",
  VALIDATE: "VALIDATE",
  CNONCE_PERSISTED: "cnoncePIN",
  CNONCE: "CNONCE_PIN",
  CNONCE_DATETIME: "CNONCE_PIN_DATETIME",
  CNONCE_THRESHOLD: 2, // seconds
});

export const CacheConstants = Object.freeze({
  FILENAME: "cache.json",
  INTERVAL: 1000 * 30, // 30 seconds
});

export const APP_VERSION = Constants.manifest.version;

export default {
  STATUS_CIRCLE_SIZE: 15,
  SWIPE_BTN_WIDTH: 80,
  LIST_ITEM_HEIGHT: 80,
  FIELD_HEIGHT: 50,
};
