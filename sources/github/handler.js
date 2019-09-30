/**
* Please do not delete [used for Intellisense]
* @param {ServerRequest} request The incoming webhook request
* @param {Object.<string, any>} settings Custom settings
* @return void
*/
async function onRequest(request, settings) {
  const body = request.json()
  var evt = request.headers.get("X-Github-Event")

  if (body.action) {
    evt += ` ${body.action}`
  }

  Segment.track({
    event: evt,
    userId: `${body.sender.id}`
  })
}