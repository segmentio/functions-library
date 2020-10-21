// Learn more about destination functions API at
// https://segment.com/docs/connections/destinations/destination-functions

/**
 * Handle track event
 * @param  {SegmentTrackEvent} event
 * @param  {FunctionSettings} settings
 */
async function onTrack(event, settings) {
  // Learn more at https://segment.com/docs/connections/spec/track/

  const endpoint = settings.useEuRegionEndpoint
    ? `https://insights-collector.eu01.nr-data.net/v1/accounts/${settings.accountId}/events`
    : `https://insights-collector.newrelic.com/v1/accounts/${settings.accountId}/events`;

  const newRelicEvent = {
    event: event.event,
    eventType: 'Segment',
    ...event.properties,
  };

  let response;

  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-Insert-Key': settings.insertKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newRelicEvent),
    });
  } catch (error) {
    // Retry on connection error
    throw new RetryError(error.message);
  }

  if (response.status >= 500 || response.status === 429) {
    // Retry on 5xx (server errors) and 429s (rate limits)
    throw new RetryError(`Failed with ${response.status}`);
  }
}
