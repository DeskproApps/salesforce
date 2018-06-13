import { selectQuery } from '../../../main/javascript/salesforce/query';
import {SFObject, SFObjectField} from "../../../main/javascript/salesforce/apiObjects";

const object = {
  "name": "Contact",
  "label": "Contact",
  "activateable": false,
  "createable": true,
  "custom": false,
  "customSetting": false,
  "deletable": true,
  "deprecatedAndHidden": false,
  "feedEnabled": true,
  "keyPrefix": "003",
  "labelPlural": "Contacts",
  "layoutable": true,
  "mergeable": true,
  "mruEnabled": true,
  "queryable": true,
  "replicateable": true,
  "retrieveable": true,
  "searchable": true,
  "triggerable": true,
  "undeletable": true,
  "updateable": true,
  "urls": {
    "compactLayouts": "\/services\/data\/v37.0\/sobjects\/Contact\/describe\/compactLayouts",
    "rowTemplate": "\/services\/data\/v37.0\/sobjects\/Contact\/{ID}",
    "approvalLayouts": "\/services\/data\/v37.0\/sobjects\/Contact\/describe\/approvalLayouts",
    "defaultValues": "\/services\/data\/v37.0\/sobjects\/Contact\/defaultValues?recordTypeId&fields",
    "listviews": "\/services\/data\/v37.0\/sobjects\/Contact\/listviews",
    "describe": "\/services\/data\/v37.0\/sobjects\/Contact\/describe",
    "quickActions": "\/services\/data\/v37.0\/sobjects\/Contact\/quickActions",
    "layouts": "\/services\/data\/v37.0\/sobjects\/Contact\/describe\/layouts",
    "sobject": "\/services\/data\/v37.0\/sobjects\/Contact"
  }
};

const fields = [
  {
    "name": "LastName",
    "type": "string",
    "label": "Last Name",
    "aggregatable": true,
    "autoNumber": false,
    "byteLength": 240,
    "calculated": false,
    "calculatedFormula": null,
    "cascadeDelete": false,
    "caseSensitive": false,
    "controllerName": null,
    "createable": true,
    "custom": false,
    "defaultValue": null,
    "defaultValueFormula": null,
    "defaultedOnCreate": false,
    "dependentPicklist": false,
    "deprecatedAndHidden": false,
    "digits": 0,
    "displayLocationInDecimal": false,
    "encrypted": false,
    "externalId": false,
    "extraTypeInfo": "personname",
    "filterable": true,
    "filteredLookupInfo": null,
    "groupable": true,
    "highScaleNumber": false,
    "htmlFormatted": false,
    "idLookup": false,
    "inlineHelpText": null,
    "length": 80,
    "mask": null,
    "maskType": null,
    "nameField": false,
    "namePointing": false,
    "nillable": false,
    "permissionable": false,
    "picklistValues": [],
    "precision": 0,
    "queryByDistance": false,
    "referenceTargetField": null,
    "referenceTo": [],
    "relationshipName": null,
    "relationshipOrder": null,
    "restrictedDelete": false,
    "restrictedPicklist": false,
    "scale": 0,
    "soapType": "xsd:string",
    "sortable": true,
    "unique": false,
    "updateable": true,
    "writeRequiresMasterRead": false
  },
  {
    "name": "FirstName",
    "type": "string",
    "label": "First Name",
    "aggregatable": true,
    "autoNumber": false,
    "byteLength": 120,
    "calculated": false,
    "calculatedFormula": null,
    "cascadeDelete": false,
    "caseSensitive": false,
    "controllerName": null,
    "createable": true,
    "custom": false,
    "defaultValue": null,
    "defaultValueFormula": null,
    "defaultedOnCreate": false,
    "dependentPicklist": false,
    "deprecatedAndHidden": false,
    "digits": 0,
    "displayLocationInDecimal": false,
    "encrypted": false,
    "externalId": false,
    "extraTypeInfo": "personname",
    "filterable": true,
    "filteredLookupInfo": null,
    "groupable": true,
    "highScaleNumber": false,
    "htmlFormatted": false,
    "idLookup": false,
    "inlineHelpText": null,
    "length": 40,
    "mask": null,
    "maskType": null,
    "nameField": false,
    "namePointing": false,
    "nillable": true,
    "permissionable": false,
    "picklistValues": [],
    "precision": 0,
    "queryByDistance": false,
    "referenceTargetField": null,
    "referenceTo": [],
    "relationshipName": null,
    "relationshipOrder": null,
    "restrictedDelete": false,
    "restrictedPicklist": false,
    "scale": 0,
    "soapType": "xsd:string",
    "sortable": true,
    "unique": false,
    "updateable": true,
    "writeRequiresMasterRead": false
  }
];

test('selectQuery adds the Id field when no fields are selected', () => {

  const queryString = selectQuery(SFObject.instance(object)).asString();
  expect(queryString).toEqual(`SELECT Id FROM ${object.name}`);
});

test('selectQuery adds the Id field when no fields are selected', () => {

  const queryString = selectQuery(SFObject.instance(object))
    .andWhere(SFObjectField.instance(fields[0]), 'Radu')
    .asString();
  expect(queryString).toEqual(`SELECT Id FROM ${object.name} WHERE LastName = 'Radu'`);
});

test('selectQuery adds the Id field when fields are selected', () => {

  const queryString = selectQuery(SFObject.instance(object))
    .select([ SFObjectField.instance(fields[0]) ])
    .asString();
  expect(queryString).toEqual(`SELECT Id, LastName FROM ${object.name}`);
});