exports.processEvents = async event => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;

  // Return an object with any combination of the following keys
  let returnValue = {
    events: [
      {
        type: "identify",
        userId: eventBody.userId,
        traits: {
          status: eventBody.status
        },
        context: {
          source: "google sheets"
        }
      },
      {
        type: "track",
        event: "Row Updated",
        userId: eventBody.userId,
        properties: {
          email: eventBody.email,
          status: eventBody.status
        },
        context: {
          source: "google sheets"
        }
      }
    ]
  };

  // Return the Javascript object with a key of events, objects or both
  return returnValue;
};
