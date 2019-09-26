/**
* Please do not delete [used for Intellisense]
* @param {ServerRequest} request The incoming webhook request
* @param {Object.<string, any>} settings Custom settings
* @return void
*/
async function onRequest(request, settings) {
  const msg = request.json()
  const { first, last } = msg.Name.value
  const { email } = msg.Email.value
  const userId = msg.UniqueID
  const formId = msg.FormID
  const optin = msg.optin.value ? true : false
  
  // create Leads in SFDC or user profiles downstream
  Segment.identify({
    userId,
    traits: {
      firstName: first,
      lastName: last,
      email,
      optin
    }
  })
  
  // send explicit track event for funnel analyses and audiencing downstream
  Segment.track({
    event: 'Form Submitted',
    userId,
    properties: { formId, email }
  })
}
