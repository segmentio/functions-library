/**
 * @typedef {Object} SegmentTrackEvent
 * @see {@link https://segment.com/docs/connections/spec/track/}  for full track event spec
 * @see {@link https://segment.com/docs/connections/spec/common/} for full common fields spec
 * @property {String} event             Track event name
 * @property {String} messageId         Original API message identifier
 * @property {String} userId            Tracked user id that we want to modify and re-track
 * @property {String} timestamp         Timestamp of event in ISO 8601 format
 * @property {Object} properties        Track event arbitrary properties, we want to add 3 own
 */

/**
 * @typedef {Object} FunctionSettings
 * @property {String} apiKey            Write key of source to forward alias and track events to
 */

/**
 * Call Segment V1 API, using HTTP API Segment Source by write key
 * @see {@link https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/} for source doc
 * @internal
 * @param {String} apiKey
 * @param {String<'alias'|'track'>} route
 * @param {Object} body
 * @return {Promise<void>}
 */
async function callSegmentAPI(apiKey, route, body) {
  let response;

  try {
    response = await fetch(`https://api.segment.io/v1/${route}`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`${apiKey}:`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    throw new RetryError(error.message);
  }

  if (response.status >= 500 || response.status === 429) {
    throw new RetryError(`Failed with ${response.status}`);
  }
}

/**
 * Handle track event
 * @param {SegmentTrackEvent} event
 * @param {FunctionSettings} settings
 * @return {Promise<void>}
 */
async function onTrack(event, settings) {
  const { apiKey } = settings;

  if (!apiKey) {
    throw new ValidationError('Forward source write key is required');
  }

  const anticipatedId = crypto.createHash('md5').update(event.userId).digest('hex');

  const [slug1, slug2, slug3] = event.userId.split('-');

  await Promise.all([
    callSegmentAPI(apiKey, 'alias', {
      previousId: event.userId,
      userId: anticipatedId,
      timestamp: event.timestamp,
    }),
    callSegmentAPI(apiKey, 'track', {
      event: event.event,
      userId: anticipatedId,
      properties: {
        ...event.properties,
        slug1,
        slug2,
        slug3,
      },
    }),
  ]);
}
