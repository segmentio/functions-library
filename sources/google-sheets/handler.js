/**
* Please do not delete [used for Intellisense]
* @param {ServerRequest} request The incoming webhook request
* @param {Object.<string, any>} settings Custom settings
* @return void
*/
async function onRequest(request, settings) {
  let eventBody = request.json();

  Segment.identify({
    userId: eventBody.userId,
    traits: {
      status: eventBody.status
    },
    context: {
      source: "google sheets"
    }
  })

  Segment.track({
    event: "Row Updated",
    userId: eventBody.userId,
    properties: {
      email: eventBody.email,
      status: eventBody.status
    },
    context: {
      source: "google sheets"
    }
  })
}