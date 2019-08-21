# Airtable Destination Function

This function helps you add user feedback directly into Airtable's [User Feedback template](https://airtable.com/templates/product-design-and-ux/expoiiRjvXfMHtXtC/user-feedback) once you've collected this information on your website.

## Getting Started
1. Add the [User Feedback template](https://airtable.com/templates/product-design-and-ux/expoiiRjvXfMHtXtC/user-feedback) as a base to your Airtable account.
2. In the Settings Builder, make sure you add the relevant [Settings as listed below](#settings), making sure the naming matches what's in the code on lines 2 and 27. You can find the Settings Builder under App Info > Settings (left hand nav).
3. Copy and paste the Airtable function template code in the `index.js` file directly into the editor.
4. Add your relevant Airtable [API Key](https://airtable.com/account) and [App ID](https://community.airtable.com/t/what-is-the-app-id-where-do-i-find-it/2984) so you can send a test event.
5. You can send the following test event to validate the existing template works as expected and see the feedback populate in your table:
```
{
  "type": "track",
  "event": "Feedback Added",
  "userId": "userId888",
  "timestamp": "2019-04-08T01:19:38.931Z",
  "email": "test@example.com",
  "properties": {
      "additionalNotes": "Wish the battery life was a little big longer!",
      "name": "Katrina Peterson",
      "otherSecurityTools": "I currently also use a Nest Cam for indoor monitoring because I've had it for 2+ years",
      "recommendToAnother": "5. Very Likely",
      "favoriteFeatures": "Alerts,Live video,Recording",
      "email": "kpeterson@test.com",
      "usage": 10,
      "leastFavoriteFeatures": "Alerts,Live video,Recording" 
  }
}
```
6. You're done! Feel free to modify the template to suit your organization's specific needs.


## Settings

- `apiKey` (string) 
- `appId` (string) 
