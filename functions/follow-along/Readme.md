
# Follow Along

This function automatically posts to Slack whenever a user completes one of the
whitelisted actions. The message payload will contain a link to Fullstory so
that you can understand what just led the user to this point

## Settings

- `apiKey` (string) the slack OAuth token to use to post messages
- `events` (string) a comma-separated list of the events to allow ("Completed Order,Signed Up")
- `channel` (string) the slack channel to post to ("#sf")