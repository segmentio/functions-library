exports.processEvents = async (event) => {
  return transform (event.payload.body)
}

function transform(event) {
  let returnValue = {
    events: []
  }

  if (event.name == 'Completed Challenge') {
    returnValue.events.push(createChallengeCompletedEvent(event));
  } else if(event.name == 'Earned Badge') {
    returnValue.events.push(createEarnedBadgeEvent(event));
  } else if(event.name == 'Joined AdvocateHub Group') {
    returnValue.events.push(createJoinedGroupEvent(event));
  } else if (event.name == 'Advocate Joined') {
    returnValue.events.push(createAdvocateJoinedEvent(event));
  } else {
    console.log("Unsupported Event: " + event.name);
  }

  return(returnValue);
}

function createChallengeCompletedEvent(event) {
  return {
    type: 'track',
    event: 'Challenge Completed',
    userId: event.contact.email,
    properties: {
      name: event.challenge.name,
      company: event.contact.company,
      points: event.points,
      challengeId: event.challenge.id,
      challengeType: event.challenge.challenge_type
    }
  }
}

function createEarnedBadgeEvent(event) {
  return {
    type: 'track',
    event: 'Badge Earned',
    userId: event.contact.email,
    properties: {
      name: event.parameters.name,
      description: event.parameters.description,
      points: event.points,
      sourceName: event.source_name,
      sourceType: event.source_type
    }
  }
}

function createJoinedGroupEvent(event) {
  return {
    type: 'track',
    event: 'Group Joined',
    userId: event.contact.email,
    properties: {
      group: event.parameters.group,
      groupId: event.parameters.group_id,
      groupType: event.parameters.type,
      points: event.points
    }
  }
}

function createAdvocateJoinedEvent(event) {
  return {
    type: 'track',
    event: 'Advocated Joined',
    userId: event.contact.email,
    properties: {
      type: event.type,
      sourceName: event.source_name,
      points: event.points,
      sourceType: event.source_type
    }
  }
}