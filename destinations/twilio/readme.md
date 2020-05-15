## Twilio Destination
This function sends text messages via Twilio on identify calls. 

## Notes
* The event must contain `traits.phone`. 
* This will not work with Personas as is. In order to add Personas support, you will need to lookup the phone number before checking for the `traits.phone` field.
* This function supports any phone number format that successfully returns from [Twilio's lookup service](https://www.twilio.com/docs/lookup).