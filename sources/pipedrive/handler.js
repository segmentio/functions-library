exports.processEvents = async (event) => {
  return transform(event.payload.body);
};

function transform(event) {
  let eventData = event;
  let eventObject = eventData.current;
  let returnValue = {
    events: [],
    objects: []
  }

  let collectionName = eventData.meta.object + "s";

  if (eventData.meta.object == 'deal') {
    returnValue.objects.push(createDealObject(eventData));
  } else if (eventData.meta.object == 'organization') {
    returnValue.objects.push(createOrganizationObject(eventData));
  } else if (eventData.meta.object == 'note') {
    returnValue.objects.push(createNoteObject(eventData));
  } else if (eventData.meta.object == 'person') {
    returnValue.objects.push(createPersonObject(eventData));
  } else {
    console.log("Unsupported Event: " + eventData.meta.object);
  }

  // Send an event when a deal is added to
  // trigger a workflow downstream
  if (eventData.event == 'added.deal') {
    let track = {
      type: 'track',
      event: 'Deal Added',
      userId: "" + eventObject.user_id,
      properties: {
        name: eventObject.title,
        value: eventObject.weighted_value,
        probability: eventObject.deal_probability,
        status: eventObject.status,
        currency: eventObject.currency
      }
    }

    returnValue.events.push(track)
  }

  // Return the objects and events to send the API calls
  return returnValue;
}

function createDealObject(eventData) {
  let currentData = eventData.current;

  return {
    collection: eventData.meta.object + "s",
    id: "" + eventData.meta.id,
    properties: {
      active: currentData.active,
      timeAdded: currentData.add_time,
      timeClosed: currentData.close_time,
      creatorUserId: currentData.creator_user_id,
      currency: currentData.currency,
      deleted: currentData.deleted,
      formattedValue: currentData.formatted_value,
      ownerName: currentData.owner_name,
      organizationId: currentData.org_id,
      organizationName: currentData.org_name,
      personId: currentData.person_id,
      personName: currentData.person_name,
      pipelineId: currentData.pipeline_id,
      stageId: currentData.stageId,
      status: currentData.status,
      title: currentData.title,
      value: currentData.value,
      wonTime: currentData.won_time
    }
  }
}

function createOrganizationObject(eventData) {
  let currentData = eventData.current;

  return {
    collection: eventData.meta.object + "s",
    id: "" + eventData.meta.id,
    properties: {
      active: currentData.active_flag,
      timeAdded: currentData.add_time,
      email: currentData.cc_email,
      closedDealCount: currentData.closed_deals_count,
      categoryId: currentData.category_id,
      countryCode: currentData.country_code,
      lastActivityDate: currentData.last_activity_date,
      lostDealsCount: currentData.lost_deals_count,
      name: currentData.name,
      nextActivityDate: currentData.next_activity_date,
      nextActivityTime: currentData.next_activity_time,
      openDealsCount: currentData.open_deals_count,
      ownerId: currentData.owner_id,
      ownerName: currentData.owner_name,
      updatedTime: currentData.update_time,
      wonDealsCount: currentData.won_deals_count
    }
  }
}

function createNoteObject(eventData) {
  let currentData = eventData.current;

  return {
    collection: eventData.meta.object + "s",
    id: "" + eventData.meta.id,
    properties: {
      active: currentData.active_flag,
      timeAdded: currentData.add_time,
      content: currentData.content,
      dealTitle: currentData.deal.title,
      dealId: currentData.deal_id,
      organizationId: currentData.org_id,
      organization_name: currentData.organization.name,
      personId: currentData.person_id,
      personName: currentData.person.name
    }
  }  
}

function createPersonObject(eventData) {
  let currentData = eventData.current;

  return {
    collection: eventData.meta.object + "s",
    id: "" + eventData.meta.id,
    properties: {
      active: currentData.active_flag,
      timeAdded: currentData.add_time,
      email: currentData.cc_email,
      firstName: currentData.first_name,
      lastName: currentData.last_name,
      lastActivityDate: currentData.last_activity_date,
      name: currentData.name,
      openDealsCount: currentData.open_deals_count,
      organizationId: currentData.org_id,
      organizationName: currentData.org_name,
      ownerId: currentData.owner_id,
      ownerName: currentData.owner_name,
      updatedTime: currentData.updated_time,
      wonDealsCount: currentData.won_deals_count
    }
  } 
}