# New Relic Custom Destination Function

This function forwards all Segment `track` API calls to [New Relic Event API](https://docs.newrelic.com/docs/telemetry-data-platform/ingest-manage-data/ingest-apis/use-event-api-report-custom-events).

## Settings

- `accountId` (string) Your New Relic Insights account ID
- `insertKey` (string) Your New Relic Insert Key
- `useEuRegionEndpoint` (boolean) Toggle this option if your New Relic account is hosted in the EU region data center. Defaults to `false`.
