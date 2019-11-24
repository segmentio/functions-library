/**
 * Please do not delete [used for Intellisense]
 * @param {ServerRequest} request The incoming webhook request
 * @param {Object.<string, any>} settings Custom settings
 * @return void
 */
async function onRequest(request, settings) {
  // Source Tests do not seems to take settings into account
  // As a workaraound I am exposing an authization token for a free dev account I created. Uncomment the line below for tests to pass
  // settings = settings || {workspaceToken:'iGnVkEeL5ge_JP1ZoMxgjSxNNWgQQqHskAIZnydjWTM.TrYonOtUNM7jKToWLAAo9pJ5vDx2UGFrnAyIjbdD2iU', workspaceSlug:'james-reynolds'}
  
  if (!settings.workspaceToken) {
    throw new ValidationError("Workspace Authorization Token is Required. Make sure you have created a 'workspaceToken' setting.");
  }
  if (!settings.workspaceSlug) {
    throw new ValidationError("Workspace Slug is Required. Make sure you have created a 'workspaceSlug' setting.")
  }
  
  const requestBody = request.json();
  const usersURL = `https://platform.segmentapis.com/v1beta/workspaces/${settings.workspaceSlug}/users`;
  const userId = requestBody.properties.details.subject ? requestBody.properties.details.subject.split('/')[1] : requestBody.userId;

  if (userId === "__system__") {
    Segment.track({
      userId,
      event: requestBody.properties.type,
      properties: requestBody.properties
    });
    return;
  }

  const res = await fetch(usersURL, {
    method: 'get',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.workspaceToken}`,
      'cache-control': 'no-cache'
    },
  })
  .then(res => res.json())
  .then(json => Segment.track({
    userId,
    event: requestBody.properties.type,
    properties: Object.assign({email: json.users.filter(user => {
      if (user.name.split('/')[1] === userId) {
        return user;
      }
    })[0].email}, requestBody.properties)
  }))
  .catch(err => Segment.track({
    userId,
    event:'Error',
    properties: err
  }));;
}