// Learn more about source functions API at
// https://segment.com/docs/connections/sources/source-functions

/**
 * Handle incoming HTTP request
 *
 * @param  {FunctionRequest} request
 * @param  {FunctionSettings} settings
 */
async function onRequest(request, settings) {
  const body = request.json();

  // check if there's a subscriber as part of the payload
  if (body && body.subscriber && body.subscriber.id) {
    // See https://segment.com/docs/connections/spec/identify/
    const subscriber = body.subscriber;
    Segment.identify({
      userId: subscriber.email_address,
      traits: {
        email: subscriber.email_address,
        convertkit_id: subscriber.id,
        converkit_status: subscriber.state,
        firstName: subscriber.first_name,
      },
    });
  }
}