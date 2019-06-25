// Supported Objects: n/a
// Supported Events: Email lifecycle events: https://docs.leanplum.com/docs/webhooks

const isBlank = (str) => {
    return (!str || /^\s*$/.test(str));
};

const mapToSegment = (eventParams) => {
  try {
    eventParams.properties = {};

    // LP sends Unix epoch time stamps in ms
    eventParams.timestamp = new Date(parseInt(eventParams.timestamp)).toISOString();

    if(eventParams.abTestID) {
      eventParams.event = "AB Test";
      eventParams.properties.abTestID = eventParams.abTestID;
      eventParams.properties.variantID = eventParams.variantID;
    } else {
      eventParams.event = eventParams.channel + " " + eventParams.event;
    }

    if(isBlank(eventParams.userId)) {
      eventParams.userId = null;
    }

    if(!isBlank(eventParams.device_id)) {
      eventParams.context = { device: { id: eventParams.device_id }};
    } else {
      eventParams.context = {};
    }

    if(!isBlank(eventParams.parameters)) {
      // LP sends URL encoded JSON for the event parameters
      let params = JSON.parse(decodeURIComponent(eventParams.parameters));
      eventParams.properties = Object.assign(eventParams.properties, params);
    }

    return { type: "track",
             timestamp: eventParams.timestamp,
             event: eventParams.event,
             userId: eventParams.userId,
             context: eventParams.context,
             properties: eventParams.properties };
  } catch (e) {
    console.log("ERROR - Could not map event properties: ", e.message);
    return null;
  }
};

exports.processEvents = async (event) => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;

  console.log("Start Processing.");
  let returnEvent = mapToSegment(queryParameters);

  let returnValue = {
    events: [{ ...returnEvent}]
  };

  console.log("End Processing:", returnValue);

  return(returnValue)
};
