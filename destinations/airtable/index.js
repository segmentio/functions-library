async function track(event, settings) {
  const endpoint = `https://api.airtable.com/v0/${settings.appId}/General%20User%20Survey`
  if (event.event = "User Added Feedback") {
    
    let favString = event.properties.favoriteFeatures;
    let favFeaturesArray = favString.split(',');
    let leastFavString = event.properties.leastFavoriteFeatures;
    let leastFavFeaturesArray = leastFavString.split(',');
    
    let airTableEvent = {
      "fields": {
      "Additional Notes": event.properties.additionalNotes,
      "Name": event.properties.name,
      "PorchCam Experience": event.properties.porchCamExperience,
      "Other security tools?": event.properties.otherSecurityTools,
      "Recommend to another?": event.properties.recommendToAnother,
      "Favorite Features": favFeaturesArray,
      "Email": event.properties.email,
      "Usage (# Weeks)": event.properties.usage,
      "Least Favorite Features": leastFavFeaturesArray
    }
    }
    
    const init =  {
      body: JSON.stringify(airTableEvent),
      headers: {
        "Authorization": `Bearer ${settings.apiKey}`,
        "Content-Type": "application/json"
      },
      method: "post"
    }
    
    const res = await fetch(endpoint, init)
    return res.json()
  }
}

// Identify is not supported
async function identify(event, settings) {
  throw new EventNotSupported("The Identify method is not supported.")
}

// Page is not supported
async function page(event, settings) {
  throw new EventNotSupported("The Page method is not supported.")
}

// Group is not supported
async function page(event, settings) {
  throw new EventNotSupported("The Group method is not supported.")
}

// Alias is not supported
async function alias(event, settings) {
  throw new EventNotSupported("The Alias method is not supported.")
}

// Screen is not supported
async function screen(event, settings) {
  throw new EventNotSupported("The Screen method is not supported.")
}
