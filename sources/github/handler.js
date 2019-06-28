exports.processEvents = async (event) => {
  const body = JSON.parse(event.payload.body.payload)
  const { headers, queryParams } = event.payload

  let evt = `${headers['X-Github-Event']}`
  if (body.action) {
    evt += ` ${body.action}`
  }

  return ({
    events: [
      {
        type: 'track',
        event: evt,
        userId: `${body.sender.id}`,
        properties: {
          body,
          headers,
          queryParams,
        },
      }
    ]
  })
}