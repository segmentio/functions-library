/**
* Please do not delete [used for Intellisense]
* @param {ServerRequest} request The incoming webhook request
* @param {Object.<string, any>} settings Custom settings
* @return void
*/
async function onRequest(request, settings) {
  let event = request.json()

  if (event.name == 'Completed Challenge') {
    createChallengeCompletedEvent(event)
  } else if(event.name == 'Earned Badge') {
    createEarnedBadgeEvent(event)
  } else if(event.name == 'Joined AdvocateHub Group') {
    createJoinedGroupEvent(event)
  } else if (event.name == 'Advocate Joined') {
    createAdvocateJoinedEvent(event)
  } else {
    console.log("Unsupported Event: " + event.name);
  }
}

function createChallengeCompletedEvent(event) {
  Segment.track({
    event: 'Challenge Completed',
    userId: event.contact.email,
    properties: {
      name: event.challenge.name,
      company: event.contact.company,
      points: event.points,
      challengeId: event.challenge.id,
      challengeType: event.challenge.challenge_type
    }
  })
}

function createEarnedBadgeEvent(event) {
  Segment.track({
    event: 'Badge Earned',
    userId: event.contact.email,
    properties: {
      name: event.parameters.name,
      description: event.parameters.description,
      points: event.points,
      sourceName: event.source_name,
      sourceType: event.source_type
    }
  })
}

function createJoinedGroupEvent(event) {
  Segment.track({
    event: 'Group Joined',
    userId: event.contact.email,
    properties: {
      group: event.parameters.group,
      groupId: event.parameters.group_id,
      groupType: event.parameters.type,
      points: event.points
    }
  })
}

function createAdvocateJoinedEvent(event) {
  Segment.track({
    event: 'Advocated Joined',
    userId: event.contact.email,
    properties: {
      type: event.type,
      sourceName: event.source_name,
      points: event.points,
      sourceType: event.source_type
    }
  })
}