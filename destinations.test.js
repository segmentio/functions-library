var fs = require('fs')
const nock = require('nock')
const process = require('process')
const { processDestinationPayload } = require('./buildpack/boreal')
const { EventNotSupported, InvalidEventPayload, ValidationError } = require('./buildpack/boreal/window')

const destinations = fs.readdirSync(`${__dirname}/destinations`)
const skips = []

describe.each(destinations)("%s", (dest) => {
    let dir = `${__dirname}/destinations/${dest}`

    let tester = test
    if (skips.indexOf(dest) > -1) {
        tester = xtest
    }

    let events = [
        ["track", {
            "type": "track",
            "event": "Registered",
            "userId": "test-user-23js8",
            "timestamp": "2019-04-08T01:19:38.931Z",
            "email": "test@example.com",
            "properties": {
                "plan": "Pro Annual",
                "accountType": "Facebook",
            }
        }],
        ["identify", {
            "type": "identify",
            "traits": {
                "name": "Peter Gibbons",
                "email": "peter@initech.com",
                "plan": "premium",
                "logins": 5
            }
        }],
    ]

    let settings = {
        "apiKey": "abcd1234",
    }

    // intercept every HTTP call and return JSON
    // TODO: load responses from response-examples/ JSON
    nock(/.*/)
        .get(/.*/)
        .reply(200, {})
        .post(/.*/)
        .reply(200, {})

    tester.each(events)("%s event", async (name, event) => {
        process.chdir(dir)
        try {
            await processDestinationPayload({ event, settings })
        } catch (err) {
            if (!(err instanceof EventNotSupported || err instanceof ValidationError || err instanceof InvalidEventPayload)) {
                fail(err)
            }
        }
    })
})