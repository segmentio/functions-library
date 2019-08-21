// 1. Access your event body, headers and query parameters through the event object
// 2. Transform the event into Segment Tracking Events or Objects by returning an object with the appropriate keys

exports.processEvents = async (event) => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;

  // Return an object with any combination of the following keys
  let returnValue = {
    events: [{
        type: 'identify',
        userId: '1234',
        properties: {
          propertyName: 'Example Property'
        }
    },
    {
        type: 'track',
        event: 'Event Name',
        userId: '1234',
        properties: {
          propertyName: 'Example Property'
        }
    },
    {
        type: 'group',
        userId: '1234',
        groupId: '1234',
        properties: {
          propertyName: 'Example Property'
        }
    }],
    objects: [{
      collection: 'Collection Name - Plural',
      id: "String of Object ID",
      properties: {
        propertyName: 'Example Property'
      }
    }]
  }

  // Return the Javascript object with a key of events, objects or both
  return(returnValue)
}