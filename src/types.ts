import { HomeLayout, ListLayout, ViewLayout } from "./screens/admin/types";

export interface Settings {
  client_key?: string;
  client_secret?: string;
  salesforce_instance_url?: string;
  global_access_token?: string;
  default_comment_on_ticket_reply?: boolean;
  default_comment_on_ticket_note?: boolean;
  mapping_contact?: string;
  mapping_note?: string;
  mapping_opportunity?: string;
  mapping_lead?: string;
  mapping_task?: string;
  mapping_event?: string;
  mapping_account?: string;
}

export type DPUser = {
  //..
};

export interface ITaskMetadata {
  fields: {
    label: string;
    name: string;
    picklistValues: { label: string; value: string; active: boolean }[];
  }[];
}
export interface IActivity {
  Type: string;
  attributes: Attributes;
  Id: string;
  WhoId: string;
  WhatId: null;
  Subject: string;
  ActivityDate: string;
  Status: string;
  Priority: string;
  IsHighPriority: boolean;
  OwnerId: string;
  Description: string;
  IsDeleted: boolean;
  AccountId: null;
  IsClosed: boolean;
  CreatedDate: string;
  CreatedById: string;
  LastModifiedDate: string;
  LastModifiedById: string;
  SystemModstamp: string;
  IsArchived: boolean;
  CallDurationInSeconds: null;
  CallType: null;
  CallDisposition: null;
  CallObject: null;
  ReminderDateTime: null;
  IsReminderSet: boolean;
  RecurrenceActivityId: null;
  IsRecurrence: boolean;
  RecurrenceStartDateOnly: null;
  RecurrenceEndDateOnly: null;
  RecurrenceTimeZoneSidKey: null;
  RecurrenceType: null;
  RecurrenceInterval: null;
  RecurrenceDayOfWeekMask: null;
  RecurrenceDayOfMonth: null;
  RecurrenceInstance: null;
  RecurrenceMonthOfYear: null;
  RecurrenceRegeneratedType: null;
  TaskSubtype: string;
  CompletedDateTime: string;
  Location: string;
  IsAllDayEvent: boolean;
  ActivityDateTime: string;
  DurationInMinutes: number;
  StartDateTime: string;
  EndDateTime: string;
  EndDate: string;
  IsPrivate: boolean;
  ShowAs: string;
  IsChild: boolean;
  IsGroupEvent: boolean;
  GroupEventType: null;
  RecurrenceStartDateTime: null;
  EventSubtype: string;
  IsRecurrence2Exclusion: boolean;
  Recurrence2PatternText: null;
  Recurrence2PatternVersion: null;
  IsRecurrence2: boolean;
  IsRecurrence2Exception: boolean;
  Recurrence2PatternStartDate: null;
  Recurrence2PatternTimeZone: null;
  ServiceAppointmentId: null;
}
// Generated by https://quicktype.io

export interface IEvent {
  attributes: Attributes;
  Id: string;
  WhoId: string;
  WhatId: string;
  Subject: string;
  Location: string;
  IsAllDayEvent: boolean;
  ActivityDateTime: string;
  ActivityDate: string;
  DurationInMinutes: number;
  StartDateTime: string;
  EndDateTime: string;
  EndDate: string;
  Description: string;
  AccountId: string;
  OwnerId: string;
  IsPrivate: boolean;
  ShowAs: string;
  IsDeleted: boolean;
  IsChild: boolean;
  IsGroupEvent: boolean;
  GroupEventType: null;
  CreatedDate: string;
  CreatedById: string;
  LastModifiedDate: string;
  LastModifiedById: string;
  SystemModstamp: string;
  IsArchived: boolean;
  RecurrenceActivityId: null;
  IsRecurrence: boolean;
  RecurrenceStartDateTime: null;
  RecurrenceEndDateOnly: null;
  RecurrenceTimeZoneSidKey: null;
  RecurrenceType: null;
  RecurrenceInterval: null;
  RecurrenceDayOfWeekMask: null;
  RecurrenceDayOfMonth: null;
  RecurrenceInstance: null;
  RecurrenceMonthOfYear: null;
  ReminderDateTime: null;
  IsReminderSet: boolean;
  EventSubtype: string;
  IsRecurrence2Exclusion: boolean;
  Recurrence2PatternText: null;
  Recurrence2PatternVersion: null;
  IsRecurrence2: boolean;
  IsRecurrence2Exception: boolean;
  Recurrence2PatternStartDate: null;
  Recurrence2PatternTimeZone: null;
  ServiceAppointmentId: null;
}

export interface Attributes {
  type: string;
  url: string;
}

export interface Attributes {
  type: string;
  url: string;
}

export type ContactLayout = {
  type: "Contact";
  home: HomeLayout;
  view: ViewLayout;
};

export type OpportunityLayout = {
  type: "Opportunity";
  list: ListLayout;
  view: ViewLayout;
};

export type TaskLayout = {
  type: "Task";
  list: ListLayout;
  view: ViewLayout;
};

export type EventLayout = {
  type: "Note";
  list: ListLayout;
  view: ViewLayout;
};

export type NoteLayout = {
  type: "Note";
  list: ListLayout;
  view: ViewLayout;
};

export type LeadLayout = {
  type: "Lead";
  home: HomeLayout;
  view: ViewLayout;
};

export type AccountLayout = {
  type: "Account";
  home: HomeLayout;
  view: ViewLayout;
};

export type NoteSubmit = {
  Title: string;
  Body: string;
  ParentId: string;
};

export type Layout =
  | ContactLayout
  | OpportunityLayout
  | TaskLayout
  | LeadLayout
  | AccountLayout
  | EventLayout
  | NoteLayout;
