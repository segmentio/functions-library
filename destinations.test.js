var fs = require('fs')
const process = require('process')
const { processDestinationPayload } = require('./buildpack/boreal')

const destinations = fs.readdirSync(`${__dirname}/destinations`)
const skips = []

describe.each(destinations)("%s", (dest) => {
    let dir = `${__dirname}/destinations/${dest}`

    let tester = test
    if (skips.indexOf(dest) > -1) {
        tester = xtest
    }

    let event = {
        "type": "track",
        "event": "Registered",
        "userId": "test-user-23js8",
        "timestamp": "2019-04-08T01:19:38.931Z",
        "email": "test@example.com",
        "properties": {
            "plan": "Pro Annual",
            "accountType": "Facebook"
        }
    }

    let settings = {
        "apiKey": "abcd1234",
    }

    tester(`${dest} handler`, async () => {
        process.chdir(dir)
        await processDestinationPayload({ event, settings })
        // expect(messages.events.length + messages.objects.length).toBeGreaterThanOrEqual(0)
    })
})