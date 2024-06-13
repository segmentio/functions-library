# Re-track Custom Destination Function

Example of destination function which:
* Intercepts track event from Segment source attached to it,
* modifies userId and posts [alias](https://segment.com/docs/connections/spec/alias/) request, so Segment will know anticipated identity,
* enriches event properties and posts [track](https://segment.com/docs/connections/spec/track/) request, so Segment will know enriched event,
* all requests are being forwarded to another [Segment HTTP Tracking API Source](https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/), given `apiKey` from function settings.

## Settings

- `apiKey` {String} ([write key of Segment HTTP Tracking API Source](https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/))
