//import { NotificationActionConstants } from "constants";

export type Nullable = null | undefined;

export type KeyLabel = {
  key: number;
  label: string;
};

export type Values = {
  values: KeyLabel[];
};

export interface IPost {
  id: string;
  accepted?: boolean | Nullable;
  age?: string | Nullable;
  assigned_to?: KeyLabel | Nullable;
  baptized?: Values | Nullable;
  baptized_by?: Values | Nullable;
  coached?: Values | Nullable;
  coached_by?: Values | Nullable;
  coaching?: Values | Nullable;
  contact_facebook?: Values | Nullable;
  contact_phone?: Values | Nullable;
  favorite?: boolean | Nullable;
  gender?: string | Nullable;
  group_coach?: Values | Nullable;
  group_leader?: Values | Nullable;
  groups?: Values | Nullable;
  last_modified?: number | Nullable;
  meetings?: Values | Nullable;
  name?: string | Nullable;
  nickname?: string | Nullable;
  overall_status?: string | Nullable;
  people_groups?: Values | Nullable;
  permalink?: string | Nullable;
  post_date?: number | Nullable;
  post_type?: string | Nullable;
  reason_closed?: string | Nullable;
  relation?: Values | Nullable;
  requires_update?: boolean | Nullable;
  seeker_path?: string | Nullable;
  sources?: Values | Nullable;
  stream_disciple?: Values | Nullable;
  stream_leader?: Values | Nullable;
  subassigned_on?: Values | Nullable;
  title?: string | Nullable;
  training_coach?: Values | Nullable;
  training_leader?: Values | Nullable;
  training_participant?: Values | Nullable;
  type?: "access" | "personal" | Nullable;
};

export interface IComment {
  comment_ID: string;
  comment_content: string | Nullable;
  comment_author?: string | Nullable;
  comment_author_email?: string | Nullable;
  // TODO: enforce this format? YYYY-MM-DD hh:mm:ss
  comment_date?: string | Nullable;
  // YYYY-MM-DD hh:mm:ss
  comment_date_gmt?: string | Nullable;
  comment_post_ID?: string | Nullable;
  comment_reactions?: string[] | Nullable;
  // TODO: enforce possible types
  comment_type?: string | Nullable;
  gravatar?: string | Nullable;
  hist_time?: number | Nullable;
  user_id?: string | Nullable;
};

export interface IActivity {
  meta_id: string;
  gravatar?: string | Nullable;
  // NOTE: string type differs from IComment.hist_time type (number)
  hist_time?: string | Nullable;
  histid?: string | Nullable;
  meta_key?: string | Nullable;
  name?: string | Nullable;
  object_note?: string | Nullable;
};

export interface INotification {
  id: string;
  channels?: string[] | Nullable;
  date_notified?: string | null | undefined;
  field_key?: string | null | undefined;
  field_value?: string | null | undefined;
  is_new?: "0" | "1" | Nullable;
  //notification_type?: NotificationActionConstants.ALERT | NotificationActionConstants.COMMENT | NotificationActionConstants.MENTION | null | undefined;
  notification_type?: "alert" | "comment" | "mention" | null | undefined;
  notification_name?: string | null | undefined;
  notification_note?: string | null | undefined;
  post_id?: string | null | undefined;
  post_title?: string | null | undefined;
  pretty_time?: string[] | null | undefined;
  secondary_item_id?: string | null | undefined;
  source_user_id?: string | null | undefined;
  user_id?: string | null | undefined;
};