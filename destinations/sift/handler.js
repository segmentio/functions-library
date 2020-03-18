// Segment & Sift 
const SEGMENT_WRITE_KEY = ""
const endpoint = "https://api.sift.com/v205/events"
const endpointScore = endpoint + "?return_score=true"
const endpointWorkflow = endpoint + "?return_workflow_status=true"
async function addScores(fields, res) {
    console.log("scores", res);
	if (res.status == 0) {
		var scoreBody = {
			"userId": fields.$user_id,
			"traits": {
				"contentAbuseScore": res.score_response.scores.content_abuse.score,
				"paymentAbuseScore": res.score_response.scores.payment_abuse.score
			}
		}
		const request = await fetch("https://api.segment.io/v1/identify", {
			body: JSON.stringify(scoreBody),
			headers: new Headers({
				"Authorization": "Basic " + btoa(SEGMENT_WRITE_KEY + ":"),
				"Content-Type": "application/json"
			}),
			method: "post"
		})
		return request.json()
	} 
}
async function addDecisions(fields, res) {
  console.log("decisions", res);
	var decisionBody = {
		"userId": fields.$user_id,
		"traits": {
			"contentAbuseDecisions": res.score_response.workflow_statuses[0].history[0].config.decision_id,
			"paymentAbuseDecisions": res.score_response.workflow_statuses[0].history[0].config.decision_id
		}
	}
	const request = await fetch("https://api.segment.io/v1/identify", {
		body: JSON.stringify(decisionBody),
		headers: new Headers({
			"Authorization": "Basic " + btoa(SEGMENT_WRITE_KEY + ":"),
			"Content-Type": "application/json"
		}),
		method: "post"
	})
	return request.json()
}
async function siftEventCall(fields) {
	const res = await fetch(endpoint, {
		body: JSON.stringify(fields),
		headers: { "Content-Type": "application/json" },
		method: "post"
	})
	const siftResponse = await res.json();
	if (siftResponse.status <= 0) {
		// Please implement conditions for retries. 
	} else if (siftResponse.status >= 0) {
		throw new InvalidEventPayload(siftResponse.error_message);
	}
  var response;
	if (endpoint == endpointScore) {
		response = await addScores(fields, siftResponse);
	} else if (endpoint == endpointWorkflow) {
		response = await addDecisions(fields, siftResponse);
	}
	return response;
}
async function onTrack(event, settings) {
	var fields = {};
	if (event.event == "Signed Up") {
		fields = {
			"$type": "$create_account",
			"$user_id": event.userId,
			"$name": event.properties.name,
			"$user_email": event.properties.email,
			"$ip": event.context.ip,
			"$phone": event.properties.phone,
			"$browser": {
				"$user_agent": event.context.userAgent
			},
			"$api_key": settings.apiKey
		}
		return siftEventCall(fields)
	} else if (event.event == "Signed In") {
		fields = {
			"$type": "$login",
			"$login_status": "$success",
			"$user_id": event.userId,
			"$username": event.properties.username,
			"$ip": event.context.ip,
			"$browser": {
				"$user_agent": event.context.userAgent
			},
			"$api_key": settings.apiKey
		}
		return siftEventCall(fields)
	} else {
		return null
	}
}
async function onIdentify(event, settings) {
	if (!event.userId) return;
	var fields = {
		"$type": "$update_account",
		"$user_id": event.userId,
		"$name": event.traits.name,
		"$user_email": event.traits.email,
		"$ip": event.context.ip,
		"$phone": event.traits.phone,
		"$browser": {
			"$user_agent": event.context.userAgent
		},
		"$api_key": settings.apiKey
	}
	return siftEventCall(fields)
}