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

	let eventToSend = {
		event: body.event,
		anonymousId: body.data.client_id,
		properties: {
			...body.data
		}
	};

	//if payload is < Segment's limit of 32KB -> send it as is (https://segment.com/docs/connections/sources/catalog/libraries/server/http-api/#max-request-size)
	if (roughSizeOfObject(eventToSend) < 32) {
		Segment.track(eventToSend);
	} else {
		//otherwise remove a portion and then send the pared down version
		delete eventToSend.properties.details.request.auth.credentials.scopes;
		Segment.track(eventToSend);
	}

	//checks size of outgoing payload
	function roughSizeOfObject(object) {
		let objectList = [];
		let stack = [object];
		let bytes = 0;

		while (stack.length) {
			let value = stack.pop();
			if (typeof value === 'boolean') {
				bytes += 4;
			} else if (typeof value === 'string') {
				bytes += value.length * 2;
			} else if (typeof value === 'number') {
				bytes += 8;
			} else if (
				typeof value === 'object' &&
				objectList.indexOf(value) === -1
			) {
				objectList.push(value);
				for (let i in value) {
					stack.push(value[i]);
				}
			}
		}
		//returns kilobytes - Segment's limit is 32KB
		return bytes / 1000;
	}
}
