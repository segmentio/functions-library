exports.processEvents = async (event) => {
    let eventBody = event.payload.body;

    let returnValue = {
        events: [{
            type: "track",
            userId: "unknown",
            event: eventBody.type,
            properties: eventBody.attributes
        }],
        objects: []
    }

    return returnValue
}
