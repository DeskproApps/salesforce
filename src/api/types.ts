export type RequestMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
}

export type ObjectType =
  | "Contact"
  | "Lead"
  | "Account"
  | "User"
  | "Opportunity"
  | "Note"
  | "ActivityHistory";

export interface Address {
  city?: string;
  country?: string;
  geocodeAccuracy?: string;
  latitude?: string;
  longitude?: string;
  postalCode?: string;
  state?: string;
  street?: string;
}

export interface ContactAttributes {
  type: "Contact";
  url: string;
}

export interface Contact {
  attributes: ContactAttributes;
  Id: string;
  IsDeleted: boolean;
  MasterRecordId?: string;
  AccountId?: string;
  LastName: string;
  FirstName: string;
  Salutation: string;
  Name?: string;
  OtherStreet?: string;
  OtherCity?: string;
  OtherState?: string;
  OtherPostalCode?: string;
  OtherCountry?: string;
  OtherLatitude?: string;
  OtherLongitude?: string;
  OtherGeocodeAccuracy?: string;
  OtherAddress?: string;
  MailingStreet?: string;
  MailingCity?: string;
  MailingState?: string;
  MailingPostalCode?: string;
  MailingCountry?: string;
  MailingLatitude?: number;
  MailingLongitude?: number;
  MailingGeocodeAccuracy?: string;
  MailingAddress?: string;
  Phone?: string;
  Fax?: string;
  MobilePhone?: string;
  HomePhone?: string;
  OtherPhone?: string;
  AssistantPhone?: string;
  ReportsToId?: string;
  Email?: string;
  Title?: string;
  Department?: string;
  AssistantName?: string;
  LeadSource?: string;
  Birthdate?: string;
  Description?: string;
  OwnerId: string;
  CreatedDate: string;
  CreatedById: string;
  LastModifiedDate: string;
  LastModifiedById: string;
  SystemModstamp: string;
  LastActivityDate?: string;
  LastCURequestDate?: string;
  LastCUUpdateDate?: string;
  LastViewedDate: string;
  LastReferencedDate: string;
  EmailBouncedReason?: string;
  EmailBouncedDate?: string;
  IsEmailBounced: boolean;
  PhotoUrl?: string;
  Jigsaw?: string;
  JigsawContactId?: string;
  CleanStatus: string;
  IndividualId?: string;
  Level__c?: string;
  Languages__c?: string;
}

export interface NoteAttributes {
  type: "Note";
  url: string;
}

export interface Note {
  attributes: NoteAttributes;
  Id: string;
  IsDeleted: boolean;
  ParentId: string;
  Title: string;
  IsPrivate: boolean;
  Body: string;
  OwnerId: string;
  CreatedDate: string;
  CreatedById: string;
  LastModifiedDate: string;
  LastModifiedById: string;
  SystemModstamp: string;
}

export interface LeadAttributes {
  type: "Lead";
  url: string;
}

export interface Lead {
  attributes: LeadAttributes;
  Id: string;
  IsDeleted: boolean;
  MasterRecordId?: string;
  LastName: string;
  FirstName: string;
  Salutation: string;
  Name?: string;
  Title?: string;
  Company: string;
  Street?: string;
  City?: string;
  State?: string;
  PostalCode?: string;
  Country?: string;
  Latitude?: string;
  Longitude?: string;
  GeocodeAccuracy?: string;
  Address?: string;
  Phone?: string;
  MobilePhone?: string;
  Fax?: string;
  Email: string;
  Website?: string;
  PhotoUrl?: string;
  Description?: string;
  LeadSource?: string;
  Status?: string;
  Industry?: string;
  Rating?: string;
  AnnualRevenue?: string;
  NumberOfEmployees?: string;
  OwnerId: string;
  IsConverted: boolean;
  ConvertedDate?: string;
  ConvertedAccountId?: string;
  ConvertedContactId?: string;
  ConvertedOpportunityId?: string;
  IsUnreadByOwner: boolean;
  CreatedDate: string;
  CreatedById: string;
  LastModifiedDate: string;
  LastModifiedById: string;
  SystemModstamp: string;
  LastActivityDate?: string;
  LastViewedDate: string;
  LastReferencedDate: string;
  Jigsaw?: string;
  JigsawContactId?: string;
  CleanStatus: string;
  CompanyDunsNumber?: string;
  DandbCompanyId?: string;
  EmailBouncedReason?: string;
  EmailBouncedDate?: string;
  IndividualId?: string;
  SICCode__c?: string;
  ProductInterest__c?: string;
  Primary__c?: string;
  CurrentGenerators__c?: string;
  NumberofLocations__c?: string;
}

export interface OpportunityAttributes {
  type: "Opportunity";
  url: string;
}

export interface Opportunity {
  attributes: OpportunityAttributes;
  Id: string;
  IsDeleted: boolean;
  AccountId: string;
  IsPrivate: boolean;
  Name: string;
  Description?: string;
  StageName: string;
  Amount: number;
  Probability: number;
  ExpectedRevenue: number;
  TotalOpportunityQuantity?: string;
  CloseDate: string;
  Type: string;
  NextStep?: string;
  LeadSource: string;
  IsClosed: boolean;
  IsWon: boolean;
  ForecastCategory: string;
  ForecastCategoryName: string;
  CampaignId?: string;
  HasOpportunityLineItem: boolean;
  Pricebook2Id?: string;
  OwnerId: string;
  CreatedDate: string;
  CreatedById: string;
  LastModifiedDate: string;
  LastModifiedById: string;
  SystemModstamp: string;
  LastActivityDate?: string;
  PushCount: number;
  LastStageChangeDate?: string;
  FiscalQuarter: number;
  FiscalYear: number;
  Fiscal: string;
  ContactId: string;
  LastViewedDate: string;
  LastReferencedDate: string;
  HasOpenActivity: boolean;
  HasOverdueTask: boolean;
  LastAmountChangedHistoryId?: string;
  LastCloseDateChangedHistoryId?: string;
  DeliveryInstallationStatus__c?: string;
  TrackingNumber__c?: string;
  OrderNumber__c?: string;
  CurrentGenerators__c?: string;
  MainCompetitors__c?: string;
}

export interface AccountAttributes {
  type: "Account";
  url: string;
}

export interface Account {
  attributes: AccountAttributes;
  Id: string;
  IsDeleted: boolean;
  MasterRecordId?: string;
  Name?: string;
  Type?: string;
  ParentId?: string;
  BillingStreet?: string;
  BillingCity?: string;
  BillingState?: string;
  BillingPostalCode?: string;
  BillingCountry?: string;
  BillingLatitude?: string;
  BillingLongitude?: string;
  BillingGeocodeAccuracy?: string;
  BillingAddress?: Address;
  ShippingStreet?: string;
  ShippingCity?: string;
  ShippingState?: string;
  ShippingPostalCode?: string;
  ShippingCountry?: string;
  ShippingLatitude?: string;
  ShippingLongitude?: string;
  ShippingGeocodeAccuracy?: string;
  ShippingAddress: Address;
  Phone?: string;
  Fax?: string;
  AccountNumber?: string;
  Website?: string;
  PhotoUrl?: string;
  Sic?: string;
  Industry?: string;
  AnnualRevenue?: string;
  NumberOfEmployees?: string;
  Ownership?: string;
  TickerSymbol?: string;
  Description?: string;
  Rating?: string;
  Site?: string;
  OwnerId?: string;
  CreatedDate: string;
  CreatedById: string;
  LastModifiedDate: string;
  LastModifiedById: string;
  SystemModstamp: string;
  LastActivityDate?: string;
  LastViewedDate: string;
  LastReferencedDate: string;
  Jigsaw?: string;
  JigsawCompanyId?: string;
  CleanStatus: string;
  AccountSource?: string;
  DunsNumber?: string;
  Tradestyle?: string;
  NaicsCode?: string;
  NaicsDesc?: string;
  YearStarted?: string;
  SicDesc?: string;
  DandbCompanyId?: string;
  OperatingHoursId?: string;
  CustomerPriority__c?: string;
  SLA__c?: string;
  Active__c?: string;
  NumberofLocations__c?: string;
  UpsellOpportunity__c?: string;
  SLASerialNumber__c?: string;
  SLAExpirationDate__c?: string;
}

export interface UserAttributes {
  type: "User";
  url: string;
}

export interface User {
  attributes: UserAttributes;
  Id: string;
  Username: string;
  LastName: string;
  FirstName: string;
  Name: string;
  CompanyName: string;
  Division?: string;
  Department?: string;
  Title?: string;
  Street?: string;
  City?: string;
  State?: string;
  PostalCode?: string;
  Country: string;
  Latitude?: string;
  Longitude?: string;
  GeocodeAccuracy?: string;
  Address: Address;
  Email: string;
  EmailPreferencesAutoBcc: boolean;
  EmailPreferencesAutoBccStayInTouch: boolean;
  EmailPreferencesStayInTouchReminder: boolean;
  SenderEmail?: string;
  SenderName?: string;
  Signature?: string;
  StayInTouchSubject?: string;
  StayInTouchSignature?: string;
  StayInTouchNote?: string;
  Phone?: string;
  Fax?: string;
  MobilePhone?: string;
  Alias: string;
  CommunityNickname: string;
  BadgeText: string;
  IsActive: boolean;
  TimeZoneSidKey: string;
  UserRoleId?: string;
  LocaleSidKey: string;
  ReceivesInfoEmails: boolean;
  ReceivesAdminInfoEmails: boolean;
  EmailEncodingKey: string;
  ProfileId: string;
  UserType: string;
  LanguageLocaleKey: string;
  EmployeeNumber?: string;
  DelegatedApproverId?: string;
  ManagerId?: string;
  LastLoginDate: string;
  LastPasswordChangeDate: string;
  CreatedDate: string;
  CreatedById: string;
  LastModifiedDate: string;
  LastModifiedById: string;
  SystemModstamp: string;
  NumberOfFailedLogins: number;
  OfflineTrialExpirationDate?: string;
  OfflinePdaTrialExpirationDate?: string;
  UserPermissionsMarketingUser: boolean;
  UserPermissionsOfflineUser: boolean;
  UserPermissionsCallCenterAutoLogin: boolean;
  UserPermissionsSFContentUser: boolean;
  UserPermissionsKnowledgeUser: boolean;
  UserPermissionsInteractionUser: boolean;
  UserPermissionsSupportUser: boolean;
  UserPermissionsJigsawProspectingUser: boolean;
  UserPermissionsSiteforceContributorUser: boolean;
  UserPermissionsSiteforcePublisherUser: boolean;
  UserPermissionsWorkDotComUserFeature: boolean;
  ForecastEnabled: boolean;
  UserPreferencesActivityRemindersPopup: boolean;
  UserPreferencesEventRemindersCheckboxDefault: boolean;
  UserPreferencesTaskRemindersCheckboxDefault: boolean;
  UserPreferencesReminderSoundOff: boolean;
  UserPreferencesDisableAllFeedsEmail: boolean;
  UserPreferencesDisableFollowersEmail: boolean;
  UserPreferencesDisableProfilePostEmail: boolean;
  UserPreferencesDisableChangeCommentEmail: boolean;
  UserPreferencesDisableLaterCommentEmail: boolean;
  UserPreferencesDisProfPostCommentEmail: boolean;
  UserPreferencesContentNoEmail: boolean;
  UserPreferencesContentEmailAsAndWhen: boolean;
  UserPreferencesApexPagesDeveloperMode: boolean;
  UserPreferencesReceiveNoNotificationsAsApprover: boolean;
  UserPreferencesReceiveNotificationsAsDelegatedApprover: boolean;
  UserPreferencesHideCSNGetChatterMobileTask: boolean;
  UserPreferencesDisableMentionsPostEmail: boolean;
  UserPreferencesDisMentionsCommentEmail: boolean;
  UserPreferencesHideCSNDesktopTask: boolean;
  UserPreferencesHideChatterOnboardingSplash: boolean;
  UserPreferencesHideSecondChatterOnboardingSplash: boolean;
  UserPreferencesDisCommentAfterLikeEmail: boolean;
  UserPreferencesDisableLikeEmail: boolean;
  UserPreferencesSortFeedByComment: boolean;
  UserPreferencesDisableMessageEmail: boolean;
  UserPreferencesHideLegacyRetirementModal: boolean;
  UserPreferencesJigsawListUser: boolean;
  UserPreferencesDisableBookmarkEmail: boolean;
  UserPreferencesDisableSharePostEmail: boolean;
  UserPreferencesEnableAutoSubForFeeds: boolean;
  UserPreferencesDisableFileShareNotificationsForApi: boolean;
  UserPreferencesShowTitleToExternalUsers: boolean;
  UserPreferencesShowManagerToExternalUsers: boolean;
  UserPreferencesShowEmailToExternalUsers: boolean;
  UserPreferencesShowWorkPhoneToExternalUsers: boolean;
  UserPreferencesShowMobilePhoneToExternalUsers: boolean;
  UserPreferencesShowFaxToExternalUsers: boolean;
  UserPreferencesShowStreetAddressToExternalUsers: boolean;
  UserPreferencesShowCityToExternalUsers: boolean;
  UserPreferencesShowStateToExternalUsers: boolean;
  UserPreferencesShowPostalCodeToExternalUsers: boolean;
  UserPreferencesShowCountryToExternalUsers: boolean;
  UserPreferencesShowProfilePicToGuestUsers: boolean;
  UserPreferencesShowTitleToGuestUsers: boolean;
  UserPreferencesShowCityToGuestUsers: boolean;
  UserPreferencesShowStateToGuestUsers: boolean;
  UserPreferencesShowPostalCodeToGuestUsers: boolean;
  UserPreferencesShowCountryToGuestUsers: boolean;
  UserPreferencesShowForecastingChangeSignals: boolean;
  UserPreferencesHideS1BrowserUI: boolean;
  UserPreferencesDisableEndorsementEmail: boolean;
  UserPreferencesPathAssistantCollapsed: boolean;
  UserPreferencesCacheDiagnostics: boolean;
  UserPreferencesShowEmailToGuestUsers: boolean;
  UserPreferencesShowManagerToGuestUsers: boolean;
  UserPreferencesShowWorkPhoneToGuestUsers: boolean;
  UserPreferencesShowMobilePhoneToGuestUsers: boolean;
  UserPreferencesShowFaxToGuestUsers: boolean;
  UserPreferencesShowStreetAddressToGuestUsers: boolean;
  UserPreferencesLightningExperiencePreferred: boolean;
  UserPreferencesPreviewLightning: boolean;
  UserPreferencesHideEndUserOnboardingAssistantModal: boolean;
  UserPreferencesHideLightningMigrationModal: boolean;
  UserPreferencesHideSfxWelcomeMat: boolean;
  UserPreferencesHideBiggerPhotoCallout: boolean;
  UserPreferencesGlobalNavBarWTShown: boolean;
  UserPreferencesGlobalNavGridMenuWTShown: boolean;
  UserPreferencesCreateLEXAppsWTShown: boolean;
  UserPreferencesFavoritesWTShown: boolean;
  UserPreferencesRecordHomeSectionCollapseWTShown: boolean;
  UserPreferencesRecordHomeReservedWTShown: boolean;
  UserPreferencesFavoritesShowTopFavorites: boolean;
  UserPreferencesExcludeMailAppAttachments: boolean;
  UserPreferencesSuppressTaskSFXReminders: boolean;
  UserPreferencesSuppressEventSFXReminders: boolean;
  UserPreferencesPreviewCustomTheme: boolean;
  UserPreferencesHasCelebrationBadge: boolean;
  UserPreferencesUserDebugModePref: boolean;
  UserPreferencesSRHOverrideActivities: boolean;
  UserPreferencesNewLightningReportRunPageEnabled: boolean;
  UserPreferencesReverseOpenActivitiesView: boolean;
  UserPreferencesShowTerritoryTimeZoneShifts: boolean;
  UserPreferencesHasSentWarningEmail: boolean;
  UserPreferencesHasSentWarningEmail238: boolean;
  UserPreferencesNativeEmailClient: boolean;
  ContactId?: string;
  AccountId?: string;
  CallCenterId?: string;
  Extension?: string;
  FederationIdentifier?: string;
  AboutMe?: string;
  FullPhotoUrl: string;
  SmallPhotoUrl: string;
  IsExtIndicatorVisible: boolean;
  OutOfOfficeMessage: string;
  MediumPhotoUrl: string;
  DigestFrequency: string;
  DefaultGroupNotificationFrequency: string;
  JigsawImportLimitOverride: number;
  LastViewedDate: string;
  LastReferencedDate: string;
  BannerPhotoUrl: string;
  SmallBannerPhotoUrl: string;
  MediumBannerPhotoUrl: string;
  IsProfilePhotoActive: boolean;
  IndividualId?: string;
}

export interface ChildRelationship {
  cascadeDelete: boolean;
  childSObject: string;
  deprecatedAndHidden: boolean;
  field: string;
  junctionIdListNames: unknown[];
  junctionReferenceTo: unknown[];
  relationshipName: string;
  restrictedDelete: boolean;
}

export interface PicklistValue {
  active: boolean;
  defaultValue: boolean;
  label: string;
  validFor?: unknown;
  value: string;
}

export type FieldType =
  | "address"
  | "anyType"
  | "calculated"
  | "combobox"
  | "currency"
  | "DataCategoryGroupReference"
  | "email"
  | "encryptedstring"
  | "id"
  | "JunctionIdList"
  | "location"
  | "masterrecord"
  | "multipicklist"
  | "percent"
  | "phone"
  | "picklist"
  | "reference"
  | "textarea"
  | "url"
  | "boolean"
  | "datetime"
  | "date";

export interface Field {
  aggregatable: boolean;
  aiPredictionField: boolean;
  autoNumber: boolean;
  byteLength: number;
  calculated: boolean;
  calculatedFormula?: unknown;
  cascadeDelete: boolean;
  caseSensitive: boolean;
  compoundFieldName: string;
  controllerName?: unknown;
  createable: boolean;
  custom: boolean;
  defaultValue?: boolean;
  defaultValueFormula?: unknown;
  defaultedOnCreate: boolean;
  dependentPicklist: boolean;
  deprecatedAndHidden: boolean;
  digits: number;
  displayLocationInDecimal: boolean;
  encrypted: boolean;
  externalId: boolean;
  extraTypeInfo: string;
  filterable: boolean;
  filteredLookupInfo?: unknown;
  formulaTreatNullNumberAsZero: boolean;
  groupable: boolean;
  highScaleNumber: boolean;
  htmlFormatted: boolean;
  idLookup: boolean;
  inlineHelpText?: unknown;
  label: string;
  length: number;
  mask?: unknown;
  maskType?: unknown;
  name: string;
  nameField: boolean;
  namePointing: boolean;
  nillable: boolean;
  permissionable: boolean;
  picklistValues: PicklistValue[];
  polymorphicForeignKey: boolean;
  precision: number;
  queryByDistance: boolean;
  referenceTargetField?: unknown;
  referenceTo: string[];
  relationshipName: string;
  relationshipOrder?: unknown;
  restrictedDelete: boolean;
  restrictedPicklist: boolean;
  scale: number;
  searchPrefilterable: boolean;
  soapType: string;
  sortable: boolean;
  type: FieldType;
  unique: boolean;
  updateable: boolean;
  writeRequiresMasterRead: boolean;
}

export interface RecordTypeUrls {
  layout: string;
}

export interface RecordTypeInfo {
  active: boolean;
  available: boolean;
  defaultRecordTypeMapping: boolean;
  developerName: string;
  master: boolean;
  name: string;
  recordTypeId: string;
  urls: RecordTypeUrls;
}

export interface SupportedScope {
  label: string;
  name: string;
}

export interface ObjectMetaUrls {
  compactLayouts: string;
  rowTemplate: string;
  approvalLayouts: string;
  uiDetailTemplate: string;
  uiEditTemplate: string;
  listviews: string;
  describe: string;
  uiNewRecord: string;
  quickActions: string;
  layouts: string;
  sobject: string;
}

export interface ObjectMeta {
  actionOverrides: unknown[];
  activateable: boolean;
  associateEntityType?: unknown;
  associateParentEntity?: unknown;
  childRelationships: ChildRelationship[];
  compactLayoutable: boolean;
  createable: boolean;
  custom: boolean;
  customSetting: boolean;
  deepCloneable: boolean;
  defaultImplementation?: unknown;
  deletable: boolean;
  deprecatedAndHidden: boolean;
  extendedBy?: unknown;
  extendsInterfaces?: unknown;
  feedEnabled: boolean;
  fields: Field[];
  hasSubtypes: boolean;
  implementedBy?: unknown;
  implementsInterfaces?: unknown;
  isInterface: boolean;
  isSubtype: boolean;
  keyPrefix: string;
  label: string;
  labelPlural: string;
  layoutable: boolean;
  listviewable?: unknown;
  lookupLayoutable?: unknown;
  mergeable: boolean;
  mruEnabled: boolean;
  name: string;
  namedLayoutInfos: unknown[];
  networkScopeFieldName?: unknown;
  queryable: boolean;
  recordTypeInfos: RecordTypeInfo[];
  replicateable: boolean;
  retrieveable: boolean;
  searchLayoutable: boolean;
  searchable: boolean;
  sobjectDescribeOption: string;
  supportedScopes: SupportedScope[];
  triggerable: boolean;
  undeletable: boolean;
  updateable: boolean;
  urls: ObjectMetaUrls;
}
