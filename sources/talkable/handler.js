/**
* Please do not delete [used for Intellisense]
* @param {ServerRequest} request The incoming webhook request
* @param {Object.<string, any>} settings Custom settings
* @return void
*/
async function onRequest(request, settings) {
  let eventBody = request.json()

  let returnValue = {
    objects: [],
    events: []
  }
  let payload = eventBody.payload
  let eventObj = {
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

  Segment.track(eventObj)
}
