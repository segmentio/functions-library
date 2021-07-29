/**
 * @param {SpecTrack} event The track event
 * @param {Object.<string, any>} settings Custom settings
 * @return void
 */
async function onTrack(event, settings) {
  throw new EventNotSupported('The track method is not supported.');
}

/**
 * onIdentify takes an Identify event and upserts Contact to Sendgrid.
 *
 * @param {SpecIdentify} event The identify event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
async function onIdentify(event, settings) {
  // Extract relevant fields.
  const { traits } = event;
  const {
    id,
    firstName,
    lastName,
    email,
    street,
    city,
    postalCode,
    state,
    country,
  } = traits;

  // Map to Sendgrid Contact.
  const contact = {
    address_line_1: street,
    // address_line_2 - Not in use.
    city,
    postal_code: postalCode,
    state_province_region: state,
    country,
    email: email || event.email, // Fall back to `event.email`.
    first_name: firstName,
    last_name: lastName,
    id,
    // custom_fields - Not in use.
  };

  // Generate request.
  const requestBody = {
    // list_ids - Not in use.
    contacts: [contact],
  };
  const writeKey = settings.apiKey;
  const res = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
    body: JSON.stringify(requestBody),
    headers: {
      Authorization: `Bearer ${writeKey}`,
      'Content-Type': 'application/json',
    },
    method: 'PUT',
  });

  // Return response.
  // Successful response should include a value in `body.job_id`.
  return res.json();
}
