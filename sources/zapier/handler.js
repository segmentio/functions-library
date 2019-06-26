exports.processEvents = async (event) => {
    let eventBody = event.payload.body;
    let eventHeaders = event.payload.headers;
    let queryParameters = event.payload.queryParameters;
  
    let events = []

    if (eventBody.eventCanceled) {
        event = {
        	type: "track",
        	event: "Meeting Canceled",
        	userId: eventBody.userId, 
        	properties: {
          		source: "zapier:calendly",
          		eventCancelReason: eventBody.eventCancelReason,
          		name: eventBody.name,
          		eventType: eventBody.eventType,
          		eventTypeKind: eventBody.eventTypeKind,
                eventDateTime: eventBody.eventDateTime,
          		inviteeIsReschedule: eventBody.inviteeIsReschedule,
          		duration: eventBody.duration
        	}
        }
        events.push(event)
    } else {
        event = {
        	type: "track",
        	event: "Meeting Created",
        	userId: eventBody.userId, 
        	properties: {
          		source: "zapier:calendly",
          		name: eventBody.name,
          		eventType: eventBody.eventType,
          		eventTypeKind: eventBody.eventTypeKind,
                eventDateTime: eventBody.eventDateTime,
          		duration: eventBody.duration
        	}
        }
        events.push(event)
    }
  
    return({events})
  }