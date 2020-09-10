// Learn more about destination functions API at
// https://segment.com/docs/connections/destinations/destination-functions

/**
 * Handle track event
 * @param  {SegmentTrackEvent} event
 * @param  {FunctionSettings} settings
 */
async function onTrack(event, settings) {
	//1. Get Datafile
	/*var event = {
  "type": "track",
  "event": "client_event",
  "userId": "test-user-23js8",
  "timestamp": "2019-04-08T01:19:38.931Z",
  "anonId": 'anonymous!',
  "email": "test@example.com",
  "properties": {
    "plan": "Pro Annual",
    "accountType" : "Facebook"
  }
};*/

	var datafileId = settings.sdkKey;
	if (datafileId === undefined) return;

	var dataFileUrl =
		'https://cdn.optimizely.com/datafiles/' + datafileId + '.json';
	var req = await fetch(dataFileUrl);
	//console.log(req.body);
	var json = await req.json();
	//2. Get Datafile Events
	var events = json.events;
	//var attributes = json.attributes;
	//4. Check for presence of converted string
	// build simply object - evntKey: evntId lookup
	let eventMapping = events.reduce((collection, val) => {
		collection[val.key] = val.id;
		return collection;
	}, {});
	var eventId = eventMapping[event.event];
	if (eventId === undefined) {
		throw new EventNotFound('Event not in datafile');
	}
	var starting_payload = {
		revision: json.revision,
		account_id: json.accountId,
		visitors: [],
		anonymize_ip: json.anonymizeIP,
		client_name: 'Optimizely/segment-cloud-poc',
		client_version: '1.0.0',
		enrich_decisions: true,
		project_id: json.projectId
	};
	var visitorTemplateObject = {
		visitor_id: '',
		attributes: [],
		snapshots: [
			{
				decisions: [],
				events: [
					{
						key: '',
						entity_id: '',
						timestamp: '',
						uuid: '',
						tags: {}
					}
				]
			}
		]
	};
	//6. Build payload
	//7. Dispatch event
	//debugger;
	var sendUserId = settings.sendKnownId;
	if (sendUserId && event.userId) {
		var knownUser = Object.assign({}, visitorTemplateObject);
		knownUser.visitor_id = event.userId;
		if (typeof json.botFiltering === 'boolean') {
			knownUser.attributes.push({
				entity_id: '$opt_bot_filtering',
				key: '$opt_bot_filtering',
				type: 'custom',
				value: json.botFiltering
			});
		}

		knownUser.snapshots[0].events[0].key = event.event;
		knownUser.snapshots[0].events[0].entity_id = eventId;
		knownUser.snapshots[0].events[0].timestamp = Date.parse(event.timestamp);
		knownUser.snapshots[0].events[0].uuid = __uuidv4();
		knownUser = __setTags(event, knownUser);
		starting_payload.visitors.push(knownUser);
	}
	var sendAnonymousId = settings.sendAnonId;
	if (sendAnonymousId && event.anonId) {
		var anonUser = Object.assign({}, visitorTemplateObject);
		anonUser.visitor_id = event.anonId;
		if (typeof json.botFiltering === 'boolean') {
			anonUser.attributes.push({
				entity_id: '$opt_bot_filtering',
				key: '$opt_bot_filtering',
				type: 'custom',
				value: json.botFiltering
			});
		}

		anonUser.snapshots[0].events[0].key = event.event;
		anonUser.snapshots[0].events[0].entity_id = eventId;
		anonUser.snapshots[0].events[0].timestamp = Date.parse(event.timestamp);
		anonUser.snapshots[0].events[0].uuid = __uuidv4();
		anonUser = __setTags(event, anonUser);

		starting_payload.visitors.push(anonUser);
	}

	var body = JSON.stringify(starting_payload);
	console.log(body);
	var url = new URL('https://logx.optimizely.com/v1/events');
	const res = await fetch(url.toString(), {
		body: body,
		headers: new Headers({
			'Content-Type': 'application/json'
		}),
		method: 'post'
	});

	return await res.text(); // or res.text() to avoid parsing response as JSON
}

function __setTags(event, payload) {
	for (x in event.properties) {
		if (event.properties[x] === null || event.properties[x] === undefined) {
			continue;
		}

		if (x == 'revenue') {
			payload.snapshots[0].events[0].revenue = Math.round(
				parseFloat(event.properties[x]) * 100.0);
		} else if (x == 'value') {
			payload.snapshots[0].events[0].value = event.properties[x];
		}

		payload.snapshots[0].events[0].tags[x] = event.properties[x];
	}

	return payload;
}
/**
 * @description UUID generator from https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
function __uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

