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
