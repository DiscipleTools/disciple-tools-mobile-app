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
  PROTOCOL: "https",
  TIMEOUT: 15000,         // 15 secs
  REFRESH_INTERVAL: 0,    // 0 secs
});

export const HTTP = Object.freeze({
  METHODS: {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE"
  },
  HEADERS: {
    DEFAULT: {
      "Content-Type": "application/json",
    }
  }
});

export default {
  STATUS_CIRCLE_SIZE: 15,
  SWIPE_BTN_WIDTH: 80,
};
