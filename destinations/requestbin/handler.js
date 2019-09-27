// This destinations sends data to https://requestbin.com/ for introspection
// Create a request bin and update this endpoint
const endpoint = new URL("https://REDACTED.x.pipedream.net")

/**
 * onTrack takes a Track event and POSTs it to an external API with fetch()
 *
 * @param {SpecTrack} event The track event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
async function onTrack(event, settings) {
  endpoint.searchParams.set("ts", event.timestamp)

  const res = await fetch(endpoint, {
    body: JSON.stringify(event),
    headers: new Headers({
      "Authentication": 'Basic ' + btoa(settings.apiKey),
      "Content-Type": "application/json",
    }),
    method: "post",
  })

  return await res.json() // or res.text() for non-JSON APIs
}

/**
 * onIdentify takes an Identify event, removes PII, enriches it, then POSTs it
 *
 * @param {SpecIdentify} event The identify event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
async function onIdentify(event, settings) {
  const blacklist = ['ssn', 'first_name', 'last_name', 'name', 'email'];
  blacklist.forEach(i => delete event[i]);

  const resp = await fetch('https://reqres.in/api/users/2');
  const user = await resp.json();

  event.traits = event.traits || {};
  event.traits.avatar = user.data && user.data.avatar;

  const res = await fetch(endpoint, {
    body: JSON.stringify(event),
    method: "post",
  })

  return await res.json()
}

/**
 * onGroup demonstrates how to handle an invalid event
 *
 * @param {SpecGroup} event The group event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
async function onGroup(event, settings) {
  if (!event.company) {
    throw new InvalidEventPayload("company is required")
  }
}

/**
 * onPage demonstrates how to handle an invalid setting
 *
 * @param {SpecPage} event The page event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
async function onPage(event, settings) {
  if (!settings.accountId) {
    throw new ValidationError("Account ID is required")
  }
}

/**
 * onPage demonstrates how to handle an event that isn't supported
 *
 * @param {SpecAlias} event The alias event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
async function onAlias(event, settings) {
  throw new EventNotSupported("alias not supported")
}

/**
 * onScreen demonstrates that not defining a function implies EventNotSupported
 *
 * @param {SpecScreen} event The screen event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
// async function onScreen(event, settings) {
//   throw new EventNotSupported("screen not supported")
// }
