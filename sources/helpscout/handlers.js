// 1. Access your event body, headers and query parameters through the event object
// 2. Transform the event into Segment Tracking Events or Objects by returning an object with the appropriate keys

//NOT FOR PRODUCTION USE

//TODO: verify Helpscout signature

exports.processEvents = async (event) => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;
  
  console.log(eventHeaders['X-Helpscout-Event'][0]);
  
  let eventType = eventHeaders['X-Helpscout-Event'][0].split('.')[0]
  
  console.log(eventType);
  
  let type = ''

  if (eventType == 'convo') {
    type = 'conversation'
  } else if (eventType == 'customer') {
    type = 'customer'
  } else if (eventType == 'satisfaction') {
    type = 'rating'
  } else {
    callback(new Error('No matching event type (must be one of Conversation, Customer, Rating)'))
  }
  
  console.log(type);

  let returnValue = {
    objects: [{
      collection: type,
      id: eventBody.id.toString(),
      properties: {
        type: eventBody.type
      }
    }]
  }
  
  console.log(returnValue);

  // Return the Javascript object with a key of events, objects or both
  return(returnValue)
}