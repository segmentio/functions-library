/**
* Please do not delete [used for Intellisense]
* @param {ServerRequest} request The incoming webhook request
* @param {Object.<string, any>} settings Custom settings
* @return void
*/
async function onRequest(request, settings) {
  return transform(request.json());
}

function transform(event) {
  let eventData = event;
  let eventObject = eventData.current;

  if (eventData.meta.object == 'deal') {
    createDealObject(eventData);
  } else if (eventData.meta.object == 'organization') {
    createOrganizationObject(eventData);
  } else if (eventData.meta.object == 'note') {
    createNoteObject(eventData);
  } else if (eventData.meta.object == 'person') {
    createPersonObject(eventData);
  } else {
    console.log("Unsupported Event: " + eventData.meta.object);
  }

  // Send an event when a deal is added to
  // trigger a workflow downstream
  if (eventData.event == 'added.deal') {
    Segment.track({
      event: 'Deal Added',
      userId: "" + eventObject.user_id,
      properties: {
        name: eventObject.title,
        value: eventObject.weighted_value,
        probability: eventObject.deal_probability,
        status: eventObject.status,
        currency: eventObject.currency
      }
    })
  }
}

function createDealObject(eventData) {
  let currentData = eventData.current;

  Segment.set({
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
  })
}

function createOrganizationObject(eventData) {
  let currentData = eventData.current;

  Segment.set({
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
  })
}

function createNoteObject(eventData) {
  let currentData = eventData.current;

  Segment.set({
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
  })
}

function createPersonObject(eventData) {
  let currentData = eventData.current;

  Segment.set({
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
  })
}