/**
 *
 * Subscribes to Yotpo webhooks and creates 'Product Reviewed' Segment Track events
 * Yotpo webhooks: https://apidocs.yotpo.com/reference#introduction-to-webhooks
 *
 * Note: the webhook payload from Yotpo does not include the product id or the user email, so
 * this function retreives that via Yotpo API
 *
 * Required Settings - create an 'appKey' and 'secretKey' for the credentials in Yotpo account
 *
 */
async function onRequest(request, settings) {
	const body = request.json();
	if (!validate(body)) {
		throw new EventNotSupported(`${request.event} is not supported.`);
	}

	// retreive metadata from Yotpo
	const review = await fetchReview(body.data.id, settings);

	// create anonymousId that will be consistent with subsequent webhook events from same user
	const hash = crypto.createHash('md5');
	hash.update(review.email);
	const anonymousId = hash.digest('hex');

	// Segment Track call matching 'Product Reviewed' spec - See https://segment.com/docs/connections/spec/ecommerce/v2/#product-reviewed
	Segment.track({
		event: 'Product Reviewed',
		anonymousId: anonymousId,
		traits: { email: review.email },
		properties: {
			product_id: review.sku,
			email: review.email,
			review_id: body.data.id,
			review_body: body.data.content,
			rating: body.data.score
		}
	});

	return { status: 'success' };
}

// only send in 'review_create' events
function validate({ event }) {
	return event === 'review_create';
}

//retreive review metadata from Yotpo API
async function fetchReview(reviewId, { appKey, secretKey } = {}) {
	const utoken = await getToken({ appKey, secretKey });
	return await getReview(reviewId, appKey, utoken);
}

async function getReview(reviewId, appKey, utoken, page = 1) {
	const endpoint = `https://api.yotpo.com/v1/apps/${appKey}/reviews?utoken=${utoken}&page=${page}&count=50&deleted=true`;

	let response;
	try {
		response = await fetch(endpoint);
	} catch (err) {
		console.error(
			'server error fetching review from Yotpo',
			JSON.stringify(err)
		);
		throw new Error('server error fetching metadata from Yotpo');
	}
	if (!response.ok) {
		console.error(
			'error fetching review metadata from Yotpo',
			JSON.stringify(data)
		);
		throw new Error('error fetching review metadata from Yotpo');
	}

	const data = await response.json();
	if (!data.reviews.length) {
		console.error(`could not find review ${reviewId} in Yotpo`);
		throw new Error(`could not find review ${reviewId} in Yotpo`);
	}

	const review = data.reviews.find(({ id }) => id === reviewId);
	if (review) return review;

	return await getReview(reviewId, appKey, utoken, page + 1);
}

async function getToken({ appKey, secretKey } = {}) {
	const endpoint = 'https://api.yotpo.com/oauth/token';

	const body = {
		client_id: appKey,
		client_secret: secretKey,
		grant_type: 'client_credentials'
	};

	let response;
	try {
		response = await fetch(endpoint, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
	} catch (err) {
		console.error('server error retrieving Yotpo token', JSON.stringify(err));
		throw new Error('server error retrieving Yotpo token');
	}

	if (!response.ok) {
		console.error('error retrieving Yotpo token', JSON.stringify(data));
		throw new Error('error retrieving Yotpo token');
	}

	const data = await response.json();
	return data.access_token;
}
