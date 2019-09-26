var fs = require('fs')
const process = require('process')
const { processSourcePayload } = require('./buildpack/boreal')

const cwd = process.cwd()
const sources = fs.readdirSync(`${cwd}/sources`)

describe.each(sources)("%s", (source) => {
    let dir = `${cwd}/sources/${source}`
    let payloads = []

    const examples = fs.readdirSync(`${dir}/webhook-examples`)
    for (var i=0; i<examples.length; i++) {
        const example = examples[i]
        const payload = JSON.parse(fs.readFileSync(`${dir}/webhook-examples/${example}`, 'utf8'))
        payloads.push([example, payload])
    }

    test.each(payloads)("%s", async (example, payload) => {
        process.chdir(dir)
        const messages = await processSourcePayload(payload)
        expect(messages.events.length + messages.objects.length).toBeGreaterThan(0)
    })    
})