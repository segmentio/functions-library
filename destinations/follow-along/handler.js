// track demonstrates how to POST data to an external API using fetch
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
async function onTrack(event, settings) {
  let evt = event.event
  if(!eventAllowed(evt, settings)) return

  let userId = event.userId
  if(!userId) return

  let text = `A user just completed ${evt}: <${fullstoryURL(userId)}|fullstory>`
  const endpoint = "https://slack.com/api/chat.postMessage"
  const res = await fetch(endpoint, {
    body: JSON.stringify({
      text: text,
      token: settings.apiKey,
      channel: settings.channel,
    }),
    headers: {
      Authorization: `Bearer ${settings.apiKey}`,
      "Content-Type": "application/json",
    },
    method: "post",
  })

  return res.text()
}

// returns whether an event is allowed in the settings
function eventAllowed(event, settings) {
  if(!settings.events) return false
  let arr = settings.events.split(",")
  if(arr.indexOf(event) > -1) return true
  return false
}

// generate the fullstory url from the `userId`
function fullstoryURL(userId) {
  return `https://app.fullstory.com/ui/1JO/segments/everyone/people:search:((NOW%2FDAY-29DAY:NOW%2FDAY%2B1DAY):((UserAppKey:==:%22${userId}%22)):():():():)/0`
}
