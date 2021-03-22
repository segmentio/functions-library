// At some point this lives in Settings but until then
// this has to be hard-coded.
// TODO add your company domain.
// If your pipedrive URL looks like: e.g. https://pipedrive-dev-67d463.pipedrive.com/persons/list/user/10603257
// Then your COMPANY_DOMAIN is 'pipedrive-dev-67d463'
const COMPANY_DOMAIN = '';

/**
 * @param {SpecTrack} event The track event
 * @param {Object.<string, any>} settings Custom settings
 * @return void
 */
async function onTrack(event, settings) {
  throw new EventNotSupported('The track method is not supported.');
}

/**
 * onIdentify takes an Identify event and creates a Pipedrive Person.
 *
 * @param {SpecIdentify} event The identify event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
async function onIdentify(event, settings) {
  if (!COMPANY_DOMAIN) {
    throw new EventNotSupported('COMPANY_DOMAIN is required before sending events to Pipedrive')
  }
  // Extract relevant fields.
  const { traits } = event;
  const { id, name, email } = traits;

  // Map to Pipedrive Contact.
  const emailArray = [email || event.email]; // Fall back to `event.email`.
  const contact = {
    name,
    email: emailArray,
    id,
  };

  // Generate and send request.
  // https://developers.pipedrive.com/docs/api/v1/#!/Persons/post_persons
  const writeKey = settings.apiKey;
  const url = `https://${COMPANY_DOMAIN}.pipedrive.com/v1/persons?api_token=${writeKey}`;
  const res = await fetch(url, {
    body: JSON.stringify(contact),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  // Return response.
  // Successful response should have value `success: true`.
  return res.json();
}
