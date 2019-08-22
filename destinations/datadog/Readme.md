# Datadog Custom Destination Function

This function forwards events to datadog as a `count` metric type with tags for sourceId, message type, and event name.

The config is at the top of the function, and dictates the metric name (ie. `segment.messages`) and tag names that we'll use in incrementing the count. Generally, it's best to use the same tag keys and metric names across all your sources so that you can create a global dashboards and slice across the same dimensions across sources, etc.

## Settings

- `apiKey` (string) ([DataDog API key](https://segment.datadoghq.com/account/settings#api))
