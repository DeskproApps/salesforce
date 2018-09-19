
const loadObjects = () => {
  return Promise.resolve([
    new SFObject({
      "activateable": false,
      "createable": true,
      "custom": true,
      "customSetting": false,
      "deletable": true,
      "deprecatedAndHidden": false,
      "feedEnabled": false,
      "keyPrefix": "a0M",
      "label": "Zendesk Support Ticket Mapping",
      "labelPlural": "Zendesk Support Ticket Mappings",
      "layoutable": true,
      "mergeable": false,
      "mruEnabled": false,
      "name": "Zendesk__Zendesk_Ticket_Mapping__c",
      "queryable": true,
      "replicateable": true,
      "retrieveable": true,
      "searchable": true,
      "triggerable": true,
      "undeletable": true,
      "updateable": true,
      "urls": {
        "compactLayouts": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Mapping__c/describe/compactLayouts",
        "rowTemplate": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Mapping__c/{ID}",
        "approvalLayouts": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Mapping__c/describe/approvalLayouts",
        "defaultValues": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Mapping__c/defaultValues?recordTypeId&fields",
        "describe": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Mapping__c/describe",
        "quickActions": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Mapping__c/quickActions",
        "layouts": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Mapping__c/describe/layouts",
        "sobject": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Mapping__c"
      }
    }),
    new SFObject(    {
      "activateable": false,
      "createable": true,
      "custom": true,
      "customSetting": false,
      "deletable": true,
      "deprecatedAndHidden": false,
      "feedEnabled": false,
      "keyPrefix": "a0K",
      "label": "Zendesk Support Ticket Comment",
      "labelPlural": "Zendesk Support Ticket Comments",
      "layoutable": true,
      "mergeable": false,
      "mruEnabled": false,
      "name": "Zendesk__Zendesk_Ticket_Comment__c",
      "queryable": true,
      "replicateable": true,
      "retrieveable": true,
      "searchable": true,
      "triggerable": true,
      "undeletable": true,
      "updateable": true,
      "urls": {
        "compactLayouts": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Comment__c/describe/compactLayouts",
        "rowTemplate": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Comment__c/{ID}",
        "approvalLayouts": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Comment__c/describe/approvalLayouts",
        "defaultValues": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Comment__c/defaultValues?recordTypeId&fields",
        "describe": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Comment__c/describe",
        "quickActions": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Comment__c/quickActions",
        "layouts": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Comment__c/describe/layouts",
        "sobject": "/services/data/v37.0/sobjects/Zendesk__Zendesk_Ticket_Comment__c"
      }
    })
  ])
};