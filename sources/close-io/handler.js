
/**
* Please do not delete [used for Intellisense]
* @param {ServerRequest} request The incoming webhook request
* @param {Object.<string, any>} settings Custom settings
* @return void
*/
async function onRequest(request, settings) {
  const { event: body } = request.json();
  const {
    object_type,
    subscription_id,
    data: { id, created_by, updated_by },
    data,
    action
  } = body;
  const sourceCtx = () => ({ integration: { name: "Close.io [Custom]" } });

  const objectTypeCollectionMapping = new Map([
    ["opportunity", "opportunities"],
    ["lead", "leads"],
    ["contact", "contacts"],
    ["activity.note", "activity_notes"],
    ["activity.call", "activity_calls"],
    ["activity.email", "activity_emails"]
  ]);

  const collection = objectTypeCollectionMapping.get(object_type);
  if (!collection) return;

  let properties = {
    ...data,
    ...subscription_id
  };

  if (action === "deleted") properties = null;

  Segment.set({
    collection,
    id,
    properties,
    context: sourceCtx()
  });

  const eventName = [...object_type.split("."), action]
    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(" ");

  Segment.track({
    userId: updated_by || created_by,
    event: eventName,
    properties: {
      [`${object_type.replace(/\./g, "_")}_id`]: id,
      ...subscription_id
    },
    context: sourceCtx()
  });
}
