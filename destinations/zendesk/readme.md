# Zendesk Destination Function

This function utilizes Zendesk's [Tickets API](https://developer.zendesk.com/rest_api/docs/support/tickets) to create a new ticket with an internal note for your Support team to action on each time a user submits an application for review where Segment's [Track method](https://segment.com/docs/spec/track/) is called.


## Getting Started
1. In the Settings Builder, make sure you add the relevant [Settings as listed below](#settings), making sure the naming matches what's in the code on lines 2 and 26. You can find the Settings Builder under App Info > Settings (left hand nav).
2. Copy and paste the Zendesk function template code in the `index.js` file directly into the editor.
3. Add your relevant Zendesk [Subdomain](https://support.zendesk.com/hc/en-us/articles/221682747-Where-can-I-find-my-Zendesk-subdomain-) and [credentials](https://developer.zendesk.com/rest_api/docs/support/introduction#basic-authentication) so you can send a test event.
4. You can send the following test event to validate the existing template works as expected and see the feedback populate in your table:
```
{
  "event": "Application Submitted",
  "originalTimestamp": "2019-07-19T18:49:41.814249419Z",
  "properties": {
    "app_name": "apps/195",
    "component_type": "subscription",
    "display_name": "Customer X's Application"
  },
  "receivedAt": "2019-07-19T18:49:46.214Z",
  "sentAt": "2019-07-19T18:49:46.205Z",
  "timestamp": "2019-07-19T18:49:41.823Z",
  "type": "track",
  "userId": "userId123"
}
```
5. You're done! Feel free to modify the template to suit your organization's specific needs.


## Settings

- `subdomain` (string) 
- `credentials` (string) 
