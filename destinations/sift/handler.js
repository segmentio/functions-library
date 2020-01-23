// Segment & Sift 
const SEGMENT_WRITE_KEY = ""
const endpoint = "https://api.sift.com/v205/events?return_score=true"

async function addScores(fields, res) {
	var body = {
		"userId": fields.$user_id,
		"traits": {
			"contentAbuseScore": res.score_response.scores.content_abuse.score,
			"paymentAbuseScore": res.score_response.scores.payment_abuse.score
		}
	}
	const apiCall = await fetch("https://api.segment.io/v1/identify", {
		body: JSON.stringify(body),
		headers: new Headers({
			"Authorization": "Basic " + btoa(SEGMENT_WRITE_KEY + ":"),
			"Content-Type": "application/json"
		}),
		method: "post"
	})
	return apiCall.json()
}

async function fetchMe(fields) {
	const res = await fetch(endpoint, {
		body: JSON.stringify(fields),
		headers: { "Content-Type": "application/json" },
		method: "post"
	})
	const response = await res.json();
	const scoreResponse = await addScores(fields, response);
	return scoreResponse;
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
		return fetchMe(fields)
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
		return fetchMe(fields)
	} else {
		return
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
	return fetchMe(fields)
}
