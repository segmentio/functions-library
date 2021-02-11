//written by Vinayak, grabbed from Slack by Diggory
//see required settings in "required-settings.png" in this folder

// Learn more about destination functions API at
// https://segment.com/docs/connections/destinations/destination-functions
/**
 * Handle track event
 * @param  {SegmentTrackEvent} event
 * @param  {FunctionSettings} settings
 */
async function onTrack(event, settings) {
  // Learn more at https://segment.com/docs/connections/spec/identify/
  throw new EventNotSupported('track is not supported');
}
/**
 * Handle identify event
 * @param  {SegmentIdentifyEvent} event
 * @param  {FunctionSettings} settings
 */
async function onIdentify(event, settings) {
  const endpoint = `https://${settings.dataCenterId}.qualtrics.com/API/v3/directories/${settings.directoryId}/mailinglists/${settings.mailingListId}/contacts`;
  let fetchedUser;
  // fetch from profile api additional enrichhment
  try {
    fetchedUser = await fetchProfile(
      event.userId,
      settings.spaceId,
      settings.profileApiToken
    );
  } catch (error) {
    // Retry on connection error'
    throw new RetryError(error.message);
  }
  let payload = {
    email: event.traits.email,
    extRef: event.userId
  };
  let user = await fetchedUser.json();
  let { firstName, lastName, shippingCountry, sellerTier } = user.traits;
  console.log('pulled TRAITS:', user.traits);
  if (firstName || lastName) {
    payload.firstName = firstName;
    payload.lastName = lastName;
    payload.embeddedData = {
      shippingCountry,
      sellerTier
    };
  }
  console.log('final payload: ', payload);
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'X-API-TOKEN': settings.apiToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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
/**
 * Handle group event
 * @param  {SegmentGroupEvent} event
 * @param  {FunctionSettings} settings
 */
async function onGroup(event, settings) {
  // Learn more at https://segment.com/docs/connections/spec/group/
  throw new EventNotSupported('group is not supported');
}
/**
 * Handle page event
 * @param  {SegmentPageEvent} event
 * @param  {FunctionSettings} settings
 */
async function onPage(event, settings) {
  // Learn more at https://segment.com/docs/connections/spec/page/
  throw new EventNotSupported('page is not supported');
}
/**
 * Handle screen event
 * @param  {SegmentScreenEvent} event
 * @param  {FunctionSettings} settings
 */
async function onScreen(event, settings) {
  // Learn more at https://segment.com/docs/connections/spec/screen/
  throw new EventNotSupported('screen is not supported');
}
/**
 * Handle alias event
 * @param  {SegmentAliasEvent} event
 * @param  {FunctionSettings} settings
 */
async function onAlias(event, settings) {
  // Learn more at https://segment.com/docs/connections/spec/alias/
  throw new EventNotSupported('alias is not supported');
}
/**
 * Handle delete event
 * @param  {SegmentDeleteEvent} event
 * @param  {FunctionSettings} settings
 */
async function onDelete(event, settings) {
  // Learn more at https://segment.com/docs/partners/spec/#delete
  throw new EventNotSupported('delete is not supported');
}
async function fetchProfile(lookup_value, space_id, profile_api_token) {
  const base_url = `https://profiles.segment.com/v1/spaces/${space_id}/collections/users/profiles`;
  const url = `${base_url}/user_id:${lookup_value}/traits?limit=200`;
  let response;
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Basic ${btoa(profile_api_token + ':')}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Retry on connection error
    throw new RetryError(error.message);
  }
  if (
    response.status >= 500 ||
    response.status == 429 ||
    response.status == 401
  ) {
    // Retry on 5xx (server errors) and 429s (rate limits)
    throw new RetryError(`Failed with ${response.status}`);
  }
  if (response.status == 200) {
    return response;
  }
}
