/**
 * Please do not delete [used for Intellisense]
 * @param {ServerRequest} request The incoming webhook request
 * @param {Object.<string, any>} settings Custom settings
 * @return void
 */
async function onRequest(request, settings) {
  if (!settings.workspaceToken) {
    throw new ValidationError("Workspace Authorization Token is Required. Make sure you have created a 'workspaceToken' setting.");
  }
  if (!settings.workspaceSlug) {
    throw new ValidationError("Workspace Slug is Required. Make sure you have created a 'workspaceSlug' setting.")
  }
  
  const requestBody = request.json();
  const usersURL = `https://platform.segmentapis.com/v1beta/workspaces/${settings.workspaceSlug}/users`;
  const userId = requestBody.properties.details.subject && requestBody.properties.details.subject.indexOf('users/') > -1 ? requestBody.properties.details.subject.split('/')[1] : requestBody.userId;

  // Uncomment the following 3 lines in order to block "Permission Check" events.
  // if (requestBody.properties.type === 'Permission Check') {
  //   return;
  // }

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
    event:'Error: User Email Not Found',
    properties: err
  }));;
}