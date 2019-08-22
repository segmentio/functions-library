exports.processEvents = async (event) => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;

  let returnValue = {
    events: [{
      type: "track",
      event: eventBody.event_type,
      userId: eventBody.resources.respondent_id, 
      timestamp: eventBody.event_datetime,
      properties: {
        source: "SurveyMonkey",
        name: eventBody.name,
        objectType: eventBody.object_type,
        objectId: eventBody.object_id,
        filterId: eventBody.filter_id,
        eventId: eventBody.event_id,
        filterType: eventBody.filter_type,
        eventType: eventBody.event_type,
        subscriptionUrl: eventBody.subscription_url,
        href: eventBody.href,
        eventDateTime: eventBody.event_datetime,
        resources: {
          respondentId: eventBody.resources.respondent_id,
          recipientId: eventBody.resources.recipient_id,
          userId: eventBody.resources.user_id,
          collectorId: eventBody.resources.collector_id,
          surveyId: eventBody.resources.survey_id
        }
      }
    }]
  }

  return(returnValue)
}