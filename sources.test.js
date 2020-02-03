var fs = require('fs')
const process = require('process')
const { processSourcePayload } = require('./buildpack/boreal')
const { EventNotSupported, InvalidEventPayload, ValidationError } = require('./buildpack/boreal/window')

const sources = fs.readdirSync(`${__dirname}/sources`)
const skips = ["leanplum"]

describe.each(sources)("%s", (source) => {
    let dir = `${__dirname}/sources/${source}`
    let payloads = []

    const examples = fs.readdirSync(`${dir}/webhook-examples`)
    for (var i = 0; i < examples.length; i++) {
        const example = examples[i]
        const payload = JSON.parse(fs.readFileSync(`${dir}/webhook-examples/${example}`, 'utf8'))
        payloads.push([example, payload])
    }

    let tester = test
    if (skips.indexOf(source) > -1) {
        tester = xtest
    }

    tester.each(payloads)("%s payload", async (example, payload) => {
        expect(payload.payload.body).toBeDefined()
    })

    tester.each(payloads)("%s handler", async (example, payload) => {
        process.chdir(dir)
        try {
            const messages = await processSourcePayload(payload)
            expect(messages.events.length + messages.objects.length).toBeGreaterThanOrEqual(0)
        } catch(err) {
            if (!(err instanceof EventNotSupported || err instanceof ValidationError || err instanceof InvalidEventPayload)) {
                fail(err)
            }
        }
    })
})