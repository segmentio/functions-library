const endpoint = "https://api.lob.com/v1/postcards"

async function onTrack(event, settings) {
  // Only call the Lob API if the item failed to be sent to the customer
  if (event.event == "Item failed") {
    return await callLobApi(event.properties.name, event.properties.address, settings);
  } else {
    return;
  }
}

// Helper function to call the Lob API
async function callLobApi(name, address, settings) {
  let body = {
    description: 'Description of the card',
    to: {
      name: name,
      address_line1: address_line1,
      address_line2: address_line2,
      address_city: address.city,
      address_state: address.state,
      address_zip: address.zip
    },
    from: {
      name: "Segment",
      address_line1: "Address Line 1",
      address_line2: "Address Line 2",
      address_city: "City",
      address_state: "State",
      address_zip: "Zip"
    },
    front: "<html style='padding: 1in; font-size: 50;'>Front HTML for {{name}}</html>",
    back: "<html style='padding: 1in; font-size: 20;'>Back HTML for {{name}}</html>",
    merge_variables: {
      name: name
    }
  }
  
  let call = await fetch(`${endpoint}`, {
    body: JSON.stringify(body),
    headers: new Headers({
      'Authorization': "Basic " + btoa(settings.apiKey + ":" + ''),
      "Content-Type": "application/json",
    }),
    method: "post"
  }) 
  
  return call.json()
}
