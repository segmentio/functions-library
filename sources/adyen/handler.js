exports.processEvents = async (event) => {
  let eventBody = event.payload.body;
  let eventHeaders = event.payload.headers;
  let queryParameters = event.payload.queryParameters;

  let batch = eventBody
  let returnValue = {events: []}

  for (var i in batch["notificationItems"]) {

    eventInput = batch["notificationItems"][i]["NotificationRequestItem"]
    eventOutput = {type: "track", properties: {}}

    for (var key in batch["notificationItems"][i]["NotificationRequestItem"]) {
      if ("additionalData" in eventInput && "shopperReference" in eventInput["additionalData"]) {
        eventOutput["userId"] = eventInput["additionalData"]["shopperReference"]
      } else {eventOutput["userId"] = "adyen"}

      if (key=="eventCode") { //handle event name
        eventOutput["event"] = eventInput["eventCode"]
      } else {eventOutput["properties"][key] = eventInput[key]}

      if (key=="eventDate") {eventOutput["timestamp"] = eventInput["eventDate"]} //handle timestamp if present

    }
    returnValue["events"].push(eventOutput)
  }

  return(returnValue)
}
