/* README
This integration connects Personas audiences and computed traits to Adobe Target profiles. This uses the 'Single Profile Update' API call, documented here: https://developers.adobetarget.com/api/#updating-profiles 

Tested using v2.2.0 of Adobe's Target SDK, also known as at.js (Dec 6 2019).

To identify the correct profile and "link" updates back to a client-side experience for personalization, Adobe Target server-side updates require either a "pcId" or an "mbox3rdPartyId". This implementation makes use of the "pcId". As such, this ID must be retrieved from the Adobe Target JS SDK, and stored in Segment Personas for subsequent reference / swapping-in as the ID for the update. Please see the prerequisites, below.

==========Important Prerequisites:==========
These simple steps are required to make this work:
    1) Retrieve the mboxPcId from your user's client-side Adobe cookie. Here's a simple code snippet that fetches this value from the cookie and stores this as a "target-id" trait:
      
      let cookie = Object.fromEntries(document.cookie.split('; ').map(x => x.split('=')))
      let mboxPC = cookie.mbox.split("|")[0].split("#")[1]
      analytics.identify({"target-id": mboxPC});

    2) Set your config options below, including specifying your Personas Space and Adobe Client Code. If you use a key other than "target-id", be sure to alter the "adobeIdTraitName" variab.

*/

/* MANDATORY CONFIG */

let adobeClientCode = "" //Your Adobe Client Code. If you don’t know your client code, in the Target UI click Setup > Implementation > Edit At.js/Mbox.js Settings. The client code is shown in the Client field.
let adobeIdTraitName = "target-id"  //Per the Prerequisites above, you must collect Adobe's Mbox PCID onto your Personas user profiles in Segment, for matching purposes. Please confirm the property name you are using.

let profileSpaceID = "" //Your Segment Personas Space ID, so that this function can fetch from the Profile API. Find this in Personas > Settings > API Access.
let profileApiToken = "" //An Access Token, to read from your Personas Instance. Grant an API Secret via Personas > Settings > API Access.

/* END CONFIG */



let targetProfileUpdateUrl = "https://"+adobeClientCode+".tt.omtrdc.net/m2/"+adobeClientCode+"/profile/update?mboxPC=IDENTITY-PLACEHOLDER"
let profileUrl = "https://profiles.segment.com/v1/spaces/"+profileSpaceID+"/collections/users/profiles/user_id:UID-PLACEHOLDER/traits?include="+adobeIdTraitName
let adobeIdValue = ""

let profileApiAuthHeaders = new Headers({
    Authorization: "Basic "+btoa(profileApiToken+":")
  })

async function onIdentify(event, settings) {
  //Check mandatory config
  if(!checkMandatoryConfig())
    throw new ValidationError("Adobe and Profile API mandatory credentials were not set")
  
  // first, grab adobe target mbox PCID. if it doesn't exist, this user cannot be updated in adobe target.
  // replace userId to fetch from Personas
  if ('userId' in event && event['userId'] != null) {
		profileUrl = profileUrl.replace(
			'UID-PLACEHOLDER',
			'user_id:' + event.userId
		);
	} else if ('anonymousId' in event) {
		profileUrl = profileUrl.replace(
			'UID-PLACEHOLDER',
			'anonymous_id:' + event.anonymousId
		);
	}
  
  const fetchIdFromPersonas = await fetch(profileUrl, {
    method: "GET",
    headers: profileApiAuthHeaders
  })

  let profileApiResponse = await fetchIdFromPersonas.json()
  if (adobeIdTraitName in profileApiResponse.traits) {
    adobeIdValue = profileApiResponse.traits[adobeIdTraitName]
  }

  //update identity on the adobe target update call
  targetProfileUpdateUrl = targetProfileUpdateUrl.replace("IDENTITY-PLACEHOLDER", adobeIdValue)
  
  Object.entries(event.traits).forEach(function (kvPair) {
    let queryStringAddition = "&profile."+kvPair[0]+"="+kvPair[1]
    console.log(queryStringAddition)
    targetProfileUpdateUrl += queryStringAddition 
  })
  
  const updateTargetProfile = await fetch(targetProfileUpdateUrl, {
    method: "GET"
  })
  return await targetProfileUpdateUrl.text
}

function checkMandatoryConfig() {
  return !!adobeClientCode && !!adobeIdTraitName && !!profileSpaceID && !!profileApiToken;
}
