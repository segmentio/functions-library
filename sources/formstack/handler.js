exports.processEvents = async (event) => {
  const msg = event.payload.body
  const { first, last } = msg.Name.value
  const { email } = msg.Email.value
  const userId = msg.UniqueID
  const formId = msg.FormID
  const optin = msg.optin.value ? true : false
  
  // create Leads in SFDC or user profiles downstream
  const identify = {
      type: 'identify',
      userId,
      traits: {
        firstName: first,
        lastName: last,
        email,
        optin
      }
    }
  
  // send explicit track event for funnel analyses and audiencing downstream
  const track = {
    type: 'track',
    event: 'Form Submitted',
    userId,
    properties: { formId, email }
  }

  // Return an object with any combination of the following keys
  let returnValue = {
    events: [identify, track]
  }

  // Return the Javascript object with a key of events, objects or both
  return(returnValue)
}
