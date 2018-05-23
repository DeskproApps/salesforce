# README

## Installation

Before you install the Salesforce app, you must create a `Connected App` profile in your organization.
If your organization is using the Lightning Experience, then go to this URL and navigate to `App Manager` under `PLATFORM TOOLS > Apps` from the left side menu:

    https://<your host>/one/one.app#/setup//SetupOneHome/home

Then, click the `New Connected App` menu from the top right connect.

On that page, fill in the required fields and check `Enable OAuth Settings` under  the `API (Enable OAuth Settings)` section. Copy the `Callback url` from this page into the `Callback URL` field in Salesforce.

Once the Connected app is created, copy the `Consumer Key` and `Consumer Secret` from Salesforce into the installer form on this page  
  