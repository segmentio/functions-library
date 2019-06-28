// 1. Access your event body, headers and query parameters through the event object
// 2. Transform the event into Segment Tracking Events or Objects by returning an object with the appropriate keys

exports.processEvents = async (event) => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;

  let returnValue = {
    objects: [],
    events: []
  }
  let payload = JSON.parse(eventBody.payload);
  let eventObj = {
    type: 'track',
    properties: { ...payload, source: 'Talkable' }
  }

  switch (eventBody.type) {
    case 'unsubscribe_web_hook':
      eventObj.anonymousId = payload.person.email;
      eventObj.event = 'User Unsubscribed';
      break;
    case 'reward_web_hook':
      eventObj.anonymousId = payload.advocate_origin.email;
      eventObj.event = 'Reward Triggered';
      break;
    case 'check_unsubscribe_web_hook':
      eventObj.anonymousId = payload.recipient.email;
      eventObj.event = 'Unsubscribe Status Checked';
      break;
    case 'claim_signup_web_hook':
      eventObj.anonymousId = payload.email;
      eventObj.event = 'Advocated Signed Up';
      break;
    case 'event_web_hook':
      // this webhook is a bit generic, so using the event category
      eventObj.anonymousId = payload.person.email;
      eventObj.event = payload.origin.event_category || 'Triggered Event';
      break;
    case 'offer_signup_web_hook':
      eventObj.anonymousId = payload.email;
      eventObj.event = 'Offer Signup';
      break;
    case 'post_share_web_hook':
      eventObj.anonymousId = payload.origin.email;
      eventObj.event = 'Post Shared';
      break;
    // COUPON not a user event, we should add this event to Coupon object
    // case 'create_coupon_web_hook':
    //
    //   eventObj.event = 'Coupon Created';
    //   break;
    case 'referral_web_hook':
      eventObj.anonymousId = payload.referrer.email;
      eventObj.event = 'Referral Approved';
      break;
  }

  // adding in email as an externalId
  eventObj.context = { externalIds: [{
    id: eventObj.anonymousId,
    type: 'email',
    encoding: 'none',
    collection: 'users'
  }]}

  returnValue.events.push(eventObj)

  // Return the Javascript object with a key of events, objects or both
  return(returnValue)
}
