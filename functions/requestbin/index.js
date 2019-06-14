// This example uses verifies POST data with https://requestbin.com/
// Create a request bin and update this endpoint
const endpoint = "https://REDACTED.x.pipedream.net"

// track demonstrates how to POST data to an external API using fetch
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function track(event, settings) {
  const url = new URL(endpoint)
  url.searchParams.set("ts", event.timestamp)

  const res = await fetch(url.toString(), {
    body: JSON.stringify(event),
    headers: new Headers({
      "Authentication": 'Basic ' + Buffer.from(settings.apiKey).toString('base64'),
      "Content-Type": "application/json",
    }),
    method: "post",
  })
  return await res.text() // or res.json() for JSON APIs
}

// identify demonstrates how to filter event data, e.g. for removing PII
// and how to enrich data using fetch
async function identify(event, settings) {
  const blacklist = ['ssn', 'first_name', 'last_name', 'name', 'email'];
  blacklist.forEach(i => delete event[i]);

  const resp = await fetch('https://reqres.in/api/users/2');
  const user = await resp.json();
  event.traits = event.traits || {};
  event.traits.avatar = user.data.avatar;

  const res = await fetch(endpoint, {
    body: JSON.stringify(event),
    method: "post",
  })
  return await res.json()
}

// group demonstrates how to handle an invalid event
async function group(event, settings) {
  if (!event.company) {
    throw new InvalidEventPayload("company is required")
  }
}

// page demonstrates how to handle an invalid setting
async function page(event, settings) {
  if (!settings.accountId) {
    throw new ValidationError("Account ID is required")
  }
}

// alias demonstrats how to handle an event that isn't supported
async function alias(event, settings) {
  throw new EventNotSupported("alias not supported")
}

// screen demonstrates how to handle an event that isn't supported
async function screen(event, settings) {
  throw new EventNotSupported("screen not supported")
}