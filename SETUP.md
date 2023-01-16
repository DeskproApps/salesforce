Salesforce App Setup
===
<sub>This app does not support Salesforce demo accounts</sub>

To install the Salesforce app you must first add the app to Salesforce itself. Head over to Salesforce and sign in.

Once you've signed in, navigate to the "Setup" section found at the top right of the screen.

[![](/docs/assets/setup/salesforce-setup-01.png)](/docs/assets/setup/salesforce-setup-01.png)

Inside the Setup section, navigate to the **Platform Tools > Apps > App Manager** section.

[![](/docs/assets/setup/salesforce-setup-02.png)](/docs/assets/setup/salesforce-setup-02.png)

Click "New Connected App"

[![](/docs/assets/setup/salesforce-setup-03.png)](/docs/assets/setup/salesforce-setup-03.png)

Next, head back to Deskpro and navigate to **Admin > Apps & Integrations > Apps**.

Click on the "Available Apps" tab and select the Salesforce app to install it. Navigate to the "Settings" tab of the app
and copy the "Callback URL" to your clipboard.

[![](/docs/assets/setup/salesforce-setup-04.png)](/docs/assets/setup/salesforce-setup-04.png)

Ok, head back to Salesforce and enter the following details into the new app form:

* **Connected App Name:** "Deskpro App"
* **API Name:** This will be generated automatically
* **Enable OAuth Settings:** Check
* **Callback URL:** Enter the callback URl that you copied from Deskpro
* **Selected OAuth Scopes:** Select "api" and "refresh_token, offline_access" scopes (see screenshot below)
* **Require Secret for Web Server Flow:** Check
* **Require Secret for Refresh Token Flow:** Check

Then click "Save"

[![](/docs/assets/setup/salesforce-setup-05.png)](/docs/assets/setup/salesforce-setup-05.png)

Next, you should see a warning informing you that these updates could take up to 10 minutes. Click "Continue" and wait 
for 10 minutes.

[![](/docs/assets/setup/salesforce-setup-06.png)](/docs/assets/setup/salesforce-setup-06.png)

On the next screen, click "Manage Consumer Details"

[![](/docs/assets/setup/salesforce-setup-07.png)](/docs/assets/setup/salesforce-setup-07.png)

Copy the "Consumer Key" and "Consumer Secret" and **keep them safe**.

[![](/docs/assets/setup/salesforce-setup-08.png)](/docs/assets/setup/salesforce-setup-08.png)

Next, head back to Deskpro and enter the consumer key and secret into the app settings form.

You'll also need to enter your Salesforce URL. This will look something like this:

`https://MY-COMPANY.my.salesforce.com`

[![](/docs/assets/setup/salesforce-setup-09.png)](/docs/assets/setup/salesforce-setup-09.png)

Next, click "Sign-in" under the "Global Salesforce User" section. Please note that this is the user that the Deskpro 
Salesforce app will use to request details from Salesforce for any Deskpro agent.

Navigate to the "Permissions" section and make sure that you have given permission to those users and/or groups that are
able to use the Salesforce app.

Once you've authorized your global Salesforce user, click the **"Install"** button at the bottom of the screen.
