
// This example hits the WAVEFRONT REST API V2 events endpoint
// Note 1: The wavefront instance name is different for each customer
// Note 2: v2 is the only supported version as of 1/15/2020

//TODO: Move these to settings once more than apiKey is supported
let wavefrontInstance = "longboard";
let wavefrontApiVersion = "v2";
let wavefrontResource = "event";

//Create endpoint
const endpoint = `https://${wavefrontInstance}.wavefront.com/api/${wavefrontApiVersion}/${wavefrontResource}`;
const url = new URL(endpoint);

//Properties we need in the track event
//Note 1: we only cover instantaneous events for now as ending events later is only possible via wavefront UI manually
//Note 2: startTime and endTime are just set to timestamp
//TODO: Convert some important context properties to tags
const annotationProperties = [
    { key: "type", validateFunc: (input) => { return _.isString(input)} },
    { key: "details", validateFunc: (input) => { return _.isString(input)} },
    { key: "severity", validateFunc: (input) => { return _.isString(input) && _.indexOf(["info", "warn", "severe"], input) > -1 } }];

/**
 * @param {SpecTrack} event The track event
 * @param {Object.<string, any>} settings Custom settings
 * @return void
 */
async function onTrack(event, settings) {
  let { properties, timestamp } = event;

  let eventName = event.event;
  let timestampInSeconds = Date.parse(timestamp);
  let annotations = {
      prettyName: eventName
  };
  annotationProperties.forEach(subproperty => {
    let { key, validateFunc } = subproperty;
    if(properties.hasOwnProperty(key) && validateFunc(properties[key]))
      annotations[key] = properties[key];
  });

  let body = {
    name: eventName,
    startTime: timestampInSeconds,
    endTime: timestampInSeconds + 1,
    annotations
  };

  //TODO: Is there a reason to create URL object and then stringify again?
  const res = await fetch(url.toString(), {
    body: JSON.stringify(body),
    headers: new Headers({
      "Authorization": `Bearer ${settings.apiKey}`,
      "Content-Type": "application/json",
      "Accept": "application/json"
    }),
    method: "post",
  })

  //TODO: there are probably other error types
  //Note 1: API sometimes returns 200 even when errors occur
  let response = await res.json();
  let { message, code, error, status={} } = response;

  if(status.hasOwnProperty("code") && status.code === 200 && status.hasOwnProperty("result") && status.result === "OK")
    return response;
  else if(code === 400 && !!message)
    throw new ValidationError(message);
  else if((status.hasOwnProperty("result") && status.result === "ERROR") || !!error)
    throw new InvalidEventPayload(message);
  else
    throw new EventNotSupported("Not sure what is going on");
}

/**
 * onIdentify takes an Identify event, but wavefront events have no concept of user info
 *
 * @param {SpecIdentify} event The identify event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
async function onIdentify(event, settings) {
    throw new EventNotSupported("alias not supported")
}

/**
 * onGroup not supported
 *
 * @param {SpecGroup} event The group event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
async function onGroup(event, settings) {
    throw new EventNotSupported("alias not supported")
}

/**
 * onPage not supported
 *
 * @param {SpecPage} event The page event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
// page demonstrates how to handle an invalid setting
//TODO: doesn't this get covered by onTrack?
async function onPage(event, settings) {
    throw new EventNotSupported("page not supported")
}

/**
 * onAlias not supported
 *
 * @param {SpecAlias} event The alias event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
async function onAlias(event, settings) {
  throw new EventNotSupported("alias not supported")
}


/**
 * onScreen not supported
 *
 * @param {SpecScreen} event The screen event
 * @param {Object.<string, any>} settings Custom settings
 * @return any
 */
//TODO: doesn't this get covered by onTrack?
async function onScreen(event, settings) {
   throw new EventNotSupported("screen not supported")
}
