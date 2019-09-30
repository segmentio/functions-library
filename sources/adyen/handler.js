/**
* Please do not delete [used for Intellisense]
* @param {ServerRequest} request The incoming webhook request
* @param {Object.<string, any>} settings Custom settings
* @return void
*/
async function onRequest(request, settings) {
  let batch = request.json()

  for (var i in batch["notificationItems"]) {
    eventInput = batch["notificationItems"][i]["NotificationRequestItem"]
    eventOutput = {properties: {}}

    for (var key in batch["notificationItems"][i]["NotificationRequestItem"]) {
      if ("additionalData" in eventInput && "shopperReference" in eventInput["additionalData"]) {
        eventOutput["userId"] = eventInput["additionalData"]["shopperReference"]
      } else {eventOutput["userId"] = "adyen"}

      if (key=="eventCode") { //handle event name
        eventOutput["event"] = eventInput["eventCode"]
      } else {eventOutput["properties"][key] = eventInput[key]}

      if (key=="eventDate") {eventOutput["timestamp"] = eventInput["eventDate"]} //handle timestamp if present

    }
    Segment.track(eventOutput)
  }
}
