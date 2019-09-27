const endpoint = "http://api.ipstack.com/"

// enriches an identify call and writes it back to a separate source in Segment
async function onIdentify(event, settings) {
  
  // the write key of the Segment source you want to send geo data to
  const writeKey = btoa(settings.sourceWriteKey)

  if (event.context && event.context.ip && event.userId) {
    const ip = event.context.ip
    const userId = event.userId

    const resp = await fetch(endpoint + ip + '?access_key=' + settings.apiKey )
    var loc = await resp.json();

    // format the identify call via HTTP req
    const ep = "https://api.segment.io/v1/identify"
    var identify = {userId : userId, traits: loc}

    const res = await fetch(ep, {
      body: JSON.stringify(identify),
      headers: new Headers({
        Authorization: "Basic " + writeKey,
        "Content-Type": "application/json",
      }),
      method: "post"
    })
    return res.json()
  }
  else {
    throw new EventNotSupported(`${event.type} missing IP or userId`)
  }
}