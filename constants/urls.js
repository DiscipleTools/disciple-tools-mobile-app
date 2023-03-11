export const SettingsURL = "dt-core/v1/settings";
export const MyUserDataURL = "dt/v1/user/my";
export const NotificationsURL = "dt/v1/notifications/get_notifications";
export const UsersURL = "dt/v1/users/get_users?get_all=1";
export const LocationsURL = "dt-mobile-app/v1/locations";
//export const PeopleGroupsURL = "dt-posts/v2/peoplegroups/";
export const PeopleGroupsURL = "dt/v1/people-groups/compact";
export const ActivityLogURL = "dt-users/v1/activity-log";

// TODO: move?
export const NotificationsRequest = Object.freeze({
  url: "dt/v1/notifications/get_notifications",
  method: "POST",
  data: {
    all: true,
    page: 0,
    limit: 1000, // TODO: support pagination (similar to Contacts/Groups in LaunchScreen)
    mentions: false,
  },
});

// see also: helpers/urls.js (ie, getListURL)
