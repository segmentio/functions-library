# Optimizely Custom Destination Function

This function forwards events to optimizely as a `track` metric type with tags forwarded.

The function adds events for both anonomous and userId.  You may only want to use one of those id in your event payload.  
## Settings

- `sdkKey` (string) ([Optimizely SDK key](https://docs.developers.optimizely.com/full-stack/docs/initialize-sdk-javascript#section-parameters))
- `sendAnonId` (boolean) Dispatch an event to Optimizely for each Segment Track event using the Segment anonymous ID as the Optimizely visitorId if available in event payload
- `sendKnownId` (boolean) Dispatch an event to Optimizely for each Segment Track event using the Segment User ID on the event as the Optimizely visitorId if available in event payload

When implementing experiments with Optimizely, we recommend that you use a single type of user identifier to bucket visitors throughout. If you are using both the anonymous ID and the User ID at different points in your stack, you can enable both toggles to dispatch a distinct event to Optimizely with each id. Assuming that you are using a single ID type for any given experiment, this should not result in double counting for experiment results. It can, however result in duplicate events being generated in our event exports. 
