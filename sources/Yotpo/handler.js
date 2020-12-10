/**
 *
 * Subscribes to Yotpo webhooks and creates 'Product Reviewed' Segment Track events
 * Yotpo webhooks: https://apidocs.yotpo.com/reference#introduction-to-webhooks
 *
 */
async function onRequest(request, settings) {
	const body = request.json();
	if (!validate(body)) {
		throw new EventNotSupported(`${request.event} is not supported.`);
	}

	// retreive metadata from Yotpo
	const review = body.data;

	// create anonymousId that will be consistent with subsequent webhook events from same user
	const hash = crypto.createHash('md5');
	hash.update(review.customer_email);
	const anonymousId = hash.digest('hex');

	// Segment Track call matching 'Product Reviewed' spec - See https://segment.com/docs/connections/spec/ecommerce/v2/#product-reviewed
	Segment.track({
		event: 'Product Reviewed',
		anonymousId: anonymousId,
		context: { traits: { email: review.customer_email } },
		properties: {
			product_id: review.sku,
			email: review.customer_email,
			title: review.title,
			content: review.content,
			order_id: review.external_order_id,
			score: review.score,
			sentiment: review.sentiment,
			shop_owner: review.shop_owner,
			user_id: review.user_id,
			verified_buyer: review.verified_buyer,
			votes_down: review.votes_down,
			votes_up: review.votes_up
		}
	});

	return { status: 'success' };
}

// only send in 'review_create' events
function validate({ event }) {
	return event === 'review_create';
}
