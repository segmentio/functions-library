/**
 * Source function that listens to Sendgrid webhooks and sends individual events to Segment.
 * Sendgrid Webhooks: https://sendgrid.com/docs/for-developers/tracking-events/getting-started-event-webhook/
 * Notes:
 *  - Sendgrid Webhooks send events in BATCH payloads, so this function parses through each batch and 'eventifies' them.
 *  - Each 'Email Delivered' event will also send off identify() call, to attach an email trait and events to user profiles in Personas
 *  - IMPORTANT: This is a code template and not a maintained Segment integration. Please review code and test before using with production data. 
 */
async function onRequest(request, settings) {
	const body = request.json();
	body.forEach(function(single_event) {
		// If no email, event name or send type are not provided - exit
		if (!single_event.email) return;
		if (!single_event.event) return;
		// Do not process 'processed' or 'deferred' events
		if (single_event.event == 'processed' || single_event.event == 'deferred') {
			console.log('Unsupported event type: ', single_event.event);
			return;
		}
		// SG event type: 'delivered', 'open', 'click', 'unsubscribe', 'bounce', 'dropped'
		var sg_event_type = single_event.event;
		// Mapping SendGrid and Segment properties
		let email = single_event.email;
		// Send type: single send or automation
		let sg_send_type =
			single_event.mc_stats === undefined ? undefined : single_event.mc_stats;
		// Email categories, provided when enabling the send
		let sg_category =
			single_event.category === undefined ? undefined : single_event.category;
		// 'ip' field bears recepient's IP with 'open', 'click', 'group unsub', 'group resub', 'unsubscribe' events. In other cases - sender's IP address is included
		let sg_ip = single_event.ip === undefined ? undefined : single_event.ip;
		let sg_user_ip =
			sg_event_type == 'open' ||
			sg_event_type == 'click' ||
			sg_event_type == 'unsubscribe' ||
			sg_event_type == 'group_unsubscribe' ||
			sg_event_type == 'group_resubscribe'
				? sg_ip
				: undefined;
		// Pull send name from 2 different fields depending on send type
		switch (sg_send_type) {
			case 'singlesend':
				sg_send_name = single_event.singlesend_name;
				break;
			case 'automation':
				sg_send_name = single_event.mc_auto_name;
				break;
			case undefined:
				sg_send_name = 'transactional';
				break;
			case 'sendtest':
				sg_send_name = 'test send';
				break;
			default:
				sg_send_name = 'not set';
		}
		// Sendgrid single send timestamp (UTC, unix format)
		let sg_single_send_timestamp =
			single_event.send_at === undefined ? undefined : single_event.send_at;
		// Convert Sendgrid single send timestamp into ISO (for Personas traits)
		let sg_single_send_date =
			single_event.send_at === undefined
				? undefined
				: new Date(single_event.send_at * 1000).toISOString();
		// Internal Sendgrid event Id
		let sg_event_id =
			single_event.sg_event_id === undefined ? null : single_event.sg_event_id;
		// Internal Sendgrid message Id
		let sg_message_id =
			single_event.sg_message_id === undefined
				? undefined
				: single_event.sg_message_id;
		// Sendgrid email template name
		let sg_template_name =
			single_event.sg_template_name === undefined
				? undefined
				: single_event.sg_template_name;
		// Internal Sendgrid smtp Id
		let sg_smtp_id =
			single_event['smtp-id'] === undefined
				? undefined
				: single_event['smtp-id'];
		// Whether tls encryption was enabled
		let sg_tls_encryption =
			single_event.tls === undefined ? undefined : single_event.tls;
		// URL clicked in the email
		let sg_click_url =
			single_event.url === undefined ? undefined : single_event.url;
		// Number of the URL clicked (if several same links are provided in the email)
		let sg_click_url_number =
			single_event.url_offset === undefined
				? undefined
				: single_event.url_offset.index;
		// Recepients useragent, send with open, click, unsubscribe, group unsubscribe/resubscribe events
		let sg_useragent =
			single_event.useragent === undefined ? undefined : single_event.useragent;
		// Parse device type from useragent
		if (sg_useragent) {
			var sg_action_device = '';
			switch (true) {
				// Google proxies recepient useragent, and we can't tell what device they are using
				case /GoogleImageProxy/.test(sg_useragent):
					sg_action_device = 'unknown';
					break;
				case /iPhone/.test(sg_useragent):
					sg_action_device = 'mobile';
					break;
				case /Windows Phone/.test(sg_useragent):
					sg_action_device = 'mobile';
					break;
				case /Android/.test(sg_useragent):
					sg_action_device = 'mobile';
					break;
				case /Macintosh/.test(sg_useragent):
					sg_action_device = 'desktop';
					break;
				case /Windows NT/.test(sg_useragent):
					sg_action_device = 'desktop';
					break;
				case /X11/.test(sg_useragent):
					sg_action_device = 'desktop';
					break;
				default:
					sg_action_device = 'unknown';
			}
		}
		// Sendgrid event timestamp (UTC, unix format)
		let sg_event_timestamp =
			single_event.timestamp === undefined ? undefined : single_event.timestamp;
		// Convert Sendgrid event timestamp into ISO format
		let sg_event_date =
			single_event.timestamp === undefined
				? undefined
				: new Date(single_event.timestamp * 1000).toISOString();
		// Bounce type: "bounce" = hard bounce, "blocked" = block
		let sg_bounce_type =
			single_event.type === undefined ? undefined : single_event.type;
		// Reason provided with Bounce and Dropped events
		let sg_bounce_reason =
			single_event.reason === undefined ? undefined : single_event.reason;
		// Unsubscribe group Id, assigned to the send. For group_unsubscribe/resubscribe events - it is an unsubscribe group, which recepient opted in/out
		let sg_ubsub_group_id =
			single_event.asm_group_id === undefined
				? undefined
				: single_event.asm_group_id.toString();
		// Send phase: "send" or "test". Applies only to single sends. "test" for AB testing test phase
		let sg_single_send_phase =
			single_event.phase_id === undefined ? undefined : single_event.phase_id;
		// create anonymousId that will be consistent with subsequent webhook events from same user
		const hash = crypto.createHash('md5');
		hash.update(single_event.email);
		const anonymousId = hash.digest('hex');
		// Include email in the context object, so track() events are merged in Personas into user profile without an Identify() call
		let contextTraits = { email: email };
		// Set up event properties. Undefined fields are not included in the result properties{}
		let properties = Object.assign(
			{},
			{ email: email },
			{ sg_send_type: sg_send_type },
			{ sg_category: sg_category },
			{ sg_user_ip: sg_user_ip },
			{ sg_send_name: sg_send_name },
			{ sg_single_send_timestamp: sg_single_send_timestamp },
			{ sg_single_send_date: sg_single_send_date },
			{ sg_smtp_id: sg_smtp_id },
			{ sg_message_id: sg_message_id },
			{ sg_event_id: sg_event_id },
			{ sg_template_name: sg_template_name },
			{ sg_tls_encryption: sg_tls_encryption },
			{ sg_click_url: sg_click_url },
			{ sg_click_url_number: sg_click_url_number },
			{ sg_useragent: sg_useragent },
			{ sg_action_device: sg_action_device },
			{ sg_event_timestamp: sg_event_timestamp },
			{ sg_event_date: sg_event_date },
			{ sg_bounce_type: sg_bounce_type },
			{ sg_bounce_reason: sg_bounce_reason },
			{ sg_ubsub_group_id: sg_ubsub_group_id },
			{ sg_single_send_phase: sg_single_send_phase }
		);
		//console.log(properties);
		// Map SendGrid events to Segment events
		switch (sg_event_type) {
			case 'delivered':
				event_name = 'Email Delivered';
				break;
			case 'open':
				event_name = 'Email Opened';
				break;
			case 'click':
				event_name = 'Email Link Clicked';
				break;
			case 'unsubscribe':
				event_name = 'Email Unsubscribed';
				break;
			case 'spamreport':
				event_name = 'Email Reported As Spam';
				break;
			case 'group_unsubscribe':
				event_name = 'Email Group Unsubscribed';
				break;
			case 'group_resubscribe':
				event_name = 'Email Group Resubscribed';
				break;
			case 'bounce':
				event_name = 'Email Bounced';
				break;
			case 'dropped':
				event_name = 'Email Dropped';
				break;
		}
		// Create Segment event payload
		let event_payload = {
			event: event_name,
			context: { traits: contextTraits },
			anonymousId: anonymousId,
			properties: properties
		};
		// Send Segment track() event
		Segment.track(event_payload);
		// Send identify() calls to create user profiles in Personas with Email Delivered events and email attribute
		if (sg_event_type == 'delivered') {
			Segment.identify({
				anonymousId: btoa(email),
				traits: {
					email: email
				}
			});
		}
	});
}
