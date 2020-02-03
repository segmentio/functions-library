const endpoint = new URL("https://api.salesloft.com/v2/people.json")

async function onIdentify(event, settings) {

  event.traits = event.traits || {};

  if (!(event.traits["first_name"]) && !(event.traits["last_name"]) && 
  (event.traits["name"]) && event.traits["name"].includes(" ")) {
    event.traits["first_name"] = event.traits["name"].split(' ')[0]
    event.traits["last_name"] = event.traits["name"].split(' ')[1]
    delete event.traits["name"]
  }
  if (event.traits["email"]) {
    event.traits["email_address"] = event.traits["email"]
    delete event.traits["email"]
  }
  if ( !(event.traits["email_address"]) && !(event.traits["last_name"] && event.traits["phone"]) ) {
    throw new EventNotSupported("must be created with a valid email address or partial name and phone number")
    }

  const res = await fetch(endpoint, {

    body: JSON.stringify(event.traits),
    headers: new Headers({
      "Authorization": 'Bearer '+settings.apiKey,
      "Content-Type": "application/json",
    }),
    method: "post"
  })
  return await res.json()
}
