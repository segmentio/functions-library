// 1. Access your event body, headers and query parameters through the event object
// 2. Transform the event into Segment Tracking Events or Objects by returning an object with the appropriate keys

exports.processEvents = async (event) => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;

  // opting for a generic pass the entire data payload as properties
  // improvements here could pick out certain fields or flatten nested objects
  let payload = {
    type: 'track',
    userId: eventBody.data.item.user.user_id,
    event: eventBody.topic,
    properties: {
		  ...eventBody.data
    }
  }

  // example of pulling out specific fields
  // let payload = {
  //   type: 'track',
  //   userId: eventBody.data.item.user.user_id,
  //   event: eventBody.topic,
  //   properties: {
	// 	  email: eventBody.data.item.user.email || '',
  //   	subject: eventBody.data.item.conversation_message.subject || '',
  //   	body: eventBody.data.item.conversation_message.body || '',
  //   	conversation_id: eventBody.data.item.conversation_message.id || '',
  //    conversation_type: eventBody.data.item.conversation_message.type || '',
  //   	assignee_email: eventBody.data.item.assignee.email  || '',
  //   	assignee_id: eventBody.data.item.assignee.id || ''
  //   }
  // }

  // Return an object with any combination of the following keys
  let returnValue = {
    events: [payload]
  }

  // Return the Javascript object with a key of events, objects or both
  return(returnValue)

}
