// This example uses a Slack incoming webhook (https://api.slack.com/incoming-webhooks)
// Create a Slack app and webhook and update this endpoint
const endpoint = "https://hooks.slack.com/services/REDACTED"

async function onTrack(event, settings) {
  if (!event.email) {
    throw new InvalidEventPayload("email is required")
  }

  const hash = crypto.createHash('md5').update(event.email).digest("hex");

  const res = await fetch(endpoint, {
    body: JSON.stringify({
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `${event.email} ${event.event.toLowerCase()} for a *${event.properties.plan}* plan`
          },
          "accessory": {
            "type": "image",
            "image_url": `https://www.gravatar.com/avatar/${hash}`,
            "alt_text": event.email,
          }
        }
      ]
    }),
    method: "post",
  })

  return await res.text()
}
