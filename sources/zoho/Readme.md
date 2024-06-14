Integrate with ZohoDesk as a Source Function
Recommended implementation: Create this as a Custom Source. For existing sources with users that you'd like to enrich with Zohodesk ticket data, connect them to a Webhook which sends to the URL of your Custom Source. 

1. Create a webhook in Zohodesk for Add Ticket and paste in the Webhook Url generated in Segment from your custom source (see image below)
<img src="https://i.ibb.co/kQNyxNS/Screen-Shot-2020-05-15-at-12-45-04-PM.png" width="400px"/>



2. Copy and paste the code from the handler.js file into the custom source function code editor. It includes track call for ticket information, and identify call for who is submitting the ticket and the group call for the organization the ticket is originating from



