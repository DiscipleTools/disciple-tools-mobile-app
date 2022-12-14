## Offline User Guide for D.T Mobile App

### Known issues

- Relationships (ie, Connection Fields) are not fully supported - the direct relationship *is* supported, but the secondary/indirect relationship is not updated while offline
  - for ex., Go OFFLINE, create a new Group or load an existing Group, and then click "Members List" Tile, add a Contact to the Group.  Observe that the Contact is properly added to Members List **BUT** if you then open that same Contact record and check associated Groups, you will not see the secondary/indirect relationship updated. If/When the user goes back ONLINE, D.T will make this association and subsequent reload of the Contact record will then show the Group association. (A fix for this issue is planned and is being tracked by GitHub Issue #??).
- Notification changes not currently supported
  - should *not* be an issue in practice since a user cannot recv notifications while offline anyway
- Not all Fields are supported for "Create New"
  - currently only the system defaults: TextField (eg, Name - required), KeySelect (Type, Status), Location, Communication Channels (eg, Phone, Email)
- Communication Field does not properly track ('+') adds
  - to reproduce, click 1 or more ('+'), then click 1 or more ('-'), and then click 1 or more ('+') again - observe that count is off
- "Download Data"* (Storage Screen) does not currently support Custom Post Types (Contacts, Groups only are prefetched)
  - Custom Post Types are still supported offline, but they must be accessed first while online
- Member/Leader Counts are unchanged when adding/removing "Members" offline
  - when user comes back online and those changes take effect, then D.T will update the counts and reload when app is next online
- Editing a Comment *which was created while OFFLINE* is not properly reflected within D.T when user goes back ONLINE
  - this is bc we need to overwrite `tmpId` the Comment update request in the Request Queue - similar to how we do with Post updates on a Post created while offline (A fix for this issue is planned and is being tracked by GitHub Issue #??).
- (Similar to directly abvoe) Deleting a Comment *which was created while OFFLINE* is not properly reflected within D.T when user goes back ONLINE
  - not as urgent, as re-deleting is fairly simple, but will eventually be resolved

### Typical usage

Any record that has been retrieved from the API while ONLINE will be made available in the app in-memory cache, and persisted to device storage on app background action (ie, swipe to close app).  On app re-launch, the cache is rehydrated/loaded from device storage back into the app in-memory cache for usage.  At any time, if the cache becomes too large and the app is sluggish, the user may navigate to "My User Screen" (4th tab on bottom), and select "Storage" option, and "Clear Storage".  After "Clear Storage", the user may want to re-launch the app in order to prefetch the "Favorites", "Recently Viewed", any posts in "Activity Log" (100 most recent actions) (each with associated "Comments" and "Activity" data - see more below). On the same "Storage Screen", there is another button to "Download Data" which will prefetch *all* posts and any associated data (ie, "Comments and Activity"). For D.T Instances that have thousands of records, this has been known to take up to an hour to download, and will occur in the background while using the app.  (Check back on the "Storage Screen" in order to confirm that the data is loading and storage size is increasing).

>Reminder that any data not cached locally will *not* be available for offline usage, so remember to periodically background the app in case of unexpected crash.  However, during normal operation and swipe close of the app the data will be persisted.

The data download flow is as follows:

1. Fresh/First launch will download "Favorites", "Recently Viewed", and any posts in "Activity Log" (each with associated "Comments" and "Activity" data)
1. At any time, the user may Pull Refresh on any of the List Screens to refresh ALL records for that Post Type (but this will *not* include "Comments" and "Activity" data for those posts)
1. Accessing "Comments" and "Activities" via the icon in the top-right header of the record details for any post makes that data available for offline use (assuming it is backgrounded and persisted)

>*Download Data on D.T Instances with 1000s of records has been known to use ~50MB of memory and disk storage, to take up to 1 hour to download, another 5-10 seconds to persist to device storage on app background, and 15-20 seconds to read from storage when the app is eventually relaunched (and sometimes an additional 5-10 seconds for data to fully load once "Home Screen" is displayed). This is likely not the situation for most teams, but please be aware.  