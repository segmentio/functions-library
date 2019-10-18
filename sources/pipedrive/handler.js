/**
* Please do not delete [used for Intellisense]
* @param {ServerRequest} request The incoming webhook request
* @param {Object.<string, any>} settings Custom settings
* @return void
*/
async function onRequest(request, settings) {
  const {
    current,
    previous,
    meta: { object: objectType, id, action, webhook_id }
  } = request.json();

  const supportedObjects = ["deal", "organization", "note", "person"];
  if (!supportedObjects.some(type => type === objectType)) {
    console.log("unsupported webhook type");
    return;
  }

  const sourceContext = () => ({ integration: { name: "PipeDrive [Custom]" } });

  let properties;
  if (action === "deleted") {
    // overwrite all the pre-existing keys with empty values
    properties = _.mapValues(flatten(previous), _ => null);
  } else {
    properties = flatten(current);
  }
    
  // upsert
  Segment.set({
    collection: `${objectType}s`,
    id,
    properties,
    context: sourceContext()
  });

  const event = [objectType, action]
    .map(w => w[0].toUpperCase() + w.substr(1).toLowerCase())
    .join(" ");

  // send event
  Segment.track({
    event,
    userId: current.user_id,
    properties: {
      [`${objectType}_id`]: current.id,
      ...(action === "deleted" ? {} : properties)
    },
    context: sourceContext(),
    messageId: `pd_${webhook_id}`
  });
}

function flatten(input) {
  const result = {};
  function recur(obj, prefix = "") {
    Object.entries(obj).forEach(([key, value]) => {
      if (_.isObject(value)) {
        recur(value, `${prefix}${key}_`);
      } else {
        result[`${prefix}${key}`] = value;
      }
    });
  }
  recur(input);
  return result;
}
